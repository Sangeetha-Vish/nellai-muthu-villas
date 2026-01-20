import { prisma } from '@/lib/prisma';
import { login, logout, getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, email, password, name, phone } = body;

        if (action === 'logout') {
            await logout();
            return NextResponse.json({ success: true });
        }

        if (action === 'register') {
            // Simple registration logic for customer
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                const user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        phone,
                        role: 'CUSTOMER'
                    }
                });
                // Auto login
                await login({ id: user.id, email: user.email, role: user.role, name: user.name });
                return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            } catch (e) {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            }
        }

        // Default action: Login
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        await login({ id: user.id, email: user.email, role: user.role, name: user.name });

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ user: null });
        }
        return NextResponse.json({ user: session.user });
    } catch (error) {
        return NextResponse.json({ user: null });
    }
}
