const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const PORT = 3000;
const LOCK_FILE = path.join(process.cwd(), '.next', 'dev', 'lock');

function log(msg) {
    console.log(`\x1b[36m[CleanStart]\x1b[0m ${msg}`);
}

function error(msg) {
    console.error(`\x1b[31m[CleanStart] ERROR:\x1b[0m ${msg}`);
    process.exit(1);
}

function cleanup() {
    // 1. Kill existing processes on port 3000
    try {
        if (process.platform === 'win32') {
            // Windows: use netstat + taskkill
            try {
                const out = execSync(`netstat -ano | findstr :${PORT}`).toString().trim();
                if (out) {
                    const lines = out.split(/\r?\n/);
                    const pids = new Set();
                    lines.forEach(line => {
                        const parts = line.trim().split(/\s+/);
                        const pid = parts[parts.length - 1];
                        if (pid && pid !== '0') pids.add(pid);
                    });
                    for (const pid of pids) {
                        log(`Killing existing process on port ${PORT} (PID: ${pid})...`);
                        try { execSync(`taskkill /PID ${pid} /F`); } catch (e) { /* ignore */ }
                    }
                }
            } catch (e) {
                // ignore failures (e.g., no matching lines)
            }
        } else {
            const pid = execSync(`lsof -t -i:${PORT}`).toString().trim();
            if (pid) {
                log(`Killing existing process on port ${PORT} (PID: ${pid})...`);
                execSync(`kill -9 ${pid}`);
            }
        }
    } catch (e) {
        // No process found, ignore
    }

    // 2. Remove lock file
    if (fs.existsSync(LOCK_FILE)) {
        log('Removing stale .next/dev/lock...');
        try {
            fs.unlinkSync(LOCK_FILE);
        } catch (e) {
            log('Failed to remove lock file, it might be in use or permissions issue.');
        }
    }
}

function checkPort(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                reject(err);
            }
        });
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        server.listen(port);
    });
}

async function waitForPortToFree(port) {
    for (let i = 0; i < 10; i++) {
        try {
            if (await checkPort(port)) return true;
        } catch (e) {
            // ignore check errors
        }
        await new Promise(r => setTimeout(r, 200));
    }
    return false;
}

async function start() {
    log('Initializing Clean Dev Start Sequence...');

    cleanup();

    // Double check port is free
    const isFree = await waitForPortToFree(PORT);
    if (!isFree) {
        // Should have been killed by cleanup, but if not (e.g. permission error), fail fast.
        error(`Port ${PORT} is still in use after cleanup attempt. Cannot start.`);
    }

    log(`Starting Next.js dev server on port ${PORT}...`);
    log('Turbopack is ENABLED.');

    // Resolve platform-local next binary (use node_modules/.bin when available)
    const nextBin = process.platform === 'win32'
        ? path.join(process.cwd(), 'node_modules', '.bin', 'next.cmd')
        : path.join(process.cwd(), 'node_modules', '.bin', 'next');

    let cmd = nextBin;
    let args = ['dev', '-p', String(PORT)];

    if (!fs.existsSync(nextBin)) {
        // Fallback to npx if local binary not found
        cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
        args = ['next', 'dev', '-p', String(PORT)];
    }

    let child;
    try {
        child = spawn(cmd, args, {
            stdio: 'inherit',
            env: { ...process.env }
        });
    } catch (err) {
        // Some Windows environments throw EINVAL when spawning .cmd directly.
        // Fallback to running via shell which is more permissive.
        log(`Direct spawn failed (${err.code || err.message}), falling back to shell spawn...`);
        const shellCmd = process.platform === 'win32'
            ? `${cmd} ${args.join(' ')}`
            : `${cmd} ${args.map(a => `'${a}'`).join(' ')}`;
        child = spawn(shellCmd, { stdio: 'inherit', env: { ...process.env }, shell: true });
    }

    if (child) {
        child.on('error', (err) => {
            error(`Failed to start dev server: ${err.message} (${err.code || 'unknown'})`);
        });

        child.on('exit', (code) => {
            if (code !== 0) {
                log(`Dev server exited with code ${code}`);
            }
        });
    }
}

start();
