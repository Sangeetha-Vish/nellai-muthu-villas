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

        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getSession();
        if (!session || !['OWNER', 'BRANCH_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, price, available, tags, specialCategory } = body;

        if (!id) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                price,
                available,
                tags,
                specialCategory
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Product update error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
