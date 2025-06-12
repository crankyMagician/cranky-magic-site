

// src/themes/palettes/crankyMagicianDark.js
import {alpha} from "@mui/material/styles";

export const crankyMagicianDark = {
    mode: 'dark',

    // Primary colors - Bright purple for magic in dark mode
    primary: {
        main: '#9575CD', // Lighter purple for dark mode - WCAG AA compliant
        light: '#B39DDB',
        dark: '#7E57C2',
        contrastText: '#000000',
    },

    // Secondary colors - Mystical gold
    secondary: {
        main: '#FFD54F', // Brighter gold for dark mode
        light: '#FFECB3',
        dark: '#FFC107',
        contrastText: '#000000',
    },

    // Error, warning, info, success with WCAG compliance for dark mode
    error: {
        main: '#F44336',
        light: '#EF5350',
        dark: '#D32F2F',
        contrastText: '#000000',
    },
    warning: {
        main: '#FFA726',
        light: '#FFB74D',
        dark: '#F57C00',
        contrastText: '#000000',
    },
    info: {
        main: '#29B6F6',
        light: '#4FC3F7',
        dark: '#039BE5',
        contrastText: '#000000',
    },
    success: {
        main: '#66BB6A',
        light: '#81C784',
        dark: '#4CAF50',
        contrastText: '#000000',
    },

    // Background colors for dark theme
    background: {
        default: '#121212',
        paper: '#1E1E1E',
    },

    // Text colors with WCAG compliance for dark backgrounds
    text: {
        primary: 'rgba(255, 255, 255, 0.87)', // WCAG AA compliant
        secondary: 'rgba(255, 255, 255, 0.60)', // WCAG AA compliant
        disabled: 'rgba(255, 255, 255, 0.38)',
    },

    // Divider
    divider: 'rgba(255, 255, 255, 0.12)',

    // Action colors
    action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },

    // Custom colors for magical effects in dark mode
    custom: {
        magicGlow: 'rgba(149, 117, 205, 0.25)',
        sparkle: '#311B92',
        mysticMist: 'rgba(149, 117, 205, 0.12)',
        cardGradient: 'linear-gradient(135deg, rgba(149, 117, 205, 0.15) 0%, rgba(255, 213, 79, 0.15) 100%)',
        overlay: 'rgba(18, 18, 18, 0.9)',
        glassMorphism: 'rgba(30, 30, 30, 0.75)',
        codeBackground: 'rgba(26, 26, 26, 0.95)',
        dataStream: 'linear-gradient(180deg, rgba(149, 117, 205, 0.2) 0%, transparent 100%)',
        glowEffect: '0 0 30px rgba(149, 117, 205, 0.5), 0 0 60px rgba(149, 117, 205, 0.25)',
        hologram: 'linear-gradient(135deg, rgba(149, 117, 205, 0.2) 0%, rgba(179, 157, 219, 0.2) 100%)',
        gridLine: 'rgba(149, 117, 205, 0.25)',
        digitalPulse: 'rgba(149, 117, 205, 0.8)',
        matrixRain: 'rgba(149, 117, 205, 0.35)',
        scanline: 'rgba(149, 117, 205, 0.08)',
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

    // Tertiary color for additional branding
    tertiary: {
        main: '#4DD0E1', // Mystical teal for dark mode
        light: '#80DEEA',
        dark: '#26C6DA',
        contrastText: '#000000',
    },

    // Helper function at palette level
    getAlphaColor: function(color, alpha) {
        return this.custom.getAlphaColor(color, alpha);
    }
};


export const getCrankyMagicianComponentOverrides = (theme) => ({
    MuiCssBaseline: {
        styleOverrides: {
            '@global': {
                // Import Google Fonts
                '@import': 'url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,900&family=JetBrains+Mono:wght@500&display=swap")',

                // Smooth scrolling
                html: {
                    scrollBehavior: 'smooth',
                },

                // Selection colors
                '::selection': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.contrastText,
                },

                // Custom scrollbar
                '*::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px',
                },
                '*::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.background.default,
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: '5px',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                    },
                },
            },
        },
    },

    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 0,
                    height: 0,
                    borderRadius: '50%',
                    background: alpha(theme.palette.common.white, 0.3),
                    transform: 'translate(-50%, -50%)',
                    transition: 'width 0.6s, height 0.6s',
                },

                '&:hover::before': {
                    width: '300px',
                    height: '300px',
                },
            },
            containedPrimary: {
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,

                '&:hover': {
                    boxShadow: `0 6px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                },
            },
            containedSecondary: {
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,

                '&:hover': {
                    boxShadow: `0 6px 30px ${alpha(theme.palette.secondary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                },
            },
            outlined: {
                borderWidth: '2px',
                '&:hover': {
                    borderWidth: '2px',
                    transform: 'translateY(-2px)',
                },
            },
        },
    },

    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            elevation1: {
                boxShadow: theme.palette.mode === 'light'
                    ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                    : '0 2px 8px rgba(0, 0, 0, 0.25)',
            },
            elevation2: {
                boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 16px rgba(0, 0, 0, 0.1)'
                    : '0 4px 16px rgba(0, 0, 0, 0.3)',
            },
            elevation3: {
                boxShadow: theme.palette.mode === 'light'
                    ? '0 6px 24px rgba(0, 0, 0, 0.12)'
                    : '0 6px 24px rgba(0, 0, 0, 0.35)',

                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'light'
                        ? `0 12px 32px rgba(0, 0, 0, 0.15), 0 0 40px ${alpha(theme.palette.primary.main, 0.15)}`
                        : `0 12px 32px rgba(0, 0, 0, 0.4), 0 0 40px ${alpha(theme.palette.primary.main, 0.25)}`,
                },
            },
        },
    },

    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                background: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(30, 30, 30, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                },

                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: theme.palette.mode === 'light'
                        ? `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 60px ${alpha(theme.palette.primary.main, 0.2)}`
                        : `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px ${alpha(theme.palette.primary.main, 0.3)}`,

                    '&::before': {
                        opacity: 1,
                    },
                },
            },
        },
    },

    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    transition: 'all 0.3s',

                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },

                    '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                    },
                },
            },
        },
    },

    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: '6px',
                fontWeight: 500,
                transition: 'all 0.2s',

                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
            },
            colorPrimary: {
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            colorSecondary: {
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
            },
        },
    },

    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(18, 18, 18, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: 'none',
            },
        },
    },

    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: theme.palette.mode === 'light'
                    ? alpha(theme.palette.grey[900], 0.9)
                    : alpha(theme.palette.grey[100], 0.9),
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                padding: '8px 16px',
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.2)}`,
            },
            arrow: {
                color: theme.palette.mode === 'light'
                    ? alpha(theme.palette.grey[900], 0.9)
                    : alpha(theme.palette.grey[100], 0.9),
            },
        },
    },

    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: alpha(theme.palette.primary.main, 0.1),

                '&::before, &::after': {
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                },
            },
        },
    },

    MuiLinearProgress: {
        styleOverrides: {
            root: {
                height: '6px',
                borderRadius: '3px',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
            bar: {
                borderRadius: '3px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            },
        },
    },
});
