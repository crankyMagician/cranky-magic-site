// Build a complete theme export object matching the ringle brand.json shape,
// wrapped with schemaVersion/exportedAt and a "feel" section for site-specific picks

import { getThemeById, getPaletteByThemeId } from './themeRegistry';
import { getTypographyStylesById } from './typography';
import { getPairedPalettes } from './themeModePairs';
import { SITE_BRAND_INFO } from './siteBrandInfo';
import ThemeService from '../services/ThemeService';

const extractFontFamilyName = (fontFamilyString) => {
  if (!fontFamilyString) return 'Default';
  const matches = fontFamilyString.match(/^['"]?([^'",]+)['"]?/);
  return matches ? matches[1].trim() : fontFamilyString;
};

const normalizeColor = (color) => {
  if (typeof color === 'string') return color;
  if (typeof color === 'object' && color.main) return color.main;
  return '#000000';
};

const buildColorGroup = (paletteColor) => {
  if (!paletteColor) {
    return { main: '#000000', light: '#333333', dark: '#000000', contrastText: '#FFFFFF' };
  }
  return {
    main: normalizeColor(paletteColor.main || paletteColor),
    light: normalizeColor(paletteColor.light),
    dark: normalizeColor(paletteColor.dark),
    contrastText: normalizeColor(paletteColor.contrastText || '#FFFFFF'),
  };
};

export const buildThemeExport = ({
  themeId,
  componentOverride,
  typography,
  animation,
  animationSpeed,
  reducedMotion,
}) => {
  const pairedPalettes = getPairedPalettes(themeId);
  const typographyObj = getTypographyStylesById(typography);
  const themePreferences = ThemeService.getThemePreferences();

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    brand: {
      company: SITE_BRAND_INFO.company,
      logo: SITE_BRAND_INFO.logo,
      colors: {
        light: {
          primary: buildColorGroup(pairedPalettes.light.primary),
          secondary: buildColorGroup(pairedPalettes.light.secondary),
          error: buildColorGroup(pairedPalettes.light.error),
          warning: buildColorGroup(pairedPalettes.light.warning),
          info: buildColorGroup(pairedPalettes.light.info),
          success: buildColorGroup(pairedPalettes.light.success),
          background: {
            default: pairedPalettes.light.background?.default || '#FFFFFF',
            paper: pairedPalettes.light.background?.paper || '#FAFAFA',
          },
          text: {
            primary: pairedPalettes.light.text?.primary || '#000000',
            secondary: pairedPalettes.light.text?.secondary || '#666666',
            disabled: pairedPalettes.light.text?.disabled || '#CCCCCC',
          },
        },
        dark: {
          primary: buildColorGroup(pairedPalettes.dark.primary),
          secondary: buildColorGroup(pairedPalettes.dark.secondary),
          error: buildColorGroup(pairedPalettes.dark.error),
          warning: buildColorGroup(pairedPalettes.dark.warning),
          info: buildColorGroup(pairedPalettes.dark.info),
          success: buildColorGroup(pairedPalettes.dark.success),
          background: {
            default: pairedPalettes.dark.background?.default || '#121212',
            paper: pairedPalettes.dark.background?.paper || '#1E1E1E',
          },
          text: {
            primary: pairedPalettes.dark.text?.primary || '#FFFFFF',
            secondary: pairedPalettes.dark.text?.secondary || '#AAAAAA',
            disabled: pairedPalettes.dark.text?.disabled || '#666666',
          },
        },
      },
      fonts: {
        heading: extractFontFamilyName(typographyObj?.h1?.fontFamily),
        body: extractFontFamilyName(typographyObj?.fontFamily),
        emailStack: `'${extractFontFamilyName(typographyObj?.fontFamily)}', 'Helvetica Neue', Arial, sans-serif`,
      },
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
