// Import font sources if needed, with a focus on readability and accessibility
import '@fontsource/open-sans'; // A highly legible sans-serif, suitable for both headers and body text
import '@fontsource/roboto'; // Offers good readability for detailed text sections

const highContrastAccessibilityTypography = {
    fontFamily: 'Open Sans, sans-serif', // Default font family, known for its legibility
    h1: {
        fontFamily: 'Open Sans, sans-serif', // Clear and legible for primary headers
        fontWeight: 800,
        fontSize: '3rem', // Larger for visibility
        color: '#000000', // High contrast color for readability
        lineHeight: '1.2', // Optimized line height for readability
    },
    h2: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 800,
        fontSize: '2.5rem',
        color: '#000000',
        lineHeight: '1.25',
    },
    h3: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
        color: '#000000',
        lineHeight: '1.3',
    },
    h4: {
        fontFamily: 'Roboto, sans-serif', // Adds a touch of versatility to smaller subheadings
        fontWeight: 700,
        fontSize: '1.75rem',
        color: '#000000',
        lineHeight: '1.35',
    },
    h5: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '1.5rem',
        color: '#000000',
        lineHeight: '1.4',
    },
    h6: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: '#000000',
        lineHeight: '1.45',
    },
    body1: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '1rem', // Standard size for body text
        color: '#000000', // Ensuring high contrast for body text
        lineHeight: '1.5', // Increased line height for better readability
    },
    body2: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem', // Slightly smaller for secondary text
        color: '#000000',
        lineHeight: '1.6',
    },
    button: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 600,
        fontSize: '1rem', // Standard for buttons to ensure legibility
        color: '#FFFFFF', // Typically buttons are on colored backgrounds, so white ensures visibility
        lineHeight: '1.5',
    },
    caption: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem', // Clear, even at small sizes
        color: '#000000',
        lineHeight: '1.66',
    },
    overline: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        color: '#000000',
        lineHeight: '1.66',
    }
};

export default highContrastAccessibilityTypography;
