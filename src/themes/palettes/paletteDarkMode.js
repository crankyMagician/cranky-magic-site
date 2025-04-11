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
        contrastText: '#FFFFFF', // Changed to white for better contrast (was #000000)
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
        main: '#BDBDBD', // Lightened for better contrast (was #9E9E9E)
        light: '#E0E0E0', // Lightened for better contrast (was #BDBDBD)
        dark: '#757575', // Darkened appropriately (was #616161)
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
        secondary: '#BDBDBD', // Lightened for better contrast (was #9E9E9E)
        disabled: '#757575', // Darker grey for disabled
    },
    action: {
        active: '#BDBDBD', // Lightened for better visibility (was #9E9E9E)
        hover: 'rgba(255, 255, 255, 0.1)', // Increased for better visibility (was 0.08)
        hoverOpacity: 0.1, // Increased for visibility (was 0.08)
        selected: 'rgba(255, 255, 255, 0.16)', // Stronger for better visibility (was 0.14)
        selectedOpacity: 0.16, // Increased slightly (was 0.14)
        disabled: 'rgba(255, 255, 255, 0.3)', // Increased for visibility (was 0.26)
        disabledBackground: 'rgba(255, 255, 255, 0.12)', // Unchanged
        disabledOpacity: 0.38, // Standard opacity for disabled
        focus: 'rgba(255, 255, 255, 0.12)', // Unchanged
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