// src/themes/paletteMappings.js
import { munchiePalette } from './palettes/munchiePalette'; // Import Munchie Palette

// Simplify the mappings to use only Munchie options
const themeModeMappings = {
    munchie: munchiePalette,
};

// Function to always return MunchiePalette
export const getPaletteByMode = () => munchiePalette;

export default themeModeMappings; // Optional if you want to export mappings for extensibility
