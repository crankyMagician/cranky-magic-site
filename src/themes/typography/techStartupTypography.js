// Import font sources if needed, assuming they're used across the app
import '@fontsource/inter'; // A highly legible and versatile sans-serif font, designed specifically for computer screens
import '@fontsource/work-sans'; // A modern, geometric typeface perfect for expressive headings and UI
import '@fontsource/space-grotesk'; // A contemporary, geometric grotesque with a distinctive character for accents and calls to action

const techStartupTypography = {
    fontFamily: 'Inter, sans-serif', // Default font family, optimized for UI clarity and legibility at various sizes
    h1: {
        fontFamily: 'Work Sans, sans-serif', // Bold and modern for impactful headers
        fontWeight: 800,
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Work Sans, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Space Grotesk, sans-serif', // Adds a unique, tech-savvy edge to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h4: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '1.5rem',
    },
    h5: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '1rem',
    },
    body1: {
        fontFamily: 'Inter, sans-serif', // Maintains the clean and accessible vibe for body text
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Work Sans, sans-serif', // Ensures buttons are engaging and match the tech aesthetic
        fontWeight: 600, // Bold enough to be noticeable without being too aggressive
    },
    caption: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
    }
};

export default techStartupTypography;
