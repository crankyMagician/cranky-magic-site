// Build the export.
//
// The four ringle keys sit at the top level in the order ringle writes them, so the file
// drops into packages/shared/brand.json unchanged and its consumers need no edit. The
// animation and component settings are added as siblings, which is how ringle's own
// schema has grown: the only shape change it has ever had was additive.

import { getTypographyStylesById } from './typography';
import { getPairedPalettes } from './themeModePairs';
import { SITE_BRAND_INFO } from './siteBrandInfo';
import { buildPaletteFromBrand, paletteToBrandColors } from './customPalette';
import { fontsFromTypography } from './brandFonts';
import { normalizeComponentSettings } from './generatedOverrides';
import {
    TERTIARY_KEYS,
    GREY_KEYS,
    ACTION_COLOR_KEYS,
    ACTION_OPACITY_KEYS,
    CUSTOM_KEYS,
} from './paletteKeys';

/**
 * Colours for one mode, always routed through createTheme's augmentation so light/dark/
 * contrastText are real derived values rather than the literal #000000 a main-only
 * palette used to produce.
 */
const colorsForMode = (customBrand, themeId, mode) => {
    if (customBrand) {
        const palette = buildPaletteFromBrand(customBrand, mode);
        return paletteToBrandColors(palette, mode, customBrand.colors?.[mode] || {});
    }
    const paired = getPairedPalettes(themeId);
    return paletteToBrandColors(paired[mode], mode);
};

/**
 * The theme-system keys ringle's schema has no slot for, as they actually render.
 *
 * These go under a `palette` sibling rather than inside `colors`, so the four ringle keys
 * stay byte-identical and the file still drops into packages/shared unchanged.
 * glowText is flattened back to its string so the block round-trips through the editor.
 */
const paletteExtrasForMode = (customBrand, themeId, mode) => {
    const palette = customBrand
        ? buildPaletteFromBrand(customBrand, mode)
        : getPairedPalettes(themeId)[mode];

    const custom = {};
    CUSTOM_KEYS.forEach((key) => {
        const value = key === 'glowText'
            ? palette?.custom?.glowText?.textShadow
            : palette?.custom?.[key];
        if (typeof value === 'string' && value) custom[key] = value;
    });

    const grey = {};
    GREY_KEYS.forEach((key) => {
        if (palette?.grey?.[key]) grey[key] = palette.grey[key];
    });

    const action = {};
    [...ACTION_COLOR_KEYS, ...ACTION_OPACITY_KEYS].forEach((key) => {
        const value = palette?.action?.[key];
        if (value !== undefined && value !== null) action[key] = value;
    });

    const tertiary = {};
    TERTIARY_KEYS.forEach((key) => {
        if (palette?.tertiary?.[key]) tertiary[key] = palette.tertiary[key];
    });

    return { tertiary, divider: palette?.divider, grey, action, custom };
};

export const buildThemeExport = ({
    themeId,
    componentOverride,
    typography,
    animation,
    animationSpeed,
    reducedMotion,
    customBrand = null,
    componentSettings = null,
}) => {
    const typographyObj = getTypographyStylesById(typography);
    const settings = normalizeComponentSettings(componentSettings);

    const company = { ...SITE_BRAND_INFO.company, ...(customBrand?.company || {}) };
    const logo = { ...SITE_BRAND_INFO.logo, ...(customBrand?.logo || {}) };
    const fonts = customBrand?.fonts || fontsFromTypography(typographyObj);

    return {
        company,
        logo,
        colors: {
            light: colorsForMode(customBrand, themeId, 'light'),
            dark: colorsForMode(customBrand, themeId, 'dark'),
        },
        fonts,

        palette: {
            light: paletteExtrasForMode(customBrand, themeId, 'light'),
            dark: paletteExtrasForMode(customBrand, themeId, 'dark'),
        },
        animation: {
            pack: animation,
            speed: animationSpeed,
            reducedMotion: Boolean(reducedMotion),
        },
        components: {
            override: componentOverride,
            typography,
            preset: themeId,
            ...settings,
        },
    };
};
