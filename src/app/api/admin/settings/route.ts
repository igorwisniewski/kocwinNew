import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getGlobalSettings, saveGlobalSettings } from '@/lib/cms';
import { sanitizeCmsValue } from '@/lib/sanitize';

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

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ error: 'Brak prawidłowych danych settings' }, { status: 400 });
        }

        const sanitizedSettings = sanitizeCmsValue(settings);
        await saveGlobalSettings(sanitizedSettings);
        return NextResponse.json({ success: true, message: 'Ustawienia ogólne zostały zapisane' });
    } catch (err: any) {
        console.error('[Settings Save Error]:', err);
        return NextResponse.json(
            { error: 'Błąd zapisu ustawień w bazie danych.' },
            { status: 500 }
        );
    }
}
