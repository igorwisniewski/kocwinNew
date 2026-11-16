import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPageSections, saveSectionData, getSectionData } from '@/lib/cms';
import { isValidSlug, sanitizeCmsValue } from '@/lib/sanitize';

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    if (!isValidSlug(page)) {
        return NextResponse.json({ error: 'Nieprawidłowy parametr page' }, { status: 400 });
    }

    if (section) {
        if (!isValidSlug(section)) {
            return NextResponse.json({ error: 'Nieprawidłowy parametr section' }, { status: 400 });
        }
        const data = await getSectionData(page, section);
        return NextResponse.json({ page, section, content: data });
    }

    const sections = await getPageSections(page);
    return NextResponse.json({ page, sections });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { page, section, content } = body;

        if (!isValidSlug(page) || !isValidSlug(section) || content === undefined) {
            return NextResponse.json(
                { error: 'Wymagane prawidłowe pola: page, section, content' },
                { status: 400 }
            );
        }

        const sanitizedContent = sanitizeCmsValue(content);
        await saveSectionData(page, section, sanitizedContent);
        return NextResponse.json({ success: true, message: 'Sekcja została bezpiecznie zapisana' });
    } catch (err: any) {
        console.error('[Content Save Error]:', err);
        return NextResponse.json(
            { error: 'Błąd zapisu sekcji w bazie danych.' },
            { status: 500 }
        );
    }
}
