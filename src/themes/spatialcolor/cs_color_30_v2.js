export const csColor30V2 = {
    // Standard MUI properties
    mode: 'dark',
    primary: {
        main: '#2B2F38',
        light: '#90BDD2',
        dark: '#2B2F38',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#697F86',
        light: '#2B2F38',
        dark: '#697F86',
        contrastText: '#FFFFFF',
    },
    tertiary: {
        main: '#74595F',
        light: '#51444B',
        dark: '#74595F',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#74595F',
        light: '#74595F',
        dark: '#74595F',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#AE2E1F',
        light: '#AE2E1F',
        dark: '#AE2E1F',
        contrastText: '#FFFFFF',
    },
    info: {
        main: '#51444B',
        light: '#51444B',
        dark: '#51444B',
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#90BDD2',
        light: '#90BDD2',
        dark: '#90BDD2',
        contrastText: '#000000',
    },
    background: {
        default: '#697F86',
        paper: '#C0C1C2',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#000000',
        disabled: '#A3A5A6',
    },
    action: {
        active: '#90BDD2',
        hover: '#74595F',
        hoverOpacity: 0.08,
        selected: '#51444B',
        selectedOpacity: 0.14,
        disabled: '#697F86',
        disabledBackground: '#51444B',
        disabledOpacity: 0.38,
        focus: '#90BDD2',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(43, 47, 56, 0.3) 0%, rgba(43, 47, 56, 0) 100%)',
        glowEffect: '0 0 10px rgba(43, 47, 56, 0.5), 0 0 20px rgba(43, 47, 56, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(43, 47, 56, 0.15) 0%, rgba(144, 189, 210, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(105, 127, 134, 0.85)',
        glassMorphism: 'rgba(192, 193, 194, 0.8)',
        codeBackground: 'rgba(105, 127, 134, 0.95)',

        // Matrix-inspired effects
        gridLine: 'rgba(43, 47, 56, 0.2)',
        digitalPulse: 'rgba(43, 47, 56, 0.7)',
        matrixRain: 'rgba(43, 47, 56, 0.3)',
        scanline: 'rgba(43, 47, 56, 0.05)',

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