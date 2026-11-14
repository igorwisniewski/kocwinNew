import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { testConnection, initDatabase, isDbConfigured, getPool } from '@/lib/db';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const isConfigured = isDbConfigured();
    const test = await testConnection();

    let sectionsCount = 0;
    let settingsCount = 0;

    if (test.success) {
        const pool = getPool();
        if (pool) {
            try {
                const [r1] = await pool.query('SELECT COUNT(*) as count FROM cms_sections');
                sectionsCount = (r1 as any)[0]?.count || 0;
            } catch {}
            try {
                const [r2] = await pool.query('SELECT COUNT(*) as count FROM cms_settings');
                settingsCount = (r2 as any)[0]?.count || 0;
            } catch {}
        }
    }

    return NextResponse.json({
        isConfigured,
        connection: test,
        env: {
            host: process.env.DB_HOST || '(brak)',
            port: process.env.DB_PORT || '3306',
            user: process.env.DB_USER || '(brak)',
            database: process.env.DB_NAME || '(brak)',
            ssl: process.env.DB_SSL === 'true',
        },
        stats: {
            sectionsCount,
            settingsCount,
        },
    });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const force = Boolean(body.force);
        const result = await initDatabase(force);

        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err?.message || 'Błąd inicjalizacji bazy' },
            { status: 500 }
        );
    }
}
