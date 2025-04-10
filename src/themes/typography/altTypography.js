// Import font sources if needed, assuming they're used across the app
import '@fontsource/roboto'; // A neutral, yet friendly Grotesque style font that's widely used
import '@fontsource/raleway'; // An elegant sans-serif typeface family intended for headings and other large size usage
import '@fontsource/merriweather'; // An attractive, free serif font that's perfect for editorial use

const altTypography = {
    fontFamily: 'Roboto, sans-serif', // Default font family
    h1: {
        fontFamily: 'Raleway, sans-serif', // Stylish, yet readable for large headers
        fontWeight: 800, // Making it bolder to stand out
        fontSize: '2.5rem',
    },
    h2: {
        fontFamily: 'Raleway, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
    },
    h3: {
        fontFamily: 'Merriweather, serif', // A serif font for a touch of formality in subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h4: {
        fontFamily: 'Merriweather, serif',
        fontWeight: 700,
        fontSize: '1.5rem',
    },
    h5: {
        fontFamily: 'Merriweather, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Merriweather, serif',
        fontWeight: 700,
        fontSize: '1rem',
    },
    body1: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
    },
    body2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500, // A bit bolder for button texts to stand out
    },
    caption: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
    },
    overline: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
    }
};

export default altTypography;
