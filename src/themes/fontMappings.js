// src/themes/fontMappings.js

// Map theme modes to their respective typography settings
import spatialModsTypography from "./typography/spatialTypograhpy";

const typographyModeMappings = {
    light: spatialModsTypography,
    dark: spatialModsTypography,
    // Same typography for light and dark modes in spatial theme
    // Add other theme mappings as needed
};

// Function to get typography settings by mode
export const getTypographyByMode = (mode) => {
    // Return the specific typography if it exists, otherwise default to spatialModsTypography
    return typographyModeMappings[mode] || spatialModsTypography;
};

export default typographyModeMappings;