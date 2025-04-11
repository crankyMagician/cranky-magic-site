// src/themes/typography/darkTypography.js

// Import font sources
import '@fontsource/lato'; // A sans-serif typeface family that is serious but friendly
import '@fontsource/oswald'; // A reworking of the classic style historically represented by the 'Alternate Gothic' sans serif typefaces
import '@fontsource/playfair-display'; // A high-contrast serif typeface with a distinctive style suitable for large display titles

const darkTypography = {
    // Default font family for general text
    fontFamily: 'Lato, sans-serif', // Default font family for body text
    h1: {
        fontFamily: 'Oswald, sans-serif', // Eye-catching for primary headers
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '0.03em', // Slightly wider spacing for impact
    },
    h2: {
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.03em',
    },
    h3: {
        fontFamily: 'Playfair Display, serif', // Adds a touch of elegance to secondary headers
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
    },
    h4: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
    },
    h5: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Lato, sans-serif', // Default body text style
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased for readability
    },
    body2: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 500, // A bit bolder to make buttons more prominent
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard button style
        letterSpacing: '0.05em', // Wider spacing for buttons
    },
    caption: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
    },
    overline: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Increased letter spacing for overlines
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Consolas, monospace',
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.01em',
    },
    dataLabel: {
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 500,
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
    },
};

export default darkTypography;