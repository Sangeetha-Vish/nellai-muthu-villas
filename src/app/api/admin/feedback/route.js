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
        const branchId = searchParams.get('branchId');
        const minRating = searchParams.get('minRating');

        const filter = {};
        if (branchId && branchId !== 'ALL') {
            filter.order = { branchId };
        }
        if (minRating) {
            filter.rating = { gte: parseInt(minRating) };
        }

        const feedbacks = await prisma.feedback.findMany({
            where: filter,
            include: {
                user: { select: { name: true, email: true } },
                order: {
                    include: {
                        branch: { select: { name: true, area: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate some stats
        const stats = await prisma.feedback.aggregate({
            _avg: { rating: true },
            _count: { id: true }
        });

        return NextResponse.json({
            feedbacks,
            stats: {
                averageRating: stats._avg.rating || 0,
                totalFeedback: stats._count.id || 0
            }
        });
    } catch (error) {
        console.error('Admin feedback fetch error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
