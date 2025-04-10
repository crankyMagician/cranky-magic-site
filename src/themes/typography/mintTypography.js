// src/themes/typography/mintTypography.js

// Import font sources
import '@fontsource/nunito'; // A well-balanced sans serif typeface superfamily with 2 versions
import '@fontsource/fira-sans'; // Designed for Mozilla, a sans-serif typeface for clarity and readability on mobile devices
import '@fontsource/bitter'; // A contemporary serif typeface for text, designed to be readable on digital devices

const mintTypography = {
    // Default font family for general text
    fontFamily: 'Nunito, sans-serif', // Default font family, offering a friendly and welcoming vibe
    h1: {
        fontFamily: 'Fira Sans, sans-serif', // Clean and modern for impactful headers
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '0.02em', // Slightly wider for impact
    },
    h2: {
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
        letterSpacing: '0.02em',
    },
    h3: {
        fontFamily: 'Bitter, serif', // Adds depth and a modern twist to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
    },
    h4: {
        fontFamily: 'Bitter, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
    },
    h5: {
        fontFamily: 'Bitter, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Bitter, serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Nunito, sans-serif', // Ensures readability and maintains a friendly tone throughout the text
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased letter spacing for readability
    },
    body2: {
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Fira Sans, sans-serif', // Keeps the UI elements crisp and clear
        fontWeight: 600, // Bold enough to be immediately noticeable
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard button style
        letterSpacing: '0.05em', // Wider spacing for buttons
    },
    caption: {
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
    },
    overline: {
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Increased letter spacing for overlines
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Fira Mono, monospace', // A matching mono font for the Fira family
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.02em',
    },
    dataLabel: {
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: 600,
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
    },
};

export default mintTypography;