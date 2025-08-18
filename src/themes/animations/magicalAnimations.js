// src/themes/animations/magicalAnimations.js
import { keyframes, alpha } from '@mui/material/styles';

/**
 * Extended Magical Animation System for Cranky Magician Theme
 * Complete library of animations, effects, and transitions
 */

// ============= CORE KEYFRAME ANIMATIONS =============

// Sparkle and Glow Effects
export const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
`;

export const starBurst = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    transform: scale(1.2) rotate(72deg);
    opacity: 1;
  }
  40% {
    transform: scale(0.9) rotate(144deg);
    opacity: 0.8;
  }
  60% {
    transform: scale(1.1) rotate(216deg);
    opacity: 0.6;
  }
  80% {
    transform: scale(0.95) rotate(288deg);
    opacity: 0.4;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

export const magicalGlow = keyframes`
  0% {
    box-shadow: 0 0 5px currentColor;
    filter: brightness(1);
  }
  50% {
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
    filter: brightness(1.2);
  }
  100% {
    box-shadow: 0 0 5px currentColor;
    filter: brightness(1);
  }
`;

// Lightning and Energy Effects
export const lightningStrike = keyframes`
  0%, 95% {
    opacity: 0;
    transform: scaleY(0) translateX(0);
  }
  96% {
    opacity: 1;
    transform: scaleY(1) translateX(-2px);
  }
  97% {
    transform: scaleY(1) translateX(2px);
  }
  98% {
    transform: scaleY(1) translateX(-1px);
  }
  100% {
    opacity: 0;
    transform: scaleY(0) translateX(0);
  }
`;

export const energyPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const plasmaFlow = keyframes`
  0% {
    background-position: 0% 50%;
    filter: hue-rotate(0deg);
  }
  50% {
    background-position: 100% 50%;
    filter: hue-rotate(180deg);
  }
  100% {
    background-position: 0% 50%;
    filter: hue-rotate(360deg);
  }
`;

// Levitation and Float Effects
export const levitate = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  75% {
    transform: translateY(-10px) rotate(-1deg);
  }
`;

export const mysticalFloat = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  20% {
    transform: translateY(-15px) translateX(5px) rotate(2deg);
  }
  40% {
    transform: translateY(-20px) translateX(-5px) rotate(-1deg);
  }
  60% {
    transform: translateY(-15px) translateX(3px) rotate(1deg);
  }
  80% {
    transform: translateY(-5px) translateX(-3px) rotate(-2deg);
  }
`;

export const bobbing = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Wand and Magic Effects
export const wandWave = keyframes`
  0% {
    transform: rotate(0deg) translateX(0);
  }
  25% {
    transform: rotate(15deg) translateX(5px);
  }
  75% {
    transform: rotate(-15deg) translateX(-5px);
  }
  100% {
    transform: rotate(0deg) translateX(0);
  }
`;

export const spellCast = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  25% {
    transform: scale(1.5) rotate(90deg);
    opacity: 0.5;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
  75% {
    transform: scale(1.2) rotate(270deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

export const magicCircle = keyframes`
  0% {
    transform: rotate(0deg) scale(0);
    opacity: 0;
  }
  20% {
    transform: rotate(72deg) scale(1.1);
    opacity: 1;
  }
  40% {
    transform: rotate(144deg) scale(1);
  }
  60% {
    transform: rotate(216deg) scale(1.05);
  }
  80% {
    transform: rotate(288deg) scale(0.95);
  }
  100% {
    transform: rotate(360deg) scale(0);
    opacity: 0;
  }
`;

// Portal and Teleport Effects
export const portal = keyframes`
  0% {
    transform: rotateY(0deg) scale(1);
    opacity: 1;
  }
  25% {
    transform: rotateY(90deg) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: rotateY(180deg) scale(0.6);
    opacity: 0.5;
  }
  75% {
    transform: rotateY(270deg) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: rotateY(360deg) scale(1);
    opacity: 1;
  }
`;

export const vortex = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
    filter: blur(0);
  }
  50% {
    transform: rotate(180deg) scale(0.5);
    filter: blur(2px);
  }
  100% {
    transform: rotate(360deg) scale(1);
    filter: blur(0);
  }
`;

