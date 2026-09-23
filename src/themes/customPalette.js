// Turn a ringle-shaped brand object into an MUI palette, and vice versa.
//
// The whole palette is derived from the ringle colour block, so every pixel on the page
// traces back to a field the user can edit. Nothing is copied from a preset. That is what
// makes "edit all the colours and watch the page change" true rather than nearly true.
//
// Everything here is total: a malformed brand must never take the page down, so each
// entry point falls back to a real registry palette instead of throwing.

import { createTheme } from '@mui/material/styles';
import { getPaletteByThemeId } from './themeRegistry';
import { getPairedPalettes } from './themeModePairs';
import { SITE_BRAND_INFO, COLOR_GROUPS, STATUS_GROUPS } from './siteBrandInfo';
import {
    isHex,
    normalizeHex,
    mix,
    shade,
    withAlpha,
    bestContrastText,
} from './colorMath';

export { isHex } from './colorMath';

const pick = (value, fallback) => (isHex(value) ? normalizeHex(value).toUpperCase() : fallback);

const DEFAULTS = {
    light: { bg: '#FFFFFF', paper: '#FFFFFF', text: '#212121' },
    dark: { bg: '#121212', paper: '#1E1E1E', text: '#FFFFFF' },
};

/**
 * A ten-step grey ramp interpolated between the page background and the primary text
 * colour. MUI components reach for palette.grey directly, so deriving it here keeps
 * greys in sympathy with a custom background instead of sitting on stock Material grey.
 */
const buildGrey = (background, text) => {
    const stops = [0.04, 0.09, 0.16, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86, 0.94];
    const keys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    const grey = {};
    keys.forEach((key, i) => { grey[key] = mix(background, text, stops[i]); });
    grey.A100 = grey['100'];
    grey.A200 = grey['200'];
    grey.A400 = grey['400'];
    grey.A700 = grey['700'];
    return grey;
};

/** The action block, keyed off the text colour so it inverts correctly in dark mode. */
const buildAction = (text, isDark) => ({
    active: withAlpha(text, isDark ? 0.7 : 0.6),
    hover: withAlpha(text, isDark ? 0.08 : 0.04),
    hoverOpacity: isDark ? 0.08 : 0.04,
    selected: withAlpha(text, isDark ? 0.16 : 0.08),
    selectedOpacity: isDark ? 0.16 : 0.08,
    disabled: withAlpha(text, 0.26),
    disabledBackground: withAlpha(text, 0.12),
    disabledOpacity: 0.38,
    focus: withAlpha(text, 0.12),
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
});

/**
 * Regenerate the visual-effects block from the edited colours.
 *
 * Registry palettes ship this block with rgba values hardcoded to their own hue, and the
 * old merge copied it wholesale, so every glow and grid line stayed orange no matter what
 * the user picked. Every string below is now built from primary, secondary or background.
 *
 * The key set covers what all eight component-override packs read, including the six the
 * wizard pack reaches for.
 */
const buildCustomEffects = (primary, secondary, tertiary, background, paper, text, isDark) => {
    const getAlphaColor = (color, alpha) => withAlpha(color, alpha);

    return {
        // Gradients and glows
        dataStream: `linear-gradient(180deg, ${withAlpha(primary, 0.3)} 0%, ${withAlpha(primary, 0)} 100%)`,
        glowEffect: `0 0 10px ${withAlpha(primary, 0.5)}, 0 0 20px ${withAlpha(primary, 0.3)}`,
        hologram: `linear-gradient(135deg, ${withAlpha(primary, 0.15)} 0%, ${withAlpha(tertiary, 0.15)} 100%)`,

        // Surfaces and overlays
        overlay: withAlpha(background, 0.85),
        glassMorphism: withAlpha(paper, 0.8),
        codeBackground: withAlpha(mix(paper, text, isDark ? 0.08 : 0.04), 0.95),

        // Grid and scanline effects
        gridLine: withAlpha(primary, 0.2),
        digitalPulse: withAlpha(primary, 0.7),
        matrixRain: withAlpha(primary, 0.3),
        scanline: withAlpha(primary, 0.05),

        // Keys the wizard pack reads
        magicalGradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        purpleGlow: `0 0 12px ${withAlpha(secondary, 0.55)}, 0 0 28px ${withAlpha(secondary, 0.3)}`,
        aurora: `linear-gradient(120deg, ${withAlpha(primary, 0.35)} 0%, ${withAlpha(secondary, 0.25)} 45%, ${withAlpha(tertiary, 0.35)} 100%)`,
        cardHoverShadow: isDark
            ? `0 10px 24px rgba(0, 0, 0, 0.5), 0 0 12px ${withAlpha(primary, 0.28)}`
            : `0 10px 24px ${withAlpha(text, 0.16)}, 0 0 12px ${withAlpha(primary, 0.18)}`,
        nebula: `radial-gradient(circle at 30% 20%, ${withAlpha(secondary, 0.35)} 0%, ${withAlpha(primary, 0.2)} 40%, transparent 70%)`,
        glowText: { textShadow: `0 0 8px ${withAlpha(primary, 0.6)}` },

        getAlphaColor,
    };
};

/**
 * Build a complete MUI palette from one mode of a ringle colour block.
 * Returns null when the input is unusable, which lets the caller fall back.
 */
