export const csColor27V1 = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#606467',
        light: '#AAA8AD',
        dark: '#313B44',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#1C1D22',
        light: '#8B4944',
        dark: '#8B4944',
        contrastText: '#FFFFFF',
    },
    tertiary: {
        main: '#E62815',
        light: '#E62815',
        dark: '#E62815',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#E62815',
        light: '#8B4944',
        dark: '#E62815',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#8B4944',
        light: '#E62815',
        dark: '#E62815',
        contrastText: '#FFFFFF',
    },
    info: {
        main: '#606467',
        light: '#606467',
        dark: '#313B44',
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#AAA8AD',
        light: '#AAA8AD',
        dark: '#606467',
        contrastText: '#000000',
    },
    background: {
        default: '#AAA8AD',
        paper: '#AAA8AD',
    },
    text: {
        primary: '#000000',
        secondary: '#FFFFFF',
        disabled: '#AAA8AD',
    },
    action: {
        active: '#8B4944',
        hover: '#8B4944',
        hoverOpacity: 0.08,
        selected: '#313B44',
        selectedOpacity: 0.14,
        disabled: '#AAA8AD',
        disabledBackground: '#606467',
        disabledOpacity: 0.38,
        focus: '#8B4944',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(96, 100, 103, 0.3) 0%, rgba(96, 100, 103, 0) 100%)',
        glowEffect: '0 0 10px rgba(96, 100, 103, 0.5), 0 0 20px rgba(96, 100, 103, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(96, 100, 103, 0.15) 0%, rgba(170, 168, 173, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(170, 168, 173, 0.85)',
        glassMorphism: 'rgba(170, 168, 173, 0.8)',
        codeBackground: 'rgba(170, 168, 173, 0.95)',

        // Matrix-inspired effects
        gridLine: 'rgba(96, 100, 103, 0.2)',
        digitalPulse: 'rgba(96, 100, 103, 0.7)',
        matrixRain: 'rgba(96, 100, 103, 0.3)',
        scanline: 'rgba(96, 100, 103, 0.05)',

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