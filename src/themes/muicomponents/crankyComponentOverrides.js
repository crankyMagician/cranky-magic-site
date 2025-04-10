// src/themes/muicomponents/crankyComponentOverrides.js

const crankyComponentOverrides = {
    // Button overrides for futuristic styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                textTransform: 'uppercase',
                padding: '10px 24px',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                fontFamily: theme.typography.button.fontFamily,
                fontWeight: theme.typography.button.fontWeight,
                letterSpacing: theme.typography.button.letterSpacing,
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
                    background: `linear-gradient(135deg, transparent 40%, ${theme.palette.primary.main}80)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    opacity: 0.7,
                },
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.custom?.glowEffect || `0 0 10px ${theme.palette.primary.main}80`,
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
                background: `${theme.palette.primary.main}0D`, // Using alpha for light background
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}1A`, // More alpha for hover state
                    borderColor: theme.palette.primary.main,
                },
            }),
            textPrimary: ({ theme }) => ({
                color: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}0D`, // Light background on hover
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
                    : `1px solid ${theme.palette.primary.main}1A`,
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
                    ? `1px solid ${theme.palette.primary.main}1A`
                    : `1px solid ${theme.palette.primary.main}33`,
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
                fontFamily: theme.typography.h1.fontFamily,
                fontWeight: theme.typography.h1.fontWeight,
                letterSpacing: theme.typography.h1.letterSpacing,
                color: theme.palette.text.primary,
                textShadow: theme.palette.mode === 'light'
                    ? `0 0 8px ${theme.palette.primary.main}33`
                    : `0 0 8px ${theme.palette.primary.main}4D`,
                position: 'relative',
            }),
            h2: ({ theme }) => ({
                fontFamily: theme.typography.h2.fontFamily,
                fontWeight: theme.typography.h2.fontWeight,
                letterSpacing: theme.typography.h2.letterSpacing,
                color: theme.palette.text.primary,
                textShadow: theme.palette.mode === 'light'
                    ? `0 0 6px ${theme.palette.primary.main}33`
                    : `0 0 6px ${theme.palette.primary.main}4D`,
            }),
            h3: ({ theme }) => ({
                fontFamily: theme.typography.h3.fontFamily,
                fontWeight: theme.typography.h3.fontWeight,
                letterSpacing: theme.typography.h3.letterSpacing,
                color: theme.palette.text.primary,
                position: 'relative',
            }),
            h4: ({ theme }) => ({
                fontFamily: theme.typography.h4.fontFamily,
                fontWeight: theme.typography.h4.fontWeight,
                letterSpacing: theme.typography.h4.letterSpacing,
                color: theme.palette.text.primary,
            }),
            h5: ({ theme }) => ({
                fontFamily: theme.typography.h5.fontFamily,
                fontWeight: theme.typography.h5.fontWeight,
                color: theme.palette.text.primary,
            }),
            h6: ({ theme }) => ({
                fontFamily: theme.typography.h6.fontFamily,
                fontWeight: theme.typography.h6.fontWeight,
                color: theme.palette.text.primary,
            }),
            body1: ({ theme }) => ({
                fontFamily: theme.typography.body1.fontFamily,
                fontWeight: theme.typography.body1.fontWeight,
                letterSpacing: theme.typography.body1.letterSpacing,
                color: theme.palette.text.primary,
            }),
            body2: ({ theme }) => ({
                fontFamily: theme.typography.body2.fontFamily,
                fontWeight: theme.typography.body2.fontWeight,
                fontSize: theme.typography.body2.fontSize,
                letterSpacing: theme.typography.body2.letterSpacing,
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
                    : `1px solid ${theme.palette.primary.main}33`,
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
                    fontFamily: theme.typography.body1.fontFamily,
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
                    fontFamily: theme.typography.body1.fontFamily,
                },
                '& .MuiInputBase-input': {
                    fontFamily: theme.typography.body1.fontFamily,
                    letterSpacing: theme.typography.body1.letterSpacing,
                },
            }),
        },
    },

    // Chip component for tag/label elements
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontFamily: theme.typography.button.fontFamily,
                letterSpacing: theme.typography.button.letterSpacing,
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
                    background: `linear-gradient(135deg, transparent 80%, ${theme.palette.primary.main}80 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    opacity: 0.5,
                },
            }),
            colorPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? `${theme.palette.primary.main}22`
                    : `${theme.palette.primary.main}33`,
                color: theme.palette.mode === 'light'
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light,
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}33`
                        : `${theme.palette.primary.main}44`,
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
                fontFamily: theme.typography.body2.fontFamily,
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
                fontFamily: theme.typography.body1.fontFamily,
                borderBottom: theme.palette.mode === 'light'
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
                        ? `${theme.palette.primary.main}0A`
                        : `${theme.palette.primary.main}14`,
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}14`
                        : `${theme.palette.primary.main}29`,
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? `${theme.palette.primary.main}1F`
                            : `${theme.palette.primary.main}3D`,
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
                        ? `${theme.palette.primary.main}0A`
                        : `${theme.palette.primary.main}14`,
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}14`
                        : `${theme.palette.primary.main}29`,
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
                            ? `${theme.palette.primary.main}1F`
                            : `${theme.palette.primary.main}3D`,
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
                fontFamily: theme.typography.h3.fontFamily,
                fontSize: '1.5rem',
                fontWeight: theme.typography.h3.fontWeight,
                letterSpacing: theme.typography.h3.letterSpacing,
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
                    ? `${theme.palette.primary.main}26`
                    : `${theme.palette.primary.main}33`,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `linear-gradient(90deg, transparent, ${theme.palette.custom?.digitalPulse || `${theme.palette.primary.main}B3`}, transparent)`,
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
                fontFamily: theme.typography.button.fontFamily,
                textTransform: 'uppercase',
                fontWeight: theme.typography.button.fontWeight,
                letterSpacing: theme.typography.button.letterSpacing,
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
                fontFamily: theme.typography.body1.fontFamily,
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
                fontFamily: theme.typography.button.fontFamily,
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
                fontFamily: theme.typography.button.fontFamily,
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
                    : `1px solid ${theme.palette.primary.main}33`,
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
                fontFamily: theme.typography.body1.fontFamily,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}14`
                        : `${theme.palette.primary.main}29`,
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}1F`
                        : `${theme.palette.primary.main}3D`,
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? `${theme.palette.primary.main}29`
                            : `${theme.palette.primary.main}52`,
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
                    : `1px solid ${theme.palette.primary.main}33`,
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
                    : `1px solid ${theme.palette.primary.main}33`,
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
                fontFamily: theme.typography.body1.fontFamily,
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
                fontFamily: theme.typography.body1.fontFamily,
                letterSpacing: theme.typography.body1.letterSpacing,
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
                fontFamily: theme.typography.body1.fontFamily,
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
                fontFamily: theme.typography.body1.fontFamily,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}1F`
                        : `${theme.palette.primary.main}3D`,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? `${theme.palette.primary.main}29`
                            : `${theme.palette.primary.main}52`,
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
                    fontFamily: theme.typography.button.fontFamily,
                    fontWeight: 600,
                    letterSpacing: theme.typography.button.letterSpacing,
                },
                '& .MuiDataGrid-cell': {
                    fontFamily: theme.typography.body1.fontFamily,
                    borderBottom: theme.palette.mode === 'light'
                        ? `1px solid rgba(0, 0, 0, 0.1)`
                        : `1px solid rgba(255, 255, 255, 0.1)`,
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}0A`
                        : `${theme.palette.primary.main}14`,
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
                fontFamily: theme.typography.h6.fontFamily,
                fontWeight: 600,
                letterSpacing: '0.03em',
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.02)'
                    : 'rgba(255, 255, 255, 0.02)',
                '&.Mui-expanded': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}0A`
                        : `${theme.palette.primary.main}14`,
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

export default crankyComponentOverrides;