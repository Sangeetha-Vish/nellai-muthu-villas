import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSession();
        if (!session || !['OWNER', 'BRANCH_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        let branchId = searchParams.get('branchId');

        // FORCE BRANCH ISOLATION
        if (session.user.role === 'BRANCH_MANAGER') {
            if (!session.user.branchId) {
                return NextResponse.json({ message: 'Manager config error: No branch assigned.' }, { status: 403 });
            }
            branchId = session.user.branchId;
        }

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Base filters
        const baseFilter = branchId ? { branchId } : {};

        // 1. Today's orders count
        const todayCount = await prisma.order.count({
            where: {
                ...baseFilter,
                createdAt: { gte: startOfDay }
            }
        });

        // 2. Pending orders (Immediate + Pre-orders that are RECEIVED or PREPARING)
        const pendingCount = await prisma.order.count({
            where: {
                ...baseFilter,
                status: { in: ['RECEIVED', 'PREPARING'] }
            }
        });

        // 3. Upcoming pre-orders (Future pickup dates beyond today)
        const upcomingPreOrders = await prisma.order.count({
            where: {
                ...baseFilter,
                orderType: 'PRE_ORDER',
                pickupTime: { gt: now },
                status: { not: 'CANCELLED' }
            }
        });

        // 4. Revenue (Total Amount of completed orders today)
        const todayRevenue = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                ...baseFilter,
                status: 'COMPLETED',
                updatedAt: { gte: startOfDay }
            }
        });

        return NextResponse.json({
            todayCount,
            pendingCount,
            upcomingPreOrders,
            todayRevenue: todayRevenue._sum.totalAmount || 0
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
