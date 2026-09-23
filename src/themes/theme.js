// src/themes/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { getPaletteByThemeId } from './themeRegistry';
import { getComponentOverrideById } from './muicomponents'; // Fixed: changed from getComponentOverridesById to getComponentOverrideById
import { getTypographyStylesById } from './typography';
import breakpoints from './breakpoints/breakpoints';
import ThemeService from '../services/ThemeService';
import * as colorUtils from "../utilities/colorUtilities";

// Function to determine if a theme is a dark mode theme
const isDarkThemeMode = (mode) => {
    return mode === 'dark' || mode === 'munchie_dark' || mode === 'retro_neon' || mode === 'cs_color_30_v2' || mode === 'cs_color_29_v4' || mode === 'professional_dark' || mode === 'cranky_dark';
};

// Function to create and return a theme based on the mode, component override, and typography
export const getTheme = (mode, componentOverride = 'cranky', typography = 'default', direction = 'ltr', customPalette = null) => {
    // Use provided mode or default to light
    const themeMode = mode || 'light';
    const overrideMode = componentOverride || 'cranky';
    const typographyMode = typography || 'default';

    // A custom palette carries its own mode, so don't consult the preset id list for it.
    const isDark = customPalette ? customPalette.mode === 'dark' : isDarkThemeMode(themeMode);

    // Get palette, typography, and component overrides from registries
    const palette = customPalette || getPaletteByThemeId(themeMode);
    const typographyStyles = getTypographyStylesById(typographyMode);
    const componentOverrides = getComponentOverrideById(overrideMode); // Fixed: using correct function name

    // Get theme preferences from ThemeService
    const themePrefs = ThemeService.getThemePreferences();

    // Create the base theme without mixins first to avoid circular reference
    let theme = createTheme({
        palette,
        typography: typographyStyles,
        components: componentOverrides,
        breakpoints,
        direction,
    });

    // Now create a complete theme with custom mixins
    theme = createTheme({
        ...theme,
        mixins: {
            ...theme.mixins,
            futuristicCard: {
                background: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : `1px solid ${colorUtils.hexToRgba(theme.palette.primary.main, 0.2)}`,
                boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
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
                    background: `linear-gradient(135deg, transparent 40%, ${colorUtils.hexToRgba(theme.palette.primary.main, 0.27)} 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: theme.palette.mode === 'light'
                        ? `0 8px 16px rgba(0, 0, 0, 0.15), 0 0 10px ${colorUtils.hexToRgba(theme.palette.primary.main, 0.1)}`
                        : `0 8px 16px rgba(0, 0, 0, 0.4), 0 0 10px ${colorUtils.hexToRgba(theme.palette.primary.main, 0.2)}`,
                },
            },
            dataDisplay: {
                fontFamily: theme.typography.h3.fontFamily,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '8px 12px',
                background: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(30, 30, 30, 0.9)',
                border: `1px solid ${colorUtils.hexToRgba(theme.palette.primary.main, 0.27)}`,
                borderRadius: '4px',
                boxShadow: `0 0 8px ${colorUtils.hexToRgba(theme.palette.primary.main, 0.2)}`,
                position: 'relative',
                display: 'inline-block',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${colorUtils.hexToRgba(theme.palette.primary.main, 0.13)}, transparent)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite linear',
                },
                '@keyframes shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            matrixTerminal: {
                fontFamily: 'monospace',
                backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#1a1a1a',
                color: theme.palette.primary.main,
                padding: '16px',
                borderRadius: '4px',
                border: `1px solid ${colorUtils.hexToRgba(theme.palette.primary.main, 0.2)}`,
                boxShadow: `inset 0 0 10px ${colorUtils.hexToRgba(theme.palette.primary.main, 0.13)}`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${colorUtils.hexToRgba(theme.palette.primary.main, 0.07)} 2px, ${colorUtils.hexToRgba(theme.palette.primary.main, 0.07)} 4px)`,
                    pointerEvents: 'none',
                },
            },
        },
    });

    // Apply responsive font sizes
    theme = responsiveFontSizes(theme);

    // Apply high contrast mode if enabled
    if (themePrefs.highContrast) {
        theme.palette.text.primary = isDark ? '#FFFFFF' : '#000000';
        theme.palette.text.secondary = isDark ? '#EEEEEE' : '#222222';
        theme.palette.background.default = isDark ? '#000000' : '#FFFFFF';
        theme.palette.background.paper = isDark ? '#111111' : '#F5F5F5';

        // Increase contrast for all colors
        const increaseContrast = (color, amount = 0.2) => {
            if (!color) return color;
            return color.startsWith('#') ? color : color;
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
            // Custom duration settings
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
                // Custom easing functions
                spatial: 'cubic-bezier(0.23, 1, 0.32, 1)',
                digitalPulse: 'cubic-bezier(0.85, 0, 0.15, 1)',
                matrixGlitch: 'steps(5, end)',
                holographic: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    });

    // Add custom spacing
    theme = createTheme({
        ...theme,
        spacing: (factor) => {
            return `${0.5 * factor}rem`;
        },
    });

    // Add custom shapes for futuristic elements
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

    // Ensure proper fullscreen handling (no scanlines or spatial effects)
    theme = createTheme({
        ...theme,
        components: {
            ...theme.components,
            MuiCssBaseline: {
                ...theme.components.MuiCssBaseline,
                styleOverrides: {
                    ...theme.components.MuiCssBaseline?.styleOverrides,
                    'html': {
                        backgroundColor: `${theme.palette.background.default} !important`,
                        color: `${theme.palette.text.primary} !important`,
                        minHeight: '100%',
                        transition: 'none',
                        '&:-webkit-full-screen': {
                            backgroundColor: `${theme.palette.background.default} !important`,
                            width: '100% !important',
                            height: '100% !important',
                        },
                        '&:-moz-full-screen': {
                            backgroundColor: `${theme.palette.background.default} !important`,
                            width: '100% !important',
                            height: '100% !important',
                        },
                        '&:fullscreen': {
                            backgroundColor: `${theme.palette.background.default} !important`,
                            width: '100% !important',
                            height: '100% !important',
                        },
                    },
                    'body': {
                        backgroundColor: `${theme.palette.background.default} !important`,
                        color: `${theme.palette.text.primary} !important`,
                        minHeight: '100vh',
                        '&:-webkit-full-screen': {
                            backgroundColor: `${theme.palette.background.default} !important`,
                            width: '100% !important',
                            height: '100% !important',
                        },
                        '&:-moz-full-screen': {
                            backgroundColor: `${theme.palette.background.default} !important`,
                            width: '100% !important',
                            height: '100% !important',
                        },
                        '&:fullscreen': {
                            backgroundColor: `${theme.palette.background.default} !important`,
                            width: '100% !important',
                            height: '100% !important',
                        },
                    },
                    '#root': {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        minHeight: '100vh',
                        'html:fullscreen &, html:-webkit-full-screen &, html:-moz-full-screen &': {
                            width: '100%',
                            height: '100%',
                            backgroundColor: theme.palette.background.default,
                        },
                    },
                    // Ensure all major containers maintain theme
                    '.MuiContainer-root, .MuiGrid-root, .MuiBox-root': {
                        transition: 'none',
                    },
                },
            },
        },
    });

    return theme;
};