// src/themes/typography/robotoTypography.js

// Import font sources
import '@fontsource/roboto'; // Google's signature font family for all text types

const robotoTypography = {
    // Default font family for general text
    fontFamily: 'Roboto, sans-serif',
    h1: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 300,
        fontSize: '2.5rem',
        lineHeight: 1.167,
        letterSpacing: '-0.01562em',
    },
    h2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 300,
        fontSize: '2rem',
        lineHeight: 1.2,
        letterSpacing: '-0.00833em',
    },
    h3: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '1.75rem',
        lineHeight: 1.167,
        letterSpacing: '0em',
    },
    h4: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '1.5rem',
        lineHeight: 1.235,
        letterSpacing: '0.00735em',
    },
    h5: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '1.25rem',
        lineHeight: 1.334,
        letterSpacing: '0em',
    },
    h6: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
    },
    subtitle1: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
    },
    subtitle2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
    },
    body1: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
    },
    body2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
    },
    button: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
    },
    caption: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
    },
    overline: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.01em',
    },
    dataLabel: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '1.25rem',
        letterSpacing: '0.05em',
    },
};

export default robotoTypography;