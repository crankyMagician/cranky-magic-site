// src/themes/muicomponents/lightningComponentOverrides.js
import { alpha, keyframes } from '@mui/material/styles';

// Lightning animations
const lightningStrike = keyframes`
  0%, 95% {
    opacity: 0;
    transform: scaleY(0) translateX(0);
  }
  96% {
    opacity: 1;
    transform: scaleY(1) translateX(-2px);
  }
  97% {
    transform: scaleY(1) translateX(2px);
  }
  98% {
    transform: scaleY(1) translateX(-1px);
  }
  100% {
    opacity: 0;
    transform: scaleY(0) translateX(0);
  }
`;

const electricPulse = keyframes`
  0% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
  100% {
    box-shadow: 0 0 5px currentColor;
  }
`;

const energyFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const staticNoise = keyframes`
  0%, 100% {
    transform: translate(0);
  }
  10% {
    transform: translate(-1px, -1px);
  }
  20% {
    transform: translate(1px, 1px);
  }
  30% {
    transform: translate(-1px, 1px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(0);
  }
`;

const lightningComponentOverrides = {
    // Button with electric effects
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.info.main, 0.4)}, transparent)`,
                    transition: 'left 0.5s ease',
                },

                '&:hover': {
                    animation: `${staticNoise} 0.3s ease infinite`,
                    boxShadow: `0 0 15px ${alpha(theme.palette.info.main, 0.5)}`,

                    '&::before': {
                        left: '100%',
                        transition: 'left 0.3s ease',
                    },

                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '2px',
                        background: theme.palette.info.main,
                        transform: 'translate(-50%, -50%)',
                        animation: `${lightningStrike} 0.5s ease-out`,
                    },
                },
            }),

            containedPrimary: ({ theme }) => ({
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                color: theme.palette.info.contrastText,

                '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`,
                    animation: `${electricPulse} 1s ease-in-out infinite`,
                },
            }),
        },
    },

    // Paper with electric border
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'inherit',
                    padding: '2px',
                    background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
                    backgroundSize: '200% 200%',
                    animation: `${energyFlow} 3s linear infinite`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                },

                '&:hover::before': {
                    opacity: 0.7,
                },
            }),
        },
    },

    // Card with lightning effects
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                transition: 'all 0.3s ease',

                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 10px 30px ${alpha(theme.palette.info.main, 0.3)}`,

                    '&::after': {
                        content: '"⚡"',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '24px',
                        animation: `${electricPulse} 0.5s ease`,
                    },
                },
            }),
        },
    },

    // TextField with electric focus
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    position: 'relative',

                    '& fieldset': {
                        borderColor: alpha(theme.palette.info.main, 0.3),
                        transition: 'all 0.2s ease',
                    },

                    '&:hover fieldset': {
                        borderColor: theme.palette.info.main,
                    },

                    '&.Mui-focused': {
                        '& fieldset': {
                            borderColor: theme.palette.info.main,
                            borderWidth: '2px',
                            animation: `${electricPulse} 2s ease-in-out infinite`,
                        },

                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '1px',
                            background: theme.palette.info.main,
                            animation: `${lightningStrike} 1s ease-out infinite`,
                        },

                        '&::before': {
                            top: 0,
                            animationDelay: '0s',
                        },

                        '&::after': {
                            bottom: 0,
                            animationDelay: '0.5s',
                        },
                    },
                },
            }),
        },
    },

    // Chip with electric glow
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                transition: 'all 0.2s ease',

                '&:hover': {
                    borderColor: theme.palette.info.main,
                    boxShadow: `0 0 10px ${alpha(theme.palette.info.main, 0.5)}`,
                    animation: `${staticNoise} 0.2s ease infinite`,
                },
            }),
        },
    },

    // Switch with lightning toggle
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 52,
                height: 32,
                padding: 4,
            },

            switchBase: ({ theme }) => ({
                padding: 6,

                '&.Mui-checked': {
                    transform: 'translateX(20px)',

                    '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.info.main,
                        opacity: 1,

                        '&::before': {
                            content: '"⚡"',
                            position: 'absolute',
                            left: '6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '14px',
                            animation: `${electricPulse} 1s ease-in-out infinite`,
                        },
                    },

                    '& .MuiSwitch-thumb': {
                        backgroundColor: theme.palette.common.white,
                        boxShadow: `0 0 12px ${alpha(theme.palette.info.main, 0.6)}`,
                    },
                },
            }),

            thumb: {
                width: 20,
                height: 20,
            },

            track: ({ theme }) => ({
                borderRadius: 16,
                backgroundColor: theme.palette.grey[400],
                opacity: 1,
                transition: 'background-color 0.3s ease',
            }),
        },
    },

    // LinearProgress with lightning effect
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                overflow: 'visible',

                '&::after': {
                    content: '"⚡"',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: 'var(--LinearProgress-percent, 0%)',
                    marginLeft: '-10px',
                    fontSize: '16px',
                    animation: `${electricPulse} 0.5s ease-in-out infinite`,
                },
            }),

            bar: ({ theme }) => ({
                borderRadius: 3,
                background: `linear-gradient(90deg, ${theme.palette.info.dark}, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                backgroundSize: '200% 100%',
                animation: `${energyFlow} 2s linear infinite`,
                boxShadow: `0 0 10px ${alpha(theme.palette.info.main, 0.5)}`,
            }),
        },
    },

    // CircularProgress with electric spin
    MuiCircularProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                animation: `${staticNoise} 0.1s ease infinite`,
            }),

            circle: ({ theme }) => ({
                strokeLinecap: 'round',
                stroke: theme.palette.info.main,
                filter: `drop-shadow(0 0 6px ${alpha(theme.palette.info.main, 0.6)})`,
            }),
        },
    },

    // Alert with electric warning
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: theme.palette.info.main,
                    animation: `${electricPulse} 2s ease-in-out infinite`,
                },
            }),

            standardInfo: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.dark,
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            }),
        },
    },

    // Fab with electric ring
    MuiFab: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: `2px solid ${theme.palette.info.main}`,
                    opacity: 0,
                    animation: `${electricPulse} 2s ease-in-out infinite`,
                },

                '&:hover': {
                    transform: 'scale(1.1)',

                    '&::before': {
                        opacity: 1,
                    },
                },
            }),
        },
    },

    // Dialog with lightning entrance
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                position: 'relative',
                overflow: 'visible',

                '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    width: '2px',
                    height: '100%',
                    background: `linear-gradient(to bottom, transparent, ${theme.palette.info.main}, transparent)`,
                    animation: `${lightningStrike} 2s ease-out infinite`,
                },

                '&::before': {
                    left: -10,
                    animationDelay: '0s',
                },

                '&::after': {
                    right: -10,
                    animationDelay: '1s',
                },
            }),
        },
    },

    // Typography with electric text
    MuiTypography: {
        styleOverrides: {
            h1: ({ theme }) => ({
                position: 'relative',

                '&.electric': {
                    color: theme.palette.info.main,
                    textShadow: `0 0 10px ${alpha(theme.palette.info.main, 0.5)}`,
                    animation: `${staticNoise} 0.05s ease infinite`,
                },
            }),
        },
    },

    // Tooltip with electric appearance
    MuiTooltip: {
        styleOverrides: {
            tooltip: ({ theme }) => ({
                backgroundColor: alpha(theme.palette.grey[900], 0.95),
                border: `1px solid ${theme.palette.info.main}`,
                boxShadow: `0 0 10px ${alpha(theme.palette.info.main, 0.3)}`,

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: theme.palette.info.main,
                    animation: `${energyFlow} 1s linear infinite`,
                },
            }),
        },
    },

    // All other components with minimal electric touches
    MuiDivider: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '2px',
                    background: theme.palette.info.main,
                    animation: `${energyFlow} 2s linear infinite`,
                },
            }),
        },
    },
};

export default lightningComponentOverrides;