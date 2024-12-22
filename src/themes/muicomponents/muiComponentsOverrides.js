// muiComponentsOverrides.js
import { baseColors } from "../colors";

const componentsOverrides = {
    // Button overrides
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 5,
                textTransform: 'none',
                padding: '10px 20px',
            },
            containedPrimary: {
                backgroundColor: baseColors.blue.dark,
                '&:hover': {
                    backgroundColor: baseColors.blue.base,
                },
            },
        },
    },

    // Typography overrides
    MuiTypography: {
        styleOverrides: {
            h1: {
                fontFamily: 'Bubblegum Sans, sans-serif',
                fontWeight: 700,
                fontSize: '3rem',
                color: baseColors.jadeGreen.dark,
            },
            h2: {
                fontFamily: 'Bubblegum Sans, sans-serif',
                fontWeight: 700,
                fontSize: '2.5rem',
                color: baseColors.jadeGreen.dark,
            },
            h3: {
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 600,
                fontSize: '2rem',
                color: baseColors.softTeal.dark,
            },
            h4: {
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 600,
                fontSize: '1.75rem',
                color: baseColors.softTeal.base,
            },
            h5: {
                fontFamily: 'Merriweather, serif',
                fontWeight: 500,
                fontSize: '1.5rem',
                color: baseColors.jadeGreen.light,
            },
            h6: {
                fontFamily: 'Bubblegum Sans, sans-serif',
                fontWeight: 500,
                fontSize: '1.25rem',
                color: baseColors.greenishBlue.dark,
            },
            body1: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '1rem',
                color: baseColors.jadeGreen.base,
            },
            body2: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '0.875rem',
                color: baseColors.jadeGreen.dark,
            },
            button: {
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'uppercase',
            },
            caption: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '0.75rem',
            },
            overline: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
            },
        },
    },

    // Paper background override for a consistent look
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundColor: baseColors.mintCream.base,
            },
        },
    },

    // ListItemText overrides for primary & secondary text
    MuiListItemText: {
        styleOverrides: {
            primary: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '1rem',
                color: baseColors.jadeGreen.dark,
            },
            secondary: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '0.875rem',
                color: baseColors.softTeal.dark,
            },
        },
    },

    // DialogTitle overrides for a consistent header style
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontFamily: 'Merriweather, serif',
                fontWeight: 600,
                fontSize: '1.5rem',
                color: baseColors.greenishBlue.dark,
                padding: '16px',
            },
        },
    },

    // DialogContentText overrides for body text in dialogs
    MuiDialogContentText: {
        styleOverrides: {
            root: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '1rem',
                color: baseColors.jadeGreen.base,
            },
        },
    },

    // Link overrides for theme-based link styling
    MuiLink: {
        styleOverrides: {
            root: {
                color: baseColors.greenishBlue.dark,
                textDecoration: 'none',
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 500,
                '&:hover': {
                    textDecoration: 'underline',
                    color: baseColors.greenishBlue.base,
                },
            },
        },
    },

    // Chip overrides for pill-like components
    MuiChip: {
        styleOverrides: {
            root: {
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                color: baseColors.white,
                backgroundColor: baseColors.greenishBlue.dark,
                '& .MuiChip-label': {
                    fontSize: '0.875rem',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                },
            },
            outlined: {
                borderColor: baseColors.greenishBlue.dark,
                color: baseColors.greenishBlue.dark,
            },
        },
    },

    // AppBar overrides for consistent header
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: baseColors.jadeGreen.dark,
                color: baseColors.white,
            },
        },
    },

    // TextField overrides to unify input styling
    MuiTextField: {
        styleOverrides: {
            root: {
                fontFamily: 'Roboto, sans-serif',
            },
        },
    },
};

export default componentsOverrides;
