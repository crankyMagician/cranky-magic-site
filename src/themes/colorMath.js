// Hex colour arithmetic shared by the palette builder, the palette generator and the
// contrast badges in the brand editor.
//
// Every function here is total. A malformed colour returns null or a sensible fallback
// rather than throwing, because these run on every keystroke in the editor.

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const isHex = (value) => typeof value === 'string' && HEX_RE.test(value.trim());

/** Expand shorthand and force a leading hash. Returns null when the input is not a hex. */
export const normalizeHex = (value) => {
    if (!isHex(value)) return null;
    let hex = value.trim().replace('#', '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    return `#${hex.toLowerCase()}`;
};

export const toRgb = (value) => {
    const hex = normalizeHex(value);
    if (!hex) return null;
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
};

const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(n)));

export const toHex = ({ r, g, b }) =>
    `#${[r, g, b].map((c) => clamp255(c).toString(16).padStart(2, '0')).join('')}`;

/** Blend two colours. t of 0 returns a, t of 1 returns b. */
export const mix = (a, b, t) => {
    const ca = toRgb(a);
    const cb = toRgb(b);
    if (!ca || !cb) return normalizeHex(a) || normalizeHex(b) || '#000000';
    const k = Math.max(0, Math.min(1, t));
    return toHex({
        r: ca.r + (cb.r - ca.r) * k,
        g: ca.g + (cb.g - ca.g) * k,
        b: ca.b + (cb.b - ca.b) * k,
    });
};

/** Positive amount moves toward white, negative toward black. */
export const shade = (color, amount) =>
    amount >= 0 ? mix(color, '#ffffff', amount) : mix(color, '#000000', -amount);

/** An rgba() string. Falls back to transparent when the colour cannot be parsed. */
export const withAlpha = (color, alpha) => {
    const c = toRgb(color);
    if (!c) return 'rgba(0, 0, 0, 0)';
    const a = Math.max(0, Math.min(1, alpha));
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
};

// WCAG 2.1 relative luminance. This is the real formula, not the 0.299/0.587/0.114
// perceptual shortcut in colorUtilities, because the contrast badges are compared
// against ringle's own AA threshold of 4.5.
export const relativeLuminance = (color) => {
    const c = toRgb(color);
    if (!c) return 0;
    const channel = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
};

export const contrastRatio = (a, b) => {
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    const light = Math.max(la, lb);
    const dark = Math.min(la, lb);
    return (light + 0.05) / (dark + 0.05);
};

/** Whichever of black or white reads better on the given background. */
export const bestContrastText = (background) =>
    contrastRatio(background, '#ffffff') >= contrastRatio(background, '#000000')
        ? '#FFFFFF'
        : '#000000';

export const meetsAA = (fg, bg) => contrastRatio(fg, bg) >= 4.5;

// ---- HSL, used by the palette generator for harmonies ----

export const hexToHsl = (color) => {
    const c = toRgb(color);
    if (!c) return null;
    const r = c.r / 255;
    const g = c.g / 255;
    const b = c.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const l = (max + min) / 2;

    if (d === 0) return { h: 0, s: 0, l };

    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;

    return { h: h * 360, s, l };
};

export const hslToHex = ({ h, s, l }) => {
    const hue = ((h % 360) + 360) % 360 / 360;
    const sat = Math.max(0, Math.min(1, s));
    const lum = Math.max(0, Math.min(1, l));

    if (sat === 0) {
        const v = lum * 255;
        return toHex({ r: v, g: v, b: v });
    }

    const q = lum < 0.5 ? lum * (1 + sat) : lum + sat - lum * sat;
    const p = 2 * lum - q;
    const channel = (t) => {
        let x = t;
        if (x < 0) x += 1;
        if (x > 1) x -= 1;
        if (x < 1 / 6) return p + (q - p) * 6 * x;
        if (x < 1 / 2) return q;
        if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
        return p;
    };

    return toHex({
        r: channel(hue + 1 / 3) * 255,
        g: channel(hue) * 255,
        b: channel(hue - 1 / 3) * 255,
    });
};

export const rotateHue = (color, degrees) => {
    const hsl = hexToHsl(color);
    if (!hsl) return normalizeHex(color) || '#000000';
    return hslToHex({ ...hsl, h: hsl.h + degrees });
};

/**
 * Nudge a foreground colour until it clears the given contrast ratio against a
 * background, moving away from the background's own luminance. Gives up after 20 steps
 * and returns the best it managed, so this always terminates.
 */
export const forceContrast = (foreground, background, target = 4.5) => {
    let current = normalizeHex(foreground);
    if (!current) return bestContrastText(background);
    if (contrastRatio(current, background) >= target) return current.toUpperCase();

    const towardWhite = relativeLuminance(background) < 0.5;
    for (let i = 0; i < 20; i += 1) {
        current = shade(current, towardWhite ? 0.05 : -0.05);
        if (contrastRatio(current, background) >= target) return current.toUpperCase();
    }
    return bestContrastText(background);
};
