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
        const pid = execSync(`lsof -t -i:${PORT}`).toString().trim();
        if (pid) {
            log(`Killing existing process on port ${PORT} (PID: ${pid})...`);
            execSync(`kill -9 ${pid}`);
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

    const child = spawn('next', ['dev', '-p', String(PORT)], {
        stdio: 'inherit',
        env: { ...process.env } // Pass through env vars
    });

    child.on('exit', (code) => {
        if (code !== 0) {
            log(`Dev server exited with code ${code}`);
        }
    });
}

start();
