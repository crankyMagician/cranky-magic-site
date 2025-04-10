// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Enhanced palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const altThemePalette = {
    // Standard MUI properties
    mode: 'light', // or 'dark'
    primary: {
        main: '#FF9800', // A vibrant, attention-grabbing color for primary actions
        light: '#FFB74D', // Keeping it consistent for simplicity
        dark: '#F57C00', // Ensuring visibility and focus
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#FFEB3B', // Bright and cheerful for secondary accents
        light: '#FFF176', // Consistent color for a harmonious look
        dark: '#FDD835', // Maintains the theme's energy
        contrastText: '#000000',
    },
    error: {
        main: '#F44336', // Strong and alerting for error states
        light: '#E57373',
        dark: '#D32F2F',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#9E9E9E', // A softer warning, using grey to differentiate from the usual orange
        light: '#BDBDBD', // Simplified approach for consistency
        dark: '#616161', // Subdued to keep the focus on primary and secondary colors
        contrastText: '#000000',
    },
    info: {
        main: '#2196F3', // Trustworthy and calm for informational cues
        light: '#64B5F6', // Consistent for a sleek look
        dark: '#1976D2', // Ensures information stands out
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#4CAF50', // Lively and positive for successful actions
        light: '#81C784',
        dark: '#388E3C',
        contrastText: '#FFFFFF',
    },
    background: {
        default: '#F5F5F5', // A light background for content
        paper: '#FFFFFF', // Lighter than default for layered design
    },
    text: {
        primary: '#000000', // Dark text on light backgrounds for readability
        secondary: '#424242', // Soft contrast for less critical text
        disabled: '#757575',
    },
    action: {
        active: '#F57C00', // Giving a distinct look for active states
        hover: '#FFEB3B',
        hoverOpacity: 0.08, // Maintaining the standard for hover states
        selected: '#FFB74D', // Slightly vibrant for selected states
        selectedOpacity: 0.14, // Slightly vibrant for selected states
        disabled: '#FF9800', // Clearly indicating disabled states with a softer color
        disabledBackground: '#FFEB3B',
        disabledOpacity: 0.38, // Clearly indicating disabled states with a softer color
        focus: '#F57C00', // Ensuring focus is noticeable
        focusOpacity: 0.12, // Ensuring focus is noticeable
        activatedOpacity: 0.12, // Consistent with the focus state for activated elements
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(255, 152, 0, 0.3) 0%, rgba(255, 152, 0, 0) 100%)',
        glowEffect: '0 0 10px rgba(255, 152, 0, 0.5), 0 0 20px rgba(255, 152, 0, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 183, 77, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(245, 245, 245, 0.85)', // Light overlay for modals, drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Glass effect background
        codeBackground: 'rgba(247, 247, 247, 0.95)', // Background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(255, 152, 0, 0.2)', // Grid line color
        digitalPulse: 'rgba(255, 152, 0, 0.7)', // Pulsing effect color
        matrixRain: 'rgba(255, 152, 0, 0.3)', // Digital rain effect
        scanline: 'rgba(255, 152, 0, 0.05)', // Scanline effect for Matrix theme

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
        main: '#F44336', // Adds a punchy accent for attention-drawing elements
        light: '#FF7961',
        dark: '#BA000D',
        contrastText: '#FFFFFF',
    },
};