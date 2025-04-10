// Import font sources if needed, assuming they're used across the app
import '@fontsource/source-sans-pro'; // A professional sans-serif font for text readability
import '@fontsource/montserrat'; // Versatile and contemporary, great for headings and emphasis
import '@fontsource/libre-baskerville'; // A classic serif font that brings a touch of elegance and seriousness

const professionalTypography = {
    fontFamily: 'Source Sans Pro, sans-serif', // Default font family, great for readability and professional documents
    h1: {
        fontFamily: 'Montserrat, sans-serif', // Strong and versatile for primary headers
        fontWeight: 800,
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Libre Baskerville, serif', // Adds an elegant and formal touch to subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h4: {
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
    },
    h5: {
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 700,
        fontSize: '1rem',
    },
    body1: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 600, // Slightly bolder to make buttons stand out without being overpowering
    },
    caption: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Source Sans Pro, sans-serif',
        fontWeight: 400,
    }
};

export default professionalTypography;
