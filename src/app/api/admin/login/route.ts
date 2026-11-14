import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createSession, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Wymagany login i hasło' },
                { status: 400 }
            );
        }

        const result = await authenticate(username, password);
        if (!result.success || !result.user) {
            return NextResponse.json(
                { success: false, error: result.error || 'Błędne dane logowania' },
                { status: 401 }
            );
        }

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
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err?.message || 'Błąd serwera podczas logowania' },
            { status: 500 }
        );
    }
}
