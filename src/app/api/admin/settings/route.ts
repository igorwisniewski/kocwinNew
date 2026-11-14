import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getGlobalSettings, saveGlobalSettings } from '@/lib/cms';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const settings = await getGlobalSettings();
    return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { settings } = body;

        if (!settings) {
            return NextResponse.json({ error: 'Brak danych settings' }, { status: 400 });
        }

        await saveGlobalSettings(settings);
        return NextResponse.json({ success: true, message: 'Ustawienia ogólne zostały zapisane' });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || 'Błąd zapisu ustawień w bazie' },
            { status: 500 }
        );
    }
}