export const dimensionShift = keyframes`
  0%, 100% {
    transform: perspective(1000px) rotateX(0) rotateY(0);
  }
  25% {
    transform: perspective(1000px) rotateX(10deg) rotateY(10deg);
  }
  50% {
    transform: perspective(1000px) rotateX(0) rotateY(20deg);
  }
  75% {
    transform: perspective(1000px) rotateX(-10deg) rotateY(10deg);
  }
`;

// Entrance and Exit Animations
export const magicalEntrance = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(720deg);
    filter: blur(10px);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1) rotate(360deg);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    filter: blur(0);
  }
`;

export const fadeInSparkle = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const smokeDisappear = keyframes`
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2) translateY(-10px);
    filter: blur(4px);
  }
  100% {
    opacity: 0;
    transform: scale(1.5) translateY(-20px);
    filter: blur(8px);
  }
`;

// Glitch and Digital Effects
export const glitch = keyframes`
  0%, 100% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  20% {
    transform: translate(-2px, 2px);
    filter: hue-rotate(90deg);
  }
  40% {
    transform: translate(-2px, -2px);
    filter: hue-rotate(180deg);
  }
  60% {
    transform: translate(2px, 2px);
    filter: hue-rotate(270deg);
  }
  80% {
    transform: translate(2px, -2px);
    filter: hue-rotate(360deg);
  }
`;

export const digitalNoise = keyframes`
  0%, 100% {
    opacity: 1;
    transform: translateX(0);
  }
  10% {
    opacity: 0.8;
    transform: translateX(-1px);
  }
  20% {
    opacity: 0.9;
    transform: translateX(1px);
  }
  30% {
    opacity: 0.7;
    transform: translateX(-2px);
  }
  40% {
    opacity: 1;
    transform: translateX(0);
  }
  50% {
    opacity: 0.9;
    transform: translateX(1px);
  }
  60% {
    opacity: 0.8;
    transform: translateX(-1px);
  }
  70% {
    opacity: 1;
    transform: translateX(2px);
  }
  80% {
    opacity: 0.9;
    transform: translateX(-1px);
  }
  90% {
    opacity: 0.8;
    transform: translateX(1px);
  }
`;

export const matrixRain = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

// Background and Particle Effects
export const auroraWave = keyframes`
  0% {
    transform: translateX(-100%) skewX(-15deg);
    opacity: 0;
  }
  50% {
    transform: translateX(0) skewX(-15deg);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) skewX(-15deg);
    opacity: 0;
  }
`;

export const particleOrbit = keyframes`
  0% {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
  }
`;

export const stardust = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 1;
  }
  25% {
    transform: translateY(-20px) translateX(10px) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-40px) translateX(-10px) scale(0.6);
    opacity: 0.6;
  }
  75% {
    transform: translateY(-60px) translateX(5px) scale(0.4);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-80px) translateX(0) scale(0.2);
    opacity: 0;
  }
`;

// Morphing and Shape Animations
export const morph = keyframes`
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
`;

export const shapeShift = keyframes`
  0%, 100% {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  25% {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  }
  50% {
    clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%);
  }
  75% {
    clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
  }
`;

// Text Effects
export const typewriter = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

export const textGlitch = keyframes`
  0%, 100% {
    text-shadow: 
      2px 2px 0 rgba(107, 75, 175, 0.5),
      -2px -2px 0 rgba(47, 178, 221, 0.5);
  }
  25% {
    text-shadow: 
      -2px 2px 0 rgba(107, 75, 175, 0.5),
      2px -2px 0 rgba(47, 178, 221, 0.5);
  }
  50% {
    text-shadow: 
      2px -2px 0 rgba(107, 75, 175, 0.5),
      -2px 2px 0 rgba(47, 178, 221, 0.5);
  }
  75% {
    text-shadow: 
      -2px -2px 0 rgba(107, 75, 175, 0.5),
      2px 2px 0 rgba(47, 178, 221, 0.5);
  }
`;

export const shimmerText = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Ripple and Wave Effects
export const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

export const wave = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-10px);
  }
  20% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
  40% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(0);
  }
  70% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(0);
  }
  90% {
    transform: translateY(-10px);
  }
