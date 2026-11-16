import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'cms_admin_token';

export interface AdminUser {
    username: string;
    role: string;
}

// Fallback random secret generated per runtime instance if JWT_SECRET env is missing
let runtimeFallbackSecret: Uint8Array | null = null;

function cleanSecretEnv(val: string | undefined): string {
    if (!val) return '';
    const trimmed = val.trim();
    if (
        (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}

export function getJwtSecretKey(): Uint8Array {
    const rawSecret = cleanSecretEnv(process.env.JWT_SECRET);
    if (rawSecret && rawSecret.length >= 16) {
        return new TextEncoder().encode(rawSecret);
    }

    if (!runtimeFallbackSecret) {
        console.warn('[Security] JWT_SECRET is not set or too short! Using ephemeral random key for this process.');
        const randomBytes = new Uint8Array(64);
        if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
            globalThis.crypto.getRandomValues(randomBytes);
        } else {
            for (let i = 0; i < 64; i++) {
                randomBytes[i] = Math.floor(Math.random() * 256);
            }
        }
        runtimeFallbackSecret = randomBytes;
    }

    return runtimeFallbackSecret;
}

export async function signAdminToken(user: AdminUser): Promise<string> {
    return await new SignJWT({ username: user.username, role: user.role })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setIssuer('twojeoddluzanie-cms')
        .setAudience('cms-admin')
        .setExpirationTime('12h')
        .sign(getJwtSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey(), {
            issuer: 'twojeoddluzanie-cms',
            audience: 'cms-admin',
            algorithms: ['HS256'],
        });
        if (!payload.username || typeof payload.username !== 'string') {
            return null;
        }
        return {
            username: payload.username,
            role: (payload.role as string) || 'admin',
        };
    } catch {
        return null;
    }
}
