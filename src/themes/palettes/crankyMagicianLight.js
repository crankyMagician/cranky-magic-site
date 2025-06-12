// src/themes/palettes/crankyMagicianLight.js
export const crankyMagicianLight = {
    mode: 'light',

    // Primary colors - Deep purple for magic
    primary: {
        main: '#5E35B1', // Deep purple - WCAG AA compliant
        light: '#7E57C2',
        dark: '#4527A0',
        contrastText: '#FFFFFF',
    },

    // Secondary colors - Mystical gold
    secondary: {
        main: '#FFB300', // Mystical gold
        light: '#FFD54F',
        dark: '#FF8F00',
        contrastText: '#000000',
    },

    // Error, warning, info, success with WCAG compliance
    error: {
        main: '#D32F2F',
        light: '#EF5350',
        dark: '#C62828',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#F57C00',
        light: '#FFB74D',
        dark: '#E65100',
        contrastText: '#000000',
    },
    info: {
        main: '#1976D2',
        light: '#42A5F5',
        dark: '#1565C0',
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#388E3C',
        light: '#66BB6A',
        dark: '#2E7D32',
        contrastText: '#FFFFFF',
    },

    // Background colors
    background: {
        default: '#FAFAFA',
        paper: '#FFFFFF',
    },

    // Text colors with WCAG compliance
    text: {
        primary: 'rgba(0, 0, 0, 0.87)', // WCAG AA compliant
        secondary: 'rgba(0, 0, 0, 0.6)', // WCAG AA compliant
        disabled: 'rgba(0, 0, 0, 0.38)',
    },

    // Divider
    divider: 'rgba(0, 0, 0, 0.12)',

    // Action colors
    action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        selected: 'rgba(0, 0, 0, 0.08)',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },

    // Custom colors for magical effects
    custom: {
        magicGlow: 'rgba(94, 53, 177, 0.15)',
        sparkle: '#E1BEE7',
        mysticMist: 'rgba(126, 87, 194, 0.08)',
        cardGradient: 'linear-gradient(135deg, rgba(94, 53, 177, 0.05) 0%, rgba(255, 179, 0, 0.05) 100%)',
        overlay: 'rgba(250, 250, 250, 0.9)',
        glassMorphism: 'rgba(255, 255, 255, 0.75)',
        codeBackground: 'rgba(245, 245, 250, 0.95)',
        dataStream: 'linear-gradient(180deg, rgba(94, 53, 177, 0.1) 0%, transparent 100%)',
        glowEffect: '0 0 20px rgba(94, 53, 177, 0.3), 0 0 40px rgba(94, 53, 177, 0.15)',
        hologram: 'linear-gradient(135deg, rgba(94, 53, 177, 0.1) 0%, rgba(126, 87, 194, 0.1) 100%)',
        gridLine: 'rgba(94, 53, 177, 0.15)',
        digitalPulse: 'rgba(94, 53, 177, 0.7)',
        matrixRain: 'rgba(94, 53, 177, 0.25)',
        scanline: 'rgba(94, 53, 177, 0.05)',
        getAlphaColor: (color, alpha) => {
            if (!color) return null;
            if (color.startsWith('rgba')) return color;
            let hex = color.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    },

    // Tertiary color for additional branding
    tertiary: {
        main: '#00ACC1', // Mystical teal
        light: '#26C6DA',
        dark: '#0097A7',
        contrastText: '#FFFFFF',
    },

    // Helper function at palette level
    getAlphaColor: function(color, alpha) {
        return this.custom.getAlphaColor(color, alpha);
    }
};