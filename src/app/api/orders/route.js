import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Helper to generate human-friendly Order ID: NMV-YYYYMMDD-XXXX
function generatePublicOrderId() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `NMV-${dateStr}-${randomSuffix}`;
}

// Helper to generate 4-6 digit OTP
function generateOtp(length = 6) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))).toString();
}

export async function GET() {
    const session = await getSession();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify user exists in DB to prevent FK errors (Stale cookies)
    const userExists = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true }
    });

    if (!userExists) {
        return NextResponse.json({ message: 'Session invalid. Please relogin.' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                branch: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Security: Remove sensitive fields from the list
        const sanitizedOrders = orders.map(order => {
            const { pickupOtpHash, ...rest } = order;
            return rest;
        });

        return NextResponse.json({ orders: sanitizedOrders });
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getSession();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // MANDATED FIX: Lookup user by email to ensure valid DB ID (Fixes P2003)
    if (!session.user.email) {
        return NextResponse.json({ message: 'Invalid session data' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!dbUser) {
        return NextResponse.json({ message: 'User not found in database. Please relogin.' }, { status: 401 });
    }

    // Use the confirmed database ID
    const userId = dbUser.id;

    try {
        const body = await request.json();
        const { branchId, items, pickupDate, pickupTime, totalAmount, orderType } = body;

        // Validate request
        if (!branchId || !items || !items.length || !totalAmount) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify Branch exists (Fix for P2003 on branchId)
        const branchExists = await prisma.branch.findUnique({
            where: { id: branchId },
            select: { id: true }
        });

        if (!branchExists) {
            return NextResponse.json({ message: 'Invalid Branch selected. Please ensure the branch exists.' }, { status: 400 });
        }

        // Validate Items (Check for stale Product IDs)
        for (const item of items) {
            const productExists = await prisma.product.findUnique({
                where: { id: item.productId },
                select: { id: true }
            });
            if (!productExists) {
                return NextResponse.json({
                    message: `Item '${item.name}' is no longer available (ID mismatch). Please clear your cart and re-add items.`
                }, { status: 400 });
            }
        }

        // Create human-friendly IDs and OTP
        const publicOrderId = generatePublicOrderId();
        const simpleId = `NMV-${Math.floor(100000 + Math.random() * 900000)}`;

        let otp = null;
        let otpHash = null;

        // Only generate OTP for CASH or completed orders
        if (body.paymentMethod === 'CASH') {
            otp = generateOtp(6);
            otpHash = await bcrypt.hash(otp, 10);
        }

        const order = await prisma.order.create({
            data: {
                simpleId,
                publicOrderId,
                userId: userId,
                branchId,
                totalAmount,
                status: body.paymentMethod === 'CASH' ? 'CONFIRMED' : 'PENDING_PAYMENT',
                orderType: orderType || 'PRE_ORDER',
                paymentMethod: body.paymentMethod || 'CASH',
                pickupOtpHash: otpHash,
                pickupTime: new Date(pickupTime || new Date()),
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        // Return order with plain OTP (ONLY THIS ONCE)
        return NextResponse.json({
            order: {
                ...order,
                otp: otp // Plain OTP for immediate display
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
