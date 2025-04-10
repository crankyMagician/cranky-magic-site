// Import font sources if needed, assuming they're used across the app
import '@fontsource/nunito'; // A well-balanced sans serif typeface superfamily, with 2 versions: The project began with Nunito, created by Vernon Adams as a rounded terminal sans serif for display typography.
import '@fontsource/fira-sans'; // Designed for Mozilla, Fira Sans is a sans-serif typeface designed for clarity and readability on mobile devices and screens.
import '@fontsource/bitter'; // A contemporary serif typeface for text, designed to be readable on digital devices.

const mintTypography = {
    fontFamily: 'Nunito, sans-serif', // Default font family, offering a friendly and welcoming vibe
    h1: {
        fontFamily: 'Fira Sans, sans-serif', // Clean and modern for impactful headers
        fontWeight: 800,
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Bitter, serif', // Adds depth and a modern twist to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h4: {
        fontFamily: 'Bitter, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
    },
    h5: {
        fontFamily: 'Bitter, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Bitter, serif',
        fontWeight: 700,
        fontSize: '1rem',
    },
    body1: {
        fontFamily: 'Nunito, sans-serif', // Ensures readability and maintains a friendly tone throughout the text
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Fira Sans, sans-serif', // Keeps the UI elements crisp and clear
        fontWeight: 600, // Bold enough to be immediately noticeable
    },
    caption: {
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 400,
    }
};

export default mintTypography;
