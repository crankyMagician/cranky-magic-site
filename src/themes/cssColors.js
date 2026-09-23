// Find and replace the colours inside a CSS value.
//
// The theme palette holds gradients and shadow stacks, not plain colours, so giving them
// a picker means locating each colour token in the string and swapping it without
// touching the angle, the stop percentages or the blur radii around it.
//
// This parses rather than reusing colorMath, which cannot read alpha back: its `toRgb`
// goes through `normalizeHex` and returns null for anything that is not 3- or 6-digit
// hex, and `isHex` rejects 8-digit hex too. Output goes back through colorMath so
// hand-picked values are spelled the same way derived ones are.
//
// Everything here is total. Malformed input yields an empty token list or null.

import { toHex, withAlpha, hslToHex } from './colorMath';

// Ordered so the longest forms match first. A lone `#abc` must not win against `#abcdef`.
const PATTERNS = [
    { kind: 'func', re: /\b(?:rgba?|hsla?)\(\s*[^()]*\)/gi },
    { kind: 'hex', re: /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})\b/gi },
    { kind: 'keyword', re: /\btransparent\b/gi },
];

/**
 * Every colour in a CSS value, left to right, with the offsets needed to splice it back.
 * Overlapping matches are dropped, so `rgba(...)` is never also reported as a hex.
 */
export const findColorTokens = (css) => {
    if (typeof css !== 'string' || !css) return [];
    try {
        const found = [];
        PATTERNS.forEach(({ kind, re }) => {
            re.lastIndex = 0;
            let m = re.exec(css);
            while (m) {
                found.push({ value: m[0], start: m.index, end: m.index + m[0].length, kind });
                m = re.exec(css);
            }
        });

        found.sort((a, b) => a.start - b.start);

        const out = [];
        let cursor = -1;
        found.forEach((token) => {
            if (token.start < cursor) return;
            out.push(token);
            cursor = token.end;
        });
        return out;
    } catch (e) {
        return [];
    }
};

/**
 * Swap one token for a new value, addressed by offset rather than by text, so two
 * identical colours in the same string stay independently editable.
 */
export const replaceToken = (css, token, next) => {
    if (typeof css !== 'string') return css;
    if (!token || typeof token.start !== 'number' || typeof token.end !== 'number') return css;
    if (token.start < 0 || token.end > css.length || token.start > token.end) return css;
    return css.slice(0, token.start) + String(next) + css.slice(token.end);
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

const numbers = (body) => (body.match(/-?[\d.]+%?/g) || []);

const channel = (raw) => {
    const value = String(raw);
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return 0;
    return clamp(Math.round(value.endsWith('%') ? (n / 100) * 255 : n), 0, 255);
};

const alphaOf = (raw) => {
    if (raw === undefined) return 1;
    const value = String(raw);
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return 1;
    return clamp(value.endsWith('%') ? n / 100 : n, 0, 1);
};

/** Channels from any form this module recognises, or null. */
export const parseToRgba = (value) => {
    if (typeof value !== 'string') return null;
    const v = value.trim();
    if (!v) return null;

    try {
        if (/^transparent$/i.test(v)) return { r: 0, g: 0, b: 0, a: 0 };

        if (v.startsWith('#')) {
            let hex = v.slice(1);
            if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
            if (hex.length === 8) {
                return {
                    r: parseInt(hex.slice(0, 2), 16),
                    g: parseInt(hex.slice(2, 4), 16),
                    b: parseInt(hex.slice(4, 6), 16),
                    a: clamp(parseInt(hex.slice(6, 8), 16) / 255, 0, 1),
                };
            }
            if (hex.length !== 6) return null;
            return {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16),
                a: 1,
            };
        }

        const fn = v.match(/^(rgba?|hsla?)\(\s*([^()]*)\)$/i);
        if (!fn) return null;
        const parts = numbers(fn[2]);
        if (parts.length < 3) return null;

        if (/^hsl/i.test(fn[1])) {
            const hex = hslToHex({
                h: parseFloat(parts[0]) || 0,
                s: (parseFloat(parts[1]) || 0) / 100,
                l: (parseFloat(parts[2]) || 0) / 100,
            });
            const rgb = parseToRgba(hex);
            return rgb ? { ...rgb, a: alphaOf(parts[3]) } : null;
        }

        return {
            r: channel(parts[0]),
            g: channel(parts[1]),
            b: channel(parts[2]),
            a: alphaOf(parts[3]),
        };
    } catch (e) {
        return null;
    }
};

/**
 * Spell a colour the way the rest of the app does. An opaque colour comes out as hex when
 * hex is allowed, so ringle's schema keeps getting hex; anything with alpha comes out as
 * rgba with the same spacing colorMath's withAlpha produces.
 */
export const formatColor = (rgba, preferHex = true) => {
    if (!rgba) return '';
    try {
        const r = clamp(Math.round(rgba.r), 0, 255);
        const g = clamp(Math.round(rgba.g), 0, 255);
        const b = clamp(Math.round(rgba.b), 0, 255);
        const a = rgba.a === undefined ? 1 : clamp(rgba.a, 0, 1);
        const hex = toHex({ r, g, b });
        if (a >= 1) return preferHex ? hex.toUpperCase() : withAlpha(hex, 1);
        return withAlpha(hex, Math.round(a * 1000) / 1000);
    } catch (e) {
        return '';
    }
};

/** True when the value is one colour and nothing else, so it needs no token list. */
export const isSingleColor = (css) => {
    if (typeof css !== 'string') return false;
    const trimmed = css.trim();
    const tokens = findColorTokens(trimmed);
    return tokens.length === 1 && tokens[0].start === 0 && tokens[0].end === trimmed.length;
};
