// Extract and reuse the theme-pairing logic from ThemeService.toggleThemeMode()
// This maps single-mode themes to their paired counterpart, falling back to generic light/dark

import { getThemeById, getPaletteByThemeId } from './themeRegistry';

const THEME_MODE_PAIRS = {
  cranky_light: 'cranky_dark',
  cranky_dark: 'cranky_light',
  munchie: 'munchie_dark',
  munchie_dark: 'munchie',
  professional: 'professional_dark',
  professional_dark: 'professional',
};

export const getPairedThemeId = (themeId) => {
  return THEME_MODE_PAIRS[themeId] || (
    getThemeById(themeId)?.category === 'dark' ? 'light' : 'dark'
  );
};

export const getPairedPalettes = (activeThemeId) => {
  const activeTheme = getThemeById(activeThemeId);
  if (!activeTheme) {
    return { light: getPaletteByThemeId('light'), dark: getPaletteByThemeId('dark') };
  }

  const activePalette = getPaletteByThemeId(activeThemeId);
  const pairedThemeId = getPairedThemeId(activeThemeId);
  const pairedPalette = getPaletteByThemeId(pairedThemeId);

  if (activeTheme.category === 'light') {
    return { light: activePalette, dark: pairedPalette };
  } else {
    return { light: pairedPalette, dark: activePalette };
  }
};
