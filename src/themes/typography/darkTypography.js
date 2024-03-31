// Import font sources if needed, assuming they're used across the app
import '@fontsource/lato'; // A sans-serif typeface family that is serious but friendly
import '@fontsource/oswald'; // A reworking of the classic style historically represented by the 'Alternate Gothic' sans serif typefaces
import '@fontsource/playfair-display'; // A high-contrast serif typeface with a distinctive style suitable for large display titles

const DarkTypography = {
    fontFamily: 'Lato, sans-serif', // Default font family for body text
    h1: {
        fontFamily: 'Oswald, sans-serif', // Eye-catching for primary headers
        fontWeight: 700,
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Playfair Display, serif', // Adds a touch of elegance to secondary headers
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h4: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
    },
    h5: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1rem',
    },
    body1: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 500, // A bit bolder to make buttons more prominent
    },
    caption: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
    }
};

export default DarkTypography;
