// src/themes/muicomponents/spatialComponentsOverrides.js

const matrixComponentsOverrides = {
    // Button overrides for futuristic styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                textTransform: 'uppercase',
                padding: '10px 24px',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.05em',
                border: '1px solid transparent',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '4px',
                    padding: '2px',
                    background: 'linear-gradient(135deg, transparent 40%, rgba(214, 90, 49, 0.5) 100%)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    opacity: 0.7,
                },
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.custom?.glowEffect || '0 0 10px rgba(214, 90, 49, 0.5)',
                },
                '&:active': {
                    transform: 'translateY(1px)',
                },
            }),
            containedPrimary: ({ theme }) => ({
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: theme.palette.primary.contrastText,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.1), ${theme.palette.custom?.glowEffect}`,
                },
            }),
            outlinedPrimary: ({ theme }) => ({
                borderColor: theme.palette.primary.main,
                color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
                background: 'rgba(214, 90, 49, 0.05)',
                '&:hover': {
                    backgroundColor: 'rgba(214, 90, 49, 0.1)',
                    borderColor: theme.palette.primary.main,
                },
            }),
            textPrimary: ({ theme }) => ({
                color: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: 'rgba(214, 90, 49, 0.05)',
                },
            }),
        },
    },

    // Paper component for card-like elements with futuristic styling
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
                    ? '0 8px 16px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)'
                    : '0 8px 16px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : '1px solid rgba(214, 90, 49, 0.1)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '8px',
                    padding: '1px',
                    background: `linear-gradient(135deg, transparent 30%, ${theme.palette.primary.main}44 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                },
            }),
            elevation1: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
            },
            elevation2: ({ theme }) => ({
                boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.12)'
                    : '0 4px 12px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.15)',
            }),
            elevation4: ({ theme }) => ({
                boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.12)'
                    : '0 8px 16px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.2)',
            }),
        },
    },

    // AppBar with Matrix-inspired design
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                background: theme.palette.mode === 'light'
                    ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, rgba(245, 245, 245, 0.8) 100%)`
                    : `linear-gradient(180deg, ${theme.palette.background.default} 0%, rgba(18, 18, 18, 0.8) 100%)`,
                backdropFilter: 'blur(10px)',
                borderBottom: theme.palette.mode === 'light'
                    ? '1px solid rgba(214, 90, 49, 0.1)'
                    : '1px solid rgba(214, 90, 49, 0.2)',
                boxShadow: 'none',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}66, transparent)`,
                },
            }),
            colorPrimary: {
                color: ({ theme }) => theme.palette.text.primary,
            },
        },
    },

    // Typography overrides for Matrix-inspired text
    MuiTypography: {
        styleOverrides: {
            h1: ({ theme }) => ({
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: theme.palette.text.primary,
                textShadow: theme.palette.mode === 'light'
                    ? '0 0 8px rgba(214, 90, 49, 0.2)'
                    : '0 0 8px rgba(214, 90, 49, 0.3)',
                position: 'relative',
            }),
            h2: ({ theme }) => ({
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: theme.palette.text.primary,
                textShadow: theme.palette.mode === 'light'
                    ? '0 0 6px rgba(214, 90, 49, 0.2)'
                    : '0 0 6px rgba(214, 90, 49, 0.3)',
            }),
            h3: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: theme.palette.text.primary,
                position: 'relative',
            }),
            h4: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: theme.palette.text.primary,
            }),
            h5: ({ theme }) => ({
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                color: theme.palette.text.primary,
            }),
            h6: ({ theme }) => ({
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                color: theme.palette.text.primary,
            }),
            body1: ({ theme }) => ({
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                letterSpacing: '0.01em',
                color: theme.palette.text.primary,
            }),
            body2: ({ theme }) => ({
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '0.875rem',
                letterSpacing: '0.01em',
                color: theme.palette.text.secondary,
            }),
        },
    },

    // Card overrides for futuristic styling
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    background: `
            linear-gradient(45deg, transparent 96%, ${theme.palette.primary.main}33 100%),
            linear-gradient(135deg, transparent 96%, ${theme.palette.primary.main}33 100%)
          `,
                    backgroundSize: '10px 10px',
                    opacity: 0.5,
                },
            }),
        },
    },

    // Dialog overrides for holographic-style modals
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundImage: theme.palette.mode === 'light'
                    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)), ${theme.palette.custom?.hologram}`
                    : `linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(24, 24, 24, 0.9)), ${theme.palette.custom?.hologram}`,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), ${theme.palette.custom?.glowEffect}`,
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : '1px solid rgba(214, 90, 49, 0.2)',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: `linear-gradient(135deg, transparent 40%, ${theme.palette.primary.main}66 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                },
            }),
        },
    },

    // TextField overrides for data input styling
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    fontFamily: 'Rajdhani, sans-serif',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease-in-out',
                    background: theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'rgba(30, 30, 30, 0.6)',
                    '& fieldset': {
                        borderColor: theme.palette.mode === 'light'
                            ? 'rgba(130, 130, 130, 0.3)'
                            : 'rgba(158, 158, 158, 0.3)',
                        transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '2px',
                        boxShadow: `0 0 0 3px ${theme.palette.primary.main}22`,
                    },
                },
                '& .MuiInputLabel-root': {
                    fontFamily: 'Rajdhani, sans-serif',
                },
                '& .MuiInputBase-input': {
                    fontFamily: 'Rajdhani, sans-serif',
                    letterSpacing: '0.03em',
                },
            }),
        },
    },

    // Chip component for tag/label elements
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                letterSpacing: '0.05em',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                border: '1px solid transparent',
                height: '28px',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '4px',
                    padding: '1px',
                    background: 'linear-gradient(135deg, transparent 80%, rgba(214, 90, 49, 0.5) 100%)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    opacity: 0.5,
                },
            }),
            colorPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.primary.main + '22'
                    : theme.palette.primary.main + '33',
                color: theme.palette.mode === 'light'
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light,
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? theme.palette.primary.main + '33'
                        : theme.palette.primary.main + '44',
                },
            }),
        },
    },

    // Switch component for toggles with futuristic styling
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 46,
                height: 26,
                padding: 0,
            },
            switchBase: ({ theme }) => ({
                padding: 2,
                '&.Mui-checked': {
                    transform: 'translateX(20px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                        opacity: 1,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: 0.5,
                        background: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
                    },
                },
            }),
            thumb: {
                width: 22,
                height: 22,
                boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
            },
            track: ({ theme }) => ({
                border: `1px solid ${theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D'}`,
                borderRadius: 26 / 2,
                opacity: 1,
                backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
                transition: 'all 0.3s ease',
            }),
        },
    },

    // Tooltip with futuristic styling
    MuiTooltip: {
        styleOverrides: {
            tooltip: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(33, 33, 33, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                color: theme.palette.mode === 'light' ? '#ffffff' : '#121212',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.025em',
                backdropFilter: 'blur(4px)',
                borderRadius: '4px',
                padding: '8px 12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                border: `1px solid ${theme.palette.primary.main}44`,
            }),
            arrow: ({ theme }) => ({
                color: theme.palette.mode === 'light'
                    ? 'rgba(33, 33, 33, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
            }),
        },
    },

    // Table styling for data displays
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Inter, sans-serif',
                borderBottom: theme.palette.mode === 'light'
                    ? `1px solid rgba(224, 224, 224, 0.7)`
                    : `1px solid rgba(81, 81, 81, 0.7)`,
                padding: '16px',
                transition: 'background-color 0.2s ease',
            }),
            head: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
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
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}66, transparent)`,
                },
            }),
        },
    },

    // Table Row hover effects
    MuiTableRow: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.04)'
                        : 'rgba(214, 90, 49, 0.08)',
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.08)'
                        : 'rgba(214, 90, 49, 0.16)',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? 'rgba(214, 90, 49, 0.12)'
                            : 'rgba(214, 90, 49, 0.24)',
                    },
                },
            }),
        },
    },

    // List items for navigation and selections
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                transition: 'all 0.2s ease',
                borderRadius: '4px',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.04)'
                        : 'rgba(214, 90, 49, 0.08)',
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.08)'
                        : 'rgba(214, 90, 49, 0.16)',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '10%',
                        height: '80%',
                        width: '3px',
                        background: theme.palette.primary.main,
                        borderRadius: '0 2px 2px 0',
                    },
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? 'rgba(214, 90, 49, 0.12)'
                            : 'rgba(214, 90, 49, 0.24)',
                    },
                },
            }),
        },
    },

    // Divider with glowing effect
    MuiDivider: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.12)'
                    : 'rgba(255, 255, 255, 0.12)',
                '&::before, &::after': {
                    borderColor: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.12)'
                        : 'rgba(255, 255, 255, 0.12)',
                },
                '&.MuiDivider-middle': {
                    '&::before, &::after': {
                        borderTop: theme.palette.mode === 'light'
                            ? '1px solid rgba(0, 0, 0, 0.12)'
                            : '1px solid rgba(255, 255, 255, 0.12)',
                    },
                },
            }),
            light: ({ theme }) => ({
                borderColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'rgba(255, 255, 255, 0.08)',
            }),
        },
    },

    // Dialog title with futuristic styling
    MuiDialogTitle: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                padding: '16px 24px',
                color: theme.palette.text.primary,
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '5%',
                    width: '90%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}66, transparent)`,
                },
            }),
        },
    },

    // Backdrop for modals with Matrix-like styling
    MuiBackdrop: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(245, 245, 245, 0.7)'
                    : 'rgba(18, 18, 18, 0.7)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease-in-out',
            }),
            invisible: {
                backgroundColor: 'transparent',
                backdropFilter: 'none',
            },
        },
    },

    // Linear progress with digital pulse effect
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                height: 6,
                borderRadius: 3,
            },
            colorPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(214, 90, 49, 0.15)'
                    : 'rgba(214, 90, 49, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `linear-gradient(90deg, transparent, ${theme.palette.custom?.digitalPulse || 'rgba(214, 90, 49, 0.7)'}, transparent)`,
                    backgroundSize: '200% 100%',
                    animation: 'pulse 2s linear infinite',
                },
                '@keyframes pulse': {
                    '0%': {
                        backgroundPosition: '-200% 0',
                    },
                    '100%': {
                        backgroundPosition: '200% 0',
                    },
                },
            }),
            bar: ({ theme }) => ({
                borderRadius: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            }),
        },
    },

    // Circular progress with glow
    MuiCircularProgress: {
        styleOverrides: {
            root: {
                transition: 'all 0.3s ease',
            },
            colorPrimary: ({ theme }) => ({
                color: theme.palette.primary.main,
                filter: `drop-shadow(0 0 2px ${theme.palette.primary.main}66)`,
            }),
        },
    },

    // Tabs with underline animation
    MuiTabs: {
        styleOverrides: {
            root: ({ theme }) => ({
                minHeight: 48,
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.12)'
                        : 'rgba(255, 255, 255, 0.12)',
                },
            }),
            indicator: ({ theme }) => ({
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: theme.palette.mode === 'light'
                    ? `0 0 6px ${theme.palette.primary.main}66`
                    : `0 0 8px ${theme.palette.primary.main}99`,
            }),
        },
    },

    // Tab item
    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em',
                minHeight: 48,
                transition: 'all 0.2s ease',
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                },
                '&:hover': {
                    color: theme.palette.primary.main,
                    opacity: 0.8,
                },
            }),
        },
    },

    // Links with futuristic styling
    MuiLink: {
        styleOverrides: {
            root: ({ theme }) => ({
                color: theme.palette.primary.main,
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
                fontWeight: 500,
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    backgroundColor: theme.palette.primary.main,
                    transform: 'scaleX(0)',
                    transformOrigin: 'right',
                    transition: 'transform 0.3s ease',
                },
                '&:hover': {
                    color: theme.palette.primary.main,
                    textShadow: `0 0 8px ${theme.palette.primary.main}33`,
                    '&::after': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'left',
                    },
                },
            }),
        },
    },

    // Alert component with tech styling
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                border: '1px solid',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                },
            }),
            standardSuccess: ({ theme }) => ({
                color: theme.palette.success.dark,
                backgroundColor: `${theme.palette.success.main}22`,
                borderColor: `${theme.palette.success.main}44`,
                '&::before': {
                    backgroundColor: theme.palette.success.main,
                },
            }),
            standardInfo: ({ theme }) => ({
                color: theme.palette.info.dark,
                backgroundColor: `${theme.palette.info.main}22`,
                borderColor: `${theme.palette.info.main}44`,
                '&::before': {
                    backgroundColor: theme.palette.info.main,
                },
            }),
            standardWarning: ({ theme }) => ({
                color: theme.palette.warning.dark,
                backgroundColor: `${theme.palette.warning.main}22`,
                borderColor: `${theme.palette.warning.main}44`,
                '&::before': {
                    backgroundColor: theme.palette.warning.main,
                },
            }),
            standardError: ({ theme }) => ({
                color: theme.palette.error.dark,
                backgroundColor: `${theme.palette.error.main}22`,
                borderColor: `${theme.palette.error.main}44`,
                '&::before': {
                    backgroundColor: theme.palette.error.main,
                },
            }),
        },
    },

    // Slider with futuristic styling
    MuiSlider: {
        styleOverrides: {
            root: {
                height: 8,
                borderRadius: 4,
            },
            rail: ({ theme }) => ({
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                opacity: 1,
            }),
            track: ({ theme }) => ({
                height: 8,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }),
            thumb: ({ theme }) => ({
                height: 16,
                width: 16,
                backgroundColor: '#fff',
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: `0 0 6px ${theme.palette.primary.main}80`,
                '&:focus, &:hover, &.Mui-active': {
                    boxShadow: `0 0 10px ${theme.palette.primary.main}cc`,
                },
            }),
            valueLabel: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                background: theme.palette.primary.main,
                '&::before': {
                    borderColor: `transparent transparent ${theme.palette.primary.main} transparent`,
                },
            }),
        },
    },

    // Badge with blinking effect for notifications
    MuiBadge: {
        styleOverrides: {
            badge: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: '0.75rem',
                '&.MuiBadge-colorPrimary': {
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: `0 0 6px ${theme.palette.primary.main}80`,
                    animation: 'pulse-fade 1.5s infinite ease-in-out',
                },
                '&.MuiBadge-colorError': {
                    backgroundColor: theme.palette.error.main,
                    boxShadow: `0 0 6px ${theme.palette.error.main}80`,
                    animation: 'pulse-fade 1.5s infinite ease-in-out',
                },
                '@keyframes pulse-fade': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                },
            }),
        },
    },

    // Avatar with high-tech border
    MuiAvatar: {
        styleOverrides: {
            root: ({ theme }) => ({
                border: `2px solid ${theme.palette.primary.main}44`,
                boxShadow: `0 0 4px ${theme.palette.primary.main}40`,
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, transparent 50%, ${theme.palette.primary.main}33 100%)`,
                    pointerEvents: 'none',
                },
            }),
        },
    },
// Menu with futuristic styling
    MuiMenu: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(30, 30, 30, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '4px',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : '1px solid rgba(214, 90, 49, 0.2)',
                boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 20px rgba(0, 0, 0, 0.15)'
                    : '0 4px 20px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '4px',
                    padding: '1px',
                    background: `linear-gradient(135deg, transparent 30%, ${theme.palette.primary.main}44 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                },
            }),
        },
    },

    // MenuItem with hover effects
    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.08)'
                        : 'rgba(214, 90, 49, 0.16)',
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.12)'
                        : 'rgba(214, 90, 49, 0.24)',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? 'rgba(214, 90, 49, 0.16)'
                            : 'rgba(214, 90, 49, 0.32)',
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '25%',
                        height: '50%',
                        width: '3px',
                        background: theme.palette.primary.main,
                        borderRadius: '0 2px 2px 0',
                    },
                },
            }),
        },
    },

    // Popover with futuristic styling
    MuiPopover: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(30, 30, 30, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '4px',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : '1px solid rgba(214, 90, 49, 0.2)',
                boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 20px rgba(0, 0, 0, 0.15)'
                    : '0 4px 20px rgba(0, 0, 0, 0.4)',
            }),
        },
    },

    // Drawer with futuristic styling
    MuiDrawer: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(24, 24, 24, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRight: theme.palette.mode === 'light'
                    ? '1px solid rgba(0, 0, 0, 0.12)'
                    : '1px solid rgba(214, 90, 49, 0.2)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '1px',
                    height: '100%',
                    background: `linear-gradient(to bottom, transparent, ${theme.palette.primary.main}55, transparent)`,
                    opacity: 0.7,
                },
            }),
        },
    },

    // Radio button with futuristic styling
    MuiRadio: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&.Mui-checked': {
                    color: theme.palette.primary.main,
                    '& .MuiSvgIcon-root': {
                        filter: `drop-shadow(0 0 2px ${theme.palette.primary.main}66)`,
                    },
                },
            }),
        },
    },

    // Checkbox with futuristic styling
    MuiCheckbox: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&.Mui-checked': {
                    color: theme.palette.primary.main,
                    '& .MuiSvgIcon-root': {
                        filter: `drop-shadow(0 0 2px ${theme.palette.primary.main}66)`,
                    },
                },
            }),
        },
    },

    // Stepper with futuristic styling
    MuiStepper: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiStepConnector-line': {
                    borderColor: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.2)'
                        : 'rgba(255, 255, 255, 0.2)',
                },
            }),
        },
    },

    // Step with futuristic styling
    MuiStepLabel: {
        styleOverrides: {
            label: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                '&.Mui-active': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                },
                '&.Mui-completed': {
                    color: theme.palette.mode === 'light'
                        ? theme.palette.primary.dark
                        : theme.palette.primary.light,
                },
            }),
        },
    },

    // StepIcon with futuristic styling
    MuiStepIcon: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&.Mui-active': {
                    color: theme.palette.primary.main,
                    filter: `drop-shadow(0 0 3px ${theme.palette.primary.main}66)`,
                },
                '&.Mui-completed': {
                    color: theme.palette.primary.main,
                },
            }),
        },
    },

    // Select with futuristic styling
    MuiSelect: {
        styleOverrides: {
            select: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                letterSpacing: '0.02em',
            }),
            icon: ({ theme }) => ({
                color: theme.palette.primary.main,
            }),
        },
    },

    // Pagination with futuristic styling
    MuiPagination: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
            }),
            ul: {
                gap: '4px',
            },
        },
    },

    // Pagination item with futuristic styling
    MuiPaginationItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.12)'
                        : 'rgba(214, 90, 49, 0.24)',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? 'rgba(214, 90, 49, 0.16)'
                            : 'rgba(214, 90, 49, 0.32)',
                    },
                    boxShadow: theme.palette.mode === 'light'
                        ? `0 0 4px ${theme.palette.primary.main}33`
                        : `0 0 6px ${theme.palette.primary.main}66`,
                },
            }),
        },
    },

    // DataGrid with futuristic styling
    MuiDataGrid: {
        styleOverrides: {
            root: ({ theme }) => ({
                border: theme.palette.mode === 'light'
                    ? `1px solid rgba(0, 0, 0, 0.15)`
                    : `1px solid rgba(255, 255, 255, 0.15)`,
                borderRadius: '8px',
                overflow: 'hidden',
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'rgba(255, 255, 255, 0.04)',
                    borderBottom: theme.palette.mode === 'light'
                        ? `2px solid rgba(0, 0, 0, 0.1)`
                        : `2px solid rgba(255, 255, 255, 0.1)`,
                },
                '& .MuiDataGrid-columnHeader': {
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                },
                '& .MuiDataGrid-cell': {
                    fontFamily: 'Inter, sans-serif',
                    borderBottom: theme.palette.mode === 'light'
                        ? `1px solid rgba(0, 0, 0, 0.1)`
                        : `1px solid rgba(255, 255, 255, 0.1)`,
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.04)'
                        : 'rgba(214, 90, 49, 0.08)',
                },
            }),
        },
    },

    // Futuristic accordion styling
    MuiAccordion: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: 'transparent',
                boxShadow: 'none',
                '&:before': {
                    display: 'none',
                },
                '&.Mui-expanded': {
                    margin: 0,
                    '&:first-of-type': {
                        marginTop: 0,
                    },
                    '&:last-of-type': {
                        marginBottom: 0,
                    },
                },
                border: theme.palette.mode === 'light'
                    ? `1px solid rgba(0, 0, 0, 0.15)`
                    : `1px solid rgba(255, 255, 255, 0.15)`,
                borderRadius: '8px',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.palette.mode === 'light'
                        ? `0 0 5px ${theme.palette.primary.main}33`
                        : `0 0 8px ${theme.palette.primary.main}66`,
                },
            }),
        },
    },

    // Accordion summary styling
    MuiAccordionSummary: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.03em',
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.02)'
                    : 'rgba(255, 255, 255, 0.02)',
                '&.Mui-expanded': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(214, 90, 49, 0.06)'
                        : 'rgba(214, 90, 49, 0.12)',
                },
            }),
            expandIconWrapper: ({ theme }) => ({
                color: theme.palette.primary.main,
            }),
        },
    },

    // Snackbar styling
    MuiSnackbar: {
        styleOverrides: {
            root: {
                '& .MuiPaper-root': {
                    backdropFilter: 'blur(10px)',
                    borderRadius: '4px',
                },
            },
        },
    },

    // Alert styling for Snackbars
    /*MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: 'Inter, sans-serif',
            }),
            standardSuccess: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(76, 175, 80, 0.9)'
                    : 'rgba(76, 175, 80, 0.2)',
                backdropFilter: 'blur(10px)',
                color: theme.palette.mode === 'light' ? '#fff' : '#4caf50',
                border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.3)'}`,
            }),
            standardError: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(211, 47, 47, 0.9)'
                    : 'rgba(211, 47, 47, 0.2)',
                backdropFilter: 'blur(10px)',
                color: theme.palette.mode === 'light' ? '#fff' : '#f44336',
                border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(211, 47, 47, 0.5)' : 'rgba(211, 47, 47, 0.3)'}`,
            }),
            standardWarning: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(255, 152, 0, 0.9)'
                    : 'rgba(255, 152, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                color: theme.palette.mode === 'light' ? '#fff' : '#ff9800',
                border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 152, 0, 0.5)' : 'rgba(255, 152, 0, 0.3)'}`,
            }),
            standardInfo: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(3, 169, 244, 0.9)'
                    : 'rgba(3, 169, 244, 0.2)',
                backdropFilter: 'blur(10px)',
                color: theme.palette.mode === 'light' ? '#fff' : '#03a9f4',
                border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(3, 169, 244, 0.5)' : 'rgba(3, 169, 244, 0.3)'}`,
            }),
        },
    },*/

    // Skeleton loading effect with futuristic styling
    MuiSkeleton: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'rgba(255, 255, 255, 0.08)',
                '&::after': {
                    background: `linear-gradient(90deg, transparent, ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)'}, transparent)`,
                },
            }),
        },
    }
};

export default matrixComponentsOverrides;