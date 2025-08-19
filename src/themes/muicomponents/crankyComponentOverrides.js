// src/themes/muicomponents/crankyComponentOverrides.js
import { alpha, keyframes } from '@mui/material/styles';

// Define magical animations
const sparkleAnimation = keyframes`
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
    100% { opacity: 0; transform: scale(0) rotate(360deg); }
`;

const wandWaveAnimation = keyframes`
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
`;

const magicRevealAnimation = keyframes`
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
        filter: blur(10px);
    }
    50% {
        filter: blur(5px);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
`;

const levitateAnimation = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
`;

const magicGlowPulse = keyframes`
    0%, 100% {
        box-shadow: 0 0 5px currentColor,
        0 0 10px currentColor,
        0 0 15px currentColor;
    }
    50% {
        box-shadow: 0 0 10px currentColor,
        0 0 20px currentColor,
        0 0 30px currentColor;
    }
`;

const mysticalShimmer = keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
`;

const spellCastAnimation = keyframes`
    0% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: scale(1.1) rotate(180deg);
        opacity: 0.8;
    }
    100% {
        transform: scale(1) rotate(360deg);
        opacity: 1;
    }
`;

// Subtle glow animation for input fields (replacing rotation)
const subtleGlowAnimation = keyframes`
  0%, 100% { 
    box-shadow: 0 0 0 3px ${alpha('#9333ea', 0.1)};
  }
  50% { 
    box-shadow: 0 0 0 5px ${alpha('#9333ea', 0.2)};
  }
`;

// Helper function to create magical sparkle elements
const createSparkleStyles = (theme) => ({
    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: theme.palette.secondary.light,
        opacity: 0,
        animation: `${sparkleAnimation} 2s infinite`,
    },
    '&::before': {
        top: '10%',
        left: '10%',
        animationDelay: '0s',
    },
    '&::after': {
        top: '80%',
        right: '10%',
        animationDelay: '1s',
    },
});

