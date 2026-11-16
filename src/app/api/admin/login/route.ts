import { NextRequest, NextResponse } from 'next/server';
import {
    authenticate,
    createSession,
    COOKIE_NAME,
    checkRateLimit,
    recordFailedAttempt,
    clearRateLimit,
} from '@/lib/auth';

function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.headers.get('x-real-ip') || 'unknown-ip';
}

export async function POST(req: NextRequest) {
    const clientIp = getClientIp(req);

    // 1. Sprawdzenie blokady Brute-Force (Rate Limit)
    const rateStatus = checkRateLimit(clientIp);
    if (!rateStatus.allowed) {
        const minutes = Math.ceil((rateStatus.retryAfterSeconds || 900) / 60);
        return NextResponse.json(
            {
                success: false,
                error: `Zbyt wiele nieudanych prób logowania. Dostęp został tymczasowo zablokowany. Spróbuj ponownie za ok. ${minutes} min.`,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(rateStatus.retryAfterSeconds || 900),
                },
            }
        );
    }

    try {
        const body = await req.json();
        const { username, password } = body;

        if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            !username.trim() ||
            !password ||
            username.length > 64 ||
            password.length > 128
        ) {
            return NextResponse.json(
                { success: false, error: 'Wymagany prawidłowy login i hasło.' },
                { status: 400 }
            );
        }

        const result = await authenticate(username, password);
        if (!result.success || !result.user) {
            recordFailedAttempt(clientIp);
            // Sztuczne opóźnienie utrudniające ataki automatyczne
            await new Promise((res) => setTimeout(res, 350 + Math.floor(Math.random() * 250)));

            return NextResponse.json(
                { success: false, error: 'Nieprawidłowy login lub hasło.' },
                { status: 401 }
            );
        }

        clearRateLimit(clientIp);
        const token = await createSession(result.user);

        const response = NextResponse.json({
            success: true,
            user: result.user,
            message: 'Zalogowano pomyślnie',
        });

        response.cookies.set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 12, // 12 hours
        });

        return response;
    } catch {
        return NextResponse.json(
            { success: false, error: 'Błąd serwera podczas autoryzacji.' },
            { status: 500 }
        );
    }
}
