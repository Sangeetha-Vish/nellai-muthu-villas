import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

function resolveImagePath(imagePath) {
    if (!imagePath) return '/images/placeholder_classy.svg';

    const publicDir = path.join(process.cwd(), 'public');
    const candidates = [];

    // Use as-provided path first
    candidates.push(path.join(publicDir, imagePath.replace(/^[\/]+/, '')));

    // Try under /images/products with basename
    const base = path.basename(imagePath);
    candidates.push(path.join(publicDir, 'images', 'products', base));

    // Try under /images with basename
    candidates.push(path.join(publicDir, 'images', base));

    for (const c of candidates) {
        try {
            if (fs.existsSync(c)) {
                // Return a web path starting with /
                const rel = path.relative(publicDir, c).replace(/\\/g, '/');
                return '/' + rel;
            }
        } catch (e) {
            // ignore
        }
    }

    // Fallback
    return '/images/placeholder_classy.svg';
}

export async function GET() {
    try {
        const dbProducts = await prisma.product.findMany({
            where: { available: true }
        });

        const normalized = dbProducts.map((p) => {
            // Prefer images under /images/products by basename of configured path
            const base = path.basename(p.image || '');
            const desired = base ? `/images/products/${base}` : p.image;
            return {
                ...p,
                image: resolveImagePath(desired),
            };
        });

        return NextResponse.json(normalized);
    } catch (error) {
        console.error('Fetch products error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
