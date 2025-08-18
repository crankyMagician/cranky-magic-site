// src/themes/componentOverrides/wizardComponentOverrides.js
import { alpha } from '@mui/material/styles';
import {
    sparkle,
    starBurst,
    magicalGlow,
    lightningStrike,
    levitate,
    mysticalFloat,
    wandWave,
    spellCast,
    magicCircle,
    portal,
    magicalEntrance,
    auroraWave,
    shimmerText, fadeInSparkle,
} from '../animations/magicalAnimations';

/**
 * Wizard Component Overrides
 * Full magical theme with advanced effects for Cranky Magician
 */
const wizardComponentOverrides = (theme) => ({
    // Button with magical effects
    MuiButton: {
        styleOverrides: {
            root: {
                position: 'relative',
                overflow: 'hidden',
                fontWeight: 600,
                letterSpacing: '0.5px',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                textTransform: 'uppercase',

                // Magical border gradient
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'inherit',
                    padding: '2px',
                    background: theme.palette.custom?.magicalGradient ||
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.success.main} 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                },

                // Sparkle effect on hover
                '&::after': {
                    content: '"✨"',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                },

                '&:hover': {
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: theme.palette.custom?.purpleGlow ||
                        `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
                    animation: `${levitate} 2s ease-in-out infinite`,

                    '&::before': {
                        opacity: 1,
                    },

                    '&::after': {
                        transform: 'translate(-50%, -50%) scale(1)',
                        opacity: 1,
                        animation: `${sparkle} 1s ease-in-out`,
                    },
                },

                '&:active': {
                    transform: 'translateY(0) scale(0.98)',
                    animation: `${spellCast} 0.6s ease-out`,
                },

                // Ripple effect customization
                '& .MuiTouchRipple-ripple': {
                    background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 50%, transparent 70%)`,
                },
            },

            contained: {
                background: theme.palette.custom?.magicalGradient ||
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}, inset 0 1px 0 ${alpha('#fff', 0.2)}`,

                '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}, inset 0 1px 0 ${alpha('#fff', 0.3)}`,
                },
            },

            outlined: {
                borderWidth: '2px',
                borderImage: theme.palette.custom?.magicalGradient ||
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                borderImageSlice: 1,

                '&:hover': {
                    borderWidth: '2px',
                    background: alpha(theme.palette.primary.main, 0.05),
                    animation: `${magicalGlow} 2s ease-in-out infinite`,
                },
            },
        },
    },

    // Card with mystical effects
    MuiCard: {
        styleOverrides: {
            root: {
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(10px)',

                // Magical border effect
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.3)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.3)} 50%, 
            ${alpha(theme.palette.success.main, 0.3)} 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    opacity: 0.5,
                    transition: 'opacity 0.3s ease',
                },

                // Aurora effect overlay
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: theme.palette.custom?.aurora ||
                        'linear-gradient(45deg, rgba(107, 75, 175, 0.1) 0%, rgba(47, 178, 221, 0.1) 50%, rgba(43, 197, 175, 0.1) 100%)',
                    animation: `${auroraWave} 15s ease-in-out infinite`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                },

                '&:hover': {
                    transform: 'translateY(-8px) rotateX(2deg) rotateY(-2deg)',
                    boxShadow: theme.palette.custom?.cardHoverShadow ||
                        `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                    animation: `${mysticalFloat} 4s ease-in-out infinite`,

                    '&::before': {
                        opacity: 1,
                    },

                    '&::after': {
                        opacity: 1,
                    },
                },
            },
        },
    },

    // TextField with magical input effects
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    position: 'relative',
                    transition: 'all 0.3s ease',

                    '& fieldset': {
                        borderWidth: '2px',
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        transition: 'all 0.3s ease',
                    },

                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },

                    '&.Mui-focused': {
                        '& fieldset': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                            animation: `${magicalGlow} 2s ease-in-out infinite`,
                        },

                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 'inherit',
                            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                transparent 50%)`,
                            pointerEvents: 'none',
                        },
                    },
                },

                '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        textShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                },
            },
        },
    },

    // Chip with magical glow
    MuiChip: {
        styleOverrides: {
            root: {
                position: 'relative',
                borderRadius: '20px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                overflow: 'hidden',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    transform: 'translate(-50%, -50%) scale(0)',
                    borderRadius: 'inherit',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 70%)`,
                    transition: 'transform 0.3s ease',
                },

                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.4)}`,

                    '&::before': {
                        transform: 'translate(-50%, -50%) scale(2)',
                    },
                },
            },

            clickable: {
                '&:hover': {
                    animation: `${levitate} 1s ease-in-out`,
                },

                '&:active': {
                    animation: `${spellCast} 0.4s ease-out`,
                },
            },
        },
    },

    // Paper with mystical depth
    MuiPaper: {
        styleOverrides: {
            root: {
                position: 'relative',
                backgroundImage: 'none',
                transition: 'all 0.3s ease',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'inherit',
                    background: theme.palette.custom?.nebula ||
                        'radial-gradient(circle at 30% 80%, rgba(107, 75, 175, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(47, 178, 221, 0.1) 0%, transparent 50%)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                },
            },

            elevation1: {
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
            elevation2: {
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
            elevation3: {
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
        },
    },

    // AppBar with magical header
    MuiAppBar: {
        styleOverrides: {
            root: {
                background: theme.palette.mode === 'dark'
                    ? `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`
                    : `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.98)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
                backdropFilter: 'blur(15px) saturate(180%)',
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: theme.palette.custom?.magicalGradient ||
                        `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
                    animation: `${shimmerText} 3s linear infinite`,
                },
            },
        },
    },

    // Typography with magical text effects
    MuiTypography: {
        styleOverrides: {
            h1: {
                position: 'relative',
                fontWeight: 900,
                letterSpacing: '-0.02em',

                '&.magical-heading': {
                    background: theme.palette.custom?.magicalGradient ||
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.success.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% auto',
                    animation: `${shimmerText} 3s linear infinite`,
                },
            },

            h2: {
                fontWeight: 800,

                '&.glowing': {
                    textShadow: theme.palette.custom?.glowText?.textShadow ||
                        `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
            },
        },
    },

    // Fab with magical floating effect
    MuiFab: {
        styleOverrides: {
            root: {
                position: 'relative',
                animation: `${mysticalFloat} 6s ease-in-out infinite`,
                transition: 'all 0.3s ease',
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '120%',
                    height: '120%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                    animation: `${magicalGlow} 2s ease-in-out infinite`,
                },

                '&:hover': {
                    transform: 'scale(1.1) rotate(15deg)',
                    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`,

                    '&::before': {
                        animation: `${starBurst} 1s ease-out`,
                    },
                },
            },
        },
    },

    // Switch with magical toggle
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 58,
                height: 38,
                padding: 8,
            },
            switchBase: {
                padding: 11,
                '&.Mui-checked': {
                    transform: 'translateX(20px)',
                    '& + .MuiSwitch-track': {
                        background: theme.palette.custom?.magicalGradient ||
                            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        opacity: 1,
                        border: 0,

                        '&::before': {
                            content: '"✨"',
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            animation: `${sparkle} 1s ease-in-out infinite`,
                        },
                    },

                    '& .MuiSwitch-thumb': {
                        background: theme.palette.common.white,
                        boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.6)}`,
                        animation: `${magicalGlow} 2s ease-in-out infinite`,
                    },
                },
            },
            thumb: {
                width: 16,
                height: 16,
                boxShadow: 'none',
                transition: 'all 0.3s ease',
            },
            track: {
                borderRadius: 38 / 2,
                backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey[400]
                    : theme.palette.grey[700],
                opacity: 1,
                transition: 'all 0.3s ease',
                position: 'relative',
            },
        },
    },

    // Dialog with portal effect
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: '20px',
                overflow: 'visible',
                animation: `${magicalEntrance} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.3)}`,

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    borderRadius: 'inherit',
                    background: theme.palette.custom?.magicalGradient ||
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.success.main} 100%)`,
                    zIndex: -1,
                    animation: `${portal} 4s linear infinite`,
                },
            },
        },
    },

    // Alert with magical effects
    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    animation: `${shimmerText} 2s linear infinite`,
                    pointerEvents: 'none',
                },
            },

            standardSuccess: {
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
            },

            standardError: {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            },

            standardWarning: {
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.dark,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            },

            standardInfo: {
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            },
        },
    },

    // Linear Progress with magical animation
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                height: 8,
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: `${shimmerText} 2s linear infinite`,
                },
            },

            bar: {
                borderRadius: 4,
                background: theme.palette.custom?.magicalGradient ||
                    `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.success.main} 100%)`,
                boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                animation: `${magicalGlow} 2s ease-in-out infinite`,
            },
        },
    },

    // Circular Progress with spin effect
    MuiCircularProgress: {
        styleOverrides: {
            root: {
                animation: `${portal} 2s linear infinite`,
            },

            circle: {
                strokeLinecap: 'round',
                stroke: `url(#magical-gradient-${theme.palette.mode})`,
                filter: `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.6)})`,
            },
        },
    },

    // Tooltip with magical appearance
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: '8px',
                fontSize: '0.875rem',
                padding: '8px 12px',
                animation: `${fadeInSparkle} 0.3s ease-out`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'inherit',
                    background: theme.palette.custom?.aurora ||
                        'linear-gradient(45deg, rgba(107, 75, 175, 0.1) 0%, rgba(47, 178, 221, 0.1) 50%, rgba(43, 197, 175, 0.1) 100%)',
                    opacity: 0.3,
                    zIndex: -1,
                },
            },

            arrow: {
                color: alpha(theme.palette.background.paper, 0.95),

                '&::before': {
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                },
            },
        },
    },

    // Menu with magical dropdown
    MuiMenu: {
        styleOverrides: {
            paper: {
                borderRadius: '12px',
                marginTop: '8px',
                animation: `${magicalEntrance} 0.3s ease-out`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                backdropFilter: 'blur(10px)',
                backgroundColor: alpha(theme.palette.background.paper, 0.95),

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: theme.palette.custom?.magicalGradient ||
                        `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
                    animation: `${shimmerText} 2s linear infinite`,
                },
            },
        },
    },

    // MenuItem with hover magic
    MuiMenuItem: {
        styleOverrides: {
            root: {
                transition: 'all 0.2s ease',
                position: 'relative',

                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    paddingLeft: '20px',

                    '&::before': {
                        content: '"→"',
                        position: 'absolute',
                        left: '8px',
                        color: theme.palette.primary.main,
                        animation: `${wandWave} 0.5s ease`,
                    },
                },
            },
        },
    },
});

export default wizardComponentOverrides;