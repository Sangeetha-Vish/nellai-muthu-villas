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

        const branches = await prisma.branch.findMany({
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(branches);
    } catch (error) {
        console.error('Branches fetch error:', error);
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
        const { id, isActive, status, timings } = body;

        if (!id) {
            return NextResponse.json({ message: 'Branch ID required' }, { status: 400 });
        }

        const updatedBranch = await prisma.branch.update({
            where: { id },
            data: {
                isActive,
                status,
                timings
            }
        });

        return NextResponse.json(updatedBranch);
    } catch (error) {
        console.error('Branch update error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
