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
            orderBy: { createdAt: 'desc' } // Changed to desc for better UX
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session || !['OWNER', 'BRANCH_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, price, weight, description, image, tradition, specialCategory, tags } = body;

        // Basic validation
        if (!name || !price) {
            return NextResponse.json({ message: 'Name and price are required' }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parseInt(price),
                weight: weight || '',
                description: description || '',
                image: image || '/images/placeholder.jpg',
                tradition: tradition || '',
                specialCategory: specialCategory || null,
                tags: tags || null,
                available: true
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Product creation error:', error);
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
