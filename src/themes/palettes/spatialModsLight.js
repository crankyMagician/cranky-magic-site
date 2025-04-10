// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Enhanced palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const spatialModsLight = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#D65A31', // Vibrant orange-red for primary actions
        light: '#E07A53', // Lighter orange-red for accents
        dark: '#B04B28', // Deeper orange-red for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#828282', // Medium grey for secondary elements
        light: '#BDBDBD', // Light grey for subtle elements
        dark: '#5F5F5F', // Darker grey for emphasis
        contrastText: '#FFFFFF', // White for contrast on darker grey
    },
    error: {
        main: '#CF2A2A', // Bold red for errors
        light: '#E53935', // Lighter red for error backgrounds
        dark: '#B71C1C', // Deeper red for critical errors
        contrastText: '#FFFFFF', // White for contrast
    },
    warning: {
        main: '#FF9800', // Standard orange for warnings
        light: '#FFC947', // Light orange for subtle warnings
        dark: '#E68900', // Deeper orange for serious warnings
        contrastText: '#000000', // Black for contrast on bright orange
    },
    info: {
        main: '#00B8FF', // Bright blue for information
        light: '#33C3FF', // Lighter blue for info backgrounds
        dark: '#0090CC', // Deeper blue for emphasis
        contrastText: '#000000', // Black for contrast on bright blue
    },
    success: {
        main: '#4CAF50', // Standard green for success
        light: '#66BB6A', // Lighter green for success backgrounds
        dark: '#388E3C', // Deeper green for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    background: {
        default: '#F5F5F5', // Light grey for main background
        paper: '#FFFFFF', // White for card and paper elements
    },
    text: {
        primary: '#212121', // Very dark grey, almost black for primary text
        secondary: '#424242', // Dark grey for secondary text
        disabled: '#9E9E9E', // Medium grey for disabled text
    },
    tertiary: {
        main: '#E09F3E', // Warm gold/amber for accent elements
        light: '#F5C16C', // Lighter gold for subtle accents
        dark: '#C88A23', // Deeper gold for emphasis
        contrastText: '#000000', // Black for contrast on bright gold
    },
    action: {
        active: 'rgba(0, 0, 0, 0.54)', // Semi-transparent black for active elements
        hover: 'rgba(0, 0, 0, 0.04)', // Very subtle black hover effect
        hoverOpacity: 0.04, // Subtle hover opacity for light mode
        selected: 'rgba(0, 0, 0, 0.08)', // Slightly stronger for selected elements
        selectedOpacity: 0.08, // Standard selection opacity
        disabled: 'rgba(0, 0, 0, 0.26)', // Semi-transparent black for disabled elements
        disabledBackground: 'rgba(0, 0, 0, 0.12)', // Light grey background for disabled elements
        disabledOpacity: 0.38, // Standard disabled opacity
        focus: 'rgba(0, 0, 0, 0.12)', // Subtle black for focus
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Matches focus opacity for consistency
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(214, 90, 49, 0.3) 0%, rgba(214, 90, 49, 0) 100%)',
        glowEffect: '0 0 10px rgba(214, 90, 49, 0.5), 0 0 20px rgba(214, 90, 49, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(214, 90, 49, 0.15) 0%, rgba(224, 159, 62, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(245, 245, 245, 0.85)', // Light overlay for modals, drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Light glass effect background
        codeBackground: 'rgba(247, 247, 247, 0.95)', // Light background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(214, 90, 49, 0.2)', // Orange-red grid lines
        digitalPulse: 'rgba(214, 90, 49, 0.7)', // Bright orange-red pulse effect
        matrixRain: 'rgba(214, 90, 49, 0.3)', // Orange-red digital rain
        scanline: 'rgba(214, 90, 49, 0.05)', // Subtle orange-red scanlines

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
};