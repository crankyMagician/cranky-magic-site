// src/themes/utils/themeEnhancement.js
import { createTheme } from '@mui/material/styles';
import colorUtils from './colorUtilities';
import { convertToEnhancedPalette } from '../palettes/enhancedPaletteStructure';

/**
 * Enhances an existing theme with necessary properties for crankyComponentOverrides
 * @param {Object} baseTheme - The base theme object to enhance
 * @returns {Object} - Enhanced theme object with all necessary properties
 */
export const enhanceTheme = (baseTheme) => {
    // Ensure palette has all required properties
    const enhancedPalette = convertToEnhancedPalette(baseTheme.palette);

    // Create an enhanced theme with the updated palette
    const enhancedTheme = createTheme({
        ...baseTheme,
        palette: enhancedPalette,
    });

    // Add custom mixins for components
    const themeWithMixins = createTheme({
        ...enhancedTheme,
        mixins: {
            ...enhancedTheme.mixins,
            // Futuristic card mixin
            futuristicCard: {
                background: enhancedTheme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                border: enhancedTheme.palette.mode === 'light'
                    ? '1px solid rgba(255, 255, 255, 0.7)'
                    : `1px solid ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.2)}`,
                boxShadow: enhancedTheme.palette.mode === 'light'
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '8px',
                    padding: '1px',
                    background: `linear-gradient(135deg, transparent 40%, ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.27)} 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: enhancedTheme.palette.mode === 'light'
                        ? `0 8px 16px rgba(0, 0, 0, 0.15), 0 0 10px ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.1)}`
                        : `0 8px 16px rgba(0, 0, 0, 0.4), 0 0 10px ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.2)}`,
                },
            },

            // Data display mixin (for statistics, numbers, etc.)
            dataDisplay: {
                fontFamily: enhancedTheme.typography.h3.fontFamily,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '8px 12px',
                background: enhancedTheme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(30, 30, 30, 0.9)',
                border: `1px solid ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.27)}`,
                borderRadius: '4px',
                boxShadow: `0 0 8px ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.2)}`,
                position: 'relative',
                display: 'inline-block',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.13)}, transparent)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite linear',
                },
                '@keyframes shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },

            // Terminal/code block styling
            matrixTerminal: {
                fontFamily: enhancedTheme.typography.code?.fontFamily || 'monospace',
                backgroundColor: enhancedTheme.palette.mode === 'light' ? '#f0f0f0' : '#1a1a1a',
                color: enhancedTheme.palette.primary.main,
                padding: '16px',
                borderRadius: '4px',
                border: `1px solid ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.2)}`,
                boxShadow: `inset 0 0 10px ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.13)}`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.07)} 2px, ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.07)} 4px)`,
                    pointerEvents: 'none',
                },
            },

            // Button with glow effect
            glowButton: {
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '4px',
                    padding: '2px',
                    background: `linear-gradient(135deg, transparent 40%, ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.5)} 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    opacity: 0.7,
                },
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: enhancedTheme.palette.mode === 'light'
                        ? `0 4px 8px ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.3)}`
                        : `0 4px 8px ${colorUtils.hexToRgba(enhancedTheme.palette.primary.main, 0.5)}`,
                },
            },
        },
    });

    // Add custom transitions
    const themeWithTransitions = createTheme({
        ...themeWithMixins,
        transitions: {
            ...themeWithMixins.transitions,
            // Custom easing for futuristic transitions
            easing: {
                ...themeWithMixins.transitions.easing,
                // Custom easing functions
                spatial: 'cubic-bezier(0.23, 1, 0.32, 1)',
                digitalPulse: 'cubic-bezier(0.85, 0, 0.15, 1)',
                matrixGlitch: 'steps(5, end)',
                holographic: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    });

    // Add enhanced shape options
    const themeWithShapes = createTheme({
        ...themeWithTransitions,
        shape: {
            ...themeWithTransitions.shape,
            // Special shapes for futuristic components
            futuristic: {
                button: {
                    borderRadius: '4px',
                    // Slight angle/chamfer on one corner for sci-fi feel
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 92% 100%, 0% 100%)',
                },
                card: {
                    borderRadius: '8px',
                    // Slight angle/chamfer on one corner for sci-fi feel
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 92%, 90% 100%, 0% 100%)',
                },
                chip: {
                    borderRadius: '4px',
                    // Slight angle/chamfer on both sides for sci-fi feel
                    clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
                },
            },
        },
    });

    return themeWithShapes;
};

export default enhanceTheme;