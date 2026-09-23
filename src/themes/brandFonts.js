// Apply a brand's heading and body fonts to a typography pack, and fetch a family the
// app does not already bundle.
//
// The typography packs import 30 @fontsource families at module load, so those faces are
// already present. Anything else (ringle's own Plus Jakarta Sans, for one) is pulled from
// Google Fonts on demand.

// Slugs of the families statically imported across src/themes/typography/*.
const BUNDLED_SLUGS = [
    'assistant', 'bitter', 'cinzel', 'fira-code', 'fira-sans', 'inter', 'kanit', 'lato',
    'libre-baskerville', 'lobster', 'lora', 'merriweather', 'montserrat', 'nunito',
    'open-sans', 'orbitron', 'oswald', 'playfair-display', 'poppins', 'rajdhani',
    'raleway', 'righteous', 'roboto', 'roboto-condensed', 'roboto-slab', 'sintony',
    'source-sans-pro', 'space-grotesk', 'space-mono', 'work-sans',
];

const BUNDLED = new Set(BUNDLED_SLUGS);

// A family name is interpolated into a stylesheet URL and into a CSS font-family value,
// so it is whitelisted rather than escaped. An imported brand.json is untrusted input and
// must not be able to put an arbitrary URL in the document head.
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9 ]{0,39}$/;

const slugify = (name) => String(name || '').trim().toLowerCase().replace(/\s+/g, '-');

const titleCase = (slug) =>
    slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

/** Display names for the editor's font dropdown. */
export const BUNDLED_FONTS = BUNDLED_SLUGS.map(titleCase).sort();

export const isBundledFont = (name) => BUNDLED.has(slugify(name));

const FALLBACK_STACK = "system-ui, -apple-system, 'Segoe UI', sans-serif";

/**
 * A font-family value for the given name, or null when the name is unusable so the
 * caller leaves the typography pack alone. The generic tail means a family that never
 * loads renders in the system font instead of vanishing.
 */
export const familyStack = (name) => {
    const clean = String(name || '').trim();
    if (!SAFE_NAME.test(clean)) return null;
    return `'${clean}', ${FALLBACK_STACK}`;
};

const requested = new Set();

/**
 * Make sure a family is available. Bundled families are already loaded, so this is a
 * no-op for them. Anything else gets one Google Fonts stylesheet, fetched at most once.
 * public/index.html already preconnects to fonts.googleapis.com and fonts.gstatic.com.
 */
export const ensureFont = (name) => {
    const clean = String(name || '').trim();
    if (!SAFE_NAME.test(clean)) return;

    const slug = slugify(clean);
    if (BUNDLED.has(slug) || requested.has(slug)) return;
    requested.add(slug);

    try {
        const id = `brand-font-${slug}`;
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${clean.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
    } catch (e) {
        // No DOM, or a locked-down document. The fallback stack still renders.
    }
};

const HEADING_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const BODY_VARIANTS = ['body1', 'body2', 'subtitle1', 'subtitle2', 'button', 'caption', 'overline'];

/**
 * Overlay a brand's fonts on a typography pack. The pack keeps its sizes, weights and
 * letter spacing; only the family changes.
 *
 * Monospace variants such as code and dataLabel are left alone on purpose. Putting a
 * display face on a code block wrecks it.
 */
export const applyBrandFonts = (typography, fonts) => {
    try {
        const heading = familyStack(fonts?.heading);
        const body = familyStack(fonts?.body);
        if (!heading && !body) return typography;

        const out = { ...(typography || {}) };
        if (body) {
            out.fontFamily = body;
            BODY_VARIANTS.forEach((key) => {
                if (out[key]) out[key] = { ...out[key], fontFamily: body };
            });
        }
        if (heading) {
            HEADING_VARIANTS.forEach((key) => {
                out[key] = { ...(out[key] || {}), fontFamily: heading };
            });
        }
        return out;
    } catch (e) {
        return typography;
    }
};

/** Pull the first family name out of a CSS font-family list. */
export const extractFontFamilyName = (fontFamilyString) => {
    if (!fontFamilyString) return 'Inter';
    const matches = String(fontFamilyString).match(/^['"]?([^'",]+)['"]?/);
    return matches ? matches[1].trim() : String(fontFamilyString);
};

/** The fonts a typography pack is actually using, so a fork starts out truthful. */
export const fontsFromTypography = (typographyStyles) => {
    const body = extractFontFamilyName(typographyStyles?.fontFamily);
    const heading = extractFontFamilyName(typographyStyles?.h1?.fontFamily) || body;
    return {
        heading,
        body,
        emailStack: `'${body}', 'Helvetica Neue', Arial, sans-serif`,
    };
};
