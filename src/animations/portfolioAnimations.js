import { keyframes } from '@mui/material/styles';

// Animation Timing Constants
export const ANIMATION_DURATION = {
    INSTANT: 0,
    FAST: 200,
    NORMAL: 300,
    MEDIUM: 500,
    SLOW: 800,
    VERY_SLOW: 1000,
    EXTRA_SLOW: 1500,
};

export const ANIMATION_DELAY = {
    NONE: 0,
    SHORT: 100,
    MEDIUM: 200,
    LONG: 400,
    STAGGER_BASE: 50,
};

export const ANIMATION_EASING = {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    ELASTIC: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    BOUNCE: 'cubic-bezier(0.87, -0.41, 0.19, 1.44)',
    LINEAR: 'linear',
};

// Keyframe Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const slideInBottom = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const rotateIn = keyframes`
  from {
    opacity: 0;
    transform: rotate(-180deg);
  }
  to {
    opacity: 1;
    transform: rotate(0);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Animation Variants for Framer Motion compatibility
export const animationVariants = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    fadeInUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 30 },
    },
    fadeInDown: {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
    },
    fadeInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    },
    fadeInRight: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 30 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    },
    rotateIn: {
        initial: { opacity: 0, rotate: -180 },
        animate: { opacity: 1, rotate: 0 },
        exit: { opacity: 0, rotate: 180 },
    },
};

// Stagger Animation Helper
export const getStaggerDelay = (index, baseDelay = ANIMATION_DELAY.STAGGER_BASE) => {
    return index * baseDelay;
};

// Animation Configuration Helper
export const createAnimationConfig = ({
                                          duration = ANIMATION_DURATION.NORMAL,
                                          delay = ANIMATION_DELAY.NONE,
                                          easing = ANIMATION_EASING.EASE_IN_OUT,
                                          fillMode = 'both',
                                      }) => ({
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
    animationTimingFunction: easing,
    animationFillMode: fillMode,
});

// Section Animation Configurations
export const sectionAnimations = {
    hero: {
        container: createAnimationConfig({
            duration: ANIMATION_DURATION.SLOW,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
        title: createAnimationConfig({
            duration: ANIMATION_DURATION.MEDIUM,
            delay: ANIMATION_DELAY.SHORT,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
        subtitle: createAnimationConfig({
            duration: ANIMATION_DURATION.MEDIUM,
            delay: ANIMATION_DELAY.MEDIUM,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
        cta: createAnimationConfig({
            duration: ANIMATION_DURATION.MEDIUM,
            delay: ANIMATION_DELAY.LONG,
            easing: ANIMATION_EASING.ELASTIC,
        }),
    },
    skills: {
        container: createAnimationConfig({
            duration: ANIMATION_DURATION.MEDIUM,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
        card: createAnimationConfig({
            duration: ANIMATION_DURATION.NORMAL,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
    },
    projects: {
        container: createAnimationConfig({
            duration: ANIMATION_DURATION.MEDIUM,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
        card: createAnimationConfig({
            duration: ANIMATION_DURATION.NORMAL,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
    },
    timeline: {
        container: createAnimationConfig({
            duration: ANIMATION_DURATION.MEDIUM,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
        item: createAnimationConfig({
            duration: ANIMATION_DURATION.NORMAL,
            easing: ANIMATION_EASING.EASE_OUT,
        }),
    },
};

// Scroll-triggered Animation Helper
export const getScrollAnimationConfig = (isVisible, delay = 0) => {
    return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all ${ANIMATION_DURATION.NORMAL}ms ${ANIMATION_EASING.EASE_OUT} ${delay}ms`,
    };
};

// Performance-optimized Animation CSS Helper
export const getOptimizedAnimationStyles = (animationName, config = {}) => {
    const defaultConfig = createAnimationConfig(config);
    return {
        animation: `${animationName} ${defaultConfig.animationDuration} ${defaultConfig.animationTimingFunction} ${defaultConfig.animationDelay} ${defaultConfig.animationFillMode}`,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        transform: 'translateZ(0)', // Hardware acceleration
    };
};

// Batch Animation Helper for Multiple Elements
export const batchAnimate = (elements, animationConfig, staggerDelay = ANIMATION_DELAY.STAGGER_BASE) => {
    return elements.map((element, index) => ({
        ...element,
        animationDelay: getStaggerDelay(index, staggerDelay),
        ...animationConfig,
    }));
};

// Animation State Machine
export const ANIMATION_STATES = {
    IDLE: 'idle',
    ENTERING: 'entering',
    ENTERED: 'entered',
    EXITING: 'exiting',
    EXITED: 'exited',
};

// Reduced Motion Query Helper
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation Class Names for CSS
export const animationClasses = {
    fadeIn: 'portfolio-fade-in',
    fadeInUp: 'portfolio-fade-in-up',
    fadeInDown: 'portfolio-fade-in-down',
    fadeInLeft: 'portfolio-fade-in-left',
    fadeInRight: 'portfolio-fade-in-right',
    scaleIn: 'portfolio-scale-in',
    slideInBottom: 'portfolio-slide-in-bottom',
    rotateIn: 'portfolio-rotate-in',
    pulse: 'portfolio-pulse',
    shimmer: 'portfolio-shimmer',
};