export const buildDerivedPalette = (colors, brandMode) => {
    if (!colors || typeof colors !== 'object') return null;
    if (!isHex(colors.primary?.main)) return null;

    const isDark = brandMode === 'dark';
    const d = isDark ? DEFAULTS.dark : DEFAULTS.light;

    const background = pick(colors.background?.default, d.bg);
    const paper = pick(colors.background?.paper, background);
    const textPrimary = pick(colors.text?.primary, d.text);
    const textSecondary = pick(colors.text?.secondary, mix(textPrimary, background, 0.35));
    const textDisabled = pick(colors.text?.disabled, mix(textPrimary, background, 0.62));

    const palette = {
        mode: isDark ? 'dark' : 'light',
        common: { black: '#000000', white: '#FFFFFF' },
        background: { default: background, paper },
        text: {
            primary: textPrimary,
            secondary: textSecondary,
            disabled: textDisabled,
            hint: textDisabled,
            inputPlaceholder: textSecondary,
        },
        divider: withAlpha(textPrimary, isDark ? 0.18 : 0.12),
        action: buildAction(textPrimary, isDark),
        grey: buildGrey(background, textPrimary),
    };

    COLOR_GROUPS.forEach((group) => {
        const incoming = colors[group];
        if (!isHex(incoming?.main)) return;
        const main = pick(incoming.main, '#000000');
        const entry = {
            main,
            light: pick(incoming.light, shade(main, 0.2)),
            dark: pick(incoming.dark, shade(main, -0.3)),
            contrastText: pick(incoming.contrastText, bestContrastText(main)),
        };
        // ringle carries text and icon on the four status groups only. They drive the
        // generated Alert and helper-text overrides, so they are real palette values now
        // rather than fields that only ever reached the export.
        if (STATUS_GROUPS.includes(group)) {
            entry.text = pick(incoming.text, isDark ? entry.light : entry.main);
            entry.icon = pick(incoming.icon, entry.main);
        }
        palette[group] = entry;
    });

    // tertiary is not part of ringle's schema but several override packs read it, so it
    // is derived from secondary rather than left pointing at a preset.
    const secondaryMain = palette.secondary?.main || palette.primary.main;
    palette.tertiary = {
        main: secondaryMain,
        light: shade(secondaryMain, 0.25),
        dark: shade(secondaryMain, -0.25),
        contrastText: bestContrastText(secondaryMain),
    };

    palette.custom = buildCustomEffects(
        palette.primary.main,
        secondaryMain,
        palette.tertiary.main,
        background,
        paper,
        textPrimary,
        isDark,
    );

    // A plain closure, not a method bound to `this`. The old registry palettes defined
    // this as `function () { return this.custom.getAlphaColor(...) }`, which stops working
    // the moment the palette is spread into a new object.
    palette.getAlphaColor = (color, alpha) => withAlpha(color, alpha);

    return palette;
};

/**
 * Entry point used by App.js. Falls back to a registry palette if the brand cannot be
 * turned into anything usable.
 */
export const buildPaletteFromBrand = (brand, brandMode) => {
    try {
        const derived = buildDerivedPalette(brand?.colors?.[brandMode], brandMode);
        if (derived) return derived;
    } catch (e) {
        console.warn('Falling back to a preset palette, the custom brand could not be applied:', e.message);
    }
    return getPaletteByThemeId(brandMode === 'dark' ? 'dark' : 'light');
};

/**
 * Run one mode's colours through createTheme so light/dark/contrastText get MUI's own
 * derivation. Exporting from the augmented result keeps the JSON matching what renders.
 */
export const augmentColors = (palette) => {
    try {
        return createTheme({ palette }).palette;
    } catch (e) {
        return palette;
    }
};

// ringle's convention: icon tracks main; text tracks main in light mode and the light
// tint in dark mode, so status text stays readable on a dark surface.
const statusExtras = (group, resolved, brandMode) =>
    STATUS_GROUPS.includes(group)
        ? {
              text: brandMode === 'dark' ? resolved.light : resolved.main,
              icon: resolved.main,
          }
        : {};

/** Shape one augmented MUI palette into ringle's colour block for a single mode. */
export const paletteToBrandColors = (palette, brandMode, overrides = {}) => {
    const augmented = augmentColors(palette);
    const out = {};

    COLOR_GROUPS.forEach((group) => {
        const g = augmented[group] || {};
        const manual = overrides[group] || {};
        const resolved = {
            main: pick(manual.main, g.main),
            light: pick(manual.light, g.light),
            dark: pick(manual.dark, g.dark),
            contrastText: pick(manual.contrastText, g.contrastText),
        };
        const extras = statusExtras(group, resolved, brandMode);
        Object.keys(extras).forEach((k) => {
            extras[k] = pick(manual[k], pick(g[k], extras[k]));
        });
        out[group] = { ...resolved, ...extras };
    });

    out.background = {
        default: pick(overrides.background?.default, augmented.background?.default),
        paper: pick(overrides.background?.paper, augmented.background?.paper),
    };
    out.text = {
        primary: pick(overrides.text?.primary, augmented.text?.primary),
        secondary: pick(overrides.text?.secondary, augmented.text?.secondary),
        disabled: pick(overrides.text?.disabled, augmented.text?.disabled),
    };

    return out;
};

/** Fork a registry preset into an editable, fully-populated ringle-shaped brand. */
export const createBrandFromTheme = (themeId, fonts) => {
    const paired = getPairedPalettes(themeId);
    return {
        company: { ...SITE_BRAND_INFO.company },
        logo: { ...SITE_BRAND_INFO.logo },
        colors: {
            light: paletteToBrandColors(paired.light, 'light'),
            dark: paletteToBrandColors(paired.dark, 'dark'),
        },
        fonts: {
            heading: fonts?.heading || 'Inter',
            body: fonts?.body || 'Inter',
            emailStack: fonts?.emailStack || "'Inter', 'Helvetica Neue', Arial, sans-serif",
        },
    };
};
