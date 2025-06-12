// src/themes/theme.js
import { createTheme } from '@mui/material/styles';
import { getPaletteByMode } from './themeMappings';
import { getTypographyByMode } from './fontMappings';
import crankyComponentOverrides from './muicomponents/crankyComponentOverrides';
import breakpoints from './breakpoints/breakpoints';
import ThemeService from '../services/ThemeService';
import spatialComponentOverrides from "./muicomponents/spatialComponentsOverrides";
import * as colorUtils from "../utilities/colorUtilities";


// Function to get component overrides based on style preference
const getComponentOverrides = (overrideStyle) => {
    switch (overrideStyle) {
        case 'spatial':
            return spatialComponentOverrides;
        case 'cranky':
        default:
            return crankyComponentOverrides;
    }
};

// Function to create and return a theme based on the mode and optional direction
export const getTheme = (mode, direction = 'ltr', overrideStyle = 'cranky') => {
    // Use the provided theme mode or default to light
    const themeMode = mode || 'light';

    // Get palette and typography based on mode
    const palette = getPaletteByMode(themeMode);
    const typography = getTypographyByMode(themeMode);

    // Get theme preferences from ThemeService
    const themePrefs = ThemeService.getThemePreferences();

    // Get the appropriate component overrides
    const componentOverrides = getComponentOverrides(overrideStyle);

    // Create the base theme without mixins first to avoid circular reference
    let theme = createTheme({
        palette,
        typography,
        components: componentOverrides,
        breakpoints,
        direction,
    });

    // Now create a complete theme with custom mixins
    theme = createTheme({
        ...theme,
        mixins: {
            ...theme.mixins,

            // Futuristic card mixin
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

            // Data display mixin (for statistics, numbers, etc.)
            dataDisplay: {
                fontFamily: typography.dataLabel ? typography.dataLabel.fontFamily : typography.fontFamily,
                fontSize: typography.dataLabel ? typography.dataLabel.fontSize : '0.875rem',
                fontWeight: typography.dataLabel ? typography.dataLabel.fontWeight : 600,
                letterSpacing: typography.dataLabel ? typography.dataLabel.letterSpacing : '0.1em',
                textTransform: 'uppercase',
                color: theme.palette.primary.main,
                padding: '8px 16px',
                borderRadius: '4px',
                background: colorUtils.hexToRgba(theme.palette.primary.main, 0.08),
                border: `1px solid ${colorUtils.hexToRgba(theme.palette.primary.main, 0.2)}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                '&::before': {
                    content: '""',
                    width: '4px',
                    height: '16px',
                    background: theme.palette.primary.main,
                    borderRadius: '2px',
                },
            },

            // Status indicator mixin
            statusIndicator: {
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                display: 'inline-block',
                position: 'relative',
                '&.active': {
                    background: theme.palette.success.main,
                    boxShadow: `0 0 0 2px ${colorUtils.hexToRgba(theme.palette.success.main, 0.3)}`,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${theme.palette.success.main}`,
                        animation: 'pulse-ring 1.5s ease-out infinite',
                    },
                },
                '&.inactive': {
                    background: theme.palette.grey[400],
                },
                '&.warning': {
                    background: theme.palette.warning.main,
                    animation: 'blink 1s ease-in-out infinite',
                },
                '&.error': {
                    background: theme.palette.error.main,
                    animation: 'blink 0.5s ease-in-out infinite',
                },
            },

            // Glassmorphism effect
            glassMorphism: {
                background: theme.palette.custom?.glassMorphism ||
                    (theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.7)'
                        : 'rgba(30, 30, 30, 0.7)'),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colorUtils.hexToRgba(
                    theme.palette.mode === 'light' ? '#ffffff' : theme.palette.primary.main,
                    0.2
                )}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },

            // Code block styling
            codeBlock: {
                background: theme.palette.custom?.codeBackground ||
                    (theme.palette.mode === 'light'
                        ? 'rgba(247, 247, 247, 0.95)'
                        : 'rgba(24, 24, 24, 0.95)'),
                color: theme.palette.mode === 'light'
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
                padding: '16px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: typography.code ? typography.code.fontFamily : '"Courier New", Courier, monospace',
                overflow: 'auto',
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: theme.palette.primary.main,
                    boxShadow: `0 0 4px ${theme.palette.primary.main}`,
                },
            },

            // Responsive utilities
            hideOnMobile: {
                [theme.breakpoints.down('sm')]: {
                    display: 'none',
                },
            },
            hideOnDesktop: {
                [theme.breakpoints.up('md')]: {
                    display: 'none',
                },
            },

            // Animation presets based on user preferences
            transition: {
                fast: themePrefs.animationLevel === 'none' ? 'none' : 'all 0.15s ease-in-out',
                medium: themePrefs.animationLevel === 'none' ? 'none' : 'all 0.3s ease-in-out',
                slow: themePrefs.animationLevel === 'none' ? 'none' : 'all 0.5s ease-in-out',
            },
        },

        // Global keyframes for animations
        components: {
            ...theme.components,
            MuiCssBaseline: {
                styleOverrides: {
                    ...theme.components?.MuiCssBaseline?.styleOverrides,
                    '@global': {
                        '@keyframes pulse-ring': {
                            '0%': {
                                transform: 'translate(-50%, -50%) scale(0)',
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'translate(-50%, -50%) scale(1)',
                                opacity: 0,
                            },
                        },
                        '@keyframes blink': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.3 },
                        },

                        // Disable animations if user prefers reduced motion
                        ...(themePrefs.reducedMotion && {
                            '*': {
                                animationDuration: '0.001ms !important',
                                animationIterationCount: '1 !important',
                                transitionDuration: '0.001ms !important',
                            },
                        }),
                    },
                },
            },
        },
    });

    return theme;
};

export default getTheme;