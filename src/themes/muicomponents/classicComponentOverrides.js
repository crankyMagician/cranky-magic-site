// src/themes/componentOverrides/classicComponentOverrides.js

const classicComponentOverrides = {
    // Button overrides for classic styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                textTransform: 'capitalize',
                fontWeight: 400,
                padding: '8px 16px',
                border: '1px solid',
                transition: 'all 0.15s ease-in-out',
            }),
            containedPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    borderColor: theme.palette.primary.dark,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.1)',
                },
                '&:active': {
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)',
                },
            }),
            outlinedPrimary: ({ theme }) => ({
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                },
            }),
            textPrimary: ({ theme }) => ({
                color: theme.palette.primary.main,
                border: 'none',
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}08`,
                    textDecoration: 'underline',
                },
            }),
        },
    },

    // Paper with classic border styling
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                border: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
                boxShadow: theme.palette.mode === 'light'
                    ? '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
                    : '0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.48)',
            }),
            elevation1: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
            },
            elevation2: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
            },
            elevation4: {
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
            },
        },
    },

    // AppBar with classic header styling
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                borderBottom: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
            }),
        },
    },

    // Card with classic border
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                border: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
                '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
                },
            }),
        },
    },

    // Dialog with classic styling
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                borderRadius: '4px',
                border: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
            }),
        },
    },

    // TextField with classic border styling
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    '& fieldset': {
                        borderColor: theme.palette.mode === 'light' ? '#c4c4c4' : '#616161',
                        borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '1px',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '2px',
                    },
                },
            }),
        },
    },

    // Chip with classic rounded styling
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '16px',
                border: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
                fontWeight: 400,
            }),
        },
    },

    // Switch with classic toggle styling
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 58,
                height: 38,
                padding: 7,
            },
            switchBase: ({ theme }) => ({
                margin: 1,
                padding: 0,
                transform: 'translateX(6px)',
                '&.Mui-checked': {
                    color: '#fff',
                    transform: 'translateX(22px)',
                    '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                        opacity: 1,
                        border: 0,
                    },
                },
            }),
            thumb: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
                width: 32,
                height: 32,
                border: '2px solid #fff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }),
            track: ({ theme }) => ({
                borderRadius: 20 / 2,
                border: '1px solid',
                borderColor: theme.palette.mode === 'light' ? '#c4c4c4' : '#616161',
                backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#424242',
                opacity: 1,
                transition: theme.transitions.create(['background-color'], {
                    duration: 500,
                }),
            }),
        },
    },

    // Table with classic borders
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
                padding: '16px',
            }),
            head: ({ theme }) => ({
                fontWeight: 600,
                backgroundColor: theme.palette.mode === 'light'
                    ? '#f5f5f5'
                    : '#303030',
                borderBottom: theme.palette.mode === 'light'
                    ? '2px solid #e0e0e0'
                    : '2px solid #424242',
            }),
        },
    },

    // List items with classic hover
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '0px',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? '#f5f5f5'
                        : '#424242',
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                        ? `${theme.palette.primary.main}10`
                        : `${theme.palette.primary.main}20`,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                },
            }),
        },
    },

    // Tabs with classic underline
    MuiTabs: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
            }),
            indicator: ({ theme }) => ({
                height: 2,
                backgroundColor: theme.palette.primary.main,
            }),
        },
    },

    // Tab with classic styling
    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: 'capitalize',
                fontWeight: 400,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                },
                '&:hover': {
                    color: theme.palette.primary.main,
                    opacity: 0.8,
                },
            }),
        },
    },

    // Menu with classic border
    MuiMenu: {
        styleOverrides: {
            paper: ({ theme }) => ({
                borderRadius: '4px',
                border: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
            }),
        },
    },

    // Tooltip with classic styling
    MuiTooltip: {
        styleOverrides: {
            tooltip: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(97, 97, 97, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                color: theme.palette.mode === 'light' ? '#ffffff' : '#121212',
                borderRadius: '4px',
                fontSize: '0.75rem',
                padding: '8px 12px',
                border: theme.palette.mode === 'light'
                    ? '1px solid rgba(97, 97, 97, 0.8)'
                    : '1px solid rgba(255, 255, 255, 0.8)',
            }),
        },
    },

    // Alert with classic border styling
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                border: '1px solid',
                fontWeight: 400,
            }),
            standardSuccess: ({ theme }) => ({
                borderColor: theme.palette.success.main,
                backgroundColor: theme.palette.mode === 'light'
                    ? `${theme.palette.success.main}10`
                    : `${theme.palette.success.main}20`,
            }),
            standardInfo: ({ theme }) => ({
                borderColor: theme.palette.info.main,
                backgroundColor: theme.palette.mode === 'light'
                    ? `${theme.palette.info.main}10`
                    : `${theme.palette.info.main}20`,
            }),
            standardWarning: ({ theme }) => ({
                borderColor: theme.palette.warning.main,
                backgroundColor: theme.palette.mode === 'light'
                    ? `${theme.palette.warning.main}10`
                    : `${theme.palette.warning.main}20`,
            }),
            standardError: ({ theme }) => ({
                borderColor: theme.palette.error.main,
                backgroundColor: theme.palette.mode === 'light'
                    ? `${theme.palette.error.main}10`
                    : `${theme.palette.error.main}20`,
            }),
        },
    },

    // Accordion with classic borders
    MuiAccordion: {
        styleOverrides: {
            root: ({ theme }) => ({
                border: theme.palette.mode === 'light'
                    ? '1px solid #e0e0e0'
                    : '1px solid #424242',
                borderRadius: '0px',
                '&:before': {
                    display: 'none',
                },
                '&.Mui-expanded': {
                    margin: 0,
                },
            }),
        },
    },

    // Divider with classic line
    MuiDivider: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderColor: theme.palette.mode === 'light'
                    ? '#e0e0e0'
                    : '#424242',
            }),
        },
    },
};

export default classicComponentOverrides;