// example/themes/typography/typographyTemplate.js

/**
 * Typography Template
 * Use this as a starting point to define a custom typography system
 * compatible with your component library or design system.
 */

const typographyTemplate = {
    // Global font family
    fontFamily: 'YourDefaultFont, sans-serif',

    h1: {
        fontFamily: 'YourHeadingFont, sans-serif',
        fontWeight: 700,
        fontSize: '3rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    h2: {
        fontFamily: 'YourHeadingFont, sans-serif',
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '0.04em',
    },
    h3: {
        fontFamily: 'YourSubheadingFont, sans-serif',
        fontWeight: 600,
        fontSize: '2rem',
        letterSpacing: '0.03em',
    },
    h4: {
        fontFamily: 'YourSubheadingFont, sans-serif',
        fontWeight: 600,
        fontSize: '1.75rem',
        letterSpacing: '0.02em',
    },
    h5: {
        fontFamily: 'YourDefaultFont, sans-serif',
        fontWeight: 500,
        fontSize: '1.5rem',
    },
    h6: {
        fontFamily: 'YourDefaultFont, sans-serif',
        fontWeight: 500,
        fontSize: '1.25rem',
    },
    body1: {
        fontFamily: 'YourDefaultFont, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body2: {
        fontFamily: 'YourDefaultFont, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'YourActionFont, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    caption: {
        fontFamily: 'YourDefaultFont, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    overline: {
        fontFamily: 'YourDefaultFont, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },

    // Additional styles for special elements
    code: {
        fontFamily: 'YourMonoFont, monospace',
        fontWeight: 500,
        fontSize: '0.9rem',
        letterSpacing: '0.03em',
    },
    dataLabel: {
        fontFamily: 'YourTechFont, sans-serif',
        fontWeight: 500,
        fontSize: '0.85rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'YourTechFont, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.15em',
    },
};

export default typographyTemplate;
