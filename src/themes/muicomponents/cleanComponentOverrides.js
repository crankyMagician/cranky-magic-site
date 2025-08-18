// src/themes/componentOverrides/cleanComponentOverrides.js

const cleanComponentOverrides = {
    // Button overrides for clean styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                textTransform: 'none',
                padding: '10px 24px',
                fontWeight: 500,
                transition: 'all 0.2s ease-in-out',
                boxShadow: 'none',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }),
            containedPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                },
            }),
            outlinedPrimary: ({ theme }) => ({
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}08`,
                    borderColor: theme.palette.primary.main,
                },
            }),
        },
    },

    // Paper component for clean card styling
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '12px',
                boxShadow: theme.palette.mode === 'light'
                    ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                    : '0 2px 8px rgba(0, 0, 0, 0.16)',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(0, 0, 0, 0.06)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
            }),
            elevation1: {
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
            },
            elevation2: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            },
            elevation4: {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)',
            },
        },
    },

    // AppBar with clean design
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                boxShadow: 'none',
                borderBottom: theme.palette.mode === 'light'
                    ? '1px solid rgba(0, 0, 0, 0.08)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: theme.palette.background.default,
            }),
        },
    },

    // Card overrides
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'light'
                        ? '0 8px 24px rgba(0, 0, 0, 0.12)'
                        : '0 8px 24px rgba(0, 0, 0, 0.24)',
                },
            }),
        },
    },

    // Dialog overrides
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                borderRadius: '16px',
                boxShadow: theme.palette.mode === 'light'
                    ? '0 16px 48px rgba(0, 0, 0, 0.16)'
                    : '0 16px 48px rgba(0, 0, 0, 0.32)',
            }),
        },
    },

    // TextField overrides
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                        borderColor: theme.palette.mode === 'light'
                            ? 'rgba(0, 0, 0, 0.12)'
                            : 'rgba(255, 255, 255, 0.12)',
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '2px',
                    },
                },
            }),
        },
    },

    // Chip component
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                fontWeight: 500,
            }),
        },
    },

    // Switch component
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 42,
                height: 26,
                padding: 0,
            },
            switchBase: ({ theme }) => ({
                padding: 1,
                '&.Mui-checked': {
                    transform: 'translateX(16px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                        opacity: 1,
                        border: 0,
                    },
                },
            }),
            thumb: {
                width: 24,
                height: 24,
            },
            track: ({ theme }) => ({
                borderRadius: 26 / 2,
                backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
                opacity: 1,
                transition: theme.transitions.create(['background-color'], {
                    duration: 500,
                }),
            }),
        },
    },

    // Table styling
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: theme.palette.mode === 'light'
                    ? '1px solid rgba(224, 224, 224, 0.6)'
                    : '1px solid rgba(81, 81, 81, 0.6)',
            }),
            head: ({ theme }) => ({
                fontWeight: 600,
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.02)'
                    : 'rgba(255, 255, 255, 0.02)',
            }),
        },
    },

    // List items
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                margin: '2px 0',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'rgba(255, 255, 255, 0.04)',
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}12`
                        : `${theme.palette.primary.main}20`,
                },
            }),
        },
    },

    // Tabs
    MuiTabs: {
        styleOverrides: {
            indicator: ({ theme }) => ({
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.palette.primary.main,
            }),
        },
    },

    // Tab
    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: 'none',
                fontWeight: 500,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                },
            }),
        },
    },

    // Tooltip
    MuiTooltip: {
        styleOverrides: {
            tooltip: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(97, 97, 97, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                color: theme.palette.mode === 'light' ? '#ffffff' : '#121212',
                borderRadius: '8px',
                fontSize: '0.75rem',
                padding: '8px 12px',
            }),
        },
    },

    // Alert
    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: '8px',
                border: '1px solid',
            },
            standardSuccess: ({ theme }) => ({
                borderColor: theme.palette.success.main,
                backgroundColor: `${theme.palette.success.main}08`,
            }),
            standardInfo: ({ theme }) => ({
                borderColor: theme.palette.info.main,
                backgroundColor: `${theme.palette.info.main}08`,
            }),
            standardWarning: ({ theme }) => ({
                borderColor: theme.palette.warning.main,
                backgroundColor: `${theme.palette.warning.main}08`,
            }),
            standardError: ({ theme }) => ({
                borderColor: theme.palette.error.main,
                backgroundColor: `${theme.palette.error.main}08`,
            }),
        },
    },

    // Skeleton
    MuiSkeleton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
            }),
        },
    },
};

export default cleanComponentOverrides;