// src/themes/palettes/crankyMagicianLight.js
import { alpha } from '@mui/material/styles';

/**
 * Cranky Magician Light Theme Palette
 * A mystical light theme with wizard-inspired colors
 * WCAG AA compliant for accessibility
 */
export const crankyMagicianLight = {
    mode: 'light',

    // Primary - Cranky Purple (adjusted for light mode)
    primary: {
        main: '#5E3D92',
        light: '#8A6FC7',
        dark: '#3E2860',
        contrastText: '#FFFFFF',
        // Additional shades for gradients
        50: '#F3E5F5',
        100: '#E1BEE7',
        200: '#CE93D8',
        300: '#BA68C8',
        400: '#AB47BC',
        500: '#5E3D92',
        600: '#8E24AA',
        700: '#7B1FA2',
        800: '#6A1B9A',
        900: '#4A148C',
    },

    // Secondary - Lightning Blue (adjusted for light mode)
    secondary: {
        main: '#1F8AAF',
        light: '#2FB2DD',
        dark: '#156A87',
        contrastText: '#FFFFFF',
        50: '#E0F2F1',
        100: '#B2DFDB',
        200: '#80CBC4',
        300: '#4DB6AC',
        400: '#26A69A',
        500: '#1F8AAF',
        600: '#00897B',
        700: '#00796B',
        800: '#00695C',
        900: '#004D40',
    },

    // Error - Magical Red
    error: {
        main: '#D32F2F',
        light: '#EF5350',
        dark: '#C62828',
        contrastText: '#FFFFFF',
    },

    // Warning - Serious Flesh (adjusted for light mode)
    warning: {
        main: '#E6A373',
        light: '#F7B591',
        dark: '#D08050',
        contrastText: '#000000',
    },

    // Info - Wand Spark Blue (adjusted for light mode)
    info: {
        main: '#2CA7B8',
        light: '#3FD1E2',
        dark: '#1E7A87',
        contrastText: '#FFFFFF',
    },

    // Success - Binary Glow Teal (adjusted for light mode)
    success: {
        main: '#1E9985',
        light: '#2BC5AF',
        dark: '#156B5C',
        contrastText: '#FFFFFF',
    },

    // Grey scale for UI elements
    grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#D5D5D5',
        A200: '#AAAAAA',
        A400: '#616161',
        A700: '#303030',
    },

    // Text colors
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.60)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
    },

    // Divider
    divider: 'rgba(0, 0, 0, 0.12)',

    // Background colors
    background: {
        default: '#FAF7FD', // Light purple tint
        paper: '#FFFFFF',
        elevated: '#FEFEFE',
    },

    // Action colors
    action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: alpha('#5E3D92', 0.04),
        hoverOpacity: 0.04,
        selected: alpha('#5E3D92', 0.08),
        selectedOpacity: 0.08,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: alpha('#5E3D92', 0.12),
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },

    // Custom magical colors for light mode
    custom: {
        // Magical gradients
        magicalGradient: 'linear-gradient(135deg, #5E3D92 0%, #1F8AAF 50%, #1E9985 100%)',
        purpleGradient: 'linear-gradient(135deg, #5E3D92 0%, #8A6FC7 100%)',
        lightningGradient: 'linear-gradient(135deg, #1F8AAF 0%, #2CA7B8 100%)',

        // Glow effects (softer for light mode)
        purpleGlow: '0 0 15px rgba(94, 61, 146, 0.3)',
        blueGlow: '0 0 15px rgba(31, 138, 175, 0.3)',
        tealGlow: '0 0 15px rgba(30, 153, 133, 0.3)',

        // Particle colors
        sparkleGold: '#FFA726',
        sparkleWhite: '#FFFFFF',
        sparklePurple: '#7E57C2',

        // Background overlays
        overlay: 'rgba(250, 247, 253, 0.85)',
        glassMorphism: 'rgba(255, 255, 255, 0.8)',
        codeBackground: 'rgba(245, 242, 250, 0.95)',

        // Magic effects (lighter versions)
        magicPulse: 'rgba(94, 61, 146, 0.2)',
        lightningStrike: 'rgba(31, 138, 175, 0.5)',
        wandTrail: 'rgba(44, 167, 184, 0.2)',
        mysticAura: 'rgba(30, 153, 133, 0.15)',

        // Interactive states
        hoverGlow: alpha('#5E3D92', 0.08),
        focusRing: alpha('#1F8AAF', 0.2),
        activePress: alpha('#1E9985', 0.15),

        // Card effects
        cardBorder: alpha('#5E3D92', 0.15),
        cardShadow: '0 2px 8px rgba(94, 61, 146, 0.08)',
        cardHoverShadow: '0 4px 16px rgba(94, 61, 146, 0.15)',

        // Text effects
        glowText: {
            textShadow: '0 0 8px rgba(94, 61, 146, 0.4), 0 0 16px rgba(94, 61, 146, 0.2)',
        },

        // Animation helpers
        getAlphaColor: (color, alphaValue) => {
            if (!color) return null;
            if (color.startsWith('rgba')) return color;

            let hex = color.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }

            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            return `rgba(${r}, ${g}, ${b}, ${alphaValue})`;
        },

        // Particle system colors
        particles: {
            primary: '#5E3D92',
            secondary: '#1F8AAF',
            tertiary: '#1E9985',
            accent: '#E6A373',
            sparkle: '#FFA726',
        },

        // Depth layers (lighter versions)
        elevation: {
            0: '#FAF7FD',
            1: '#FFFFFF',
            2: '#FEFEFE',
            3: '#FDFDFD',
            4: '#FCFCFC',
            5: '#FBFBFB',
            6: '#FAFAFA',
            8: '#F9F9F9',
            12: '#F8F8F8',
            16: '#F7F7F7',
            24: '#F6F6F6',
        },

        // Special effects (lighter versions)
        aurora: 'linear-gradient(45deg, rgba(94, 61, 146, 0.15) 0%, rgba(31, 138, 175, 0.15) 50%, rgba(30, 153, 133, 0.15) 100%)',
        nebula: 'radial-gradient(circle at 30% 80%, rgba(94, 61, 146, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(31, 138, 175, 0.2) 0%, transparent 50%)',
        constellation: 'radial-gradient(2px 2px at 20% 30%, #5E3D92, transparent), radial-gradient(2px 2px at 60% 70%, #1F8AAF, transparent), radial-gradient(1px 1px at 50% 50%, #1E9985, transparent)',

        // Status indicators
        online: '#1E9985',
        offline: '#9E9E9E',
        busy: '#E6A373',
        away: '#FFA726',

        // Code syntax colors (for developer mode - light versions)
        syntax: {
            keyword: '#7C4DFF',
            string: '#558B2F',
            comment: '#90A4AE',
            function: '#0288D1',
            variable: '#D32F2F',
            number: '#F57C00',
            operator: '#00ACC1',
            className: '#F9A825',
        },

        // Light mode specific additions
        softShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        subtleBorder: 'rgba(94, 61, 146, 0.08)',
        lightOverlay: 'rgba(255, 255, 255, 0.9)',
        frostedGlass: 'rgba(255, 255, 255, 0.7)',

        // Pastel variations for light mode
        pastel: {
            purple: '#E1BEE7',
            blue: '#B3E5FC',
            teal: '#B2DFDB',
            flesh: '#FFCCBC',
            gold: '#FFE082',
        },
    },

    // Augmented colors for MUI components
    augmentColor: {
        color: {
            main: '#5E3D92',
        },
        mainShade: 500,
        lightShade: 300,
        darkShade: 700,
    },

    // Contrast threshold
    contrastThreshold: 3,

    // Tone offset
    tonalOffset: 0.2,

    // Get contrast text function
    getContrastText: (background) => {
        // Custom contrast calculation for magical theme
        const rgb = background.startsWith('#')
            ? parseInt(background.slice(1), 16)
            : 0;
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? 'rgba(0, 0, 0, 0.87)' : '#FFFFFF';
    },
};