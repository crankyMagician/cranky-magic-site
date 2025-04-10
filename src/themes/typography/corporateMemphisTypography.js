// Import font sources if needed, assuming they're used across the app
import '@fontsource/poppins'; // A geometric sans serif with a contemporary feel, perfect for headers and text in a Memphis design
import '@fontsource/roboto-condensed'; // Offers a more structured look, complementing the Memphis style with its corporate feel
import '@fontsource/roboto-slab'; // A contemporary slab serif that adds a touch of sophistication and stability

const corporateMemphisTypography = {
    fontFamily: 'Poppins, sans-serif', // Default font family, balancing playfulness and professionalism
    h1: {
        fontFamily: 'Poppins, sans-serif', // Bold and engaging for primary headers
        fontWeight: 800,
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Roboto Slab, serif', // Adds a touch of sophistication to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h4: {
        fontFamily: 'Roboto Slab, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
    },
    h5: {
        fontFamily: 'Roboto Slab, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Roboto Slab, serif',
        fontWeight: 700,
        fontSize: '1rem',
    },
    body1: {
        fontFamily: 'Roboto Condensed, sans-serif', // Ensures legibility and efficiency in body text
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Poppins, sans-serif', // Maintains the Memphis energy in interactive elements
        fontWeight: 600, // Bold enough to stand out without overwhelming
    },
    caption: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontWeight: 400,
    }
};

export default corporateMemphisTypography;
