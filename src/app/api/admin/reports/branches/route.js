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

        const branches = await prisma.branch.findMany({
            include: {
                orders: {
                    where: { status: 'COMPLETED' },
                    select: { totalAmount: true }
                }
            }
        });

        const branchMetrics = branches.map(branch => ({
            id: branch.id,
            name: branch.name,
            totalOrders: branch.orders.length,
            totalRevenue: branch.orders.reduce((sum, o) => sum + o.totalAmount, 0)
        }));

        return NextResponse.json(branchMetrics);
    } catch (error) {
        console.error('Branch report error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
