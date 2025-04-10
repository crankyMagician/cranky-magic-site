// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Enhanced palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const paletteDarkMode = {
    // Standard MUI properties
    mode: 'dark',
    primary: {
        main: '#2196F3', // Blue base
        light: '#64B5F6', // Light blue
        dark: '#0D47A1', // Dark blue
        contrastText: '#FFFFFF', // White text for contrast
    },
    secondary: {
        main: '#4CAF50', // Green base
        light: '#81C784', // Light green
        dark: '#388E3C', // Dark green
        contrastText: '#FFFFFF', // White text for contrast
    },
    error: {
        main: '#F44336', // Red base
        light: '#E57373', // Light red
        dark: '#D32F2F', // Dark red
        contrastText: '#FFFFFF', // White text for contrast
    },
    warning: {
        main: '#FF9800', // Orange base
        light: '#FFB74D', // Light orange
        dark: '#F57C00', // Dark orange
        contrastText: '#000000', // Black text for contrast
    },
    info: {
        main: '#9E9E9E', // Grey base
        light: '#BDBDBD', // Light grey
        dark: '#616161', // Dark grey
        contrastText: '#000000', // Black text for contrast
    },
    success: {
        main: '#4CAF50', // Green base (same as secondary)
        light: '#81C784', // Light green
        dark: '#388E3C', // Dark green
        contrastText: '#FFFFFF', // White text for contrast
    },
    background: {
        default: '#000000', // Black
        paper: '#121212', // Dark paper for layering
    },
    text: {
        primary: '#FFFFFF', // White
        secondary: '#9E9E9E', // Grey
        disabled: '#757575', // Darker grey for disabled
    },
    action: {
        active: '#9E9E9E', // Grey base, adjusted for visibility against dark backgrounds
        hover: '#424242', // Dark grey for hover
        hoverOpacity: 0.08, // Standard opacity
        selected: '#BDBDBD', // Light grey for selected state
        selectedOpacity: 0.14, // Consistent with light mode
        disabled: '#424242', // Dark grey for disabled
        disabledBackground: '#757575', // Medium grey for disabled background
        disabledOpacity: 0.38, // Standard opacity for disabled
        focus: '#BDBDBD', // Light grey for focus
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Consistency with focus state
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(33, 150, 243, 0.3) 0%, rgba(33, 150, 243, 0) 100%)',
        glowEffect: '0 0 10px rgba(33, 150, 243, 0.5), 0 0 20px rgba(33, 150, 243, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(100, 181, 246, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(0, 0, 0, 0.85)', // Dark overlay for modals, drawers
        glassMorphism: 'rgba(18, 18, 18, 0.8)', // Dark glass effect background
        codeBackground: 'rgba(18, 18, 18, 0.95)', // Dark background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(33, 150, 243, 0.2)', // Blue grid line color
        digitalPulse: 'rgba(33, 150, 243, 0.7)', // Blue pulsing effect
        matrixRain: 'rgba(33, 150, 243, 0.3)', // Blue digital rain effect
        scanline: 'rgba(33, 150, 243, 0.05)', // Blue scanline effect

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
        main: '#FFEB3B', // Yellow for tertiary accent
        light: '#FFF176', // Light yellow
        dark: '#FBC02D', // Dark yellow
        contrastText: '#000000', // Black text for contrast
    },
};