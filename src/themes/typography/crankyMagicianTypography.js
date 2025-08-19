// src/themes/typography/crankyMagicianTypography.js

// Import font sources
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/500.css';
import '@fontsource/orbitron/600.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/800.css';
import '@fontsource/orbitron/900.css';
import '@fontsource/fira-code/300.css';
import '@fontsource/fira-code/400.css';
import '@fontsource/fira-code/500.css';
import '@fontsource/fira-code/600.css';
import '@fontsource/fira-code/700.css';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/cinzel/800.css';
import '@fontsource/cinzel/900.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/900.css';

/**
 * Cranky Magician Typography System
 * Magical and technical fonts with animated effects
 * Perfect for mystical wizard-themed interfaces
 */
const crankyMagicianTypography = {
    // Default font family for general text
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    h1: {
        fontFamily: 'Orbitron, "Space Mono", monospace', // Mystical tech headers
        fontWeight: 900,
        fontSize: '3.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
        '@media (max-width:900px)': {
            fontSize: '2.75rem',
        },
        '@media (max-width:600px)': {
            fontSize: '2.25rem',
        },
    },

    h2: {
        fontFamily: 'Orbitron, "Space Mono", monospace',
        fontWeight: 800,
        fontSize: '2.75rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        '@media (max-width:900px)': {
            fontSize: '2.25rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.875rem',
        },
    },

    h3: {
        fontFamily: 'Orbitron, "Space Mono", monospace',
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.35,
        letterSpacing: '0em',
        '@media (max-width:900px)': {
            fontSize: '1.875rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.5rem',
        },
    },

    h4: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.4,
        letterSpacing: '0.01em',
        '@media (max-width:900px)': {
            fontSize: '1.5rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.25rem',
        },
    },

    h5: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.45,
        letterSpacing: '0.01em',
        '@media (max-width:900px)': {
            fontSize: '1.25rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.125rem',
        },
    },

    h6: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
        '@media (max-width:900px)': {
            fontSize: '1.125rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1rem',
        },
    },

    subtitle1: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '1.125rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
    },

    subtitle2: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
    },

    body1: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.00938em',
    },

    body2: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '0.01071em',
    },

    button: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 600,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
    },

    caption: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
    },

    overline: {
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
    },

    // Custom typography variants for magical effects
    magical: {
        fontFamily: 'Cinzel, "Playfair Display", Georgia, serif', // Elegant magical script
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.5,
        letterSpacing: '0.05em',
        fontStyle: 'italic',
    },

    code: {
        fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Consolas, monospace',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0em',
    },

    glitch: {
        fontFamily: 'Orbitron, "Space Mono", monospace',
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.2,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    },

    // Data display typography for magical meters and stats
    dataLabel: {
        fontFamily: 'Orbitron, "Space Mono", monospace',
        fontWeight: 600,
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },

    digitDisplay: {
        fontFamily: 'Orbitron, "Space Mono", monospace',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
    },

    // Spell incantation text
    incantation: {
        fontFamily: 'Cinzel, "Playfair Display", Georgia, serif',
        fontWeight: 500,
        fontSize: '1.1rem',
        lineHeight: 1.6,
        letterSpacing: '0.03em',
        fontStyle: 'italic',
    },

    // Mystical runes or symbols
    runic: {
        fontFamily: 'Orbitron, "Space Mono", monospace',
        fontWeight: 800,
        fontSize: '1.5rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
    },
};

export { crankyMagicianTypography };
export default crankyMagicianTypography;