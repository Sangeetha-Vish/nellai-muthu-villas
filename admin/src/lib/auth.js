import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('Missing required environment variable JWT_SECRET. Add it to your .env or environment.');
}
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function login(userData) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: userData, expires });
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set('session', '', { expires: new Date(0) });
}
