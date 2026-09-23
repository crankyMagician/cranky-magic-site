// Parse a pasted or uploaded brand.json into an editable brand object.
// Accepts either a bare ringle brand.json or one of this app's {brand, feel} exports.
// Always returns a result object; never throws.

import { isHex } from './customPalette';
import { SITE_BRAND_INFO, COLOR_GROUPS, STATUS_GROUPS } from './siteBrandInfo';

const fail = (error) => ({ ok: false, brand: null, error });

const str = (v, fallback) => (typeof v === 'string' && v.trim() ? v.trim() : fallback);

const num = (v, fallback) => {
    const n = typeof v === 'number' ? v : parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
};

const colorGroup = (incoming, group) => {
    if (!incoming || typeof incoming !== 'object') return null;
    if (!isHex(incoming.main)) return null;

    const out = { main: incoming.main.trim() };
    ['light', 'dark', 'contrastText'].forEach((k) => {
        if (isHex(incoming[k])) out[k] = incoming[k].trim();
    });
    if (STATUS_GROUPS.includes(group)) {
        ['text', 'icon'].forEach((k) => {
            if (isHex(incoming[k])) out[k] = incoming[k].trim();
        });
    }
    return out;
};

const colorsForMode = (incoming) => {
    if (!incoming || typeof incoming !== 'object') return null;
    const out = {};
    let found = 0;

    COLOR_GROUPS.forEach((group) => {
        const g = colorGroup(incoming[group], group);
        if (g) {
            out[group] = g;
            found += 1;
        }
    });
    if (!found) return null;

    if (incoming.background && typeof incoming.background === 'object') {
        const bg = {};
        if (isHex(incoming.background.default)) bg.default = incoming.background.default.trim();
        if (isHex(incoming.background.paper)) bg.paper = incoming.background.paper.trim();
        if (Object.keys(bg).length) out.background = bg;
    }
    if (incoming.text && typeof incoming.text === 'object') {
        const t = {};
        ['primary', 'secondary', 'disabled'].forEach((k) => {
            if (isHex(incoming.text[k])) t[k] = incoming.text[k].trim();
        });
        if (Object.keys(t).length) out.text = t;
    }

    return out;
};

export const parseBrandJson = (text) => {
    if (typeof text !== 'string' || !text.trim()) {
        return fail('Nothing to import — paste some JSON or choose a file.');
    }

    let raw;
    try {
        raw = JSON.parse(text);
    } catch (e) {
        return fail(`That is not valid JSON (${e.message}).`);
    }

    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return fail('Expected a JSON object at the top level.');
    }

    // Unwrap this app's own export shape.
    const source = raw.brand && typeof raw.brand === 'object' ? raw.brand : raw;

    const light = colorsForMode(source.colors?.light);
    const dark = colorsForMode(source.colors?.dark);

    if (!light && !dark) {
        return fail('No usable colours found. Expected colors.light and/or colors.dark with hex values like "#0E4938".');
    }

    const company = source.company && typeof source.company === 'object' ? source.company : {};
    const logo = source.logo && typeof source.logo === 'object' ? source.logo : {};
    const fonts = source.fonts && typeof source.fonts === 'object' ? source.fonts : {};
    const D = SITE_BRAND_INFO;

    return {
        ok: true,
        error: null,
        brand: {
            company: {
                name: str(company.name, D.company.name),
                tagline: str(company.tagline, D.company.tagline),
                website: str(company.website, D.company.website),
                portal: str(company.portal, D.company.portal),
            },
            logo: {
                app: str(logo.app, D.logo.app),
                appDark: str(logo.appDark, D.logo.appDark),
                appAccent: str(logo.appAccent, D.logo.appAccent),
                appAccentDark: str(logo.appAccentDark, D.logo.appAccentDark),
                email: str(logo.email, D.logo.email),
                emailDark: str(logo.emailDark, D.logo.emailDark),
                emailAccent: str(logo.emailAccent, D.logo.emailAccent),
                emailWidth: num(logo.emailWidth, D.logo.emailWidth),
                emailHeight: num(logo.emailHeight, D.logo.emailHeight),
            },
            colors: {
                light: light || dark,
                dark: dark || light,
            },
            fonts: {
                heading: str(fonts.heading, 'Inter'),
                body: str(fonts.body, 'Inter'),
                emailStack: str(fonts.emailStack, "'Inter', 'Helvetica Neue', Arial, sans-serif"),
            },
        },
    };
};