`;

// ============= ANIMATION CLASS CONFIGURATIONS =============

export const magicalAnimationClasses = {
  // Sparkle animations
  '.sparkle-slow': {
    animation: `${sparkle} 2s ease-in-out infinite`,
  },
  '.sparkle-fast': {
    animation: `${sparkle} 0.8s ease-in-out infinite`,
  },
  '.sparkle-random': {
    animation: `${sparkle} 1.5s ease-in-out infinite`,
    animationDelay: 'calc(var(--random) * 1s)',
  },

  // Glow animations
  '.glow-pulse': {
    animation: `${magicalGlow} 2s ease-in-out infinite`,
  },
  '.glow-subtle': {
    animation: `${magicalGlow} 4s ease-in-out infinite`,
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Levitation animations
  '.levitate': {
    animation: `${levitate} 3s ease-in-out infinite`,
  },
  '.levitate-subtle': {
    animation: `${levitate} 4s ease-in-out infinite`,
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  '.float-mystical': {
    animation: `${mysticalFloat} 6s ease-in-out infinite`,
  },
  '.bobbing': {
    animation: `${bobbing} 2s ease-in-out infinite`,
  },

  // Lightning effects
  '.lightning-strike': {
    animation: `${lightningStrike} 0.8s ease-out`,
  },
  '.lightning-continuous': {
    animation: `${lightningStrike} 2s ease-out infinite`,
  },

  // Energy effects
  '.energy-pulse': {
    animation: `${energyPulse} 1.5s ease-in-out infinite`,
  },
  '.plasma-flow': {
    background: 'linear-gradient(270deg, #6B4BAF, #2FB2DD, #2BC5AF, #6B4BAF)',
    backgroundSize: '400% 400%',
    animation: `${plasmaFlow} 10s ease infinite`,
  },

  // Portal effects
  '.portal-spin': {
    animation: `${portal} 3s linear infinite`,
  },
  '.vortex': {
    animation: `${vortex} 2s linear infinite`,
  },
  '.dimension-shift': {
    animation: `${dimensionShift} 4s ease-in-out infinite`,
  },

  // Entrance effects
  '.entrance-magical': {
    animation: `${magicalEntrance} 1s cubic-bezier(0.4, 0, 0.2, 1)`,
  },
  '.entrance-sparkle': {
    animation: `${fadeInSparkle} 0.8s cubic-bezier(0.4, 0, 0.2, 1)`,
  },

  // Exit effects
  '.exit-smoke': {
    animation: `${smokeDisappear} 0.8s ease-out forwards`,
  },

  // Glitch effects
  '.glitch': {
    animation: `${glitch} 0.3s ease-in-out infinite`,
  },
  '.glitch-subtle': {
    animation: `${glitch} 2s ease-in-out infinite`,
  },
  '.digital-noise': {
    animation: `${digitalNoise} 0.5s linear infinite`,
  },
  '.matrix-rain': {
    animation: `${matrixRain} 10s linear infinite`,
  },

  // Background effects
  '.aurora-wave': {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(107, 75, 175, 0.3) 0%, rgba(47, 178, 221, 0.3) 50%, rgba(43, 197, 175, 0.3) 100%)',
      animation: `${auroraWave} 8s ease-in-out infinite`,
    },
  },

  // Particle effects
  '.particle-orbit': {
    animation: `${particleOrbit} 5s linear infinite`,
  },
  '.stardust': {
    animation: `${stardust} 3s ease-out infinite`,
  },

  // Morphing effects
  '.morph': {
    animation: `${morph} 8s ease-in-out infinite`,
  },
  '.shape-shift': {
    animation: `${shapeShift} 4s ease-in-out infinite`,
  },

  // Text effects
  '.text-typewriter': {
    overflow: 'hidden',
    borderRight: '0.15em solid',
    whiteSpace: 'nowrap',
    animation: `${typewriter} 3.5s steps(40, end)`,
  },
  '.text-glitch': {
    animation: `${textGlitch} 0.5s ease-in-out infinite`,
  },
  '.text-shimmer': {
    background: 'linear-gradient(90deg, #6B4BAF 0%, #2FB2DD 50%, #6B4BAF 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${shimmerText} 3s linear infinite`,
  },

  // Wave effects
  '.ripple': {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      border: '2px solid currentColor',
      animation: `${ripple} 1.5s ease-out infinite`,
    },
  },
  '.wave': {
    animation: `${wave} 2s linear infinite`,
  },

  // Magic cast effects
  '.spell-cast': {
    animation: `${spellCast} 1s ease-out`,
  },
  '.magic-circle': {
    animation: `${magicCircle} 2s ease-in-out`,
  },
  '.wand-wave': {
    animation: `${wandWave} 0.8s ease-in-out`,
  },

  // Compound effects
  '.magical-hover': {
    transition: 'all 0.3s ease',
    '&:hover': {
      animation: `${levitate} 1s ease-in-out, ${magicalGlow} 1.5s ease-in-out`,
      transform: 'translateY(-5px)',
      filter: 'brightness(1.1)',
    },
  },
  '.lightning-hover': {
    position: 'relative',
    overflow: 'hidden',
    '&:hover::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, currentColor, transparent)',
      transform: 'translate(-50%, -50%)',
      animation: `${lightningStrike} 0.5s ease-out`,
    },
  },
};

