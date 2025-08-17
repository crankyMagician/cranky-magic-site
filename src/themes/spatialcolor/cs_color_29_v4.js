export const csColor29V4 = {
    // Standard MUI properties
    mode: 'dark',
    primary: {
        main: '#186764',
        light: '#C0A088',
        dark: '#186764',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#9A7C65',
        light: '#DAC6B6',
        dark: '#9A7C65',
        contrastText: '#FFFFFF',
    },
    tertiary: {
        main: '#000101',
        light: '#186784',
        dark: '#000101',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#186784',
        light: '#186784',
        dark: '#186784',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#DD7324',
        light: '#DD7324',
        dark: '#DD7324',
        contrastText: '#FFFFFF',
    },
    info: {
        main: '#C0A088',
        light: '#C0A088',
        dark: '#C0A088',
        contrastText: '#000000',
    },
    success: {
        main: '#186784',
        light: '#186784',
        dark: '#186784',
        contrastText: '#FFFFFF',
    },
    background: {
        default: '#186784',
        paper: '#DAC6B6',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#000000',
        disabled: '#9A7C65',
    },
    action: {
        active: '#0C2E3D',
        hover: '#186784',
        hoverOpacity: 0.08,
        selected: '#0C2E3D',
        selectedOpacity: 0.14,
        disabled: '#C0A088',
        disabledBackground: '#9A7C65',
        disabledOpacity: 0.38,
        focus: '#0C2E3D',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(24, 103, 100, 0.3) 0%, rgba(24, 103, 100, 0) 100%)',
        glowEffect: '0 0 10px rgba(24, 103, 100, 0.5), 0 0 20px rgba(24, 103, 100, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(24, 103, 100, 0.15) 0%, rgba(192, 160, 136, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(24, 103, 132, 0.85)',
        glassMorphism: 'rgba(218, 198, 182, 0.8)',
        codeBackground: 'rgba(24, 103, 132, 0.95)',

        // Matrix-inspired effects
        gridLine: 'rgba(24, 103, 100, 0.2)',
        digitalPulse: 'rgba(24, 103, 100, 0.7)',
        matrixRain: 'rgba(24, 103, 100, 0.3)',
        scanline: 'rgba(24, 103, 100, 0.05)',

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