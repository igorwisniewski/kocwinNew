import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPageSections, saveSectionData, getSectionData } from '@/lib/cms';

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    if (!page) {
        return NextResponse.json({ error: 'Brak parametru page' }, { status: 400 });
    }

    if (section) {
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

        if (!page || !section || content === undefined) {
            return NextResponse.json(
                { error: 'Wymagane pola: page, section, content' },
                { status: 400 }
            );
        }

        await saveSectionData(page, section, content);
        return NextResponse.json({ success: true, message: 'Sekcja została zapisana' });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || 'Błąd zapisu sekcji w bazie' },
            { status: 500 }
        );
    }
}
