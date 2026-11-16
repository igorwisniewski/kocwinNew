import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifyAdminToken } from '@/lib/jwt';

const PUBLIC_ADMIN_API_PATHS = new Set([
    '/api/admin/login',
    '/api/admin/check-auth',
]);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Ochrona CSRF dla wszystkich żądań modyfikujących do /api/admin/*
    if (pathname.startsWith('/api/admin') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const origin = req.headers.get('origin');
        const host = req.headers.get('host');
        if (origin && host) {
            try {
                const originHost = new URL(origin).host;
                if (originHost !== host) {
                    return NextResponse.json(
                        { error: 'Niedozwolone żądanie międzywitrynowe (CSRF Blocked).' },
                        { status: 403 }
                    );
                }
            } catch {
                return NextResponse.json(
                    { error: 'Nieprawidłowy nagłówek Origin.' },
                    { status: 403 }
                );
            }
        }
    }

    // 2. Weryfikacja JWT w Edge Middleware dla chronionych endpointów /api/admin/*
    if (pathname.startsWith('/api/admin') && !PUBLIC_ADMIN_API_PATHS.has(pathname)) {
        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
        }
        const user = await verifyAdminToken(token);
        if (!user) {
            return NextResponse.json({ error: 'Sesja wygasła lub jest nieprawidłowa' }, { status: 401 });
        }
    }

    const res = NextResponse.next();

    // 3. Nagłówki bezpieczeństwa dla panelu /admin oraz /api/admin
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.headers.set('Pragma', 'no-cache');
        res.headers.set('Expires', '0');
    }

    // 4. Globalne nagłówki ochronne
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

    return res;
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
