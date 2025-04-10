// src/themes/typography/techStartupTypography.js

// Import font sources
import '@fontsource/inter'; // A highly legible and versatile sans-serif font, designed specifically for computer screens
import '@fontsource/work-sans'; // A modern, geometric typeface perfect for expressive headings and UI
import '@fontsource/space-grotesk'; // A contemporary, geometric grotesque with a distinctive character for accents and calls to action

const techStartupTypography = {
    // Default font family for general text
    fontFamily: 'Inter, sans-serif', // Default font family, optimized for UI clarity and legibility at various sizes
    h1: {
        fontFamily: 'Work Sans, sans-serif', // Bold and modern for impactful headers
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '0.02em', // Clean, modern spacing
    },
    h2: {
        fontFamily: 'Work Sans, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
        letterSpacing: '0.02em',
    },
    h3: {
        fontFamily: 'Space Grotesk, sans-serif', // Adds a unique, tech-savvy edge to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
    },
    h4: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
    },
    h5: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Inter, sans-serif', // Maintains the clean and accessible vibe for body text
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased for readability
    },
    body2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Work Sans, sans-serif', // Ensures buttons are engaging and match the tech aesthetic
        fontWeight: 600, // Bold enough to be noticeable without being too aggressive
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard style for tech interfaces
        letterSpacing: '0.05em', // Wider spacing for buttons
    },
    caption: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
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
        fontFamily: 'JetBrains Mono, monospace', // A modern, tech-focused monospace font
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.01em',
    },
    dataLabel: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 600,
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Work Sans, sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
    },
};

export default techStartupTypography;