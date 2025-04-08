// src/themes/themeMappings.js
import {spatialModsLight} from "./palettes/spatialModsLight";
import {spatialModsDark} from "./palettes/spatialModsDark";

// Map theme modes to their respective palettes
const themeModeMappings = {
    light: spatialModsLight,
    dark: spatialModsDark,
    // Preserve other existing theme mappings
};

// Function to get the palette by mode
export const getPaletteByMode = (mode) => {
    // Return the specific palette if it exists, otherwise default to spatialModsLight
    return themeModeMappings[mode] || spatialModsDark;
};

export default themeModeMappings;