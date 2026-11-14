import { getPool, isDbConfigured } from './db';
import { defaultSections, defaultGlobalSettings } from './cms-defaults';

export async function getSectionData<T = any>(pageSlug: string, sectionKey: string): Promise<T> {
    const defaultItem = defaultSections.find(
        (s) => s.page === pageSlug && s.section === sectionKey
    );
    const fallback = defaultItem ? (defaultItem.content as T) : ({} as T);

    if (!isDbConfigured()) {
        return fallback;
    }

    const pool = getPool();
    if (!pool) return fallback;

    try {
        const [rows] = await pool.query(
            'SELECT content_json FROM cms_sections WHERE page_slug = ? AND section_key = ? LIMIT 1',
            [pageSlug, sectionKey]
        );
        const record = (rows as any[])[0];
        if (record && record.content_json) {
            try {
                const parsed = JSON.parse(record.content_json);
                // Merge with fallback so new keys are never undefined
                if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
                    return { ...fallback, ...parsed };
                }
                return parsed;
            } catch {
                return fallback;
            }
        }
    } catch (err) {
        console.warn(`[CMS] Failed to read ${pageSlug}/${sectionKey} from MySQL, using fallback:`, err);
    }

    return fallback;
}

export async function getPageSections(pageSlug: string): Promise<Record<string, any>> {
    // Collect defaults first
    const result: Record<string, any> = {};
    for (const item of defaultSections) {
        if (item.page === pageSlug) {
            result[item.section] = item.content;
        }
    }

    if (!isDbConfigured()) {
        return result;
    }

    const pool = getPool();
    if (!pool) return result;

    try {
        const [rows] = await pool.query(
            'SELECT section_key, content_json FROM cms_sections WHERE page_slug = ?',
            [pageSlug]
        );
        for (const row of rows as any[]) {
            try {
                const parsed = JSON.parse(row.content_json);
                const prev = result[row.section_key];
                if (prev && typeof prev === 'object' && !Array.isArray(prev)) {
                    result[row.section_key] = { ...prev, ...parsed };
                } else {
                    result[row.section_key] = parsed;
                }
            } catch {
                // Ignore json parse error, keep fallback
            }
        }
    } catch (err) {
        console.warn(`[CMS] Error loading sections for page ${pageSlug}:`, err);
    }

    return result;
}

export async function saveSectionData(pageSlug: string, sectionKey: string, content: any): Promise<boolean> {
    const pool = getPool();
    if (!pool) {
        throw new Error('Baza danych MySQL nie jest połączona. Uzupełnij dane w .env.');
    }

    const json = JSON.stringify(content);
    await pool.query(
        `INSERT INTO cms_sections (page_slug, section_key, content_json)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP`,
        [pageSlug, sectionKey, json]
    );

    return true;
}

export async function getGlobalSettings(): Promise<any> {
    const fallback = defaultGlobalSettings.general;
    if (!isDbConfigured()) {
        return fallback;
    }

    const pool = getPool();
    if (!pool) return fallback;

    try {
        const [rows] = await pool.query(
            'SELECT setting_value FROM cms_settings WHERE setting_key = ? LIMIT 1',
            ['general']
        );
        const record = (rows as any[])[0];
        if (record && record.setting_value) {
            try {
                const parsed = JSON.parse(record.setting_value);
                return { ...fallback, ...parsed };
            } catch {
                return fallback;
            }
        }
    } catch (err) {
        console.warn('[CMS] Failed to read global settings from MySQL:', err);
    }

    return fallback;
}

export async function saveGlobalSettings(settings: any): Promise<boolean> {
    const pool = getPool();
    if (!pool) {
        throw new Error('Baza danych MySQL nie jest połączona.');
    }

    const json = JSON.stringify(settings);
    await pool.query(
        `INSERT INTO cms_settings (setting_key, setting_value)
         VALUES ('general', ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP`,
        [json]
    );

    return true;
}
