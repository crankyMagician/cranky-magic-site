export const corporateMemphisPalette = {
    // Standard MUI properties
    mode: 'light', // or 'dark'
    primary: {
        main: '#0D47A1', // A confident, deep blue for primary actions
        light: '#5472D3', // Brighter for a touch of Memphis vibrancy
        dark: '#002171', // Solid and dependable for corporate trust
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#FF8F00', // Warm and inviting, yet vibrant for secondary accents
        light: '#FFB74D', // Cheerful for a lighter, engaging feel
        dark: '#C25E00', // Depth and warmth for emphasis
        contrastText: '#000000', // Changed to black for better contrast with light variant
    },
    error: {
        main: '#D32F2F', // Bold and alerting, in line with Memphis intensity
        light: '#EF5350',
        dark: '#C62828',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#FFB300', // Bright and cautionary, with a playful edge
        light: '#FFD54F', // A softer approach to warnings
        dark: '#FFA000', // A deeper shade for serious alerts
        contrastText: '#000000',
    },
    info: {
        main: '#546E7A', // Trustworthy yet subdued for information
        light: '#819CA9', // A lighter shade for informational contrast
        dark: '#29434E', // Ensures key info stands out in a corporate setting
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#43A047', // A lively, optimistic green for success
        light: '#66BB6A',
        dark: '#2E7D32',
        contrastText: '#FFFFFF',
    },
    background: {
        default: '#FFFFFF', // A clean, neutral backdrop for clarity and focus
        paper: '#FAFAFA', // Soft and subtle for differentiation without distraction
    },
    text: {
        primary: '#212121', // Strong and legible, anchoring the design in professionalism
        secondary: '#424242', // A soft contrast for less dominant text, adds depth
        disabled: '#757575',
    },
    action: {
        active: '#5472D3', // Clear and engaging for interactive elements
        hover: '#E0E0E0', // Understated for hover, allowing color to signal action
        hoverOpacity: 0.08, // Subtle interaction cue, keeping with Memphis's playful spirit
        selected: '#BDBDBD', // Neutral yet distinct for selected states
        selectedOpacity: 0.14, // Visibility without overwhelming the vibrant Memphis style
        disabled: '#E0E0E0', // Lightened (was #9E9E9E) for better contrast
        disabledBackground: '#BDBDBD', // Consistent, subdued for disabled states
        disabledOpacity: 0.38, // Clearly marked, maintaining usability
        focus: '#0D47A1', // Focused elements stand out with deep blue for accessibility
        focusOpacity: 0.12, // Ensures focus is noticeable without dominating the design
        activatedOpacity: 0.12, // Consistent with focus for an integrated interactive experience
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(13, 71, 161, 0.3) 0%, rgba(13, 71, 161, 0) 100%)',
        glowEffect: '0 0 10px rgba(13, 71, 161, 0.5), 0 0 20px rgba(13, 71, 161, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(13, 71, 161, 0.15) 0%, rgba(84, 114, 211, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(245, 245, 245, 0.85)', // Light overlay for modals, drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Glass effect background
        codeBackground: 'rgba(247, 247, 247, 0.95)', // Background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(13, 71, 161, 0.2)', // Grid line color
        digitalPulse: 'rgba(13, 71, 161, 0.7)', // Pulsing effect color
        matrixRain: 'rgba(13, 71, 161, 0.3)', // Digital rain effect
        scanline: 'rgba(13, 71, 161, 0.05)', // Scanline effect for Matrix theme

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
        main: '#B71C1C', // An assertive, dynamic color for standout elements
        light: '#E57373',
        dark: '#7F0000',
        contrastText: '#FFFFFF',
    },
};