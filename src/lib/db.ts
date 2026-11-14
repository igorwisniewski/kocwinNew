import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

function cleanEnv(val: string | undefined): string {
    if (!val) return '';
    const idx = val.indexOf('#');
    const stripped = idx !== -1 ? val.substring(0, idx) : val;
    return stripped.trim().replace(/^["']|["']$/g, '');
}

export function getDbConfig() {
    return {
        host: cleanEnv(process.env.DB_HOST) || 'localhost',
        port: Number(cleanEnv(process.env.DB_PORT)) || 3306,
        user: cleanEnv(process.env.DB_USER) || '',
        password: cleanEnv(process.env.DB_PASSWORD) || '',
        database: cleanEnv(process.env.DB_NAME) || '',
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        // SSL can be configured if host requires it
        ssl: cleanEnv(process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : undefined,
    };
}

export function isDbConfigured(): boolean {
    return Boolean(cleanEnv(process.env.DB_HOST) && cleanEnv(process.env.DB_USER) && cleanEnv(process.env.DB_NAME));
}

export function getPool(): Pool | null {
    if (!isDbConfigured()) {
        return null;
    }

    if (!pool) {
        try {
            pool = mysql.createPool(getDbConfig());
        } catch (error) {
            console.error('[MySQL] Error initializing connection pool:', error);
            pool = null;
        }
    }
    return pool;
}

export async function testConnection(): Promise<{ success: boolean; message: string; host?: string; database?: string; tables?: string[] }> {
    if (!isDbConfigured()) {
        return {
            success: false,
            message: 'Baza danych nie jest skonfigurowana. Uzupełnij zmienne DB_HOST, DB_USER, DB_PASSWORD, DB_NAME w pliku .env (dane z hostingu SEOHOST).',
        };
    }

    try {
        const currentPool = getPool();
        if (!currentPool) {
            return { success: false, message: 'Nie można utworzyć puli połączeń MySQL.' };
        }

        const connection = await currentPool.getConnection();
        try {
            const [tablesResult] = await connection.query('SHOW TABLES');
            const tables = (tablesResult as any[]).map((row) => Object.values(row)[0] as string);
            return {
                success: true,
                message: 'Połączenie z serwerem MySQL (SEOHOST) powiodło się pomyślnie!',
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                tables,
            };
        } finally {
            connection.release();
        }
    } catch (error: any) {
        return {
            success: false,
            message: `Błąd połączenia z serwerem MySQL: ${error?.message || error}. Sprawdź, czy w cPanel na SEOHOST dodałeś adres IP w zakładce "Zdalny MySQL" (lub znak %) oraz czy dane logowania są poprawne.`,
        };
    }
}

export async function initDatabase(forceSeed = false): Promise<{ success: boolean; message: string }> {
    const currentPool = getPool();
    if (!currentPool) {
        return {
            success: false,
            message: 'Baza danych nie jest skonfigurowana. Skonfiguruj .env z parametrami serwera SEOHOST.',
        };
    }

    try {
        const conn = await currentPool.getConnection();
        try {
            // 1. Tabela cms_sections
            await conn.query(`
                CREATE TABLE IF NOT EXISTS cms_sections (
                    page_slug VARCHAR(64) NOT NULL,
                    section_key VARCHAR(64) NOT NULL,
                    content_json LONGTEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    PRIMARY KEY (page_slug, section_key)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);

            // 2. Tabela cms_settings
            await conn.query(`
                CREATE TABLE IF NOT EXISTS cms_settings (
                    setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
                    setting_value LONGTEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);

            // 3. Tabela cms_users
            await conn.query(`
                CREATE TABLE IF NOT EXISTS cms_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(64) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(32) DEFAULT 'admin',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);

            // 4. Inicjalizacja domyślnych danych
            const { defaultSections, defaultGlobalSettings } = await import('./cms-defaults');

            // Sprawdzamy czy tabela ma rekordy
            const [existingSections] = await conn.query('SELECT COUNT(*) as count FROM cms_sections');
            const sectionsCount = (existingSections as any)[0]?.count || 0;

            if (sectionsCount === 0 || forceSeed) {
                for (const item of defaultSections) {
                    await conn.query(
                        `INSERT INTO cms_sections (page_slug, section_key, content_json)
                         VALUES (?, ?, ?)
                         ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP`,
                        [item.page, item.section, JSON.stringify(item.content)]
                    );
                }
            }

            const [existingSettings] = await conn.query('SELECT COUNT(*) as count FROM cms_settings');
            const settingsCount = (existingSettings as any)[0]?.count || 0;

            if (settingsCount === 0 || forceSeed) {
                for (const [key, val] of Object.entries(defaultGlobalSettings)) {
                    await conn.query(
                        `INSERT INTO cms_settings (setting_key, setting_value)
                         VALUES (?, ?)
                         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP`,
                        [key, JSON.stringify(val)]
                    );
                }
            }

            return {
                success: true,
                message: 'Tabele bazy danych zostały pomyślnie utworzone i zainicjalizowane domyślną zawartością strony!',
            };
        } finally {
            conn.release();
        }
    } catch (error: any) {
        console.error('[MySQL Init] Error:', error);
        return {
            success: false,
            message: `Błąd podczas inicjalizacji bazy danych: ${error?.message || error}`,
        };
    }
}
