// src/themes/typography/corporateMemphisTypography.js

// Import font sources
import '@fontsource/poppins'; // A geometric sans serif with a contemporary feel, perfect for headers and text in a Memphis design
import '@fontsource/roboto-condensed'; // Offers a more structured look, complementing the Memphis style with its corporate feel
import '@fontsource/roboto-slab'; // A contemporary slab serif that adds a touch of sophistication and stability

const corporateMemphisTypography = {
    // Default font family for general text
    fontFamily: 'Poppins, sans-serif', // Default font family, balancing playfulness and professionalism
    h1: {
        fontFamily: 'Poppins, sans-serif', // Bold and engaging for primary headers
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '0.03em', // Slightly increased spacing for impact
    },
    h2: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
        letterSpacing: '0.03em',
    },
    h3: {
        fontFamily: 'Roboto Slab, serif', // Adds a touch of sophistication to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.02em',
    },
    h4: {
        fontFamily: 'Roboto Slab, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.02em',
    },
    h5: {
        fontFamily: 'Roboto Slab, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Roboto Slab, serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Roboto Condensed, sans-serif', // Ensures legibility and efficiency in body text
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased letter spacing for readability
    },
    body2: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Poppins, sans-serif', // Maintains the Memphis energy in interactive elements
        fontWeight: 600, // Bold enough to stand out without overwhelming
        fontSize: '1rem',
        textTransform: 'uppercase', // Adds emphasis to interactive elements
        letterSpacing: '0.05em', // Wider spacing for buttons for Memphis style impact
    },
    caption: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
    },
    overline: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Increased letter spacing for Memphis style
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.02em',
    },
    dataLabel: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
    },
};

export default corporateMemphisTypography;