import { NextResponse } from 'next/server';

// Basic In-Memory Rate Limiter
const rateLimitMap = new Map();
const LIMIT = 100; // requests
const WINDOW = 60 * 1000; // 1 minute

export function middleware(request) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    // Only rate limit specific sensitive paths
    const isSensitivePath = request.nextUrl.pathname.startsWith('/api/auth') ||
        request.nextUrl.pathname.startsWith('/api/orders') ||
        request.nextUrl.pathname.startsWith('/api/feedback');

    if (isSensitivePath) {
        const userData = rateLimitMap.get(ip) || { count: 0, start: now };

        if (now - userData.start > WINDOW) {
            userData.count = 1;
            userData.start = now;
        } else {
            userData.count++;
        }

        rateLimitMap.set(ip, userData);

        if (userData.count > LIMIT) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Too many requests' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    const response = NextResponse.next();

    // Enforce HTTPS in production
    if (process.env.NODE_ENV === 'production') {
        const xForwardedProto = request.headers.get('x-forwarded-proto');
        if (xForwardedProto && xForwardedProto !== 'https') {
            return NextResponse.redirect(
                `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
                301
            );
        }
    }

    // Security Headers
    const securityHeaders = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
