export const spatialModsDark = {
    // Standard MUI properties
    mode: 'dark',
    primary: {
        main: '#D65A31', // Vibrant orange-red for primary actions
        light: '#E07A53', // Lighter orange-red for accents
        dark: '#B04B28', // Deeper orange-red for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#9E9E9E', // Neutral grey for secondary elements
        light: '#D0D0D0', // Lightened for better contrast (was #BDBDBD)
        dark: '#757575', // Darker grey for emphasis
        contrastText: '#000000', // Black text on lighter secondary colors
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
        default: '#121212', // Very dark grey, almost black for background
        paper: '#1E1E1E', // Dark grey for card and paper elements
    },
    text: {
        primary: '#FFFFFF', // White for primary text
        secondary: '#BDBDBD', // Light grey for secondary text
        disabled: '#757575', // Medium grey for disabled text
    },
    tertiary: {
        main: '#E09F3E', // Warm gold/amber for accent elements
        light: '#F5C16C', // Lighter gold for subtle accents
        dark: '#C88A23', // Deeper gold for emphasis
        contrastText: '#000000', // Black for contrast on bright gold
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
        dataStream: 'linear-gradient(180deg, rgba(214, 90, 49, 0.5) 0%, rgba(214, 90, 49, 0) 100%)',
        glowEffect: '0 0 10px rgba(214, 90, 49, 0.7), 0 0 20px rgba(214, 90, 49, 0.4)',
        hologram: 'linear-gradient(135deg, rgba(214, 90, 49, 0.25) 0%, rgba(224, 159, 62, 0.25) 100%)',

        // Background and overlay effects
        overlay: 'rgba(18, 18, 18, 0.85)', // Dark overlay for modals, drawers
        glassMorphism: 'rgba(30, 30, 30, 0.7)', // Dark glass effect background
        codeBackground: 'rgba(24, 24, 24, 0.95)', // Dark background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(214, 90, 49, 0.3)', // Orange-red grid lines
        digitalPulse: 'rgba(214, 90, 49, 0.8)', // Bright orange-red pulse effect
        matrixRain: 'rgba(214, 90, 49, 0.4)', // Orange-red digital rain
        scanline: 'rgba(214, 90, 49, 0.1)', // Subtle orange-red scanlines

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