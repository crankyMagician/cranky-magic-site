// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Enhanced palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const retroNeonPalette = {
    // Standard MUI properties
    mode: 'dark',
    primary: {
        main: '#D500F9', // Neon Purple
        light: '#E040FB', // Light Neon Purple
        dark: '#AA00FF', // Dark Neon Purple
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#00E5FF', // Neon Blue
        light: '#18FFFF', // Light Neon Blue
        dark: '#00B8D4', // Dark Neon Blue
        contrastText: '#000000', // Black for contrast on bright neon
    },
    error: {
        main: '#FF1744', // Neon Red, to keep the intensity high
        light: '#FF5252', // Light neon red
        dark: '#D50000', // Dark neon red
        contrastText: '#FFFFFF', // White for contrast
    },
    warning: {
        main: '#FFEA00', // Neon Yellow, for a vivid contrast
        light: '#FFFF00', // Bright Yellow
        dark: '#FFD600', // Dark Neon Yellow
        contrastText: '#000000', // Black for contrast on bright yellow
    },
    info: {
        main: '#00E676', // Neon Green, for standout informational cues
        light: '#69F0AE', // Light Neon Green
        dark: '#00C853', // Dark Neon Green
        contrastText: '#000000', // Black for contrast on bright green
    },
    success: {
        main: '#76FF03', // Neon Lime, bringing a bright pop of color
        light: '#B2FF59', // Light neon lime
        dark: '#64DD17', // Dark neon lime
        contrastText: '#000000', // Black for contrast on bright lime
    },
    background: {
        default: '#212121', // Deep Grey, mimicking a night sky
        paper: '#424242', // Dark Grey, for paper elements, resembling urban asphalt
    },
    text: {
        primary: '#E0E0E0', // Light Grey, for readability against dark backgrounds
        secondary: '#BDBDBD', // Medium Grey, for secondary text, ensuring contrast
        disabled: '#757575', // Darker grey for disabled text
    },
    action: {
        active: '#BDBDBD', // Medium Grey, adjusted for visibility against dark backgrounds
        hover: '#616161', // Dark Grey, for hover states, providing a subtle interaction cue
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: '#757575', // Selected state has a medium-dark grey
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: '#9E9E9E', // Grey, for disabled state
        disabledBackground: '#757575', // Medium Dark Grey, for disabled background
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: '#9E9E9E', // Grey, for focus states
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Similar to focus for consistency
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(213, 0, 249, 0.3) 0%, rgba(213, 0, 249, 0) 100%)',
        glowEffect: '0 0 10px rgba(213, 0, 249, 0.5), 0 0 20px rgba(213, 0, 249, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(213, 0, 249, 0.15) 0%, rgba(224, 64, 251, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(33, 33, 33, 0.85)', // Dark overlay for modals, drawers
        glassMorphism: 'rgba(66, 66, 66, 0.8)', // Dark glass effect background
        codeBackground: 'rgba(33, 33, 33, 0.95)', // Dark background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(213, 0, 249, 0.2)', // Neon purple grid lines
        digitalPulse: 'rgba(213, 0, 249, 0.7)', // Neon purple pulsing effect
        matrixRain: 'rgba(0, 229, 255, 0.3)', // Neon blue digital rain effect
        scanline: 'rgba(213, 0, 249, 0.05)', // Neon purple scanline effect

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
        main: '#FF3D00', // Neon Orange, to complement the vibrant theme
        light: '#FF6E40', // Light neon orange
        dark: '#DD2C00', // Dark neon orange
        contrastText: '#FFFFFF', // White for contrast
    },
};