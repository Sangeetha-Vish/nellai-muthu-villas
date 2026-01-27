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

        const orderItems = await prisma.orderItem.findMany({
            where: {
                order: { status: 'COMPLETED' }
            },
            include: {
                product: {
                    select: { name: true }
                }
            }
        });

        const productSales = orderItems.reduce((acc, item) => {
            const name = item.product.name;
            if (!acc[name]) {
                acc[name] = { name, volume: 0, revenue: 0 };
            }
            acc[name].volume += item.quantity;
            acc[name].revenue += item.price * item.quantity;
            return acc;
        }, {});

        // Sort by volume descending
        const sortedProducts = Object.values(productSales).sort((a, b) => b.volume - a.volume);

        return NextResponse.json(sortedProducts);
    } catch (error) {
        console.error('Product report error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
