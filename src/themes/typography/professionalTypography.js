// src/themes/typography/professionalTypography.js

// Import font sources
import '@fontsource/source-sans-pro'; // A professional sans-serif font for text readability
import '@fontsource/montserrat'; // Versatile and contemporary, great for headings and emphasis
import '@fontsource/libre-baskerville'; // A classic serif font that brings a touch of elegance and seriousness

const professionalTypography = {
    // Default font family for general text
    fontFamily: 'Source Sans Pro, sans-serif', // Default font family, great for readability and professional documents
    h1: {
        fontFamily: 'Montserrat, sans-serif', // Strong and versatile for primary headers
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '0.02em', // Slightly wider for impact but maintaining professionalism
    },
    h2: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
        letterSpacing: '0.02em',
    },
    h3: {
        fontFamily: 'Libre Baskerville, serif', // Adds an elegant and formal touch to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
    },
    h4: {
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
    },
    h5: {
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
    },
    h6: {
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.01em',
    },
    body1: {
        fontFamily: 'Source Sans Pro, sans-serif', // Default body text style
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.01em', // Slightly increased letter spacing for readability
    },
    body2: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
    },
    button: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 600, // Slightly bolder to make buttons stand out without being overpowering
        fontSize: '1rem',
        textTransform: 'uppercase', // Professional button style
        letterSpacing: '0.05em', // Wider spacing for buttons
    },
    caption: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.01em',
    },
    overline: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Increased letter spacing for overlines
    },
    // Additional typographic styles for special use cases
    code: {
        fontFamily: 'Source Code Pro, monospace', // A matching font for code snippets
        fontWeight: 400,
        fontSize: '0.9rem',
        letterSpacing: '0.02em',
    },
    dataLabel: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    digitDisplay: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '0.05em',
    },
};

export default professionalTypography;