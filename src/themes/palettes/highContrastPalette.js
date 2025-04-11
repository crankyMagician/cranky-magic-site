export const highContrastPalette = {
    // Standard MUI properties
    mode: 'light', // or 'dark'
    primary: {
        main: '#000000', // Black for maximum contrast
        light: '#444444', // Darkened for better contrast (was #555555)
        dark: '#000000', // Keeping dark elements consistent with maximum contrast
        contrastText: '#FFFFFF', // White to ensure high readability against dark backgrounds
    },
    secondary: {
        main: '#FFFFFF', // White for secondary elements
        light: '#CCCCCC', // Light Gray for lighter secondary elements
        dark: '#555555', // Dark Gray for darker secondary elements
        contrastText: '#000000', // Black to ensure sufficient contrast on lighter backgrounds
    },
    error: {
        main: '#FF0000', // Bright Red for errors
        light: '#FF6666', // Lighter Red variant for error backgrounds or accents
        dark: '#B20000', // Dark Red variant for heightened alert states
        contrastText: '#FFFFFF', // White ensures clear readability on error elements
    },
    warning: {
        main: '#FFA500', // Orange for warnings
        light: '#FFC042', // Lighter Orange for subtle warning cues
        dark: '#C07800', // Darker Orange for more critical warning states
        contrastText: '#000000', // Black provides optimal contrast against warning backgrounds
    },
    info: {
        main: '#0000FF', // Blue for information
        light: '#6B82E6', // Lighter Blue for informational accents
        dark: '#0044CC', // Dark Blue for deeper informational emphasis
        contrastText: '#FFFFFF', // White ensures information stands out clearly
    },
    success: {
        main: '#008000', // Green for success indicators
        light: '#33A633', // Lighter Green for success accents
        dark: '#005F00', // Dark Green for stronger success indications
        contrastText: '#FFFFFF', // White to maintain high readability on success elements
    },
    background: {
        default: '#FFFFFF', // White for the default background to maximize contrast with text
        paper: '#F5F5F5', // Off-White for paper elements for subtle layering
    },
    text: {
        primary: '#000000', // Black for primary text, ensuring maximum readability
        secondary: '#444444', // Darkened for better contrast (was #555555)
        disabled: '#757575', // Standard disabled text color for clarity without interference
    },
    action: {
        active: '#444444', // Darkened for better contrast (was #555555)
        hover: '#EEEEEE', // Very light gray for hover states to maintain visual clarity
        hoverOpacity: 0.1, // Increased for better visibility (was 0.08)
        selected: '#DDDDDD', // Light Gray for selected states, ensuring discernible contrast
        selectedOpacity: 0.16, // Increased for better visibility (was 0.14)
        disabled: '#CCCCCC', // Light Gray for disabled elements to indicate non-interactivity
        disabledBackground: '#E0E0E0', // Very light gray for disabled backgrounds
        disabledOpacity: 0.38, // Enhanced opacity for disabled states to ensure they're noticeable
        focus: '#444444', // Darkened for better contrast (was #CCCCCC)
        focusOpacity: 0.12, // Standard focus opacity for consistency
        activatedOpacity: 0.12, // Matching opacity for activated states for uniformity
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)',
        glowEffect: '0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(85, 85, 85, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(245, 245, 245, 0.85)', // Light overlay for modals and drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Glass effect background for a modern feel
        codeBackground: 'rgba(247, 247, 247, 0.95)', // Background color for code blocks ensuring legibility

        // Matrix-inspired effects
        gridLine: 'rgba(0, 0, 0, 0.2)', // Grid line color for subtle design accents
        digitalPulse: 'rgba(0, 0, 0, 0.7)', // Pulsing effect color for interactive elements
        matrixRain: 'rgba(0, 0, 0, 0.3)', // Digital rain effect for dynamic themes
        scanline: 'rgba(0, 0, 0, 0.05)', // Scanline effect for added texture

        // Helper getters for component overrides
        getAlphaColor: (color, alpha) => {
            // Helper to convert hex to rgba with alpha
            if (!color) return null;

            // Check if the color is already in rgba format
            if (color.startsWith('rgba')) return color;

            // Convert hex to rgba format
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
        main: '#FFFF00', // Bright Yellow for accent elements to ensure high visibility
        light: '#FFFF66', // Lighter Yellow for softer accents
        dark: '#CCCC00', // Darker Yellow for more pronounced accents
        contrastText: '#000000', // Black text to maintain optimal contrast with yellow accents
    },
};