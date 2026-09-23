// Turn a ringle-shaped brand object into an MUI palette, and vice versa.
//
// Everything here is total: a malformed brand must never take the page down, so each
// entry point falls back to a real registry palette instead of throwing.

import { createTheme } from '@mui/material/styles';
import { getPaletteByThemeId } from './themeRegistry';
import { getPairedPalettes } from './themeModePairs';
import { SITE_BRAND_INFO, COLOR_GROUPS, STATUS_GROUPS } from './siteBrandInfo';

const HEX = /^#[0-9a-f]{6}$/i;

export const isHex = (v) => typeof v === 'string' && HEX.test(v.trim());

const pick = (value, fallback) => (isHex(value) ? value.trim() : fallback);

const basePaletteFor = (brandMode) => getPaletteByThemeId(brandMode === 'dark' ? 'dark' : 'light');

/**
 * Merge a brand's colours for one mode over a real registry palette.
 *
 * Merging rather than building from scratch is deliberate: registry palettes carry a
 * `custom.*` gradient block, an `action` block and a `getAlphaColor` *function* that
 * component overrides call directly. A palette rebuilt from JSON has none of those, and
 * the wizard overrides in particular would throw on the missing function.
 */
export const buildPaletteFromBrand = (brand, brandMode) => {
    const base = basePaletteFor(brandMode);
    try {
        const colors = brand?.colors?.[brandMode];
        if (!colors || typeof colors !== 'object') return base;

        const merged = { ...base, mode: brandMode === 'dark' ? 'dark' : 'light' };

        COLOR_GROUPS.forEach((group) => {
            const incoming = colors[group];
            if (!incoming || typeof incoming !== 'object') return;
            const baseGroup = base[group] || {};
            if (!isHex(incoming.main) && !isHex(baseGroup.main)) return;

            merged[group] = {
                ...baseGroup,
                main: pick(incoming.main, baseGroup.main),
                light: pick(incoming.light, baseGroup.light),
                dark: pick(incoming.dark, baseGroup.dark),
                contrastText: pick(incoming.contrastText, baseGroup.contrastText),
            };
        });

        if (colors.background && typeof colors.background === 'object') {
            merged.background = {
                ...base.background,
                default: pick(colors.background.default, base.background?.default),
                paper: pick(colors.background.paper, base.background?.paper),
            };
        }

        if (colors.text && typeof colors.text === 'object') {
            merged.text = {
                ...base.text,
                primary: pick(colors.text.primary, base.text?.primary),
                secondary: pick(colors.text.secondary, base.text?.secondary),
                disabled: pick(colors.text.disabled, base.text?.disabled),
            };
        }

        return merged;
    } catch (e) {
        console.warn('Falling back to base palette, custom brand could not be applied:', e.message);
        return base;
    }
};

/**
 * Run one mode's colours through createTheme so light/dark/contrastText get MUI's own
 * derivation (light = lighten(main, .2), dark = darken(main, .3), contrast-checked text).
 * Exporting from the augmented result is what keeps the JSON matching what is rendered.
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
const statusExtras = (group, augmented, brandMode) =>
    STATUS_GROUPS.includes(group)
        ? {
              text: brandMode === 'dark' ? augmented.light : augmented.main,
              icon: augmented.main,
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
            extras[k] = pick(manual[k], extras[k]);
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
