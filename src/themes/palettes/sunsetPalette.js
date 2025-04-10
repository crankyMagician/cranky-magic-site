// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Enhanced palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const sunsetPalette = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#FF8A65', // Sunset Orange
        light: '#FFBB93', // Light Sunset Orange
        dark: '#C75B39', // Dark Sunset Orange
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#FBC02D', // Sunset Yellow
        light: '#FFF263', // Light Sunset Yellow
        dark: '#C49000', // Dark Sunset Yellow
        contrastText: '#000000', // Black for contrast on bright yellow
    },
    error: {
        main: '#D32F2F', // Red, similar to light mode for consistency
        light: '#EF5350', // Light red for error backgrounds
        dark: '#C62828', // Darker red for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    warning: {
        main: '#FFA726', // Orange, slightly adjusted for sunset theme
        light: '#FFD95B', // Light Orange
        dark: '#C77800', // Dark Orange
        contrastText: '#000000', // Black for contrast
    },
    info: {
        main: '#29B6F6', // Light Blue, to contrast the warm colors
        light: '#73E8FF', // Lighter Blue
        dark: '#0086C3', // Darker Blue
        contrastText: '#000000', // Black for contrast on light blue
    },
    success: {
        main: '#66BB6A', // Green, similar to light mode for consistency
        light: '#98EE99', // Light green
        dark: '#338A3E', // Dark green
        contrastText: '#000000', // Black for contrast on light green
    },
    background: {
        default: '#FFFDE7', // Light yellow, to mimic a sunset sky
        paper: '#FFECB3', // Lighter yellow, for paper elements
    },
    text: {
        primary: '#4E342E', // Dark Brown, for readability on light backgrounds
        secondary: '#6D4C41', // Medium Brown, for secondary text
        disabled: '#A1887F', // Light brown for disabled text
    },
    action: {
        active: '#6D4C41', // Medium Brown, adjusted for visibility
        hover: '#FFE082', // Very light yellow, for hover states
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: '#FFCC80', // Selected state has a soft orange
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: '#BCAAA4', // Grey-brown, for disabled state
        disabledBackground: '#EDE7F6', // Very light purple, for disabled background
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: '#8D6E63', // Warm Brown, for focus states
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Similar to focus for consistency
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(255, 138, 101, 0.3) 0%, rgba(255, 138, 101, 0) 100%)',
        glowEffect: '0 0 10px rgba(255, 138, 101, 0.5), 0 0 20px rgba(255, 138, 101, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(255, 138, 101, 0.15) 0%, rgba(251, 192, 45, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(255, 253, 231, 0.85)', // Light yellow overlay for modals, drawers
        glassMorphism: 'rgba(255, 236, 179, 0.8)', // Light yellow glass effect
        codeBackground: 'rgba(255, 248, 225, 0.95)', // Light yellow/amber background for code

        // Matrix-inspired effects
        gridLine: 'rgba(255, 138, 101, 0.2)', // Sunset orange grid lines
        digitalPulse: 'rgba(255, 138, 101, 0.7)', // Sunset orange pulse effect
        matrixRain: 'rgba(251, 192, 45, 0.3)', // Sunset yellow digital rain effect
        scanline: 'rgba(255, 138, 101, 0.05)', // Sunset orange scanline effect

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
    getAlphaColor: function (color, alpha) {
        if (!color) return null;
        return this.custom.getAlphaColor(color, alpha);
    },

    // Add tertiary color just like spatial themes use
    tertiary: {
        main: '#FFD740', // Amber, to complement the sunset theme
        light: '#FFECB3', // Light amber for subtle accents
        dark: '#FFC400', // Darker amber for emphasis
        contrastText: '#000000', // Black text for contrast on amber
    },
};