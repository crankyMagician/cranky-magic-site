// src/themes/typography/retroNeonTypography.js

// Import font sources
import '@fontsource/righteous'; // A geometric sans-serif with a retro feel, perfect for capturing the neon sign look
import '@fontsource/rajdhani'; // A modern, square sans serif that echoes the structural look of neon signage
import '@fontsource/playfair-display'; // An elegant serif that adds a contrasting, classic touch, reminiscent of vintage advertising

const retroNeonTypography = {
    // Default font family for general text
    fontFamily: 'Rajdhani, sans-serif', // Default font family, reflecting the geometric clarity of neon signs
    h1: {
        fontFamily: 'Righteous, cursive', // Emulates the bold and striking appearance of neon lights for primary headers
        fontWeight: 400, // Righteous carries a bold look inherently
        fontSize: '2.5rem',
        letterSpacing: '0.05em', // Wider spacing for neon-inspired impact
    },
    h2: {
        fontFamily: 'Righteous, cursive',
        fontWeight: 400,
        fontSize: '2rem',
        letterSpacing: '0.05em',
    },
    h3: {
        fontFamily: 'Playfair Display, serif', // Adds a touch of vintage sophistication to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.02em',
    },
    h4: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.02em',
    },
    h5: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.02em',
    },
    h6: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.02em',
    },
    body1: {
        fontFamily: 'Rajdhani, sans-serif', // Keeps the body text in line with the theme while ensuring readability
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.02em', // Slightly increased letter spacing for the retro feel
    },
    body2: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.02em',
    },
    button: {
        fontFamily: 'Rajdhani, sans-serif', // Maintains the structural and bold feel of neon signs in interactive elements
        fontWeight: 600, // A bit bolder to make buttons pop
        fontSize: '1rem',
        textTransform: 'uppercase', // Uppercase for retro signage feel
        letterSpacing: '0.1em', // Extra wide spacing for neon sign effect
    },
    caption: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.02em',
    },
    overline: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em', // Extra wide spacing for neon effect
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Space Mono, monospace', // A retro-futuristic monospace font
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.05em',
    },
    dataLabel: {
        fontFamily: 'Righteous, cursive',
        fontWeight: 400,
        fontSize: '0.85rem',
        letterSpacing: '0.15em', // Extra wide spacing for neon sign effect
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.2em', // Very wide spacing for digital readout effect
    },
};

export default retroNeonTypography;