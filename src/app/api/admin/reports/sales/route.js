import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const session = await getSession();
        if (!session || !['OWNER', 'BRANCH_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: 'COMPLETED'
            },
            select: {
                createdAt: true,
                totalAmount: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by day
        const salesByDay = orders.reduce((acc, order) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { date, revenue: 0, orders: 0 };
            }
            acc[date].revenue += order.totalAmount;
            acc[date].orders += 1;
            return acc;
        }, {});

        return NextResponse.json(Object.values(salesByDay));
    } catch (error) {
        console.error('Sales report error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
