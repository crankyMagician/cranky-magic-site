// src/themes/typography/crankyMagicianTypography.js
export const crankyMagicianTypography = {
    // Primary font stack with good fallbacks
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

    // Display headings - using Playfair Display for magical, theatrical feel
    h1: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 700,
        fontSize: '3.5rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
    },
    h2: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 700,
        fontSize: '2.75rem',
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
    },
    h3: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 600,
        fontSize: '2.25rem',
        letterSpacing: '0em',
        lineHeight: 1.4,
    },
    h4: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 600,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
        lineHeight: 1.4,
    },
    h5: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
    },
    h6: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
    },

    // Body text - clean and readable
    body1: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em',
        lineHeight: 1.7,
    },
    body2: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
        lineHeight: 1.6,
    },

    // Interactive elements
    button: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 600,
        fontSize: '0.9375rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },

    // Supporting text
    caption: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.03em',
        lineHeight: 1.5,
    },
    overline: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 500,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        lineHeight: 2,
    },

    // Custom typography variants for special elements
    subtitle1: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 500,
        fontSize: '1.125rem',
        letterSpacing: '0.01em',
        lineHeight: 1.6,
    },
    subtitle2: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 500,
        fontSize: '0.9375rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
    },

    // Special variants for code and technical content
    code: {
        fontFamily: '"JetBrains Mono", "Consolas", "Monaco", monospace',
        fontWeight: 500,
        fontSize: '0.875rem',
        letterSpacing: '0.02em',
    },

    // Magic-themed display text
    magicDisplay: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 900,
        fontSize: '4rem',
        letterSpacing: '-0.03em',
        fontStyle: 'italic',
    },

    // Resume/portfolio specific
    resumeSection: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 700,
        fontSize: '1.125rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
    },
};

