// Import font sources if needed, assuming they're used across the app
import '@fontsource/righteous'; // A geometric sans-serif with a retro feel, perfect for capturing the neon sign look.
import '@fontsource/rajdhani'; // A modern, square sans serif that echoes the structural look of neon signage.
import '@fontsource/playfair-display'; // An elegant serif that adds a contrasting, classic touch, reminiscent of vintage advertising.

const retroNeonTypography = {
    fontFamily: 'Rajdhani, sans-serif', // Default font family, reflecting the geometric clarity of neon signs
    h1: {
        fontFamily: 'Righteous, cursive', // Emulates the bold and striking appearance of neon lights for primary headers
        fontWeight: 400, // Righteous carries a bold look inherently
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Righteous, cursive',
        fontWeight: 400,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Playfair Display, serif', // Adds a touch of vintage sophistication to subheadings
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
        fontFamily: 'Rajdhani, sans-serif', // Keeps the body text in line with the theme while ensuring readability
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Rajdhani, sans-serif', // Maintains the structural and bold feel of neon signs in interactive elements
        fontWeight: 600, // A bit bolder to make buttons pop
    },
    caption: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 400,
    }
};

export default retroNeonTypography;
