export const futuristicPurpleDark = {
    // Standard MUI properties
    mode: 'dark',
    primary: {
        main: '#6D40A9', // Brand purple
        light: '#8C60CF',
        dark: '#4B2B7A',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#C35EFF', // Elevated for readability on dark surfaces
        light: '#D98AFF',
        dark: '#8C2FB3',
        contrastText: '#0F0F0F',
    },
    error: {
        main: '#CF2A2A', // Bold red for errors
        light: '#E53935', // Lighter red for error backgrounds
        dark: '#B71C1C', // Deeper red for critical errors
        contrastText: '#FFFFFF', // White for contrast
    },
    warning: {
        main: '#E68900', // Darkened for better contrast (was #FF9800)
        light: '#FFC947', // Light orange for subtle warnings
        dark: '#E68900', // Deeper orange for serious warnings
        contrastText: '#000000', // Black for contrast on bright orange
    },
    info: {
        main: '#4593FF', // Accent blue
        light: '#7AB1FF',
        dark: '#2B69C5',
        contrastText: '#0F0F0F',
    },
    success: {
        main: '#4CAF50', // Standard green for success
        light: '#66BB6A', // Lighter green for success backgrounds
        dark: '#388E3C', // Deeper green for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    background: {
        default: '#141019', // Deep neutral matching mock layout
        paper: '#201F28', // Dark grey for card and paper elements
    },
    text: {
        primary: '#F6F2FF', // Soft white for primary text
        secondary: '#D2CCE5', // Muted lavender-grey
        disabled: '#8F8A9E', // Medium grey for disabled text
        inputText: '#FFFFFF', // White for input field text in dark mode
        inputPlaceholder: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white for placeholder text
    },
    tertiary: {
        main: '#552497', // UI layout purple
        light: '#6B3DB5',
        dark: '#3C176B',
        contrastText: '#FFFFFF',
    },
    action: {
        active: '#FFFFFF', // White for active elements in dark mode
        hover: 'rgba(255, 255, 255, 0.08)', // Subtle white hover effect
        hoverOpacity: 0.08, // Standard hover opacity
        selected: 'rgba(255, 255, 255, 0.16)', // Slightly stronger white for selected elements
        selectedOpacity: 0.16, // Slightly stronger than hover
        disabled: 'rgba(255, 255, 255, 0.3)', // Faded white for disabled elements
        disabledBackground: 'rgba(255, 255, 255, 0.12)', // Subtle white background for disabled elements
        disabledOpacity: 0.38, // Standard disabled opacity
        focus: 'rgba(255, 255, 255, 0.12)', // Subtle white for focus
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.24, // Stronger opacity for activated elements
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(109, 64, 169, 0.45) 0%, rgba(69, 147, 255, 0) 100%)',
        glowEffect: '0 0 10px rgba(109, 64, 169, 0.6), 0 0 20px rgba(69, 147, 255, 0.45)',
        hologram: 'linear-gradient(135deg, rgba(109, 64, 169, 0.28) 0%, rgba(69, 147, 255, 0.28) 100%)',

        // Background and overlay effects
        overlay: 'rgba(20, 19, 26, 0.88)', // Dark overlay for modals, drawers
        glassMorphism: 'rgba(32, 31, 40, 0.78)', // Dark glass effect background
        codeBackground: 'rgba(27, 26, 34, 0.95)', // Dark background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(109, 64, 169, 0.3)',
        digitalPulse: 'rgba(69, 147, 255, 0.7)',
        matrixRain: 'rgba(109, 64, 169, 0.32)',
        scanline: 'rgba(69, 147, 255, 0.1)',

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
