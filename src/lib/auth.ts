import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getPool, isDbConfigured } from './db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'seohost_mysql_cms_super_secret_jwt_key_2025_twojeoddluzanie'
);

export const COOKIE_NAME = 'cms_admin_token';

export interface AdminUser {
    username: string;
    role: string;
}

export async function createSession(user: AdminUser): Promise<string> {
    return await new SignJWT({ username: user.username, role: user.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return {
            username: payload.username as string,
            role: (payload.role as string) || 'admin',
        };
    } catch {
        return null;
    }
}

export async function getSession(): Promise<AdminUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function authenticate(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const envUser = process.env.ADMIN_USER || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    // 1. Sprawdzenie danych z .env
    if (username === envUser && password === envPass) {
        return { success: true, user: { username, role: 'admin' } };
    }

    // 2. Jeśli baza jest połączona, sprawdź również w tabeli cms_users
    if (isDbConfigured()) {
        const pool = getPool();
        if (pool) {
            try {
                const [rows] = await pool.query(
                    'SELECT * FROM cms_users WHERE username = ? LIMIT 1',
                    [username]
                );
                const user = (rows as any[])[0];
                if (user && user.password_hash) {
                    const match = await bcrypt.compare(password, user.password_hash);
                    if (match) {
                        return { success: true, user: { username: user.username, role: user.role || 'admin' } };
                    }
                }
            } catch (err) {
                console.error('[Auth] Error querying cms_users:', err);
            }
        }
    }

    return { success: false, error: 'Nieprawidłowy login lub hasło.' };
}
