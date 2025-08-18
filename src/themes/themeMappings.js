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
import {csColor27V1} from "./spatialcolor/cs_color_27_v1";
import {csColor30V2} from "./spatialcolor/cs_color_30_v2";
import {csColor23V3} from "./spatialcolor/cs_color_23_v3";
import {csColor29V4} from "./spatialcolor/cs_color_29_v4";
import {csColor31V5} from "./spatialcolor/cs_color_31_v5";

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
    // Add your new color schemes
    cs_color_27_v1: csColor27V1,
    cs_color_30_v2: csColor30V2,
    cs_color_23_v3: csColor23V3,
    cs_color_29_v4: csColor29V4,
    cs_color_31_v5: csColor31V5
};

// Function to get the palette by mode
export const getPaletteByMode = (mode) => {
    // Return the specific palette if it exists, otherwise default to spatialModsLight
    return themeModeMappings[mode] || spatialModsLight;
};

export default themeModeMappings;