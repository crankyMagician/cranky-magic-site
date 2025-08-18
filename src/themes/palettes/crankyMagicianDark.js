// src/themes/palettes/crankyMagicianDark.js
import { alpha } from '@mui/material/styles';

/**
 * Cranky Magician Dark Theme Palette
 * A mystical dark theme with wizard-inspired colors
 * WCAG AA compliant for accessibility
 */
export const crankyMagicianDark = {
    mode: 'dark',

    // Primary - Cranky Purple
    primary: {
        main: '#6B4BAF',
        light: '#8A6FC7',
        dark: '#4E3580',
        contrastText: '#FFFFFF',
        // Additional shades for gradients
        50: '#EDE7F6',
        100: '#D1C4E9',
        200: '#B39DDB',
        300: '#9575CD',
        400: '#7E57C2',
        500: '#6B4BAF',
        600: '#5E35B1',
        700: '#512DA8',
        800: '#4527A0',
        900: '#311B92',
    },

    // Secondary - Lightning Blue
    secondary: {
        main: '#2FB2DD',
        light: '#5CC5E7',
        dark: '#1F8AAF',
        contrastText: '#FFFFFF',
        50: '#E0F7FA',
        100: '#B2EBF2',
        200: '#80DEEA',
        300: '#4DD0E1',
        400: '#26C6DA',
        500: '#2FB2DD',
        600: '#00ACC1',
        700: '#0097A7',
        800: '#00838F',
        900: '#006064',
    },

    // Error - Angry Red (with magical twist)
    error: {
        main: '#FF5252',
        light: '#FF8A80',
        dark: '#D32F2F',
        contrastText: '#FFFFFF',
    },

    // Warning - Serious Flesh (for warnings/highlights)
    warning: {
        main: '#F7B591',
        light: '#FFCCBC',
        dark: '#E6A373',
        contrastText: '#1D1129',
    },

    // Info - Wand Spark Blue
    info: {
        main: '#3FD1E2',
        light: '#6FE0ED',
        dark: '#2CA7B8',
        contrastText: '#10091B',
    },

    // Success - Binary Glow Teal
    success: {
        main: '#2BC5AF',
        light: '#5DD5C2',
        dark: '#1E9985',
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
        A100: '#F5F5F5',
        A200: '#EEEEEE',
        A400: '#BDBDBD',
        A700: '#616161',
    },

    // Text colors
    text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.38)',
        hint: 'rgba(255, 255, 255, 0.38)',
    },

    // Divider
    divider: 'rgba(255, 255, 255, 0.12)',

    // Background colors
    background: {
        default: '#10091B', // Deep Night Background
        paper: '#1D1129', // Angry Eyebrow Black
        elevated: '#241534', // Slightly lighter for elevation
    },

    // Action colors
    action: {
        active: '#FFFFFF',
        hover: alpha('#FFFFFF', 0.08),
        hoverOpacity: 0.08,
        selected: alpha('#FFFFFF', 0.16),
        selectedOpacity: 0.16,
        disabled: alpha('#FFFFFF', 0.38),
        disabledBackground: alpha('#FFFFFF', 0.12),
        disabledOpacity: 0.38,
        focus: alpha('#FFFFFF', 0.12),
        focusOpacity: 0.12,
        activatedOpacity: 0.24,
    },

    // Custom magical colors
    custom: {
        // Magical gradients
        magicalGradient: 'linear-gradient(135deg, #6B4BAF 0%, #2FB2DD 50%, #2BC5AF 100%)',
        purpleGradient: 'linear-gradient(135deg, #6B4BAF 0%, #8A6FC7 100%)',
        lightningGradient: 'linear-gradient(135deg, #2FB2DD 0%, #3FD1E2 100%)',

        // Glow effects
        purpleGlow: '0 0 20px rgba(107, 75, 175, 0.6)',
        blueGlow: '0 0 20px rgba(47, 178, 221, 0.6)',
        tealGlow: '0 0 20px rgba(43, 197, 175, 0.6)',

        // Particle colors
        sparkleGold: '#FFD700',
        sparkleWhite: '#FFFFFF',
        sparklePurple: '#9575CD',

        // Background overlays
        overlay: 'rgba(16, 9, 27, 0.85)',
        glassMorphism: 'rgba(29, 17, 41, 0.7)',
        codeBackground: 'rgba(36, 21, 52, 0.95)',

        // Magic effects
        magicPulse: 'rgba(107, 75, 175, 0.4)',
        lightningStrike: 'rgba(47, 178, 221, 0.8)',
        wandTrail: 'rgba(63, 209, 226, 0.3)',
        mysticAura: 'rgba(43, 197, 175, 0.2)',

        // Interactive states
        hoverGlow: alpha('#6B4BAF', 0.2),
        focusRing: alpha('#2FB2DD', 0.4),
        activePress: alpha('#2BC5AF', 0.3),

        // Card effects
        cardBorder: alpha('#6B4BAF', 0.3),
        cardShadow: '0 4px 20px rgba(107, 75, 175, 0.15)',
        cardHoverShadow: '0 8px 30px rgba(107, 75, 175, 0.25)',

        // Text effects
        glowText: {
            textShadow: '0 0 10px rgba(107, 75, 175, 0.8), 0 0 20px rgba(107, 75, 175, 0.6)',
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
            primary: '#6B4BAF',
            secondary: '#2FB2DD',
            tertiary: '#2BC5AF',
            accent: '#F7B591',
            sparkle: '#FFD700',
        },

        // Depth layers
        elevation: {
            0: '#10091B',
            1: '#1D1129',
            2: '#241534',
            3: '#2B1A3F',
            4: '#321F4A',
            5: '#392455',
            6: '#402960',
            8: '#472E6B',
            12: '#4E3376',
            16: '#553881',
            24: '#5C3D8C',
        },

        // Special effects
        aurora: 'linear-gradient(45deg, rgba(107, 75, 175, 0.3) 0%, rgba(47, 178, 221, 0.3) 50%, rgba(43, 197, 175, 0.3) 100%)',
        nebula: 'radial-gradient(circle at 30% 80%, rgba(107, 75, 175, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(47, 178, 221, 0.4) 0%, transparent 50%)',
        constellation: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent)',

        // Status indicators
        online: '#2BC5AF',
        offline: '#757575',
        busy: '#F7B591',
        away: '#FFD700',

        // Code syntax colors (for developer mode)
        syntax: {
            keyword: '#C678DD',
            string: '#98C379',
            comment: '#5C6370',
            function: '#61AFEF',
            variable: '#E06C75',
            number: '#D19A66',
            operator: '#56B6C2',
            className: '#E5C07B',
        },
    },

    // Augmented colors for MUI components
    augmentColor: {
        color: {
            main: '#6B4BAF',
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

        return luminance > 0.5 ? '#10091B' : '#FFFFFF';
    },
};