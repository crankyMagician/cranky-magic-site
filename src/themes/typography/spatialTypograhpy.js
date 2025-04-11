// src/themes/typography/spatialTypography.js

// Import font sources
import '@fontsource/inter'; // Modern, highly legible sans-serif font for body text
import '@fontsource/orbitron'; // A distinctly futuristic, techy display font for main headers
import '@fontsource/rajdhani'; // A geometric, modern sans-serif for subheadings

const spatialModsTypography = {
    // Default font family for general text
    fontFamily: 'Inter, sans-serif',
    h1: {
        fontFamily: 'Orbitron, sans-serif', // Futuristic font for large headers
        fontWeight: 700,
        fontSize: '3rem',
        letterSpacing: '0.05em', // Wider letter spacing for futuristic feel
        textTransform: 'uppercase', // Uppercase for impact
    },
    h2: {
        fontFamily: 'Orbitron, sans-serif', // Consistency in main header styling
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '0.04em',
    },
    h3: {
        fontFamily: 'Rajdhani, sans-serif', // Geometric font for subheadings
        fontWeight: 600,
        fontSize: '2rem',
        letterSpacing: '0.03em',
    },
    h4: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 600,
        fontSize: '1.75rem',
        letterSpacing: '0.02em',
    },
    h5: {
        fontFamily: 'Inter, sans-serif', // Use Inter to maintain clarity at smaller header sizes
        fontWeight: 500,
        fontSize: '1.5rem',
    },
    h6: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: '1.25rem',
    },
    body1: {
        fontFamily: 'Inter, sans-serif', // Default body text style
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased letter spacing for readability
    },
    body2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Rajdhani, sans-serif', // Modern and crisp for interactive elements
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard button style
        letterSpacing: '0.05em', // Wider letter spacing for buttons
    },
    caption: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    overline: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Increased letter spacing for overlines
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 500,
        fontSize: '0.9rem',
        letterSpacing: '0.03em',
    },
    dataLabel: {
        fontFamily: 'Orbitron, sans-serif',
        fontWeight: 500,
        fontSize: '0.85rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Orbitron, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.15em',
    },
};

export default spatialModsTypography;