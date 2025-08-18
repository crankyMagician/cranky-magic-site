// src/themes/animations/index.js
import magicalAnimations from './magicalAnimations';
import simpleAnimations from './simpleAnimations';
import elegantAnimations from './elegantAnimations';
import dynamicAnimations from './dynamicAnimations';
import playfulAnimations from './playfulAnimations';
import { keyframes } from '@mui/material/styles';

// Fade In Sparkle Animation
export const fadeInSparkle = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
    filter: blur(10px);
  }
  20% {
    opacity: 0.3;
    transform: scale(0.9) translateY(10px);
    filter: blur(5px);
  }
  40% {
    opacity: 0.6;
    transform: scale(1.05) translateY(-2px);
    filter: blur(2px);
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);
  }
  60% {
    opacity: 0.9;
    transform: scale(1.02) translateY(0);
    filter: blur(0);
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.6), 
                0 0 60px rgba(79, 70, 229, 0.4);
  }
  80% {
    opacity: 1;
    transform: scale(1.01) translateY(0);
    box-shadow: 0 0 25px rgba(147, 51, 234, 0.5), 
                0 0 50px rgba(79, 70, 229, 0.3);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
    box-shadow: 0 0 15px rgba(147, 51, 234, 0.3), 
                0 0 30px rgba(79, 70, 229, 0.2);
  }
`;

// Animation mode registry
const animationRegistry = {
    magical: {
        id: 'magical',
        name: 'Magical',
        description: 'Enchanting animations with sparkles and mystical effects',
        animations: magicalAnimations,
        fadeInSparkle: fadeInSparkle,
    },
    simple: {
        id: 'simple',
        name: 'Simple',
        description: 'Clean and subtle animations',
        animations: simpleAnimations,
    },
    elegant: {
        id: 'elegant',
        name: 'Elegant',
        description: 'Sophisticated and smooth animations',
        animations: elegantAnimations,
    },
    dynamic: {
        id: 'dynamic',
        name: 'Dynamic',
        description: 'Bold and energetic animations',
        animations: dynamicAnimations,
    },
    playful: {
        id: 'playful',
        name: 'Playful',
        description: 'Fun and bouncy animations',
        animations: playfulAnimations,
    },
    none: {
        id: 'none',
        name: 'No Animations',
        description: 'Disable all animations',
        animations: {},
    },
};

// Get all available animation IDs
export const getAvailableAnimationIds = () => {
    return Object.keys(animationRegistry).filter(id => id !== 'none');
};

// Validate animation ID
export const validateAnimationId = (animationId) => {
    return animationRegistry.hasOwnProperty(animationId);
};

// Get animations by ID
export const getAnimationsById = (animationId) => {
    if (!validateAnimationId(animationId)) {
        console.warn(`Invalid animation ID: ${animationId}. Using magical.`);
        return animationRegistry.magical.animations;
    }
    return animationRegistry[animationId].animations;
};

// Get all animations info
export const getAllAnimations = () => {
    return Object.values(animationRegistry);
};

// Get animation info
export const getAnimationInfo = (animationId) => {
    if (!validateAnimationId(animationId)) {
        return animationRegistry.magical;
    }
    return animationRegistry[animationId];
};

// Export specific animation sets
export {
    magicalAnimations,
    simpleAnimations,
    elegantAnimations,
    dynamicAnimations,
    playfulAnimations,
};

// Export common animation utilities
export const animationUtils = {
    // Duration presets
    duration: {
        instant: 0,
        fast: 200,
        normal: 300,
        slow: 500,
        slower: 800,
        slowest: 1200,
    },

    // Easing presets
    easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },

    // Delay presets
    delay: {
        none: 0,
        short: 100,
        medium: 200,
        long: 400,
        stagger: 50,
    },
};

// Animation hooks helper
export const createAnimationStyles = (animationId, elementType = 'default') => {
    const animations = getAnimationsById(animationId);

    if (!animations || animationId === 'none') {
        return {};
    }

    const baseStyles = {
        animationFillMode: 'both',
        animationTimingFunction: animationUtils.easing.easeInOut,
        willChange: 'transform, opacity',
    };

    // Return appropriate animation styles based on element type
    switch (elementType) {
        case 'entrance':
            return {
                ...baseStyles,
                animation: animations.fadeIn || animations.entrance,
                animationDuration: `${animationUtils.duration.normal}ms`,
            };
        case 'hover':
            return {
                ...baseStyles,
                animation: animations.hover || animations.pulse,
                animationDuration: `${animationUtils.duration.fast}ms`,
            };
        case 'exit':
            return {
                ...baseStyles,
                animation: animations.fadeOut || animations.exit,
                animationDuration: `${animationUtils.duration.fast}ms`,
            };
        default:
            return baseStyles;
    }
};