// src/themes/typographyMappings.js

// Simplify the mappings to use only Munchie options
import munchieTypography from "./typography/munchieTypography";

const typographyModeMappings = {
    munchie: munchieTypography,
};

// Function to always return MunchieTypography
export const getTypographyByMode = () => munchieTypography;

export default typographyModeMappings; // Optional if you want to export mappings for extensibility
