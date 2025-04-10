// src/themes/typography/sunsetTypography.js

// Import font sources
import '@fontsource/lora'; // A well-balanced contemporary serif with roots in calligraphy. It conveys warmth and style
import '@fontsource/open-sans'; // A humanist sans-serif typeface with great legibility and warmth, perfect for body text
import '@fontsource/lobster'; // A playful, cursive script font that captures the whimsical essence of a sunset

const sunsetTypography = {
    // Default font family for general text
    fontFamily: 'Open Sans, sans-serif', // Default font family, chosen for its readability and friendly appearance
    h1: {
        fontFamily: 'Lobster, cursive', // Captures the artistic and inspirational feel of a sunset for primary headers
        fontWeight: 400, // Lobster inherently carries a bold presence, so we'll keep the weight standard
        fontSize: '2.5rem',
        letterSpacing: '0.02em', // Slight spacing adjustment for readability
    },
    h2: {
        fontFamily: 'Lobster, cursive',
        fontWeight: 400,
        fontSize: '2rem',
        letterSpacing: '0.02em',
    },
    h3: {
        fontFamily: 'Lora, serif', // Adds an elegant touch to subheadings, mirroring the serene aspect of the sunset
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
    },
    h4: {
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
    },
    h5: {
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Open Sans, sans-serif', // Maintains the inviting and warm tone throughout the body text
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased letter spacing for readability
    },
    body2: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Open Sans, sans-serif', // Ensures UI elements are clear and accessible, with a touch of warmth
        fontWeight: 600, // A bit bolder to stand out
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard button style
        letterSpacing: '0.05em', // Wider spacing for buttons
    },
    caption: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
    },
    overline: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Increased letter spacing for overlines
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Source Code Pro, monospace',
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.02em',
    },
    dataLabel: {
        fontFamily: 'Lobster, cursive',
        fontWeight: 400,
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.08em',
    },
};

export default sunsetTypography;