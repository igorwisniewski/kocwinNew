import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Brak pliku do wysłania' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanity check name and extension
        const originalName = file.name || 'image.jpg';
        const cleanExt = path.extname(originalName) || '.jpg';
        const baseName = path.basename(originalName, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${baseName}_${Date.now()}${cleanExt}`;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${filename}`;
        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename,
            message: 'Plik został pomyślnie wgrany na serwer',
        });
    } catch (err: any) {
        console.error('[Upload Error]', err);
        return NextResponse.json(
            { error: err?.message || 'Błąd podczas wgrywania pliku' },
            { status: 500 }
        );
    }
}
