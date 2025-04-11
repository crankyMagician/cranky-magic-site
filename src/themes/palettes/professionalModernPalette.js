export const professionalModernPalette = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#757575', // Darkened for better contrast (was #9E9E9E)
        light: '#E0E0E0', // Provides a soft, accessible contrast
        dark: '#616161', // Ensures sufficient contrast and visibility
        contrastText: '#FFFFFF', // Changed to white for better contrast (was #000000)
    },
    secondary: {
        main: '#2196F3', // Calm and professional for secondary accents
        light: '#64B5F6', // Slightly lighter to enhance usability
        dark: '#0D47A1', // Deep and serious for focused attention
        contrastText: '#FFFFFF', // White text for contrast
    },
    error: {
        main: '#F44336', // Clear and alerting for critical feedback
        light: '#E57373', // Lighter red for softer error indications
        dark: '#D32F2F', // Darker red for critical errors
        contrastText: '#FFFFFF', // White text for contrast
    },
    warning: {
        main: '#FF9800', // Warm and cautionary for warnings
        light: '#FFB74D', // Softened to be noticeable without alarming
        dark: '#F57C00', // Strong and serious for emphasis
        contrastText: '#000000', // Black text for contrast
    },
    info: {
        main: '#0D47A1', // Trusted and stable for informational cues
        light: '#2196F3', // Ensures information is approachable
        dark: '#64B5F6', // Stands out against various backgrounds
        contrastText: '#FFFFFF', // White text for contrast on dark blue
    },
    success: {
        main: '#388E3C', // Rich and affirmative for successful actions
        light: '#4CAF50', // Lighter green for subtle success indications
        dark: '#2E7D32', // Darker green for emphasis
        contrastText: '#FFFFFF', // White text for contrast
    },
    background: {
        default: '#FFFFFF', // Clean and bright for clarity and focus
        paper: '#F5F5F5', // Lightened for better contrast (was #E0E0E0)
    },
    text: {
        primary: '#000000', // Strong and legible for core text
        secondary: '#424242', // Darkened for better contrast (was #616161)
        disabled: '#9E9E9E', // Grey for disabled text
    },
    action: {
        active: '#424242', // Darkened for better contrast (was #616161)
        hover: 'rgba(0, 0, 0, 0.08)', // Lightly highlighted for interactivity
        hoverOpacity: 0.08, // Maintaining standard opacity for hover states
        selected: '#757575', // Darkened for better contrast (was #9E9E9E)
        selectedOpacity: 0.14, // Clear but unobtrusive selection state
        disabled: '#9E9E9E', // Visibly disabled but integrated into the theme
        disabledBackground: '#E0E0E0', // Lightened for better contrast
        disabledOpacity: 0.38, // Clearly indicating disabled states while maintaining design
        focus: '#424242', // Darkened for better visibility (was #616161)
        focusOpacity: 0.12, // Visibility without distraction
        activatedOpacity: 0.12, // Consistency in interaction states
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(158, 158, 158, 0) 100%)',
        glowEffect: '0 0 10px rgba(158, 158, 158, 0.5), 0 0 20px rgba(158, 158, 158, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(158, 158, 158, 0.15) 0%, rgba(224, 224, 224, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(255, 255, 255, 0.85)', // Light overlay for modals, drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Glass effect background
        codeBackground: 'rgba(245, 245, 245, 0.95)', // Light background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(158, 158, 158, 0.2)', // Grey grid line color
        digitalPulse: 'rgba(158, 158, 158, 0.7)', // Grey pulsing effect
        matrixRain: 'rgba(158, 158, 158, 0.3)', // Grey digital rain effect
        scanline: 'rgba(158, 158, 158, 0.05)', // Grey scanline effect

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
        main: '#FF5722', // Distinct and vibrant for additional accents
        light: '#FF8A65', // Light orange for subtle accents
        dark: '#E64A19', // Dark orange for emphasis
        contrastText: '#FFFFFF', // White text for contrast
    },
};