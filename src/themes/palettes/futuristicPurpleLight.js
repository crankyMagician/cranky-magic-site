export const futuristicPurpleLight = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#6D40A9', // Brand purple
        light: '#8C60CF',
        dark: '#4B2B7A',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#C35EFF', // Lifted for contrast on dark backgrounds
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
        main: '#FF9800', // Standard orange for warnings
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
        default: '#141019', // Darker backdrop to match landing direction even in light mode
        paper: '#201F28', // Rich dark paper for cohesion
    },
    text: {
        primary: '#F6F2FF', // Soft white for readability on dark base
        secondary: '#D2CCE5', // Dimmed lavender-grey
        disabled: '#8F8A9E', // Medium grey for disabled text
        inputText: '#FFFFFF', // White for input field text
        inputPlaceholder: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white for placeholder text
    },
    tertiary: {
        main: '#552497', // UI layout purple
        light: '#6B3DB5',
        dark: '#3C176B',
        contrastText: '#FFFFFF',
    },
    action: {
        active: 'rgba(255, 255, 255, 0.72)', // Elevated for dark base
        hover: 'rgba(255, 255, 255, 0.08)',
        hoverOpacity: 0.08,
        selected: 'rgba(255, 255, 255, 0.14)',
        selectedOpacity: 0.14,
        disabled: 'rgba(255, 255, 255, 0.3)',
        disabledBackground: 'rgba(255, 255, 255, 0.1)',
        disabledOpacity: 0.38,
        focus: 'rgba(255, 255, 255, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.16,
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(109, 64, 169, 0.25) 0%, rgba(69, 147, 255, 0) 100%)',
        glowEffect: '0 0 10px rgba(109, 64, 169, 0.45), 0 0 20px rgba(69, 147, 255, 0.35)',
        hologram: 'linear-gradient(135deg, rgba(109, 64, 169, 0.12) 0%, rgba(69, 147, 255, 0.12) 100%)',

        // Background and overlay effects
        overlay: 'rgba(27, 26, 34, 0.86)', // Dark overlay for modals, drawers
        glassMorphism: 'rgba(32, 31, 40, 0.82)', // Glass effect against dark surfaces
        codeBackground: 'rgba(27, 26, 34, 0.95)', // Dark background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(109, 64, 169, 0.2)',
        digitalPulse: 'rgba(69, 147, 255, 0.55)',
        matrixRain: 'rgba(109, 64, 169, 0.22)',
        scanline: 'rgba(69, 147, 255, 0.05)',

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
