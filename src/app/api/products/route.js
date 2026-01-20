import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MOCK_PRODUCTS = [
    // 1. Nella Muthu Vilas Special (Signature)
    {
        id: 'nmv-1',
        name: 'Tirunelveli Halwa',
        description: 'Our signature wheat halwa, dripping with pure ghee and cashews.',
        price: 180,
        weight: '250g',
        image: '/images/products/tirunelvelihalwa.png',
        specialCategory: 'NMV_SPECIAL',
        tags: 'Chef’s Choice,House Special',
        available: true,
        tradition: 'Signature',
    },
    {
        id: 'nmv-2',
        name: 'Ghee Mysore Pak',
        description: 'Melt-in-your-mouth texture with rich ghee flavor.',
        price: 200,
        weight: '250g',
        image: '/images/products/mysore-pak.jpg',
        specialCategory: 'NMV_SPECIAL',
        tags: 'House Special,Premium',
        available: true,
        tradition: 'Royal',
    },

    // 2. Top Picks (Most Ordered)
    {
        id: 'top-1',
        name: 'Motichoor Laddu',
        description: 'Fine boondi laddu made with pure ghee.',
        price: 150,
        weight: '250g',
        image: '/images/products/motichoorladdu.png',
        specialCategory: 'TOP_PICKS',
        tags: 'Most Ordered,Popular Today',
        available: true,
        tradition: 'Classic',
    },
    {
        id: 'top-2',
        name: 'Mini Jangiri',
        description: 'Juicy swirls of fermented urad dal batter fried to perfection.',
        price: 140,
        weight: '250g',
        image: '/images/products/jangiri.jpg',
        specialCategory: 'TOP_PICKS',
        tags: 'Popular Today',
        available: true,
        tradition: 'Festive',
    },

    // 3. Festival Favourite
    {
        id: 'fest-1',
        name: 'Adhirasam',
        description: 'Traditional fermented rice and jaggery donut.',
        price: 130,
        weight: '5 pcs',
        image: '/images/products/adhirasam.png',
        specialCategory: 'FESTIVAL_FAVOURITE',
        tags: 'Festive Special,Seasonal Delight',
        available: true,
        tradition: 'Village Special',
    },
    {
        id: 'fest-2',
        name: 'Kai Murukku',
        description: 'Hand-twisted crunchy rice spirals.',
        price: 120,
        weight: '200g',
        image: '/images/products/kaimurukku.png',
        specialCategory: 'FESTIVAL_FAVOURITE',
        tags: 'Seasonal Delight,Crispy',
        available: true,
        tradition: 'Savoury',
    },

    // 4. Customer Favourite
    {
        id: 'cust-1',
        name: 'Badusha',
        description: 'Flaky pastry donuts glazed in sugar syrup.',
        price: 160,
        weight: '250g',
        image: '/images/products/badhusa.png',
        specialCategory: 'CUSTOMER_FAVOURITE',
        tags: 'Loved by Customers,Best Rated',
        available: true,
        tradition: 'North-South Fusion',
    },
    {
        id: 'cust-2',
        name: 'Chandrakala',
        description: 'Crispy pastry filled with sweet khoya and dry fruits.',
        price: 190,
        weight: '250g',
        image: '/images/products/chandrakala.png',
        specialCategory: 'CUSTOMER_FAVOURITE',
        tags: 'Best Rated,Rich',
        available: true,
        tradition: 'Royal',
    },

    // Additional items (use available images from /public/images)
    {
        id: 'extra-1',
        name: 'Badam Halwa',
        description: 'Rich almond halwa made with pure ghee and premium almonds.',
        price: 650,
        weight: '250g',
        image: '/images/products/badam-halwa.jpg',
        specialCategory: 'EXTRA',
        tags: 'Premium,Rich',
        available: true,
        tradition: 'Slow-cooked',
    },
    {
        id: 'extra-2',
        name: 'Gulab Jamun',
        description: 'Soft milk-solid dumplings soaked in rose-flavored syrup.',
        price: 350,
        weight: '500g',
        image: '/images/products/gulab-jamun.jpg',
        specialCategory: 'EXTRA',
        tags: 'Classic,Popular',
        available: true,
        tradition: 'Served warm',
    },
    {
        id: 'extra-3',
        name: 'Kaju Katli',
        description: 'Diamond-shaped cashew fudge with a delicate sweetness.',
        price: 750,
        weight: '250g',
        image: '/images/products/kaju-katli.jpg',
        specialCategory: 'EXTRA',
        tags: 'Premium,Rich',
        available: true,
        tradition: 'Festive',
    },
    {
        id: 'extra-4',
        name: 'Milk Peda',
        description: 'Soft, creamy milk sweet with cardamom flavor.',
        price: 380,
        weight: '250g',
        image: '/images/products/milk-peda.jpg',
        specialCategory: 'EXTRA',
        tags: 'Classic,Milky',
        available: true,
        tradition: 'Traditional',
    },

    // 5. All-Time Classics
    {
        id: 'clas-1',
        name: 'Soan Papdi',
        description: 'Flaky and crisp flaky sweet with cardamom.',
        price: 140,
        weight: '200g',
        image: '/images/products/soanpapdi.png',
        specialCategory: 'ALL_TIME_CLASSICS',
        tags: 'Traditional,Timeless Recipe',
        available: true,
        tradition: 'Classic',
    },
    {
        id: 'clas-2',
        name: 'Mixture',
        description: 'Spicy mix of boondi, omapodi, nuts, and curry leaves.',
        price: 100,
        weight: '250g',
        image: '/images/products/mixture.png',
        specialCategory: 'ALL_TIME_CLASSICS',
        tags: 'Traditional,Spicy',
        available: true,
        tradition: 'Savoury',
    },
    {
        id: 'clas-3',
        name: 'Rava Laddu',
        description: 'Semolina balls made with ghee, sugar, and cashews.',
        price: 150,
        weight: '250g',
        image: '/images/products/ravaladdu.png',
        specialCategory: 'ALL_TIME_CLASSICS',
        tags: 'Timeless Recipe,Home Style',
        available: true,
        tradition: 'Classic',
    },
    {
        id: 'clas-4',
        name: 'Palkova',
        description: 'Rich, caramelized milk sweet made from pure cow milk.',
        price: 180,
        weight: '200g',
        image: '/images/products/palkova.png',
        specialCategory: 'ALL_TIME_CLASSICS',
        tags: 'Milk Sweet,Traditional',
        available: true,
        tradition: 'Srivilliputhur',
    },
    {
        id: 'clas-5',
        name: 'Ribbon Pakoda',
        description: 'Crunchy ribbon-shaped savoury snack.',
        price: 90,
        weight: '200g',
        image: '/images/products/Ribbonpakoda.png',
        specialCategory: 'ALL_TIME_CLASSICS',
        tags: 'Savoury,Crispy',
        available: true,
        tradition: 'Festival Snack',
    },
];

// Map product id => file name in /public/images/products for deterministic mapping
const IMAGE_MAP = {
    'nmv-1': 'halwa.jpg',
    'nmv-2': 'mysore-pak.jpg',
    'top-1': 'laddu.jpg',
    'top-2': 'jangiri.jpg',
    'fest-1': 'adhirasam.jpg',
    'fest-2': 'murukku.jpg',
    'cust-1': 'badusha.jpg',
    'cust-2': 'chandrakala.jpg',
    'clas-1': 'soanpapdi.jpg',
    'clas-2': 'mixture.jpg',
    'clas-3': 'ravaladdu.jpg',
    'clas-4': 'palkova.jpg',
    'clas-5': 'ribbon.jpg',
    'extra-1': 'badam-halwa.jpg',
    'extra-2': 'gulab-jamun.jpg',
    'extra-3': 'kaju-katli.jpg',
    'extra-4': 'milk-peda.jpg',
};
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
    const normalized = MOCK_PRODUCTS.map((p) => {
        // Prefer images under /images/products by basename of configured path
        const base = path.basename(p.image || '');
        const desired = base ? `/images/products/${base}` : p.image;
        return {
            ...p,
            image: resolveImagePath(desired),
        };
    });

    return NextResponse.json(normalized);
}
