// src/themes/utils/colorUtilities.js

/**
 * Convert hex color to rgba with specified alpha
 * @param {string} hex - Hex color code (e.g. '#FF0000' or '#F00')
 * @param {number} alpha - Alpha value between 0 and 1
 * @returns {string} - RGBA color string
 */
export const hexToRgba = (hex, alpha = 1) => {
    if (!hex) return null;

    // Return if already in rgba format
    if (hex.startsWith('rgba')) return hex;
    if (hex.startsWith('rgb(')) {
        return hex.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }

    // Remove # if present
    hex = hex.replace('#', '');

    // Convert shorthand hex to full hex
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Convert hex to rgb
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return rgba value
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Create a color with alpha in hexadecimal format
 * @param {string} hex - Hex color code
 * @param {number} alpha - Alpha value between 0 and 1
 * @returns {string} - Hex color with alpha
 */
export const hexWithAlpha = (hex, alpha = 1) => {
    if (!hex) return null;

    // Remove # if present
    hex = hex.replace('#', '');

    // Convert shorthand hex to full hex
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Convert alpha to hex
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');

    return `#${hex}${alphaHex}`;
};

/**
 * Lighten or darken a color by a percentage
 * @param {string} color - Hex color code
 * @param {number} amount - Amount to lighten (positive) or darken (negative)
 * @returns {string} - Modified hex color
 */
export const adjustColorBrightness = (color, amount) => {
    if (!color) return null;

    // Remove # if present
    let hex = color.replace('#', '');

    // Convert shorthand hex to full hex
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Convert hex to rgb
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Adjust brightness
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    // Convert back to hex
    const newHex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return `#${newHex}`;
};

/**
 * Generate a color palette from a base color
 * @param {string} baseColor - Base color in hex
 * @returns {Object} - Object containing main, light, and dark variations
 */
export const generateColorPalette = (baseColor) => {
    return {
        main: baseColor,
        light: adjustColorBrightness(baseColor, 30),
        dark: adjustColorBrightness(baseColor, -30),
        contrastText: isLightColor(baseColor) ? '#000000' : '#FFFFFF',
    };
};

/**
 * Determine if a color is light or dark
 * @param {string} color - Hex color code
 * @returns {boolean} - True if color is light
 */
export const isLightColor = (color) => {
    // Remove # if present
    let hex = color.replace('#', '');

    // Convert shorthand hex to full hex
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Convert hex to rgb
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance
    // Formula: 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
};

/**
 * Get the appropriate text color for a background color
 * @param {string} backgroundColor - Background color in hex
 * @returns {string} - Appropriate text color (#000000 or #FFFFFF)
 */
export const getContrastText = (backgroundColor) => {
    return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

/**
 * Convert a color to a glow effect
 * @param {string} color - Color in hex
 * @returns {string} - CSS box-shadow property for a glow effect
 */
export const createGlowEffect = (color) => {
    return `0 0 10px ${hexToRgba(color, 0.5)}, 0 0 20px ${hexToRgba(color, 0.3)}`;
};

/**
 * Create a gradient string from two colors
 * @param {string} color1 - First color in hex
 * @param {string} color2 - Second color in hex
 * @param {string} direction - Gradient direction (e.g. '90deg', 'to bottom')
 * @returns {string} - CSS linear-gradient property
 */
export const createGradient = (color1, color2, direction = '90deg') => {
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
};

/**
 * Add transparency gradient to a color
 * @param {string} color - Color in hex
 * @param {number} startAlpha - Starting alpha value (0-1)
 * @param {number} endAlpha - Ending alpha value (0-1)
 * @param {string} direction - Gradient direction
 * @returns {string} - CSS linear-gradient with transparency
 */
export const createTransparencyGradient = (color, startAlpha = 0.3, endAlpha = 0, direction = '180deg') => {
    return `linear-gradient(${direction}, ${hexToRgba(color, startAlpha)} 0%, ${hexToRgba(color, endAlpha)} 100%)`;
};

export default {
    hexToRgba,
    hexWithAlpha,
    adjustColorBrightness,
    generateColorPalette,
    isLightColor,
    getContrastText,
    createGlowEffect,
    createGradient,
    createTransparencyGradient
};