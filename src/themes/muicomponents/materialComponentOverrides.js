// src/themes/componentOverrides/materialComponentOverrides.js

const materialComponentOverrides = {
    // Button overrides following pure Material Design
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '4px',
                textTransform: 'uppercase',
                fontWeight: 500,
                padding: '8px 16px',
                minWidth: '64px',
                boxShadow: 'none',
            }),
            containedPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                },
                '&:active': {
                    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
                },
            }),
            outlinedPrimary: ({ theme }) => ({
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}04`,
                },
            }),
            textPrimary: ({ theme }) => ({
                color: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}04`,
                },
            }),
        },
    },

    // Paper with standard Material Design elevation
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: '4px',
            },
            elevation1: {
                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
            },
            elevation2: {
                boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            },
            elevation4: {
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
            },
            elevation8: {
                boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
            },
        },
    },

    // AppBar with Material Design styling
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
            },
        },
    },

    // Card with standard Material Design
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: '4px',
            },
        },
    },

    // Dialog with Material Design styling
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: '4px',
                boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
            },
        },
    },

    // TextField with Material Design styling
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                },
            }),
        },
    },

    // Chip with Material Design
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: '16px',
                height: '32px',
            },
        },
    },

    // Switch with Material Design
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
                    '& .MuiSwitch-thumb:before': {
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                            '#fff',
                        )}" d="m8.229 14.062-3.521-3.541L5.75 9.479l2.479 2.459 6.021-6L15.292 7Z"/></svg>')`,
                    },
                    '& + .MuiSwitch-track': {
                        opacity: 1,
                        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                    },
                },
            }),
            thumb: {
                backgroundColor: '#001e3c',
                width: 32,
                height: 32,
                '&:before': {
                    content: "''",
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                        '#fff',
                    )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95-1.214 1.214a5.5 5.5 0 00-.158 7.908l1.158-.956A4 4 0 016.942 4.5a4.016 4.016 0 011.158-.956L6.786 2.33a5.47 5.47 0 00-2.188 1.287zm-.882 13.97L2.5 16.372a5.5 5.5 0 007.908.158l-.956-1.158A4 4 0 014.5 13.058a4.016 4.016 0 01-.956-1.158l-1.214 1.214a5.47 5.47 0 001.287 2.188z"/></svg>')`,
                },
            },
            track: ({ theme }) => ({
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                borderRadius: 20 / 2,
            }),
        },
    },

    // Fab with Material Design
    MuiFab: {
        styleOverrides: {
            root: {
                boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                '&:hover': {
                    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
                },
            },
        },
    },

    // Tabs with Material Design
    MuiTabs: {
        styleOverrides: {
            indicator: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                height: 2,
            }),
        },
    },

    // Tab with Material Design
    MuiTab: {
        styleOverrides: {
            root: {
                textTransform: 'uppercase',
                fontWeight: 500,
                fontSize: '0.875rem',
                letterSpacing: '0.02857em',
                minHeight: 48,
            },
        },
    },

    // List items with Material Design
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                },
            }),
        },
    },

    // Menu with Material Design
    MuiMenu: {
        styleOverrides: {
            paper: {
                borderRadius: '4px',
                boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
            },
        },
    },

    // Tooltip with Material Design
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: 'rgba(97, 97, 97, 0.92)',
                color: '#fff',
                fontSize: '0.625rem',
                borderRadius: '4px',
                padding: '4px 8px',
            },
        },
    },

    // Snackbar with Material Design
    MuiSnackbar: {
        styleOverrides: {
            root: {
                '& .MuiPaper-root': {
                    borderRadius: '4px',
                    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                },
            },
        },
    },
};

export default materialComponentOverrides;