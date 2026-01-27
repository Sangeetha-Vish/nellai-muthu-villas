import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, rating, comment } = body;

        // 1. Basic Validation
        if (!orderId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ message: 'Invalid feedback data' }, { status: 400 });
        }

        // 2. Verify Order exists, belongs to user, and is COMPLETED
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { feedback: true }
        });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        if (order.userId !== session.user.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (order.status !== 'COMPLETED') {
            return NextResponse.json({ message: 'Feedback can only be submitted for completed orders' }, { status: 400 });
        }

        // 3. Verify no existing feedback
        if (order.feedback) {
            return NextResponse.json({ message: 'Feedback already submitted for this order' }, { status: 400 });
        }

        // 4. Create Feedback and Audit Log in a transaction
        const result = await prisma.$transaction([
            prisma.feedback.create({
                data: {
                    orderId,
                    userId: session.user.id,
                    rating: parseInt(rating),
                    comment
                }
            }),
            prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'SUBMIT_FEEDBACK',
                    entity: 'Order',
                    entityId: orderId,
                    details: JSON.stringify({ rating, comment })
                }
            })
        ]);

        return NextResponse.json({ message: 'Feedback submitted successfully', feedback: result[0] }, { status: 201 });
    } catch (error) {
        console.error('Feedback submission error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
