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
        const type = searchParams.get('type'); // IMMEDIATE, PRE_ORDER
        let branchId = searchParams.get('branchId');
        const status = searchParams.get('status');

        // FORCE BRANCH ISOLATION
        if (session.user.role === 'BRANCH_MANAGER') {
            if (!session.user.branchId) {
                return NextResponse.json({ message: 'Manager config error: No branch assigned.' }, { status: 403 });
            }
            branchId = session.user.branchId;
        }

        const filter = {};
        if (type) filter.orderType = type;
        if (branchId) filter.branchId = branchId;
        if (status) filter.status = status;

        const orders = await prisma.order.findMany({
            where: filter,
            include: {
                user: { select: { name: true, email: true, phone: true } },
                branch: true,
                items: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
