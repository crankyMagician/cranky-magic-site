export const techStartupInnovationPalette = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#6200EA', // A vibrant purple for innovation and creativity
        light: '#9C47FF', // Lighter purple for a playful, yet techy vibe
        dark: '#3700B3', // Dark purple for depth and seriousness
        contrastText: '#FFFFFF', // White text for clarity and contrast
    },
    secondary: {
        main: '#03DAC6', // A tech-inspired teal for secondary accents
        light: '#70EFDE', // Light teal for a fresh, modern look
        dark: '#018786', // Dark teal for contrast and visibility
        contrastText: '#000000', // Black text on secondary.light only
    },
    error: {
        main: '#B00020', // A strong red for alerts and warnings
        light: '#CF6679', // Light red for error backgrounds
        dark: '#790000', // Dark red for critical errors
        contrastText: '#FFFFFF', // White text for contrast
    },
    warning: {
        main: '#FF9800', // Standardized from FFC107 for better contrast
        light: '#FFD54F', // Light amber for a softer warning
        dark: '#F57C00', // Dark amber for a more serious tone
        contrastText: '#000000', // Black text for contrast on amber
    },
    info: {
        main: '#2196F3', // Bright blue for information and trust
        light: '#64B5F6', // Light blue for clarity and calmness
        dark: '#1976D2', // Dark blue for strength and reliability
        contrastText: '#000000', // Black text for contrast on light blue, changed to work with light variant
    },
    success: {
        main: '#4CAF50', // A confident green for success messages
        light: '#81C784', // Light green for a more gentle indication of success
        dark: '#388E3C', // Dark green for more subdued success alerts
        contrastText: '#FFFFFF', // White text for contrast on dark green
    },
    background: {
        default: '#FFFFFF', // Clean white for a fresh, open canvas
        paper: '#F5F5F5', // Off-white for subtle contrast and depth
    },
    text: {
        primary: '#212121', // Deep gray for primary text, ensuring readability
        secondary: '#424242', // Darkened for better contrast (was #757575)
        disabled: '#9E9E9E', // Light gray for disabled text
    },
    action: {
        active: '#424242', // Darkened for better contrast (was #6200EA)
        hover: '#F5F5F5', // Unchanged
        hoverOpacity: 0.08, // Opacity for hover states
        selected: '#EDE7F6', // Lightened purple for better visibility (was #9C47FF)
        selectedOpacity: 0.14, // Opacity for selected states
        disabled: '#757575', // Gray for disabled states, ensuring readability
        disabledBackground: '#E0E0E0', // Light gray for disabled backgrounds, maintaining UI consistency
        disabledOpacity: 0.38, // Opacity for disabled states, clearly indicating non-interactive elements
        focus: '#3700B3', // Dark purple for focus states, ensuring accessibility
        focusOpacity: 0.12, // Opacity for focus states
        activatedOpacity: 0.12, // Opacity for activated states
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(98, 0, 234, 0.3) 0%, rgba(98, 0, 234, 0) 100%)',
        glowEffect: '0 0 10px rgba(98, 0, 234, 0.5), 0 0 20px rgba(98, 0, 234, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(98, 0, 234, 0.15) 0%, rgba(3, 218, 198, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(255, 255, 255, 0.85)', // Light overlay for modals, drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Glass effect background
        codeBackground: 'rgba(245, 245, 245, 0.95)', // Light background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(98, 0, 234, 0.2)', // Purple grid lines
        digitalPulse: 'rgba(98, 0, 234, 0.7)', // Purple pulsing effect
        matrixRain: 'rgba(3, 218, 198, 0.3)', // Teal digital rain effect
        scanline: 'rgba(98, 0, 234, 0.05)', // Purple scanline effect

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
        main: '#FF9800', // A bold orange for standout features or calls to action
        light: '#FFB74D', // Light orange for subtle accents
        dark: '#F57C00', // Dark orange for emphasis
        contrastText: '#000000', // Black text for contrast on orange
    },
};