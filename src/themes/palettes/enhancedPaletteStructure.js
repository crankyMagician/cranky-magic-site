// src/themes/palettes/enhancedPaletteStructure.js
// This file shows an example of how to structure any palette to work with crankyComponentOverrides

/**
 * Palette structure template
 * All palettes should follow this structure to work with crankyComponentOverrides
 */
export const paletteTemplate = {
    // Standard MUI properties
    mode: 'light', // or 'dark'
    primary: {
        main: '#D65A31',
        light: '#E07A53',
        dark: '#B04B28',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#828282',
        light: '#BDBDBD',
        dark: '#5F5F5F',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#CF2A2A',
        light: '#E55858',
        dark: '#B00020',
        contrastText: '#FFFFFF',
    },
    warning: {
        main: '#FF9800',
        light: '#FFC947',
        dark: '#E68900',
        contrastText: '#000000',
    },
    info: {
        main: '#00B8FF',
        light: '#33C3FF',
        dark: '#0090CC',
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#4CAF50',
        light: '#7BC67E',
        dark: '#3B873E',
        contrastText: '#FFFFFF',
    },
    background: {
        default: '#F5F5F5',
        paper: '#FFFFFF',
    },
    text: {
        primary: '#212121',
        secondary: '#424242',
        disabled: '#757575',
    },
    action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },

    // Required for crankyComponentOverrides - visual effects
    custom: {
        // Gradient effects
        dataStream: 'linear-gradient(180deg, rgba(214, 90, 49, 0.3) 0%, rgba(214, 90, 49, 0) 100%)',
        glowEffect: '0 0 10px rgba(214, 90, 49, 0.5), 0 0 20px rgba(214, 90, 49, 0.3)',
        hologram: 'linear-gradient(135deg, rgba(214, 90, 49, 0.15) 0%, rgba(224, 159, 62, 0.15) 100%)',

        // Background and overlay effects
        overlay: 'rgba(245, 245, 245, 0.85)', // Light overlay for modals, drawers
        glassMorphism: 'rgba(255, 255, 255, 0.8)', // Glass effect background
        codeBackground: 'rgba(247, 247, 247, 0.95)', // Background for code blocks

        // Matrix-inspired effects
        gridLine: 'rgba(214, 90, 49, 0.2)', // Grid line color
        digitalPulse: 'rgba(214, 90, 49, 0.7)', // Pulsing effect color
        matrixRain: 'rgba(214, 90, 49, 0.3)', // Digital rain effect
        scanline: 'rgba(214, 90, 49, 0.05)', // Scanline effect for Matrix theme

        // Helper getters for component overrides
        getAlphaColor: (color, alpha) => {
            // Helper to convert hex to rgba with alpha
            if (!color) return null;

            // Check if already rgba
            if (color.startsWith('rgba')) return color;

            // Convert hex to rgba
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

    // Function to properly get a color with alpha (fallback for components that don't use the theme function)
    getAlphaColor: function(color, alpha) {
        if (!color) return null;
        return this.custom.getAlphaColor(color, alpha);
    },

    // Add tertiary color just like spatial themes use
    tertiary: {
        main: '#E09F3E',
        light: '#E8B362',
        dark: '#C68122',
        contrastText: '#FFFFFF',
    },
};

// Example of how to convert an existing palette to the enhanced structure
export const convertToEnhancedPalette = (existingPalette) => {
    // Deep clone the existing palette
    const newPalette = JSON.parse(JSON.stringify(existingPalette));

    // Add the enhanced palette structure
    const enhancedPalette = {
        ...newPalette,
        custom: {
            ...newPalette.custom || {},
            // Fill in any missing custom properties with defaults based on primary color
            dataStream: newPalette.custom?.dataStream ||
                `linear-gradient(180deg, ${newPalette.getAlphaColor?.(newPalette.primary.main, 0.3) ||
                `${newPalette.primary.main}4D`} 0%, ${newPalette.getAlphaColor?.(newPalette.primary.main, 0) ||
                `${newPalette.primary.main}00`} 100%)`,

            glowEffect: newPalette.custom?.glowEffect ||
                `0 0 10px ${newPalette.getAlphaColor?.(newPalette.primary.main, 0.5) ||
                `${newPalette.primary.main}80`}, 0 0 20px ${newPalette.getAlphaColor?.(newPalette.primary.main, 0.3) ||
                `${newPalette.primary.main}4D`}`,

            hologram: newPalette.custom?.hologram ||
                `linear-gradient(135deg, ${newPalette.getAlphaColor?.(newPalette.primary.main, 0.15) ||
                `${newPalette.primary.main}26`} 0%, ${newPalette.getAlphaColor?.(newPalette.primary.light, 0.15) ||
                `${newPalette.primary.light}26`} 100%)`,

            // Add missing overlay properties
            overlay: newPalette.custom?.overlay ||
                (newPalette.mode === 'light' ? 'rgba(245, 245, 245, 0.85)' : 'rgba(18, 18, 18, 0.85)'),

            glassMorphism: newPalette.custom?.glassMorphism ||
                (newPalette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.7)'),

            codeBackground: newPalette.custom?.codeBackground ||
                (newPalette.mode === 'light' ? 'rgba(247, 247, 247, 0.95)' : 'rgba(24, 24, 24, 0.95)'),

            // Add Matrix-inspired effects
            gridLine: newPalette.custom?.gridLine ||
                (newPalette.mode === 'light' ?
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.2) || `${newPalette.primary.main}33`}` :
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.3) || `${newPalette.primary.main}4D`}`),

            digitalPulse: newPalette.custom?.digitalPulse ||
                (newPalette.mode === 'light' ?
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.7) || `${newPalette.primary.main}B3`}` :
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.8) || `${newPalette.primary.main}CC`}`),

            matrixRain: newPalette.custom?.matrixRain ||
                (newPalette.mode === 'light' ?
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.3) || `${newPalette.primary.main}4D`}` :
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.4) || `${newPalette.primary.main}66`}`),

            scanline: newPalette.custom?.scanline ||
                (newPalette.mode === 'light' ?
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.05) || `${newPalette.primary.main}0D`}` :
                    `${newPalette.getAlphaColor?.(newPalette.primary.main, 0.1) || `${newPalette.primary.main}1A`}`),

            // Add the getter function for alpha colors
            getAlphaColor: (color, alpha) => {
                // Helper to convert hex to rgba with alpha
                if (!color) return null;

                // Check if already rgba
                if (color.startsWith('rgba')) return color;

                // Convert hex to rgba
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

        // Add a global helper function to get alpha colors
        getAlphaColor: function(color, alpha) {
            return this.custom.getAlphaColor(color, alpha);
        }
    };

    // Ensure tertiary color exists
    if (!enhancedPalette.tertiary) {
        enhancedPalette.tertiary = {
            main: newPalette.primary.light || newPalette.primary.main,
            light: newPalette.primary.main,
            dark: newPalette.primary.dark,
            contrastText: newPalette.primary.contrastText,
        };
    }

    return enhancedPalette;
};