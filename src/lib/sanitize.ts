const DANGEROUS_PROTOCOL_REGEX = /^\s*(javascript|vbscript|data\s*:\s*text\/html)\s*:/i;
const SCRIPT_TAG_REGEX = /<\s*\/?\s*script\b[^>]*>/gi;
const EVENT_HANDLER_REGEX = /\bon[a-z]+\s*=\s*(['"]).*?\1/gi;

const SAFE_SLUG_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export function isValidSlug(slug: unknown): slug is string {
    return typeof slug === 'string' && SAFE_SLUG_REGEX.test(slug);
}

export function sanitizeCmsValue(val: any, depth = 0): any {
    if (depth > 15) {
        throw new Error('Zbyt głęboko zagnieżdżona struktura danych.');
    }

    if (typeof val === 'string') {
        if (val.length > 100000) {
            throw new Error('Przekroczono maksymalną długość pola tekstowego.');
        }
        let cleaned = val.replace(SCRIPT_TAG_REGEX, '').replace(EVENT_HANDLER_REGEX, '');
        if (DANGEROUS_PROTOCOL_REGEX.test(cleaned)) {
            cleaned = '#';
        }
        return cleaned;
    }

    if (Array.isArray(val)) {
        if (val.length > 500) {
            throw new Error('Przekroczono maksymalną liczbę elementów tablicy.');
        }
        return val.map((item) => sanitizeCmsValue(item, depth + 1));
    }

    if (val !== null && typeof val === 'object') {
        const keys = Object.keys(val);
        if (keys.length > 200) {
            throw new Error('Przekroczono maksymalną liczbę kluczy obiektu.');
        }
        const out: Record<string, any> = {};
        for (const k of keys) {
            if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
                continue; // Prototype pollution protection
            }
            out[k] = sanitizeCmsValue(val[k], depth + 1);
        }
        return out;
    }

    return val;
}
