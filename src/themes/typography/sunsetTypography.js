// Import font sources if needed, assuming they're used across the app
import '@fontsource/lora'; // A well-balanced contemporary serif with roots in calligraphy. It conveys warmth and style.
import '@fontsource/open-sans'; // A humanist sans-serif typeface with great legibility and warmth, perfect for body text.
import '@fontsource/lobster'; // A playful, cursive script font that captures the whimsical essence of a sunset.

const sunsetTypography = {
    fontFamily: 'Open Sans, sans-serif', // Default font family, chosen for its readability and friendly appearance
    h1: {
        fontFamily: 'Lobster, cursive', // Captures the artistic and inspirational feel of a sunset for primary headers
        fontWeight: 400, // Lobster inherently carries a bold presence, so we'll keep the weight standard
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Lobster, cursive',
        fontWeight: 400,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Lora, serif', // Adds an elegant touch to subheadings, mirroring the serene aspect of the sunset
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h4: {
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
    },
    h5: {
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        fontSize: '1rem',
    },
    body1: {
        fontFamily: 'Open Sans, sans-serif', // Maintains the inviting and warm tone throughout the body text
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Open Sans, sans-serif', // Ensures UI elements are clear and accessible, with a touch of warmth
        fontWeight: 600, // A bit bolder to stand out
    },
    caption: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
    }
};

export default sunsetTypography;
