import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request, { params }) {
    try {
        const session = await getSession();
        if (!session || !['OWNER', 'BRANCH_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        const allowedStatuses = ['RECEIVED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'];
        if (status && !allowedStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: { select: { name: true, email: true } },
                branch: true
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Order update error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
