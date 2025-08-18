export const csColor31V5 = {
    // Standard MUI properties
    mode: 'light',
    primary: {
        main: '#555FA7',
        light: '#6381C2',
        dark: '#555FA7',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#7667A5',
        light: '#555FA7',
        dark: '#7667A5',
        contrastText: '#FFFFFF',
    },
    tertiary: {
        main: '#6381C2',
        light: '#7667A5',
        dark: '#6381C2',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#D3ABD3',
        light: '#D3ABD3',
        dark: '#D3ABD3',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#D35C9C',
        light: '#D35C9C',
        dark: '#D35C9C',
        contrastText: '#000000',
    },
    info: {
        main: '#6381C2',
        light: '#6381C2',
        dark: '#6381C2',
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#62C9F5',
        light: '#62C9F5',
        dark: '#62C9F5',
        contrastText: '#000000',
    },
    background: {
        default: '#7D94C6',
        paper: '#90A3CB',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#000000',
        disabled: '#9DA4B3',
    },
    action: {
        active: '#555FA7',
        hover: '#62C9F5',
        hoverOpacity: 0.08,
        selected: '#555FA7',
        selectedOpacity: 0.14,
        disabled: '#54ABD1',
        disabledBackground: '#7667A5',
        disabledOpacity: 0.38,
        focus: '#555FA7',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(85, 95, 167, 0.3) 0%, rgba(85, 95, 167, 0) 100%)',
        glowEffect: '0 0 10px rgba(85, 95, 167, 0.5), 0 0 20px rgba(85, 95, 167, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(85, 95, 167, 0.15) 0%, rgba(99, 129, 194, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(125, 148, 198, 0.85)',
        glassMorphism: 'rgba(144, 163, 203, 0.8)',
        codeBackground: 'rgba(125, 148, 198, 0.95)',

        // Matrix-inspired effects
        gridLine: 'rgba(85, 95, 167, 0.2)',
        digitalPulse: 'rgba(85, 95, 167, 0.7)',
        matrixRain: 'rgba(85, 95, 167, 0.3)',
        scanline: 'rgba(85, 95, 167, 0.05)',

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