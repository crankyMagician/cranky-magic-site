// Build a complete theme export matching ringle's packages/shared/brand.json shape,
// wrapped with schemaVersion/exportedAt and a "feel" section for site-specific picks.

import { getTypographyStylesById } from './typography';
import { getPairedPalettes } from './themeModePairs';
import { SITE_BRAND_INFO } from './siteBrandInfo';
import { buildPaletteFromBrand, paletteToBrandColors } from './customPalette';
import ThemeService from '../services/ThemeService';

const extractFontFamilyName = (fontFamilyString) => {
  if (!fontFamilyString) return 'Default';
  const matches = fontFamilyString.match(/^['"]?([^'",]+)['"]?/);
  return matches ? matches[1].trim() : fontFamilyString;
};

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
}) => {
  const typographyObj = getTypographyStylesById(typography);
  const themePreferences = ThemeService.getThemePreferences();

  const company = { ...SITE_BRAND_INFO.company, ...(customBrand?.company || {}) };
  const logo = { ...SITE_BRAND_INFO.logo, ...(customBrand?.logo || {}) };

  const fonts = customBrand?.fonts || {
    heading: extractFontFamilyName(typographyObj?.h1?.fontFamily),
    body: extractFontFamilyName(typographyObj?.fontFamily),
    emailStack: `'${extractFontFamilyName(typographyObj?.fontFamily)}', 'Helvetica Neue', Arial, sans-serif`,
  };

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    brand: {
      company,
      logo,
      colors: {
        light: colorsForMode(customBrand, themeId, 'light'),
        dark: colorsForMode(customBrand, themeId, 'dark'),
      },
      fonts,
    },
    feel: {
      themeId,
      componentOverride,
      typography,
      animation,
      animationSpeed,
      reducedMotion,
      preferences: themePreferences,
    },
  };
};
