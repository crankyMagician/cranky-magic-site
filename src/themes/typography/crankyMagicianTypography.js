// src/themes/typography/crankyMagicianTypography.js

/**
 * Cranky Magician Typography System
 * Magical and technical fonts with animated effects
 */
const crankyMagicianTypography = {
    // Font families
    fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),

    // Display font for headings
    displayFontFamily: [
        'Orbitron',
        'Space Mono',
        'monospace',
    ].join(','),

    // Code font
    codeFontFamily: [
        'Fira Code',
        'JetBrains Mono',
        'Monaco',
        'Consolas',
        '"Courier New"',
        'monospace',
    ].join(','),

    // Magical script font for special effects
    magicalFontFamily: [
        'Cinzel',
        'Playfair Display',
        'Georgia',
        'serif',
    ].join(','),

    // Font weights
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    fontWeightExtraBold: 800,
    fontWeightBlack: 900,

    // HTML font size (16px default)
    htmlFontSize: 16,

    // Typography variants
    h1: {
        fontFamily: [
            'Orbitron',
            'Space Mono',
            'monospace',
        ].join(','),
        fontWeight: 900,
        fontSize: '3.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
        '@media (max-width:900px)': {
            fontSize: '2.75rem',
        },
        '@media (max-width:600px)': {
            fontSize: '2.25rem',
        },
        // Magical glow effect
        '&.magical-glow': {
            animation: 'magicalGlow 2s ease-in-out infinite alternate',
        },
    },

    h2: {
        fontFamily: [
            'Orbitron',
            'Space Mono',
            'monospace',
        ].join(','),
        fontWeight: 800,
        fontSize: '2.75rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        '@media (max-width:900px)': {
            fontSize: '2.25rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.875rem',
        },
    },

    h3: {
        fontFamily: [
            'Orbitron',
            'Space Mono',
            'monospace',
        ].join(','),
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.35,
        letterSpacing: '0em',
        '@media (max-width:900px)': {
            fontSize: '1.875rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.5rem',
        },
    },

    h4: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.4,
        letterSpacing: '0.01em',
        '@media (max-width:900px)': {
            fontSize: '1.5rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.25rem',
        },
    },

    h5: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.45,
        letterSpacing: '0.01em',
        '@media (max-width:900px)': {
            fontSize: '1.25rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1.125rem',
        },
    },

    h6: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
        '@media (max-width:900px)': {
            fontSize: '1.125rem',
        },
        '@media (max-width:600px)': {
            fontSize: '1rem',
        },
    },

    subtitle1: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 500,
        fontSize: '1.125rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
    },

    subtitle2: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
    },

    body1: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.00938em',
    },

    body2: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '0.01071em',
    },

    button: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 600,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
    },

    caption: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
    },

    overline: {
        fontFamily: [
            'Inter',
            'Roboto',
            'sans-serif',
        ].join(','),
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
    },

    // Custom variants for magical effects
    magical: {
        fontFamily: [
            'Cinzel',
            'Playfair Display',
            'Georgia',
            'serif',
        ].join(','),
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.5,
        letterSpacing: '0.05em',
        fontStyle: 'italic',
    },

    code: {
        fontFamily: [
            'Fira Code',
            'JetBrains Mono',
            'Monaco',
            'Consolas',
            'monospace',
        ].join(','),
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0em',
    },

    glitch: {
        fontFamily: [
            'Orbitron',
            'Space Mono',
            'monospace',
        ].join(','),
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.2,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        position: 'relative',
        '&::before, &::after': {
            content: 'attr(data-text)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
        },
        '&::before': {
            animation: 'glitch-1 0.5s infinite',
            color: '#6B4BAF',
            zIndex: -1,
        },
        '&::after': {
            animation: 'glitch-2 0.5s infinite',
            color: '#2FB2DD',
            zIndex: -2,
        },
    },

    // Responsive font sizes
    responsive: {
        '@media (max-width:600px)': {
            fontSize: 14,
        },
    },

    // Custom animation keyframes to be added to global styles
    animations: `
        @keyframes magicalGlow {
            0% {
                text-shadow: 
                    0 0 10px rgba(107, 75, 175, 0.5),
                    0 0 20px rgba(107, 75, 175, 0.3),
                    0 0 30px rgba(107, 75, 175, 0.2);
            }
            100% {
                text-shadow: 
                    0 0 20px rgba(107, 75, 175, 0.8),
                    0 0 30px rgba(107, 75, 175, 0.6),
                    0 0 40px rgba(107, 75, 175, 0.4);
            }
        }
        
        @keyframes glitch-1 {
            0%, 100% {
                clip-path: inset(0 0 0 0);
                transform: translate(0);
            }
            20% {
                clip-path: inset(33% 0 30% 0);
                transform: translate(-2px, 2px);
            }
            40% {
                clip-path: inset(20% 0 60% 0);
                transform: translate(2px, -2px);
            }
            60% {
                clip-path: inset(70% 0 10% 0);
                transform: translate(-2px, 2px);
            }
            80% {
                clip-path: inset(10% 0 80% 0);
                transform: translate(2px, -2px);
            }
        }
        
        @keyframes glitch-2 {
            0%, 100% {
                clip-path: inset(0 0 0 0);
                transform: translate(0);
            }
            20% {
                clip-path: inset(60% 0 20% 0);
                transform: translate(2px, -2px);
            }
            40% {
                clip-path: inset(10% 0 80% 0);
                transform: translate(-2px, 2px);
            }
            60% {
                clip-path: inset(40% 0 40% 0);
                transform: translate(2px, 2px);
            }
            80% {
                clip-path: inset(80% 0 10% 0);
                transform: translate(-2px, -2px);
            }
        }
        
        @keyframes typewriter {
            from {
                width: 0;
            }
            to {
                width: 100%;
            }
        }
        
        @keyframes blink {
            50% {
                border-color: transparent;
            }
        }
    `,

    // Font loading configuration
    fontDisplay: 'swap',

    // Custom font imports (to be added to index.html or CSS)
    fontImports: [
        '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");',
        '@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");',
        '@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap");',
        '@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap");',
        '@import url("https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap");',
        '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap");',
    ],
};

export default crankyMagicianTypography;