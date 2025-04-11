export const mintPalette = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#4DB6AC', // Mint Green
        light: '#82E9DE', // Light Mint Green
        dark: '#00867D', // Dark Mint Green
        contrastText: '#000000', // Changed to black for better contrast (was #FFFFFF)
    },
    secondary: {
        main: '#00796B', // Darkened for better contrast (was #80CBC4)
        light: '#4DB6AC', // Darkened for better contrast (was #B2FEF7)
        dark: '#004D40', // Darkened for better contrast (was #4F9A94)
        contrastText: '#FFFFFF', // White for contrast on darker teal
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
        main: '#039BE5', // Darkened for better contrast (was #4FC3F7)
        light: '#81D4FA', // Lighter Blue
        dark: '#0277BD', // Darkened for better contrast (was #039BE5)
        contrastText: '#FFFFFF', // Changed to white for contrast on darkened blue (was #000000)
    },
    success: {
        main: '#43A047', // Darkened for better contrast (was #81C784)
        light: '#81C784', // Unchanged
        dark: '#2E7D32', // Darkened for better contrast (was #43A047)
        contrastText: '#FFFFFF', // Changed to white for contrast on darkened green (was #000000)
    },
    background: {
        default: '#E0F2F1', // Very light mint, emulating a serene sky
        paper: '#F5F5F5', // Lightened for better contrast (was #B2DFDB)
    },
    text: {
        primary: '#212121', // Darkened for better contrast (was #37474F)
        secondary: '#424242', // Darkened for better contrast (was #607D8B)
        disabled: '#90A4AE', // Lighter variant for disabled text
    },
    action: {
        active: '#00796B', // Darkened for better contrast (was #607D8B)
        hover: '#E0F7FA', // Very light blue, for hover states
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: '#B2EBF2', // Selected state has a soft blue
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: '#CFCFCF', // Grey, for disabled state
        disabledBackground: '#ECEFF1', // Very light grey, for disabled background
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: '#00796B', // Darkened for better contrast (was #B0BEC5)
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
        main: '#F57C00', // Darkened for better contrast (was #FFD740)
        light: '#FFB74D', // Light amber for subtle accents
        dark: '#E65100', // Darkened for better contrast (was #FFC400)
        contrastText: '#FFFFFF', // Changed to white for better contrast with darkened colors (was #000000)
    },
};