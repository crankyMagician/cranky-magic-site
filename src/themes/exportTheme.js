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
