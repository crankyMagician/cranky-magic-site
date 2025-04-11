// src/themes/typography/highContrastAccessibilityTypography.js

// Import font sources
import '@fontsource/open-sans'; // A highly legible sans-serif, suitable for both headers and body text
import '@fontsource/roboto'; // Offers good readability for detailed text sections

const highContrastAccessibilityTypography = {
    // Default font family for general text
    fontFamily: 'Open Sans, sans-serif', // Default font family, known for its legibility
    h1: {
        fontFamily: 'Open Sans, sans-serif', // Clear and legible for primary headers
        fontWeight: 800,
        fontSize: '3rem', // Larger for visibility
        letterSpacing: '0.01em', // Careful with spacing to maintain readability
        lineHeight: '1.2', // Optimized line height for readability
    },
    h2: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '0.01em',
        lineHeight: '1.25',
    },
    h3: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.01em',
        lineHeight: '1.3',
    },
    h4: {
        fontFamily: 'Roboto, sans-serif', // Adds a touch of versatility to smaller subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
        lineHeight: '1.35',
    },
    h5: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
        lineHeight: '1.4',
    },
    h6: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        lineHeight: '1.45',
    },
    body1: {
        fontFamily: 'Open Sans, sans-serif', // Default body text style
        fontWeight: 400,
        fontSize: '1rem', // Standard size for body text
        letterSpacing: '0.01em', // Careful with spacing
        lineHeight: '1.5', // Increased line height for better readability
    },
    body2: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem', // Slightly smaller for secondary text
        letterSpacing: '0.01em',
        lineHeight: '1.6',
    },
    button: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 600,
        fontSize: '1rem', // Standard for buttons to ensure legibility
        letterSpacing: '0.05em', // Slightly wider spacing for buttons
        textTransform: 'uppercase', // For clarity and emphasis
        lineHeight: '1.5',
    },
    caption: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem', // Clear, even at small sizes
        letterSpacing: '0.01em',
        lineHeight: '1.66',
    },
    overline: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.08em', // Increased spacing for emphasis
        textTransform: 'uppercase',
        lineHeight: '1.66',
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: 400,
        fontSize: '1rem', // Larger for better readability of code
        letterSpacing: '0.01em',
        lineHeight: '1.6',
    },
    dataLabel: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 700,
        fontSize: '0.9rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        lineHeight: '1.5',
    },
    digitDisplay: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '1.5rem', // Larger for clear reading of numbers
        letterSpacing: '0.05em',
        lineHeight: '1.4',
    },
};

export default highContrastAccessibilityTypography;