const crankyComponentOverrides = {
    // Button with magical effects
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: theme.typography.button.fontFamily,
                letterSpacing: theme.typography.button.letterSpacing,
                textTransform: 'none',
                borderRadius: '4px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',

                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                },

                '&:active': {
                    transform: 'translateY(0)',
                },
            }),

            containedPrimary: ({ theme }) => ({
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}, inset 0 1px 0 ${alpha('#fff', 0.2)}`,
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'inherit',
                    background: `linear-gradient(270deg, transparent, ${alpha(theme.palette.secondary.light, 0.3)}, transparent)`,
                    backgroundSize: '200% 100%',
                    animation: `${mysticalShimmer} 3s linear infinite`,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                },

                '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}, 0 0 40px ${alpha(theme.palette.primary.light, 0.3)}`,

                    '&::after': {
                        opacity: 1,
                    },
                },
            }),

            containedSecondary: ({ theme }) => ({
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: `0 4px 15px ${alpha(theme.palette.secondary.main, 0.4)}, inset 0 1px 0 ${alpha('#fff', 0.2)}`,

                '&:hover': {
                    animation: `${magicGlowPulse} 1.5s ease-in-out infinite`,
                },
            }),

            outlinedPrimary: ({ theme }) => ({
                borderColor: theme.palette.primary.main,
                color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
                background: alpha(theme.palette.primary.main, 0.05),
                borderWidth: '2px',

                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                },
            }),

            textPrimary: ({ theme }) => ({
                color: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
            }),
        },
    },

    // Paper component with magical effects - FIXED HOVER ISSUE
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundImage: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))'
                    : 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(24, 24, 24, 0.85))',
                backdropFilter: 'blur(10px)',
                boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.1)'
                    : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.15)',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: 'relative',
                overflow: 'hidden',

                // FIXED: Removed aggressive hover effect that made paper disappear
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'light'
                        ? `0 12px 32px rgba(0, 0, 0, 0.15), 0 0 40px ${alpha(theme.palette.primary.main, 0.15)}`
                        : `0 12px 32px rgba(0, 0, 0, 0.4), 0 0 40px ${alpha(theme.palette.primary.main, 0.25)}`,
                    // Removed opacity change that was making paper disappear
                },
            }),

            elevation1: ({ theme }) => ({
                boxShadow: theme.palette.mode === 'light'
                    ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                    : '0 2px 8px rgba(0, 0, 0, 0.12)',
            }),

            elevation2: ({ theme }) => ({
                boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 16px rgba(0, 0, 0, 0.1)'
                    : '0 4px 16px rgba(0, 0, 0, 0.15)',
            }),

            elevation3: ({ theme }) => ({
                boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 24px rgba(0, 0, 0, 0.12)'
                    : '0 8px 24px rgba(0, 0, 0, 0.2)',
            }),

            elevation4: ({ theme }) => ({
                boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.12)'
                    : '0 8px 16px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.2)',
            }),
        },
    },

    // TextField with magical focus effect - FIXED ROTATION ANIMATION
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    fontFamily: theme.typography.body1.fontFamily,
                    borderRadius: '4px',
                    transition: 'all 0.2s ease-in-out',
                    background: theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'rgba(30, 30, 30, 0.6)',
                    position: 'relative',

                    '& fieldset': {
                        borderColor: theme.palette.mode === 'light'
                            ? 'rgba(130, 130, 130, 0.3)'
                            : 'rgba(158, 158, 158, 0.3)',
                        transition: 'all 0.2s ease',
                    },

                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },

                    '&.Mui-focused': {
                        // FIXED: Replaced rotation animation with subtle glow
                        animation: `${subtleGlowAnimation} 2s ease-in-out infinite`,

                        '& fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '2px',
                        },
                    },

                    '& input': {
                        '&::placeholder': {
                            opacity: 0.6,
                            fontStyle: 'italic',
                        },
                    },
                },

                '& .MuiInputLabel-root': {
                    fontFamily: theme.typography.body1.fontFamily,
                },

                '& .MuiInputBase-input': {
                    fontFamily: theme.typography.body1.fontFamily,
                },
            }),
        },
    },

    // AppBar with magical gradient
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                background: theme.palette.mode === 'light'
                    ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, rgba(245, 245, 245, 0.8) 100%)`
                    : `linear-gradient(180deg, ${theme.palette.background.default} 0%, rgba(18, 18, 18, 0.8) 100%)`,
                backdropFilter: 'blur(10px)',
                borderBottom: theme.palette.mode === 'light'
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: 'none',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.4)}, transparent)`,
                },
            }),

            colorPrimary: {
                color: ({ theme }) => theme.palette.text.primary,
            },
        },
    },

    // Typography with magical text effects
    MuiTypography: {
        styleOverrides: {
            h1: ({ theme }) => ({
                fontFamily: theme.typography.h1.fontFamily,
                fontWeight: theme.typography.h1.fontWeight,
                letterSpacing: theme.typography.h1.letterSpacing,
                color: theme.palette.text.primary,
                textShadow: theme.palette.mode === 'light'
                    ? '2px 2px 4px rgba(0, 0, 0, 0.1)'
                    : `2px 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            }),

            h2: ({ theme }) => ({
                fontFamily: theme.typography.h2.fontFamily,
                fontWeight: theme.typography.h2.fontWeight,
                letterSpacing: theme.typography.h2.letterSpacing,
            }),

            h3: ({ theme }) => ({
                fontFamily: theme.typography.h3.fontFamily,
                fontWeight: theme.typography.h3.fontWeight,
                letterSpacing: theme.typography.h3.letterSpacing,
            }),

            body1: ({ theme }) => ({
                fontFamily: theme.typography.body1.fontFamily,
                letterSpacing: theme.typography.body1.letterSpacing,
            }),
        },
    },

    // Card with magical hover effect
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                background: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(8px)',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
                    transform: 'translate(30%, -30%)',
                    transition: 'transform 0.3s',
                },

                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'light'
                        ? `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 60px ${alpha(theme.palette.primary.main, 0.2)}`
                        : `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px ${alpha(theme.palette.primary.main, 0.3)}`,

                    '& .MuiCardMedia-root': {
                        transform: 'scale(1.05)',
                        filter: 'brightness(1.1)',
                    },
                },
            }),
        },
    },

    // Chip with magical hover sparkle
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: theme.typography.button.fontFamily,
                letterSpacing: theme.typography.button.letterSpacing,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                border: '1px solid transparent',
                height: '28px',
                position: 'relative',
                overflow: 'visible',

                '&:hover': {
                    transform: 'scale(1.05)',

                    '&::before': {
                        content: '"✦"',
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        color: theme.palette.secondary.main,
                        fontSize: '0.75rem',
                        animation: `${sparkleAnimation} 1s`,
                    },
                },
            }),

            colorPrimary: ({ theme }) => ({
                background: `linear-gradient(135deg, 
                    ${alpha(theme.palette.primary.main, 0.15)} 0%, 
                    ${alpha(theme.palette.primary.light, 0.15)} 100%
                )`,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,

                '&:hover': {
                    background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.primary.main, 0.25)} 0%, 
                        ${alpha(theme.palette.primary.light, 0.25)} 100%
                    )`,
                },
            }),
        },
    },

    // Switch with magical day/night toggle
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 58,
                height: 38,
                padding: 8,
                '& .MuiSwitch-switchBase': {
                    padding: 11,
                    '&.Mui-checked': {
                        transform: 'translateX(20px)',
                        '& + .MuiSwitch-track': {
                            opacity: 1,
                        },
                    },
                },
            },

            colorPrimary: ({ theme }) => ({
                '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.mode === 'light'
                        ? theme.palette.primary.main
                        : theme.palette.primary.light,

                    '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                    },
                },
            }),

            track: ({ theme }) => ({
                borderRadius: 20,
                background: `linear-gradient(90deg, 
                    ${theme.palette.grey[400]}, 
                    ${theme.palette.grey[600]}
                )`,
                opacity: 1,
                transition: 'all 0.3s',
                position: 'relative',

                '&::before': {
                    content: '"🌙"',
                    position: 'absolute',
                    left: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px',
                },

                '&::after': {
                    content: '"☀️"',
                    position: 'absolute',
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px',
                },
            }),

            thumb: ({ theme }) => ({
                width: 16,
                height: 16,
                backgroundColor: '#fff',
                boxShadow: `0 0 10px ${alpha(theme.palette.secondary.main, 0.5)}`,
            }),
        },
    },

    // Dialog with magical portal effect
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundImage: theme.palette.mode === 'light'
                    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))`
                    : `linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(24, 24, 24, 0.9))`,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px ${alpha(theme.palette.primary.main, 0.3)}`,
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                overflow: 'visible',
                animation: `${magicRevealAnimation} 0.5s ease-out`,

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '20px',
                    background: `radial-gradient(ellipse at center, ${alpha(theme.palette.primary.main, 0.5)} 0%, transparent 70%)`,
                    filter: 'blur(10px)',
                },
            }),
        },
    },

    // Table cells with magical borders
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderColor: theme.palette.mode === 'light'
                    ? `1px solid rgba(224, 224, 224, 0.7)`
                    : `1px solid rgba(81, 81, 81, 0.7)`,
                padding: '16px',
                transition: 'background-color 0.2s ease',
            }),

            head: ({ theme }) => ({
                fontFamily: theme.typography.h6.fontFamily,
                fontWeight: 600,
                letterSpacing: '0.05em',
                backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey.A100
                    : theme.palette.background.paper,
                color: theme.palette.mode === 'light'
                    ? theme.palette.grey[900]
                    : theme.palette.common.white,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.4)}, transparent)`,
                    animation: `${mysticalShimmer} 3s linear infinite`,
                },
            }),
        },
    },

    // Linear progress with magical energy flow
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                height: 8,
                borderRadius: 4,
                overflow: 'visible',
                background: alpha(theme.palette.primary.main, 0.1),

                '&::after': {
                    content: '"⚡"',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.palette.secondary.main,
                    fontSize: '1.2rem',
                    left: 'var(--LinearProgress-percent, 0%)',
                    marginLeft: '-10px',
                    animation: `${levitateAnimation} 1s ease-in-out infinite`,
                },
            }),

            colorPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.primary.main, 0.15),
            }),

            barColorPrimary: ({ theme }) => ({
                background: `linear-gradient(90deg, 
                    ${theme.palette.primary.dark}, 
                    ${theme.palette.primary.main}, 
                    ${theme.palette.secondary.light}
                )`,
                boxShadow: `0 0 10px ${alpha(theme.palette.secondary.main, 0.5)}`,
            }),
        },
    },

    // Fab button with magical ring
    MuiFab: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                overflow: 'visible',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    background: `conic-gradient(
                        from 0deg,
                        ${theme.palette.primary.main},
                        ${theme.palette.secondary.main},
                        ${theme.palette.primary.main}
                    )`,
                    opacity: 0,
                    transition: 'opacity 0.3s, transform 0.3s',
                    animation: `${spellCastAnimation} 3s linear infinite`,
                    zIndex: -1,
                },

                '&:hover': {
                    transform: 'scale(1.1)',

                    '&::before': {
                        opacity: 0.5,
                        transform: 'scale(1.2)',
                    },
                },
            }),

            primary: ({ theme }) => ({
                background: `radial-gradient(
                    circle at 30% 30%,
                    ${theme.palette.primary.light},
                    ${theme.palette.primary.main}
                )`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            }),

            secondary: ({ theme }) => ({
                background: `radial-gradient(
                    circle at 30% 30%,
                    ${theme.palette.secondary.light},
                    ${theme.palette.secondary.main}
                )`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.4)}`,
            }),
        },
    },
};

export default crankyComponentOverrides;