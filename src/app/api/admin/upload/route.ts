import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const ALLOWED_MIMES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
]);

function isValidImageMagicBytes(buf: Buffer, ext: string): boolean {
    if (buf.length < 12) return false;

    // JPEG: FF D8 FF
    if (ext === '.jpg' || ext === '.jpeg') {
        return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (ext === '.png') {
        return (
            buf[0] === 0x89 &&
            buf[1] === 0x50 &&
            buf[2] === 0x4e &&
            buf[3] === 0x47 &&
            buf[4] === 0x0d &&
            buf[5] === 0x0a &&
            buf[6] === 0x1a &&
            buf[7] === 0x0a
        );
    }

    // GIF: GIF87a or GIF89a
    if (ext === '.gif') {
        const header = buf.subarray(0, 6).toString('ascii');
        return header === 'GIF87a' || header === 'GIF89a';
    }

    // WEBP: RIFF....WEBP
    if (ext === '.webp') {
        const riff = buf.subarray(0, 4).toString('ascii');
        const webp = buf.subarray(8, 12).toString('ascii');
        return riff === 'RIFF' && webp === 'WEBP';
    }

    // AVIF: ....ftypavif or ....ftypavis or ....ftypmif1
    if (ext === '.avif') {
        const ftyp = buf.subarray(4, 8).toString('ascii');
        return ftyp === 'ftyp';
    }

    return false;
}

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

        if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'Plik jest za duży. Maksymalny dozwolony rozmiar to 5 MB.' },
                { status: 400 }
            );
        }

        const originalName = path.basename(file.name || 'image.jpg');
        const cleanExt = path.extname(originalName).toLowerCase();

        if (!ALLOWED_EXTENSIONS.has(cleanExt) || !ALLOWED_MIMES.has(file.type)) {
            return NextResponse.json(
                {
                    error: 'Niedozwolony format pliku. Dozwolone są wyłącznie bezpieczne obrazy: JPG, PNG, WEBP, GIF, AVIF.',
                },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (!isValidImageMagicBytes(buffer, cleanExt)) {
            return NextResponse.json(
                { error: 'Sygnatura pliku nie odpowiada poprawnemu obrazowi.' },
                { status: 400 }
            );
        }

        const baseName = path
            .basename(originalName, path.extname(originalName))
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .slice(0, 40);
        const randomSuffix = crypto.randomBytes(6).toString('hex');
        const filename = `${baseName || 'img'}_${Date.now()}_${randomSuffix}${cleanExt}`;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        // Upewnienie się, że ścieżka docelowa nie wychodzi poza katalog uploadDir (Path Traversal check)
        if (!filePath.startsWith(uploadDir)) {
            return NextResponse.json({ error: 'Nieprawidłowa ścieżka pliku' }, { status: 400 });
        }

        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${filename}`;
        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename,
            message: 'Plik został zweryfikowany i bezpiecznie wgrany na serwer',
        });
    } catch (err: any) {
        console.error('[Upload Error]', err);
        return NextResponse.json(
            { error: 'Błąd serwera podczas wgrywania pliku.' },
            { status: 500 }
        );
    }
}
