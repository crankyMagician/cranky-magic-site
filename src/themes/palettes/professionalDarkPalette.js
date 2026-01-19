// Professional Dark Palette - Cool Teal/Slate Theme
// A sophisticated, modern dark palette with vibrant teal accents

export const professionalDarkPalette = {
    // Standard MUI properties
    mode: 'dark',
    primary: {
        main: '#0D9488', // Cool Teal - main brand color
        light: '#2DD4BF', // Lighter teal for accents
        dark: '#0F766E', // Deeper teal for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#475569', // Slate Blue for secondary elements
        light: '#64748B', // Lighter slate for accents
        dark: '#334155', // Deeper slate for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    error: {
        main: '#EF4444', // Modern red for errors
        light: '#F87171', // Lighter red for error backgrounds
        dark: '#DC2626', // Deeper red for critical errors
        contrastText: '#FFFFFF', // White for contrast
    },
    warning: {
        main: '#F59E0B', // Amber for warnings (no orange)
        light: '#FBBF24', // Light amber for subtle warnings
        dark: '#D97706', // Deeper amber for serious warnings
        contrastText: '#FFFFFF', // White for contrast in dark mode
    },
    info: {
        main: '#0EA5E9', // Sky blue for information
        light: '#38BDF8', // Lighter sky blue for backgrounds
        dark: '#0284C7', // Deeper sky blue for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    success: {
        main: '#10B981', // Emerald green for success
        light: '#34D399', // Lighter emerald for backgrounds
        dark: '#059669', // Deeper emerald for emphasis
        contrastText: '#FFFFFF', // White for contrast
    },
    background: {
        default: '#0C1222', // Deep teal-tinted slate
        paper: '#162032', // Slightly lighter for cards
    },
    text: {
        primary: '#F8FAFC', // Near-white for primary text
        secondary: '#94A3B8', // Slate grey for secondary text
        disabled: '#64748B', // Muted slate for disabled text
    },
    tertiary: {
        main: '#22D3EE', // Cyan accent for highlights
        light: '#67E8F9', // Lighter cyan for subtle accents
        dark: '#06B6D4', // Deeper cyan for emphasis
        contrastText: '#0C1222', // Dark background color for contrast on bright cyan
    },
    action: {
        active: '#F8FAFC', // Near-white for active elements
        hover: 'rgba(13, 148, 136, 0.08)', // Teal-tinted hover
        hoverOpacity: 0.08,
        selected: 'rgba(13, 148, 136, 0.16)', // Teal-tinted selected
        selectedOpacity: 0.16,
        disabled: 'rgba(248, 250, 252, 0.3)', // Faded white for disabled
        disabledBackground: 'rgba(248, 250, 252, 0.12)', // Subtle background
        disabledOpacity: 0.38,
        focus: 'rgba(13, 148, 136, 0.12)', // Teal focus
        focusOpacity: 0.12,
        activatedOpacity: 0.24,
    },
    divider: 'rgba(148, 163, 184, 0.12)', // Subtle slate divider

    // Grey scale for utility
    grey: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
    },

    // Custom visual effects for professional dark theme
    custom: {
        // Gradient effects with teal
        dataStream: 'linear-gradient(180deg, rgba(13, 148, 136, 0.5) 0%, rgba(13, 148, 136, 0) 100%)',
        glowEffect: '0 0 10px rgba(13, 148, 136, 0.5), 0 0 20px rgba(13, 148, 136, 0.3), 0 0 30px rgba(13, 148, 136, 0.1)',
        hologram: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%)',

        // Hero background gradient
        heroGradient: 'linear-gradient(135deg, #0C1222 0%, #0F172A 50%, #134E4A 100%)',

        // Section gradients
        sectionGradientAlt: 'linear-gradient(180deg, #0C1222 0%, #162032 100%)',
        sectionGradientSubtle: 'linear-gradient(180deg, #162032 0%, #1E293B 100%)',

        // Background and overlay effects
        overlay: 'rgba(12, 18, 34, 0.9)', // Dark teal overlay
        glassMorphism: 'rgba(22, 32, 50, 0.8)', // Glass effect
        codeBackground: 'rgba(15, 23, 42, 0.95)', // Code block background

        // Grid and pattern effects
        gridLine: 'rgba(13, 148, 136, 0.1)', // Subtle teal grid
        gridPattern: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(13, 148, 136, 0.03) 50px,
            rgba(13, 148, 136, 0.03) 51px
        ),
        repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(13, 148, 136, 0.03) 50px,
            rgba(13, 148, 136, 0.03) 51px
        )`,

        // Glow effects for cards/buttons
        cardGlow: '0 4px 20px rgba(13, 148, 136, 0.15)',
        cardGlowHover: '0 8px 30px rgba(13, 148, 136, 0.25)',
        buttonGlow: '0 0 20px rgba(13, 148, 136, 0.4)',

        // Scanline texture (subtle)
        scanline: 'rgba(13, 148, 136, 0.02)',
        digitalPulse: 'rgba(34, 211, 238, 0.6)',

        // Border effects
        borderGlow: '1px solid rgba(13, 148, 136, 0.3)',
        borderSubtle: '1px solid rgba(148, 163, 184, 0.1)',

        // Helper function for alpha colors
        getAlphaColor: (color, alpha) => {
            if (!color) return null;
            if (color.startsWith('rgba')) return color;

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

    // Function to get alpha color (fallback)
    getAlphaColor: function(color, alpha) {
        if (!color) return null;
        return this.custom.getAlphaColor(color, alpha);
    },
};
