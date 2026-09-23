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

/**
 * Flatten whatever a pack exports into a plain `{ name: keyframes }` map.
 *
 * The magical pack default-exports a wrapper of the form
 * `{ animations, classes, transitions, hoverEffects, utils }`, while the other four
 * export the keyframes map directly. Normalizing here means callers see one shape, and
 * the 900-line magical file does not have to be touched.
 */
const flatten = (pack) => {
    if (!pack || typeof pack !== 'object') return {};
    const source = pack.animations && typeof pack.animations === 'object' ? pack.animations : pack;
    const out = {};
    Object.entries(source).forEach(([name, value]) => {
        // Emotion keyframes serialize to an object carrying `name` and `styles`, and
        // stringify to the generated animation name.
        if (value && (typeof value === 'object' || typeof value === 'string')) out[name] = value;
    });
    return out;
};

// Get animations by ID, always as a flat keyframes map
export const getAnimationsById = (animationId) => {
    if (!validateAnimationId(animationId)) {
        console.warn(`Invalid animation ID: ${animationId}. Using magical.`);
        return flatten(animationRegistry.magical.animations);
    }
    return flatten(animationRegistry[animationId].animations);
};

// Get all animations info
export const getAllAnimations = () => {
    return Object.values(animationRegistry);
};

// Export specific animation sets
export {
    magicalAnimations,
    simpleAnimations,
    elegantAnimations,
    dynamicAnimations,
    playfulAnimations,
};
