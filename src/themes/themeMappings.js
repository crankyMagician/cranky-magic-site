// src/themes/themeMappings.js
import {
    paletteLightMode,
    paletteDarkMode,
    altThemePalette,
    professionalModernPalette,
    corporateMemphisPalette,
    techStartupInnovationPalette
} from "./palettes/palettes";
import {sunsetPalette} from "./palettes/sunsetPalette";
import {mintPalette} from "./palettes/mintPalette";
import {retroNeonPalette} from "./palettes/retroNeonPalette";

const themeModeMappings = {
    light: paletteLightMode,
    dark: paletteDarkMode,
    altTheme: altThemePalette,
    professional: professionalModernPalette,
    memphis: corporateMemphisPalette,
    startup: techStartupInnovationPalette,
    sunset: sunsetPalette,
    mint: mintPalette,
    retro_neon: retroNeonPalette
};

export const getPaletteByMode = (mode) => themeModeMappings[mode] || paletteLightMode;

