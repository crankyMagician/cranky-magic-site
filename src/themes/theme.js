// src/themes/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { getPaletteByMode } from './themeMappings';
import { getTypographyByMode } from "./fontMappings";
import spatialComponentsOverrides from './muicomponents/spatialComponentsOverrides';
import componentsOverrides from './muicomponents/muiComponentsOverrides'; // Original overrides
import breakpoints from './breakpoints/breakpoints';
import ThemeService from '../services/ThemeService';

// Matrix-inspired effects for both dark and light themes
const getMatrixEffects = (mode) => {
    const isDark = mode === 'dark';

    return {
        matrixEffects: {
            // Common scanline effect CSS
            scanlines: {
                '&::after': {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 2000,
                    background: `repeating-linear-gradient(
                        0deg,
                        ${isDark ? 'rgba(214, 90, 49, 0.03)' : 'rgba(214, 90, 49, 0.015)'} 0px,
                        ${isDark ? 'rgba(214, 90, 49, 0.03)' : 'rgba(214, 90, 49, 0.015)'} 1px,
                        transparent 1px,
                        transparent 2px
                    )`,
                    pointerEvents: 'none',
                    opacity: isDark ? 1 : 0.7,
                },
            },

            // Digital rain effect (Matrix-style falling characters)
            digitalRain: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1999,
                overflow: 'hidden',
                opacity: isDark ? 0.13 : 0.05,
            },

            // Futuristic grid lines
            gridLines: {
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1998,
                    background: `
                        linear-gradient(90deg, ${isDark ? 'rgba(214, 90, 49, 0.05)' : 'rgba(214, 90, 49, 0.02)'} 1px, transparent 1px),
                        linear-gradient(0deg, ${isDark ? 'rgba(214, 90, 49, 0.05)' : 'rgba(214, 90, 49, 0.02)'} 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    pointerEvents: 'none',
                },
            },

            // Hover glow animation
            hoverGlow: {
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: isDark
                        ? '0 0 15px rgba(214, 90, 49, 0.6)'
                        : '0 0 15px rgba(214, 90, 49, 0.4)',
                },
            },

            // Futuristic text effects
            futuristicText: {
                position: 'relative',
                '&::after': {
                    content: 'attr(data-text)',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.7,
                    filter: `blur(1px) drop-shadow(0 0 2px ${isDark ? 'rgba(214, 90, 49, 0.8)' : 'rgba(214, 90, 49, 0.6)'}`,
                },
            },

            // Digital glitch effect for text
            glitchText: {
                animation: 'glitch 3s infinite',
                '@keyframes glitch': {
                    '0%': { transform: 'none', opacity: 1 },
                    '7%': { transform: 'skew(-0.5deg, -0.9deg)', opacity: 1 },
                    '10%': { transform: 'none', opacity: 1 },
                    '27%': { transform: 'none', opacity: 1 },
                    '30%': { transform: 'skew(0.8deg, -0.1deg)', opacity: 1 },
                    '35%': { transform: 'none', opacity: 1 },
                    '52%': { transform: 'none', opacity: 1 },
                    '55%': { transform: 'skew(-1deg, 0.2deg)', opacity: 1 },
                    '56%': { transform: 'none', opacity: 1 },
                    '100%': { transform: 'none', opacity: 1 },
                },
            },

            // Glass morphism effect
            glassMorphism: {
                background: isDark
                    ? 'rgba(30, 30, 30, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: isDark
                    ? '1px solid rgba(214, 90, 49, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: isDark
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
        },
    };
};

// Function to create and return a theme based on the mode and optional direction
export const getTheme = (mode, direction = 'ltr') => {
    // Check if it's a spatial theme or use default
    const isSpatialTheme = mode === 'light' || mode === 'dark';
    const themeMode = isSpatialTheme ? mode : 'munchie'; // Use munchie as fallback

    // Get palette and typography based on mode
    const palette = getPaletteByMode(mode);
    const typography = getTypographyByMode(mode);

    // Get theme preferences from ThemeService
    const themePrefs = ThemeService.getThemePreferences();

    // Choose component overrides based on theme
    const componentOverrides = isSpatialTheme
        ? spatialComponentsOverrides
        : componentsOverrides;

    // Create the base theme without mixins first to avoid circular reference
    let theme = createTheme({
        palette,
        typography,
        components: componentOverrides,
        breakpoints,
        direction,
        // Add Matrix-inspired effects only if using spatial theme
        ...(isSpatialTheme && getMatrixEffects(mode)),
    });

    // Now create a complete theme with custom mixins
    theme = createTheme({
        ...theme,
        mixins: {
            ...theme.mixins,
            futuristicCard: {
                background: mode === 'dark'
                    ? 'rgba(30, 30, 30, 0.7)'
                    : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                border: mode === 'dark'
                    ? '1px solid rgba(214, 90, 49, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: mode === 'dark'
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '8px',
                    padding: '1px',
                    background: `linear-gradient(135deg, transparent 40%, ${palette.primary.main}44 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: mode === 'dark'
                        ? `0 8px 16px rgba(0, 0, 0, 0.4), 0 0 10px rgba(214, 90, 49, 0.2)`
                        : `0 8px 16px rgba(0, 0, 0, 0.15), 0 0 10px rgba(214, 90, 49, 0.1)`,
                },
            },
            dataDisplay: {
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '8px 12px',
                background: mode === 'dark'
                    ? 'rgba(30, 30, 30, 0.9)'
                    : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${palette.primary.main}44`,
                borderRadius: '4px',
                boxShadow: `0 0 8px ${palette.primary.main}33`,
                position: 'relative',
                display: 'inline-block',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${palette.primary.main}22, transparent)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite linear',
                },
                '@keyframes shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            matrixTerminal: {
                fontFamily: 'Rajdhani, monospace',
                backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f0f0f0',
                color: palette.primary.main,
                padding: '16px',
                borderRadius: '4px',
                border: `1px solid ${palette.primary.main}33`,
                boxShadow: `inset 0 0 10px ${palette.primary.main}22`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${palette.primary.main}11 2px, ${palette.primary.main}11 4px)`,
                    pointerEvents: 'none',
                },
            },
        },
    });

    // Apply responsive font sizes
    theme = responsiveFontSizes(theme);

    // Apply high contrast mode if enabled
    if (themePrefs.highContrast) {
        theme.palette.text.primary = mode === 'dark' ? '#FFFFFF' : '#000000';
        theme.palette.text.secondary = mode === 'dark' ? '#EEEEEE' : '#222222';
        theme.palette.background.default = mode === 'dark' ? '#000000' : '#FFFFFF';
        theme.palette.background.paper = mode === 'dark' ? '#111111' : '#F5F5F5';

        // Increase contrast for all colors
        const increaseContrast = (color, amount = 0.2) => {
            if (!color) return color;
            return color.startsWith('#') ? color : color; // We'd need a color manipulation library for proper adjustment
        };

        // Apply to primary and secondary
        theme.palette.primary.main = increaseContrast(theme.palette.primary.main);
        theme.palette.secondary.main = increaseContrast(theme.palette.secondary.main);
    }

    // Add custom transitions for animation
    theme = createTheme({
        ...theme,
        transitions: {
            ...theme.transitions,
            create: (props, options = {}) => {
                const { duration = 300, easing = 'cubic-bezier(0.4, 0, 0.2, 1)', delay = 0 } = options;

                // Adjust animation speed based on preferences
                let durationFactor = 1.0;
                if (themePrefs.animationLevel === 'low') durationFactor = 1.5;
                if (themePrefs.animationLevel === 'high') durationFactor = 0.7;
                if (themePrefs.reducedMotion) durationFactor = 2.0;

                const properties = Array.isArray(props) ? props : [props];
                return properties
                    .map(prop => `${prop} ${duration * durationFactor}ms ${easing} ${delay}ms`)
                    .join(',');
            },
            // Custom duration settings for spatial theme
            duration: {
                shortest: themePrefs.reducedMotion ? 200 : 100,
                shorter: themePrefs.reducedMotion ? 250 : 150,
                short: themePrefs.reducedMotion ? 350 : 250,
                standard: themePrefs.reducedMotion ? 450 : 300,
                complex: themePrefs.reducedMotion ? 550 : 375,
                enteringScreen: themePrefs.reducedMotion ? 300 : 225,
                leavingScreen: themePrefs.reducedMotion ? 300 : 195,
            },
            // Special easing options
            easing: {
                ...theme.transitions.easing,
                // Custom easing functions for spatial theme
                spatial: 'cubic-bezier(0.23, 1, 0.32, 1)', // Slightly more pronounced than easeOutQuint
                digitalPulse: 'cubic-bezier(0.85, 0, 0.15, 1)', // Sharp movement with smooth finish
                matrixGlitch: 'steps(5, end)', // Stuttering movement for glitch effects
                holographic: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    });

    // Add custom spacing for futuristic layout
    theme = createTheme({
        ...theme,
        spacing: (factor) => {
            return `${0.5 * factor}rem`;
        },
    });

    // Add spatial theme-specific shadows
    if (isSpatialTheme) {
        theme = createTheme({
            ...theme,
            shadows: [
                'none',
                // Subtle shadow for elevation 1
                mode === 'dark'
                    ? '0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)'
                    : '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.15)',
                // Moderate shadow for cards and panels - elevation 2
                mode === 'dark'
                    ? '0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.4)'
                    : '0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)',
                // Medium shadow with slight glow - elevation 3
                mode === 'dark'
                    ? `0 6px 12px rgba(0,0,0,0.4), 0 3px 6px rgba(0,0,0,0.4), 0 0 5px rgba(214,90,49,0.2)`
                    : `0 6px 12px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.1), 0 0 5px rgba(214,90,49,0.1)`,
                // Custom shadow with distinctive glow for key elements - elevation 4
                mode === 'dark'
                    ? `0 8px 16px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4), 0 0 8px rgba(214,90,49,0.3)`
                    : `0 8px 16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1), 0 0 8px rgba(214,90,49,0.2)`,
                // Modal/dialog shadow - elevation 5
                mode === 'dark'
                    ? `0 16px 24px rgba(0,0,0,0.5), 0 6px 12px rgba(0,0,0,0.5), 0 0 12px rgba(214,90,49,0.4)`
                    : `0 16px 24px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1), 0 0 12px rgba(214,90,49,0.3)`,
                // Continue with the rest of the default shadows
                // (Simplified for brevity - in a full implementation, you'd define all 25 shadow levels)
                ...Array(20).fill('none'),
            ],
        });
    }

    // Add shape customization for futuristic elements
    theme = createTheme({
        ...theme,
        shape: {
            ...theme.shape,
            borderRadius: 4,
            // Special shapes for specific components
            futuristic: {
                button: {
                    borderRadius: '4px',
                    // Slight angle/chamfer on one corner for sci-fi feel
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 92% 100%, 0% 100%)',
                },
                card: {
                    borderRadius: '8px',
                    // Slight angle/chamfer on one corner for sci-fi feel
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 92%, 90% 100%, 0% 100%)',
                },
                chip: {
                    borderRadius: '4px',
                    // Slight angle/chamfer on both sides for sci-fi feel
                    clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
                },
            },
        },
    });

    // Apply global CSS styles for Matrix effects if using spatial theme
    if (isSpatialTheme && themePrefs.useScanlines) {
        // Create global styles for scanlines and other Matrix effects
        theme = createTheme({
            ...theme,
            components: {
                ...theme.components,
                MuiCssBaseline: {
                    styleOverrides: {
                        'html, body': {
                            position: 'relative',
                        },
                        'body::after': {
                            content: '""',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            zIndex: 9999,
                            pointerEvents: 'none',
                            opacity: mode === 'dark' ? 0.15 : 0.08,
                            background: `repeating-linear-gradient(
                                0deg,
                                rgba(214, 90, 49, 0.05) 0px,
                                rgba(214, 90, 49, 0.05) 1px,
                                transparent 1px,
                                transparent 2px
                            )`,
                            animation: 'scanline-motion 8s linear infinite',
                        },
                        '@keyframes scanline-motion': {
                            '0%': { backgroundPosition: '0 0' },
                            '100%': { backgroundPosition: '0 100px' }
                        },
                    },
                },
            },
        });
    }

    return theme;
};