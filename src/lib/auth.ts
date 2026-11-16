import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getPool, isDbConfigured, cleanEnv } from './db';
import {
    COOKIE_NAME,
    AdminUser,
    signAdminToken,
    verifyAdminToken,
} from './jwt';

export { COOKIE_NAME, type AdminUser };

// ============================================================================
// BRUTE-FORCE & RATE LIMITING PROTECTION
// ============================================================================
interface RateLimitEntry {
    attempts: number;
    firstAttemptAt: number;
    lockedUntil: number | null;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const entry = loginAttempts.get(ip);

    if (!entry) {
        return { allowed: true };
    }

    if (entry.lockedUntil && now < entry.lockedUntil) {
        const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
        return { allowed: false, retryAfterSeconds };
    }

    if (now - entry.firstAttemptAt > WINDOW_MS) {
        loginAttempts.delete(ip);
        return { allowed: true };
    }

    return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const entry = loginAttempts.get(ip);

    if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
        loginAttempts.set(ip, {
            attempts: 1,
            firstAttemptAt: now,
            lockedUntil: null,
        });
        return;
    }

    entry.attempts += 1;
    if (entry.attempts >= MAX_ATTEMPTS) {
        entry.lockedUntil = now + LOCKOUT_MS;
    }
    loginAttempts.set(ip, entry);
}

export function clearRateLimit(ip: string): void {
    loginAttempts.delete(ip);
}

// ============================================================================
// CONSTANT-TIME STRING COMPARISON (Anti-Timing Attack)
// ============================================================================
function safeCompare(a: string, b: string): boolean {
    const hashA = crypto.createHash('sha256').update(a, 'utf8').digest();
    const hashB = crypto.createHash('sha256').update(b, 'utf8').digest();
    return crypto.timingSafeEqual(hashA, hashB);
}

export async function createSession(user: AdminUser): Promise<string> {
    return await signAdminToken(user);
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
    return await verifyAdminToken(token);
}

export async function getSession(): Promise<AdminUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
}

export async function authenticate(
    username: string,
    password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanInputUser = username.trim();
    const envUser = cleanEnv(process.env.ADMIN_USER);
    const envPass = cleanEnv(process.env.ADMIN_PASSWORD);

    // 1. Sprawdzenie poświadczeń z .env (tylko jeśli są jawnie skonfigurowane i bezpieczne)
    if (envUser && envPass && envPass !== 'admin123' && envPass.length >= 8) {
        const userMatch = safeCompare(cleanInputUser, envUser);
        const passMatch = safeCompare(password, envPass);
        if (userMatch && passMatch) {
            return { success: true, user: { username: envUser, role: 'admin' } };
        }
    }

    // 2. Sprawdzenie w tabeli cms_users w bazie MySQL (hash bcrypt)
    if (isDbConfigured()) {
        const pool = getPool();
        if (pool) {
            try {
                const [rows] = await pool.query(
                    'SELECT username, password_hash, role FROM cms_users WHERE username = ? LIMIT 1',
                    [cleanInputUser]
                );
                const user = (rows as any[])[0];
                if (user && user.password_hash) {
                    const match = await bcrypt.compare(password, user.password_hash);
                    if (match) {
                        return {
                            success: true,
                            user: { username: user.username, role: user.role || 'admin' },
                        };
                    }
                }
            } catch (err) {
                console.error('[Auth] Error querying cms_users:', err);
            }
        }
    }

    return { success: false, error: 'Nieprawidłowy login lub hasło.' };
}
