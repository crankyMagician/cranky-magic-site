// src/themes/typography/lightTypography.js

// Import font sources
import '@fontsource/kanit'; // A Thai and Latin text typeface with loopless terminals that comes in 18 styles
import '@fontsource/assistant'; // A modern sans-serif typeface characterized by its clarity and open forms
import '@fontsource/sintony'; // A versatile sans-serif with a neutral appearance, ideal for clear reading

const lightTypography = {
    // Default font family for general text
    fontFamily: 'Sintony, sans-serif', // Default font family for body text
    h1: {
        fontFamily: 'Kanit, sans-serif', // Bold and modern for primary headers
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '0.02em', // Slightly wider letter spacing for impact
    },
    h2: {
        fontFamily: 'Kanit, sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.02em',
    },
    h3: {
        fontFamily: 'Assistant, sans-serif', // Clean and approachable for subheadings
        fontWeight: 400,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
    },
    h4: {
        fontFamily: 'Assistant, sans-serif',
        fontWeight: 400,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
    },
    h5: {
        fontFamily: 'Assistant, sans-serif',
        fontWeight: 400,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Assistant, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Sintony, sans-serif', // Default body text style
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased letter spacing for readability
    },
    body2: {
        fontFamily: 'Sintony, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Sintony, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard button style
        letterSpacing: '0.05em', // Wider spacing for buttons
    },
    caption: {
        fontFamily: 'Sintony, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
    },
    overline: {
        fontFamily: 'Sintony, sans-serif',
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
        fontFamily: 'Kanit, sans-serif',
        fontWeight: 500,
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Kanit, sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
    },
};

export default lightTypography;