// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Enhanced palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const mintPalette = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#4DB6AC', // Mint Green
        light: '#82E9DE', // Light Mint Green
        dark: '#00867D', // Dark Mint Green
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#80CBC4', // Soft Teal
        light: '#B2FEF7', // Light Teal
        dark: '#4F9A94', // Dark Teal
        contrastText: '#000000', // Black for contrast on lighter teals
    },
    error: {
        main: '#EF5350', // Red, for consistency with light themes
        light: '#FF8A80', // Lighter red for softer error indications
        dark: '#C62828', // Darker red for critical errors
        contrastText: '#FFFFFF', // White for contrast
    },
    warning: {
        main: '#FFB74D', // Light Orange, to add warmth
        light: '#FFD180', // Very Light Orange
        dark: '#FFA726', // Dark Orange
        contrastText: '#000000', // Black for contrast on light orange
    },
    info: {
        main: '#4FC3F7', // Light Blue, for a refreshing contrast
        light: '#81D4FA', // Lighter Blue
        dark: '#039BE5', // Darker Blue
        contrastText: '#000000', // Black for contrast on light blue
    },
    success: {
        main: '#81C784', // Soft Green, akin to light mode for consistency
        light: '#A5D6A7', // Lighter green 
        dark: '#43A047', // Darker green
        contrastText: '#000000', // Black for contrast on light green
    },
    background: {
        default: '#E0F2F1', // Very light mint, emulating a serene sky
        paper: '#B2DFDB', // Light Mint, for paper elements
    },
    text: {
        primary: '#37474F', // Dark Slate, for readability on light backgrounds
        secondary: '#607D8B', // Blue Grey, for secondary text
        disabled: '#90A4AE', // Lighter variant for disabled text
    },
    action: {
        active: '#607D8B', // Blue Grey, adjusted for visibility
        hover: '#E0F7FA', // Very light blue, for hover states
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: '#B2EBF2', // Selected state has a soft blue
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: '#CFCFCF', // Grey, for disabled state
        disabledBackground: '#ECEFF1', // Very light grey, for disabled background
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: '#B0BEC5', // Cool Grey, for focus states
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Similar to focus for consistency
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(77, 182, 172, 0.3) 0%, rgba(77, 182, 172, 0) 100%)',
        glowEffect: '0 0 10px rgba(77, 182, 172, 0.5), 0 0 20px rgba(77, 182, 172, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(77, 182, 172, 0.15) 0%, rgba(130, 233, 222, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(224, 242, 241, 0.85)', // Light mint overlay for modals, drawers
        glassMorphism: 'rgba(178, 223, 219, 0.8)', // Glass effect with mint tint
        codeBackground: 'rgba(224, 242, 241, 0.95)', // Light mint background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(77, 182, 172, 0.2)', // Mint grid line color
        digitalPulse: 'rgba(77, 182, 172, 0.7)', // Mint pulsing effect
        matrixRain: 'rgba(77, 182, 172, 0.3)', // Mint digital rain effect
        scanline: 'rgba(77, 182, 172, 0.05)', // Mint scanline effect

        // Helper getters for component overrides
        getAlphaColor: (color, alpha) => {
            // Helper to convert hex to rgba with alpha
            if (!color) return null;

            // Check if already rgba
            if (color.startsWith('rgba')) return color;

            // Convert hex to rgba
            let hex = color.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }

            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    },

    // Function to properly get a color with alpha (fallback for components that don't use the theme function)
    getAlphaColor: function(color, alpha) {
        if (!color) return null;
        return this.custom.getAlphaColor(color, alpha);
    },

    // Add tertiary color just like spatial themes use
    tertiary: {
        main: '#FFD740', // Amber, to complement the mint theme
        light: '#FFECB3', // Light amber for subtle accents
        dark: '#FFC400', // Darker amber for emphasis
        contrastText: '#000000', // Black text for contrast on amber
    },
};