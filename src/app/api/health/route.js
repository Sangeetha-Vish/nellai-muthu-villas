import { prisma } from '@/lib/prisma';

export async function GET() {
    const startTime = Date.now();
    let dbStatus = 'UP';

    try {
        // Basic connectivity check
        await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
        console.error('Health Check DB Error:', error);
        dbStatus = 'DOWN';
    }

    const status = dbStatus === 'UP' ? 200 : 503;

    return Response.json({
        status: dbStatus === 'UP' ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus,
        latency: `${Date.now() - startTime}ms`
    }, { status });
}
