// Import font sources if needed
import '@fontsource/roboto'; // A neutral, friendly sans-serif font for body text
import '@fontsource/raleway'; // An elegant sans-serif typeface for subheadings
import '@fontsource/merriweather'; // A serif font for a touch of formality
import '@fontsource/bubblegum-sans'; // Playful font for titles

const munchieTypography = {
    fontFamily: 'Roboto, sans-serif', // Default font family for general use
    h1: {
        fontFamily: 'Bubblegum Sans, sans-serif', // Playful font for large headers
        fontWeight: 700,
        fontSize: '3rem', // Larger size for the main title
    },
    h2: {
        fontFamily: 'Bubblegum Sans, sans-serif', // Consistency in title styling
        fontWeight: 700,
        fontSize: '2.5rem',
    },
    h3: {
        fontFamily: 'Raleway, sans-serif', // Stylish subheading
        fontWeight: 600,
        fontSize: '2rem',
    },
    h4: {
        fontFamily: 'Raleway, sans-serif', // Secondary subheading style
        fontWeight: 600,
        fontSize: '1.75rem',
    },
    h5: {
        fontFamily: 'Merriweather, serif', // A serif font for a touch of formality
        fontWeight: 500,
        fontSize: '1.5rem',
    },
    h6: {
        fontFamily: 'Merriweather, serif',
        fontWeight: 500,
        fontSize: '1.25rem',
    },
    body1: {
        fontFamily: 'Roboto, sans-serif', // Default body text style
        fontWeight: 400,
        fontSize: '1rem',
    },
    body2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
    },
    button: {
        fontFamily: 'Raleway, sans-serif', // Elegant and modern for buttons
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'uppercase', // Standard button style
    },
    caption: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    overline: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
    },
};

export default munchieTypography;
