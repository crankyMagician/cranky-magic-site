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
        main: '#00ACC1', // Darkened for better contrast (was #00E5FF)
        light: '#18FFFF', // Light Neon Blue
        dark: '#0097A7', // Darkened for better contrast (was #00B8D4)
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
        default: '#121212', // Darkened for better contrast (was #212121)
        paper: '#1E1E1E', // Darkened for better contrast (was #424242)
    },
    text: {
        primary: '#FFFFFF', // White for primary text on dark backgrounds
        secondary: '#E0E0E0', // Lightened for better contrast (was #BDBDBD)
        disabled: '#9E9E9E', // Lightened for better visibility (was #757575)
    },
    action: {
        active: '#FFFFFF', // Changed to white for better visibility (was #BDBDBD)
        hover: 'rgba(255, 255, 255, 0.1)', // Slightly increased for visibility (was 0.08)
        hoverOpacity: 0.1, // Increased for better visibility (was 0.08)
        selected: 'rgba(255, 255, 255, 0.16)', // Stronger for visibility (was 0.14)
        selectedOpacity: 0.16, // Increased for better visibility (was 0.14)
        disabled: 'rgba(255, 255, 255, 0.3)', // Unchanged
        disabledBackground: 'rgba(255, 255, 255, 0.12)', // Unchanged
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: 'rgba(255, 255, 255, 0.12)', // Unchanged
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