import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function generateSimpleId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { branchId, items, pickupTime, totalAmount, customerName, phone } = body;

        if (!branchId || !items || items.length === 0) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        const db = new Database('./prisma/dev.db');
        const orderId = randomUUID();
        const simpleId = generateSimpleId();

        const insertOrder = db.prepare(`INSERT INTO Orders (id, simpleId, branchId, pickupTime, totalAmount, status, customerName, phone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
        insertOrder.run(orderId, simpleId, branchId, pickupTime, totalAmount, 'PENDING', customerName || null, phone || null);

        const insertItem = db.prepare(`INSERT INTO OrderItems (id, orderId, productId, quantity, price) VALUES (?, ?, ?, ?, ?)`);
        for (const it of items) {
            insertItem.run(randomUUID(), orderId, it.productId, it.quantity, it.price);
        }

        const order = {
            id: orderId,
            simpleId,
            branchId,
            pickupTime,
            totalAmount,
            status: 'PENDING',
            customerName: customerName || null,
            phone: phone || null,
        };

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error creating order', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const branchId = searchParams.get('branchId');

        const db = new Database('./prisma/dev.db', { readonly: true });
        let rows;
        if (branchId) {
            rows = db.prepare('SELECT * FROM Orders WHERE branchId = ? ORDER BY createdAt DESC').all(branchId);
        } else {
            rows = db.prepare('SELECT * FROM Orders ORDER BY createdAt DESC').all();
        }

        const orders = rows.map((r) => ({
            id: r.id,
            simpleId: r.simpleId,
            branchId: r.branchId,
            pickupTime: r.pickupTime,
            totalAmount: Number(r.totalAmount),
            status: r.status,
            customerName: r.customerName,
            phone: r.phone,
            createdAt: r.createdAt,
        }));

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
