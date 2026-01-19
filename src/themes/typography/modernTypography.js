// src/themes/typography/modernTypography.js

// Import font sources (Roboto is used for body)
import '@fontsource/roboto'; 

const modernTypography = {
    // Default font family for general text (Body uses Roboto)
    fontFamily: 'Roboto, sans-serif',
    h1: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 800, // Bold for impact
        fontSize: '3rem',
        letterSpacing: '-0.02em', // Tighter spacing for modern look
    },
    h2: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '-0.01em',
    },
    h3: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
    },
    h4: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h5: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 600,
        fontSize: '1.5rem',
    },
    h6: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
    },
    body1: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.6,
    },
    body2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.6,
    },
    button: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 700,
        fontSize: '1rem',
        textTransform: 'none', // Modern buttons often don't uppercase
        letterSpacing: '0.02em',
    },
    caption: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    overline: {
        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
        fontWeight: 700,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.16em', // Matching HeroSection style
    },
    // Additional typographic styles
    code: {
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        fontWeight: 400,
        fontSize: '0.9rem',
    },
};

export default modernTypography;
