export const csColor23V3 = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#423738',
        light: '#D3AF85',
        dark: '#423738',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#D3AF85',
        light: '#8E5915',
        dark: '#1A1A1A', // Fixed typo from original
        contrastText: '#000000',
    },
    tertiary: {
        main: '#F4B315',
        light: '#E59312',
        dark: '#F4B315',
        contrastText: '#000000',
    },
    error: {
        main: '#423738',
        light: '#423738',
        dark: '#423738',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#E59312',
        light: '#E59312',
        dark: '#E59312',
        contrastText: '#FFFFFF',
    },
    info: {
        main: '#8E5915',
        light: '#8E5915',
        dark: '#8E5915',
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#F4B315',
        light: '#F4B315',
        dark: '#F4B315',
        contrastText: '#FFFFFF',
    },
    background: {
        default: '#D3AF85',
        paper: '#D3AF85',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#000000',
        disabled: '#A9A6A3',
    },
    action: {
        active: '#F4B315',
        hover: '#E59312',
        hoverOpacity: 0.08,
        selected: '#E59312',
        selectedOpacity: 0.14,
        disabled: '#8E5915',
        disabledBackground: '#D3AF85',
        disabledOpacity: 0.38,
        focus: '#F4B315',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(66, 55, 56, 0.3) 0%, rgba(66, 55, 56, 0) 100%)',
        glowEffect: '0 0 10px rgba(66, 55, 56, 0.5), 0 0 20px rgba(66, 55, 56, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(66, 55, 56, 0.15) 0%, rgba(211, 175, 133, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(211, 175, 133, 0.85)',
        glassMorphism: 'rgba(211, 175, 133, 0.8)',
        codeBackground: 'rgba(211, 175, 133, 0.95)',

        // Matrix-inspired effects
        gridLine: 'rgba(66, 55, 56, 0.2)',
        digitalPulse: 'rgba(66, 55, 56, 0.7)',
        matrixRain: 'rgba(66, 55, 56, 0.3)',
        scanline: 'rgba(66, 55, 56, 0.05)',

        // Helper getters for component overrides
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

    // Function to properly get a color with alpha
    getAlphaColor: function(color, alpha) {
        if (!color) return null;
        return this.custom.getAlphaColor(color, alpha);
    },
};