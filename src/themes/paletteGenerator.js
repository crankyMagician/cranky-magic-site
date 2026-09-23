// Generate a complete, unique ringle-shaped colour block from a seed colour.
//
// Status hues stay recognisable (red for error, amber for warning, blue for info, green
// for success) because a palette where errors are not red is a worse palette. What the
// seed drives is their saturation and lightness, so they sit in the same family as the
// brand colours instead of looking bolted on.

import { STATUS_GROUPS } from './siteBrandInfo';
import {
    hexToHsl,
    hslToHex,
    shade,
    bestContrastText,
    forceContrast,
    normalizeHex,
} from './colorMath';

export const SCHEMES = [
    { id: 'complementary', name: 'Complementary', offset: 180 },
    { id: 'analogous', name: 'Analogous', offset: 38 },
    { id: 'triadic', name: 'Triadic', offset: 120 },
    { id: 'split', name: 'Split complementary', offset: 150 },
    { id: 'monochrome', name: 'Monochrome', offset: 0 },
];

const STATUS_HUES = { error: 4, warning: 38, info: 200, success: 145 };

const schemeById = (id) => SCHEMES.find((s) => s.id === id) || SCHEMES[0];

/** A colour group with MUI-style tints and an accessible contrastText. */
const groupFrom = (main) => ({
    main: normalizeHex(main).toUpperCase(),
    light: shade(main, 0.22).toUpperCase(),
    dark: shade(main, -0.28).toUpperCase(),
    contrastText: bestContrastText(main),
});

/**
 * Build one mode's colours.
 *
 * In dark mode the brand pair swaps: the secondary becomes the lead, which is the same
 * move ringle makes (its light primary is seafoam, its dark primary is canary).
 */
export const harmonyFromSeed = (seed, schemeId, mode) => {
    const seedHex = normalizeHex(seed) || '#297B66';
    const hsl = hexToHsl(seedHex) || { h: 210, s: 0.5, l: 0.45 };
    const isDark = mode === 'dark';
    const { offset } = schemeById(schemeId);

    const saturation = Math.max(0.28, Math.min(0.82, hsl.s || 0.5));
    const leadHue = hsl.h;

    // The seed is used literally as the light primary. Anything else makes "build from
    // seed" a lie, since the colour you picked would not be the colour you got.
    const partnerHue = offset === 0 ? leadHue : leadHue + offset;
    const partner = hslToHex({
        h: partnerHue,
        s: offset === 0 ? saturation * 0.7 : saturation,
        l: offset === 0
            ? Math.min(0.78, hsl.l + 0.3)
            : Math.max(0.34, Math.min(0.74, hsl.l + 0.2)),
    });

    // Dark mode needs a brighter lead, which is the swap ringle makes: its light primary
    // is seafoam and its dark primary is the light secondary, canary.
    const brighten = (color) => {
        const c = hexToHsl(color);
        if (!c) return color;
        return c.l >= 0.55 ? color : hslToHex({ ...c, l: Math.min(0.78, c.l + 0.26) });
    };

    const primaryMain = isDark ? brighten(partner) : seedHex;
    const secondaryMain = isDark ? brighten(seedHex) : partner;

    // Surfaces carry a trace of the seed hue so the whole page reads as one palette.
    const background = isDark
        ? hslToHex({ h: leadHue, s: Math.min(0.24, saturation * 0.4), l: 0.08 })
        : hslToHex({ h: leadHue, s: Math.min(0.18, saturation * 0.25), l: 0.985 });
    const paper = isDark
        ? hslToHex({ h: leadHue, s: Math.min(0.22, saturation * 0.36), l: 0.13 })
        : '#FFFFFF';

    const textPrimary = isDark
        ? hslToHex({ h: leadHue, s: 0.12, l: 0.96 })
        : hslToHex({ h: leadHue, s: 0.34, l: 0.14 });
    const textSecondary = isDark
        ? hslToHex({ h: leadHue, s: 0.1, l: 0.78 })
        : hslToHex({ h: leadHue, s: 0.16, l: 0.38 });
    const textDisabled = isDark
        ? hslToHex({ h: leadHue, s: 0.06, l: 0.55 })
        : hslToHex({ h: leadHue, s: 0.08, l: 0.58 });

    const colors = {
        primary: groupFrom(primaryMain),
        secondary: groupFrom(secondaryMain),
        background: { default: background.toUpperCase(), paper: paper.toUpperCase() },
        text: {
            primary: textPrimary.toUpperCase(),
            secondary: textSecondary.toUpperCase(),
            disabled: textDisabled.toUpperCase(),
        },
    };

    STATUS_GROUPS.forEach((group) => {
        const main = hslToHex({
            h: STATUS_HUES[group],
            s: Math.max(0.42, Math.min(0.78, saturation)),
            l: isDark ? 0.44 : 0.36,
        });
        const entry = groupFrom(main);
        // ringle's convention, with a contrast pass so status text clears AA against the
        // page background. Its own test suite asserts exactly this.
        entry.text = isDark ? entry.light : forceContrast(entry.main, colors.background.default, 4.5);
        entry.icon = entry.main;
        colors[group] = entry;
    });

    return colors;
};

const randomHex = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 0.4 + Math.random() * 0.4;
    const l = 0.36 + Math.random() * 0.16;
    return hslToHex({ h, s, l });
};

/** A fresh seed plus a scheme, for the Randomize button. */
export const randomSeed = () => randomHex().toUpperCase();

export const randomScheme = () => SCHEMES[Math.floor(Math.random() * SCHEMES.length)].id;

/** Both modes from one seed, which is what the editor writes into the brand. */
export const generateBrandColors = (seed, schemeId) => ({
    light: harmonyFromSeed(seed, schemeId, 'light'),
    dark: harmonyFromSeed(seed, schemeId, 'dark'),
});
