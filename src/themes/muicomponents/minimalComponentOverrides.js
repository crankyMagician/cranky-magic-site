// src/themes/muicomponents/minimalComponentOverrides.js
import { alpha } from '@mui/material/styles';

const minimalComponentOverrides = {
    // Minimal button styling
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: 'none',
                borderRadius: '6px',
                fontWeight: 500,
                padding: '8px 16px',
                transition: 'all 0.2s ease',
                boxShadow: 'none',

                '&:hover': {
                    boxShadow: 'none',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
            }),

            contained: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: 'none',

                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
            }),

            outlined: ({ theme }) => ({
                borderColor: alpha(theme.palette.divider, 0.5),

                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
            }),

            text: ({ theme }) => ({
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
            }),
        },
    },

    // Minimal card styling
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.2s ease',

                '&:hover': {
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
                },
            }),
        },
    },

    // Minimal paper styling
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
            }),

            elevation1: ({ theme }) => ({
                boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
            }),

            elevation2: ({ theme }) => ({
                boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.08)}`,
            }),

            elevation3: ({ theme }) => ({
                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
            }),
        },
    },

    // Minimal text field styling
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',

                    '& fieldset': {
                        borderColor: alpha(theme.palette.divider, 0.3),
                        transition: 'all 0.2s ease',
                    },

                    '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                    },

                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '1px',
                    },
                },
            }),
        },
    },

    // Minimal switch styling
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 48,
                height: 28,
                padding: 0,
                display: 'flex',
            },

            switchBase: ({ theme }) => ({
                padding: 2,

                '&.Mui-checked': {
                    transform: 'translateX(20px)',
                    color: '#fff',

                    '& + .MuiSwitch-track': {
                        opacity: 1,
                        backgroundColor: theme.palette.primary.main,
                    },
                },
            }),

            thumb: ({ theme }) => ({
                width: 24,
                height: 24,
                borderRadius: '50%',
                transition: theme.transitions.create(['width'], {
                    duration: 200,
                }),
            }),

            track: ({ theme }) => ({
                borderRadius: 14,
                opacity: 1,
                backgroundColor: alpha(theme.palette.common.black, 0.15),
                boxSizing: 'border-box',
            }),
        },
    },

    // Minimal chip styling
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '6px',
                fontWeight: 500,
                height: 28,

                '&.MuiChip-filled': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                },
            }),
        },
    },

    // Minimal tab styling
    MuiTabs: {
        styleOverrides: {
            root: ({ theme }) => ({
                minHeight: 40,
            }),

            indicator: ({ theme }) => ({
                height: 2,
                borderRadius: '2px 2px 0 0',
                backgroundColor: theme.palette.primary.main,
            }),
        },
    },

    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: 'none',
                minHeight: 40,
                fontWeight: 500,
                color: theme.palette.text.secondary,

                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                },
            }),
        },
    },

    // Minimal dialog styling
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                borderRadius: '12px',
                boxShadow: theme.shadows[8],
            }),
        },
    },

    // Minimal accordion styling
    MuiAccordion: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',
                boxShadow: 'none',
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,

                '&:before': {
                    display: 'none',
                },

                '&.Mui-expanded': {
                    margin: '8px 0',
                },
            }),
        },
    },

    // Minimal table styling
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                padding: '12px 16px',
            }),

            head: ({ theme }) => ({
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.grey[50], 0.5),
            }),
        },
    },

    // Minimal alert styling
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: '8px',

                '&.MuiAlert-standardSuccess': {
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.dark,
                },

                '&.MuiAlert-standardError': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.dark,
                },

                '&.MuiAlert-standardWarning': {
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.dark,
                },

                '&.MuiAlert-standardInfo': {
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                },
            }),
        },
    },
};

export default minimalComponentOverrides;