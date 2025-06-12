// src/themes/muicomponents/spatialComponentOverrides.js
import { alpha, keyframes } from '@mui/material/styles';

// Matrix-inspired animations
const matrixRain = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const digitalPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const scanlineAnimation = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const glitchAnimation1 = keyframes`
  0%, 100% { transform: translate(0); }
  33% { transform: translate(-2px, 2px); }
  66% { transform: translate(2px, -2px); }
`;

const glitchAnimation2 = keyframes`
  0%, 100% { transform: translate(0); }
  33% { transform: translate(2px, 2px); }
  66% { transform: translate(-2px, -2px); }
`;

const holographicShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

// Spatial component overrides with Matrix/cyberpunk theme
const spatialComponentOverrides = {
    // Global baseline for spatial effects
    MuiCssBaseline: {
        styleOverrides: {
            '@global': {
                body: {
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        background: ({ theme }) => `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${alpha(theme.palette.primary.main, 0.03)} 2px,
              ${alpha(theme.palette.primary.main, 0.03)} 4px
            )`,
                        animation: `${scanlineAnimation} 8s linear infinite`,
                        zIndex: 1,
                        opacity: 0.4,
                    },
                },
            },
        },
    },

    // Spatial button styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                overflow: 'hidden',
                transition: 'all 0.3s ease',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.light, 0.4)}, transparent)`,
                    transition: 'left 0.5s',
                },

                '&:hover::before': {
                    left: '100%',
                },

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 'inherit',
                    opacity: 0,
                    transform: 'scale(1.1)',
                    transition: 'all 0.3s',
                },

                '&:hover::after': {
                    opacity: 0.5,
                    transform: 'scale(1)',
                },
            }),

            containedPrimary: ({ theme }) => ({
                background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,

                '&:hover': {
                    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.7)}, inset 0 0 20px ${alpha(theme.palette.primary.light, 0.3)}`,
                },
            }),
        },
    },

    // Spatial paper with holographic effect
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                background: theme.palette.mode === 'light'
                    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))`
                    : `linear-gradient(135deg, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 0.85))`,
                backdropFilter: 'blur(10px)',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    opacity: 0.5,
                    backgroundSize: '300% 300%',
                    animation: `${holographicShift} 4s ease-in-out infinite`,
                },
            }),
        },
    },

    // Typography with glitch effects
    MuiTypography: {
        styleOverrides: {
            h1: ({ theme }) => ({
                position: 'relative',
                textShadow: theme.palette.mode === 'dark'
                    ? `0 0 10px ${alpha(theme.palette.primary.main, 0.8)}, 0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`
                    : `0 0 5px ${alpha(theme.palette.primary.main, 0.5)}`,

                '&[data-glitch]::before, &[data-glitch]::after': {
                    content: 'attr(data-glitch)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.8,
                },

                '&[data-glitch]::before': {
                    animation: `${glitchAnimation1} 0.3s infinite`,
                    color: theme.palette.error.main,
                    zIndex: -1,
                },

                '&[data-glitch]::after': {
                    animation: `${glitchAnimation2} 0.3s infinite`,
                    color: theme.palette.info.main,
                    zIndex: -2,
                },
            }),

            h2: ({ theme }) => ({
                textShadow: theme.palette.mode === 'dark'
                    ? `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`
                    : `0 0 4px ${alpha(theme.palette.primary.main, 0.4)}`,
            }),
        },
    },

    // Digital card styling
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                overflow: 'hidden',
                background: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(24, 24, 24, 0.8)',
                backdropFilter: 'blur(10px)',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%)`,
                    pointerEvents: 'none',
                },

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                    animation: `${holographicShift} 3s linear infinite`,
                },
            }),
        },
    },

    // Matrix-style text fields
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',

                    '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        transition: 'all 0.3s',
                    },

                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 5px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },

                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.7)}, inset 0 0 5px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                },

                '& .MuiInputLabel-root': {
                    color: theme.palette.primary.main,
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                    letterSpacing: '0.1em',
                },
            }),
        },
    },

    // Futuristic chip styling
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.dark, 0.1)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                position: 'relative',
                overflow: 'hidden',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '-50%',
                    width: '100%',
                    height: '200%',
                    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.light, 0.3)}, transparent)`,
                    transform: 'translateY(-50%) rotate(45deg)',
                    transition: 'left 0.5s',
                },

                '&:hover::before': {
                    left: '150%',
                },
            }),
        },
    },

    // Digital switch
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 58,
                height: 38,
                padding: 7,
            },

            switchBase: ({ theme }) => ({
                padding: 11,

                '&.Mui-checked': {
                    transform: 'translateX(20px)',

                    '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                        opacity: 1,
                        border: 'none',

                        '&::before': {
                            content: '"ON"',
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '0.625rem',
                            color: theme.palette.primary.contrastText,
                            fontWeight: 'bold',
                            letterSpacing: '0.05em',
                        },
                    },
                },
            }),

            thumb: ({ theme }) => ({
                width: 16,
                height: 16,
                backgroundColor: theme.palette.common.white,
                boxShadow: `0 0 4px ${alpha(theme.palette.primary.main, 0.5)}`,
            }),

            track: ({ theme }) => ({
                borderRadius: 38 / 2,
                backgroundColor: theme.palette.grey[400],
                opacity: 1,
                position: 'relative',

                '&::after': {
                    content: '"OFF"',
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.625rem',
                    color: theme.palette.grey[700],
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                },
            }),
        },
    },

    // Matrix-style progress bars
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                overflow: 'hidden',
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            ${alpha(theme.palette.primary.dark, 0.1)} 10px,
            ${alpha(theme.palette.primary.dark, 0.1)} 20px
          )`,
                    animation: `${holographicShift} 1s linear infinite`,
                },
            }),

            bar: ({ theme }) => ({
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            }),
        },
    },

    // Futuristic tooltip
    MuiTooltip: {
        styleOverrides: {
            tooltip: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.grey[900], 0.95),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '8px 12px',
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}, 0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
            }),
        },
    },

    // Digital avatar
    MuiAvatar: {
        styleOverrides: {
            root: ({ theme }) => ({
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -4,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: '50%',
                    animation: `${digitalPulse} 2s ease-in-out infinite`,
                },
            }),
        },
    },

    // Cyberpunk table
    MuiTable: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                },
            }),
        },
    },

    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: 'relative',

                '&:first-of-type::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: `linear-gradient(180deg, transparent, ${theme.palette.primary.main}, transparent)`,
                },
            }),

            head: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.875rem',
            }),
        },
    },

    // Digital dialog
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundImage: 'none',
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.3)}, 0 20px 40px ${alpha(theme.palette.common.black, 0.3)}`,
                position: 'relative',
                overflow: 'visible',

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

    // Futuristic tabs
    MuiTabs: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                    animation: `${holographicShift} 3s linear infinite`,
                },
            }),

            indicator: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                height: 3,
                boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            }),
        },
    },

    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
                minHeight: 48,
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%) scaleX(0)',
                    width: '80%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'transform 0.3s',
                },

                '&.Mui-selected': {
                    color: theme.palette.primary.main,

                    '&::after': {
                        transform: 'translateX(-50%) scaleX(1)',
                    },
                },

                '&:hover': {
                    color: theme.palette.primary.light,
                },
            }),
        },
    },

    // Matrix-style menu
    MuiMenu: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}, 0 0 20px ${alpha(theme.palette.primary.main, 0.1)}`,
            }),
        },
    },

    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.875rem',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '0%',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'height 0.3s',
                },

                '&:hover, &.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),

                    '&::before': {
                        height: '60%',
                    },
                },
            }),
        },
    },

    // Circular progress with digital effect
    MuiCircularProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                color: theme.palette.primary.main,
                filter: `drop-shadow(0 0 10px ${theme.palette.primary.main})`,
            }),

            circle: {
                strokeLinecap: 'square',
            },
        },
    },

    // Futuristic alert
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                backdropFilter: 'blur(10px)',
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                border: '1px solid',
                borderRadius: '4px',
                position: 'relative',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '4px',
                    borderRadius: '4px 0 0 4px',
                },
            }),

            standardSuccess: ({ theme }) => ({
                borderColor: alpha(theme.palette.success.main, 0.3),
                color: theme.palette.success.main,

                '&::before': {
                    backgroundColor: theme.palette.success.main,
                },
            }),

            standardError: ({ theme }) => ({
                borderColor: alpha(theme.palette.error.main, 0.3),
                color: theme.palette.error.main,

                '&::before': {
                    backgroundColor: theme.palette.error.main,
                },
            }),

            standardWarning: ({ theme }) => ({
                borderColor: alpha(theme.palette.warning.main, 0.3),
                color: theme.palette.warning.main,

                '&::before': {
                    backgroundColor: theme.palette.warning.main,
                },
            }),

            standardInfo: ({ theme }) => ({
                borderColor: alpha(theme.palette.info.main, 0.3),
                color: theme.palette.info.main,

                '&::before': {
                    backgroundColor: theme.palette.info.main,
                },
            }),
        },
    },
};

export default spatialComponentOverrides;