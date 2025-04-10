// src/themes/typography/altTypography.js

// Import font sources
import '@fontsource/roboto'; // A neutral, yet friendly Grotesque style font that's widely used
import '@fontsource/raleway'; // An elegant sans-serif typeface family intended for headings and other large size usage
import '@fontsource/merriweather'; // An attractive, free serif font that's perfect for editorial use

const altTypography = {
    // Default font family for general text
    fontFamily: 'Roboto, sans-serif',
    h1: {
        fontFamily: 'Raleway, sans-serif', // Stylish, yet readable for large headers
        fontWeight: 800, // Making it bolder to stand out
        fontSize: '2.5rem',
        letterSpacing: '0.02em', // Slight letter spacing for improved readability
    },
    h2: {
        fontFamily: 'Raleway, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
        letterSpacing: '0.02em',
    },
    h3: {
        fontFamily: 'Merriweather, serif', // A serif font for a touch of formality in subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
    },
    h4: {
        fontFamily: 'Merriweather, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
    },
    h5: {
        fontFamily: 'Merriweather, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Merriweather, serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Roboto, sans-serif', // Default body text style
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased letter spacing for readability
    },
    body2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500, // A bit bolder for button texts to stand out
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard button style
        letterSpacing: '0.05em',
    },
    caption: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
    },
    overline: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.01em',
    },
    dataLabel: {
        fontFamily: 'Raleway, sans-serif',
        fontWeight: 600,
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

export default altTypography;