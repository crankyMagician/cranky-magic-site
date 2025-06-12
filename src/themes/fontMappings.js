// src/themes/fontMappings.js
// Import all typography options
import spatialModsTypography from "./typography/spatialTypograhpy";
import techStartupTypography from "./typography/techStartupTypography";
import sunsetTypography from "./typography/sunsetTypography";
import retroNeonTypography from "./typography/retroNeonTypography";
import professionalTypography from "./typography/professionalTypography";
import mintTypography from "./typography/mintTypography";
import lightTypography from "./typography/lightTypography";
import highContrastAccessibilityTypography from "./typography/highContrastAccessibilityTypography";
import darkTypography from "./typography/darkTypography";
import corporateMemphisTypography from "./typography/corporateMemphisTypography";
import altTypography from "./typography/altTypography";
import {crankyMagicianTypography} from "./typography/crankyMagicianTypography";

// Map theme modes to their respective typography settings
const typographyModeMappings = {
    // Spatial themes
    light: spatialModsTypography,
    dark: spatialModsTypography,

    // Standard themes
    munchie: lightTypography,
    munchie_dark: darkTypography,

    // Special themes
    professional: professionalTypography,
    startup: techStartupTypography,
    memphis: corporateMemphisTypography,
    altTheme: altTypography,
    sunset: sunsetTypography,
    mint: mintTypography,
    retro_neon: retroNeonTypography,
    high_contrast: highContrastAccessibilityTypography,

    // Cranky Magician themes
    cranky_light: crankyMagicianTypography,
    cranky_dark: crankyMagicianTypography
};

// Function to get typography settings by mode
export const getTypographyByMode = (mode) => {
    // Return the specific typography if it exists, otherwise default to spatialModsTypography
    return typographyModeMappings[mode] || spatialModsTypography;
};

export default typographyModeMappings;