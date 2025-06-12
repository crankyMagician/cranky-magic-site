// src/themes/themeMappings.js
import {spatialModsLight} from "./palettes/spatialModsLight";
import {spatialModsDark} from "./palettes/spatialModsDark";
import {paletteLightMode} from "./palettes/paletteLightMode";
import {paletteDarkMode} from "./palettes/paletteDarkMode";
import {professionalModernPalette} from "./palettes/professionalModernPalette";
import {techStartupInnovationPalette} from "./palettes/techStartupInnovationPalette";
import {corporateMemphisPalette} from "./palettes/corporateMemphisPalette";
import {altThemePalette} from "./palettes/altThemePalette";
import {sunsetPalette} from "./palettes/sunsetPalette";
import {mintPalette} from "./palettes/mintPalette";
import {retroNeonPalette} from "./palettes/retroNeonPalette";
import {highContrastPalette} from "./palettes/highContrastPalette";
import {crankyMagicianLight} from "./palettes/crankyMagicianLight";
import {crankyMagicianDark} from "./palettes/crankyMagicianDark";

// Map theme modes to their respective palettes
const themeModeMappings = {
    light: spatialModsLight,
    dark: spatialModsDark,
    munchie: paletteLightMode,
    munchie_dark: paletteDarkMode,
    professional: professionalModernPalette,
    startup: techStartupInnovationPalette,
    memphis: corporateMemphisPalette,
    altTheme: altThemePalette,
    sunset: sunsetPalette,
    mint: mintPalette,
    retro_neon: retroNeonPalette,
    high_contrast: highContrastPalette,
    cranky_light: crankyMagicianLight,
    cranky_dark: crankyMagicianDark
};

// Function to get the palette by mode
export const getPaletteByMode = (mode) => {
    // Return the specific palette if it exists, otherwise default to spatialModsLight
    return themeModeMappings[mode] || spatialModsLight;
};

export default themeModeMappings;