// ============= ANIMATION UTILITY FUNCTIONS =============

export const getRandomDelay = () => Math.random() * 2;
export const getRandomDuration = (min = 1, max = 3) => min + Math.random() * (max - min);
export const getRandomRotation = () => Math.random() * 360;

export const applyMagicalAnimation = (element, animationType, options = {}) => {
  const {
    duration = '1s',
    delay = '0s',
    iteration = 'infinite',
    timing = 'ease-in-out',
  } = options;

  const animationMap = {
    sparkle,
    glow: magicalGlow,
    levitate,
    lightning: lightningStrike,
    portal,
    glitch,
    aurora: auroraWave,
  };

  const animation = animationMap[animationType];
  if (animation) {
    element.style.animation = `${animation} ${duration} ${timing} ${delay} ${iteration}`;
  }
};

// ============= TRANSITION CONFIGURATIONS =============

export const magicalTransitions = {
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  bouncy: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  snap: 'all 0.15s cubic-bezier(0.4, 0, 1, 1)',
  morph: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
  magical: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// ============= HOVER EFFECT PRESETS =============

export const magicalHoverEffects = {
  glow: {
    transition: magicalTransitions.smooth,
    '&:hover': {
      boxShadow: '0 0 20px rgba(107, 75, 175, 0.6)',
      transform: 'translateY(-2px)',
    },
  },
  levitate: {
    transition: magicalTransitions.smooth,
    '&:hover': {
      animation: `${levitate} 1s ease-in-out`,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
  },
  lightning: {
    position: 'relative',
    overflow: 'hidden',
    '&:hover::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #2FB2DD, transparent)',
      transform: 'translate(-50%, -50%)',
      animation: `${lightningStrike} 0.5s ease-out`,
    },
  },
  sparkle: {
    position: 'relative',
    '&:hover::after': {
      content: '"✨"',
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      animation: `${sparkle} 0.8s ease-in-out`,
    },
  },
  portal: {
    transition: magicalTransitions.smooth,
    '&:hover': {
      animation: `${portal} 1s ease-in-out`,
      borderRadius: '50%',
    },
  },
  glitch: {
    '&:hover': {
      animation: `${glitch} 0.3s ease-in-out`,
    },
  },
  morph: {
    transition: magicalTransitions.morph,
    '&:hover': {
      animation: `${morph} 2s ease-in-out infinite`,
    },
  },
};

// Export everything as a combined object for easy importing
export default {
  animations: {
    sparkle,
    starBurst,
    magicalGlow,
    lightningStrike,
    energyPulse,
    plasmaFlow,
    levitate,
    mysticalFloat,
    bobbing,
    wandWave,
    spellCast,
    magicCircle,
    portal,
    vortex,
    dimensionShift,
    magicalEntrance,
    fadeInSparkle,
    smokeDisappear,
    glitch,
    digitalNoise,
    matrixRain,
    auroraWave,
    particleOrbit,
    stardust,
    morph,
    shapeShift,
    typewriter,
    textGlitch,
    shimmerText,
    ripple,
    wave,
  },
  classes: magicalAnimationClasses,
  transitions: magicalTransitions,
  hoverEffects: magicalHoverEffects,
  utils: {
    getRandomDelay,
    getRandomDuration,
    getRandomRotation,
    applyMagicalAnimation,
  },
};