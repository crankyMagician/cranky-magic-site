import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    ANIMATION_STATES,
    ANIMATION_DURATION,
    ANIMATION_DELAY,
    ANIMATION_EASING,
    animationVariants,
    prefersReducedMotion,
    getStaggerDelay,
    createAnimationConfig,
} from '../animations/portfolioAnimations';
import {
    ANIMATION_TIMING,
    STORAGE_KEYS,
    ANALYTICS_EVENTS,
} from '../components/landing/utils/portfolioConstants';
import { useIntersectionObserver, useMultipleIntersectionObserver } from './useIntersectionObserver';

/**
 * Custom hook for controlling animations with advanced features
 * @param {Object} options - Configuration options
 * @param {string} options.animationType - Type of animation from animationVariants
 * @param {number} options.duration - Animation duration in ms
 * @param {number} options.delay - Animation delay in ms
 * @param {string} options.easing - Easing function
 * @param {boolean} options.triggerOnScroll - Whether to trigger on scroll
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @param {Function} options.onStart - Callback when animation starts
 * @param {Function} options.onComplete - Callback when animation completes
 * @param {boolean} options.respectReducedMotion - Whether to respect reduced motion preference
 * @param {boolean} options.trackAnalytics - Whether to track animation events
 * @returns {Object} - Animation control object
 */
export const useAnimationControl = (options = {}) => {
    const {
        animationType = 'fadeIn',
        duration = ANIMATION_DURATION.NORMAL,
        delay = ANIMATION_DELAY.NONE,
        easing = ANIMATION_EASING.EASE_IN_OUT,
        triggerOnScroll = true,
        triggerOnce = true,
        onStart = null,
        onComplete = null,
        respectReducedMotion = true,
        trackAnalytics = false,
    } = options;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [animationState, setAnimationState] = useState(ANIMATION_STATES.IDLE);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    const animationTimeoutRef = useRef(null);
    const startTimeRef = useRef(null);
    const pausedTimeRef = useRef(0);
    const isPausedRef = useRef(false);

    // Check for reduced motion preference
    const shouldReduceMotion = useMemo(() => {
        if (!respectReducedMotion) return false;
        return prefersReducedMotion();
    }, [respectReducedMotion]);

    // Check localStorage for animation preference
    const animationsEnabled = useMemo(() => {
        try {
            const preference = localStorage.getItem(STORAGE_KEYS.ANIMATION_PREFERENCE);
            return preference !== 'disabled';
        } catch {
            return true;
        }
    }, []);

    // Calculate adjusted timing based on device
    const adjustedDuration = useMemo(() => {
        if (shouldReduceMotion) return 0;
        if (isMobile) return duration * 0.8;
        if (isTablet) return duration * 0.9;
        return duration;
    }, [duration, isMobile, isTablet, shouldReduceMotion]);

    const adjustedDelay = useMemo(() => {
        if (shouldReduceMotion) return 0;
        if (isMobile) return delay * 0.8;
        return delay;
    }, [delay, isMobile, shouldReduceMotion]);

    // Get animation variant
    const animationVariant = useMemo(() => {
        return animationVariants[animationType] || animationVariants.fadeIn;
    }, [animationType]);

    // Intersection observer for scroll-triggered animations
    const { ref, isIntersecting, trigger: manualTrigger, reset: resetObserver } = useIntersectionObserver({
        triggerOnce,
        threshold: 0.1,
        rootMargin: '-50px 0px',
        initialValue: false,
        freezeOnceVisible: triggerOnce,
    });

    // Animation lifecycle management
    const startAnimation = useCallback(() => {
        if (!animationsEnabled || (hasAnimated && triggerOnce)) return;

        // Clear any existing timeout
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        setAnimationState(ANIMATION_STATES.ENTERING);
        setIsAnimating(true);
        startTimeRef.current = Date.now();

        // Call onStart callback
        if (onStart) {
            onStart();
        }

        // Track analytics event
        if (trackAnalytics && window.analytics) {
            window.analytics.track(ANALYTICS_EVENTS.ANIMATION_COMPLETE, {
                animationType,
                duration: adjustedDuration,
                delay: adjustedDelay,
            });
        }

        // Handle animation completion
        animationTimeoutRef.current = setTimeout(() => {
            setAnimationState(ANIMATION_STATES.ENTERED);
            setIsAnimating(false);
            setHasAnimated(true);

            // Call onComplete callback
            if (onComplete) {
                onComplete();
            }
        }, adjustedDuration + adjustedDelay);
    }, [
        animationsEnabled,
        hasAnimated,
        triggerOnce,
        onStart,
        onComplete,
        trackAnalytics,
        animationType,
        adjustedDuration,
        adjustedDelay,
    ]);

    // Pause animation
    const pauseAnimation = useCallback(() => {
        if (!isAnimating || isPausedRef.current) return;

        isPausedRef.current = true;
        pausedTimeRef.current = Date.now() - startTimeRef.current;

        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        setAnimationState(ANIMATION_STATES.IDLE);
    }, [isAnimating]);

    // Resume animation
    const resumeAnimation = useCallback(() => {
        if (!isPausedRef.current) return;

        isPausedRef.current = false;
        const remainingTime = adjustedDuration - pausedTimeRef.current;

        setAnimationState(ANIMATION_STATES.ENTERING);

        animationTimeoutRef.current = setTimeout(() => {
            setAnimationState(ANIMATION_STATES.ENTERED);
            setIsAnimating(false);
            setHasAnimated(true);

            if (onComplete) {
                onComplete();
            }
        }, remainingTime);
    }, [adjustedDuration, onComplete]);

    // Reset animation
    const resetAnimation = useCallback(() => {
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        setAnimationState(ANIMATION_STATES.IDLE);
        setIsAnimating(false);
        setHasAnimated(false);
        startTimeRef.current = null;
        pausedTimeRef.current = 0;
        isPausedRef.current = false;

        if (triggerOnScroll) {
            resetObserver();
        }
    }, [triggerOnScroll, resetObserver]);

    // Exit animation
    const exitAnimation = useCallback(() => {
        setAnimationState(ANIMATION_STATES.EXITING);

        setTimeout(() => {
            setAnimationState(ANIMATION_STATES.EXITED);
            setIsAnimating(false);
        }, ANIMATION_TIMING.EXIT_DURATION);
    }, []);

    // Trigger animation based on scroll intersection
    useEffect(() => {
        if (triggerOnScroll && isIntersecting && !hasAnimated) {
            startAnimation();
        }
    }, [triggerOnScroll, isIntersecting, hasAnimated, startAnimation]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, []);

    // Generate animation styles
    const animationStyles = useMemo(() => {
        if (shouldReduceMotion || !animationsEnabled) {
            return animationVariant.animate;
        }

        const config = createAnimationConfig({
            duration: adjustedDuration,
            delay: adjustedDelay,
            easing,
        });

        switch (animationState) {
            case ANIMATION_STATES.IDLE:
            case ANIMATION_STATES.EXITED:
                return animationVariant.initial;
            case ANIMATION_STATES.ENTERING:
                return {
                    ...animationVariant.animate,
                    transition: `all ${config.animationDuration} ${config.animationTimingFunction} ${config.animationDelay}`,
                };
            case ANIMATION_STATES.ENTERED:
                return animationVariant.animate;
            case ANIMATION_STATES.EXITING:
                return {
                    ...animationVariant.exit,
                    transition: `all ${ANIMATION_TIMING.EXIT_DURATION}ms ${easing}`,
                };
            default:
                return {};
        }
    }, [
        shouldReduceMotion,
        animationsEnabled,
        animationState,
        animationVariant,
        adjustedDuration,
        adjustedDelay,
        easing,
    ]);

    // Animation CSS classes
    const animationClasses = useMemo(() => {
        const classes = [];
        if (isAnimating) classes.push('is-animating');
        if (hasAnimated) classes.push('has-animated');
        classes.push(`animation-${animationState}`);
        return classes.join(' ');
    }, [isAnimating, hasAnimated, animationState]);

    return {
        ref: triggerOnScroll ? ref : null,
        animationStyles,
        animationClasses,
        animationState,
        isAnimating,
        hasAnimated,
        startAnimation,
        pauseAnimation,
        resumeAnimation,
        resetAnimation,
        exitAnimation,
        trigger: manualTrigger,
    };
};

/**
 * Hook for orchestrating multiple animations in sequence
 * @param {Array} animations - Array of animation configurations
 * @param {Object} options - Orchestration options
 * @returns {Object} - Orchestration control object
 */
export const useAnimationOrchestrator = (animations = [], options = {}) => {
    const {
        staggerDelay = ANIMATION_DELAY.STAGGER_BASE,
        sequential = false,
        loop = false,
        autoStart = false,
        onSequenceComplete = null,
    } = options;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    const sequenceTimeoutRef = useRef(null);

    // Create fixed animation controls - this avoids the React hooks rule violation
    // We create a maximum number of controls that we expect to need
    const control1 = useAnimationControl({ triggerOnScroll: false });
    const control2 = useAnimationControl({ triggerOnScroll: false });
    const control3 = useAnimationControl({ triggerOnScroll: false });
    const control4 = useAnimationControl({ triggerOnScroll: false });
    const control5 = useAnimationControl({ triggerOnScroll: false });
    const control6 = useAnimationControl({ triggerOnScroll: false });
    const control7 = useAnimationControl({ triggerOnScroll: false });
    const control8 = useAnimationControl({ triggerOnScroll: false });

    // Create array of all available controls
    const allControls = [control1, control2, control3, control4, control5, control6, control7, control8];

    // Configure each control with its animation options
    useEffect(() => {
        animations.forEach((animation, index) => {
            if (index < allControls.length) {
                const control = allControls[index];
                // Update control configuration
                control.animationType = animation.animationType || 'fadeIn';
                control.duration = animation.duration || ANIMATION_DURATION.NORMAL;
                control.delay = animation.delay || ANIMATION_DELAY.NONE;
                control.easing = animation.easing || ANIMATION_EASING.EASE_IN_OUT;
            }
        });
    }, [animations]);

    // Get only the controls we need for our animations
    const animationControls = useMemo(() => {
        return allControls.slice(0, Math.min(animations.length, allControls.length));
    }, [animations.length]);

    // Play next animation in sequence
    const playNext = useCallback(() => {
        if (currentIndex < animations.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, animations.length]);

    // Handle sequence completion
    const handleSequenceComplete = useCallback(() => {
        setHasCompleted(true);
        setIsPlaying(false);

        if (onSequenceComplete) {
            onSequenceComplete();
        }

        if (loop) {
            setTimeout(() => {
                resetSequence();
                startSequence();
            }, 1000);
        }
    }, [loop, onSequenceComplete]);

    // Start animation sequence
    const startSequence = useCallback(() => {
        setIsPlaying(true);
        setHasCompleted(false);

        if (sequential) {
            // Start first animation
            if (animationControls[0]) {
                animationControls[0].startAnimation();

                // Set up completion handlers for sequential animation
                for (let i = 0; i < animationControls.length; i++) {
                    const control = animationControls[i];
                    control.onComplete = () => {
                        if (i < animationControls.length - 1) {
                            animationControls[i + 1].startAnimation();
                        } else {
                            handleSequenceComplete();
                        }
                    };
                }
            }
        } else {
            // Start all animations with stagger
            animationControls.forEach((control, index) => {
                sequenceTimeoutRef.current = setTimeout(() => {
                    control.startAnimation();

                    // If this is the last animation, set up completion handler
                    if (index === animationControls.length - 1) {
                        control.onComplete = handleSequenceComplete;
                    }
                }, getStaggerDelay(index, staggerDelay));
            });
        }
    }, [sequential, animationControls, staggerDelay, handleSequenceComplete]);

    // Pause sequence
    const pauseSequence = useCallback(() => {
        setIsPlaying(false);
        animationControls.forEach((control) => control.pauseAnimation());
    }, [animationControls]);

    // Resume sequence
    const resumeSequence = useCallback(() => {
        setIsPlaying(true);
        if (sequential) {
            animationControls[currentIndex].resumeAnimation();
        } else {
            animationControls.forEach((control) => control.resumeAnimation());
        }
    }, [sequential, currentIndex, animationControls]);

    // Reset sequence
    const resetSequence = useCallback(() => {
        if (sequenceTimeoutRef.current) {
            clearTimeout(sequenceTimeoutRef.current);
        }
        setCurrentIndex(0);
        setIsPlaying(false);
        setHasCompleted(false);
        animationControls.forEach((control) => control.resetAnimation());
    }, [animationControls]);

    // Auto-start if enabled
    useEffect(() => {
        if (autoStart && !isPlaying && !hasCompleted) {
            startSequence();
        }
    }, [autoStart, isPlaying, hasCompleted, startSequence]);

    // Trigger current animation in sequential mode
    useEffect(() => {
        if (sequential && isPlaying && currentIndex > 0) {
            animationControls[currentIndex].startAnimation();
        }
    }, [sequential, isPlaying, currentIndex, animationControls]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sequenceTimeoutRef.current) {
                clearTimeout(sequenceTimeoutRef.current);
            }
        };
    }, []);

    return {
        animationControls,
        currentIndex,
        isPlaying,
        hasCompleted,
        startSequence,
        pauseSequence,
        resumeSequence,
        resetSequence,
    };
};

/**
 * Hook for staggered animations on multiple elements
 * @param {Object} options - Configuration options
 * @returns {Object} - Stagger animation control
 */
export const useStaggerAnimation = (options = {}) => {
    const {
        animationType = 'fadeInUp',
        baseDelay = ANIMATION_DELAY.NONE,
        staggerDelay = ANIMATION_DELAY.STAGGER_BASE,
        duration = ANIMATION_DURATION.NORMAL,
        easing = ANIMATION_EASING.EASE_OUT,
        triggerOnScroll = true,
        threshold = 0.1,
        rootMargin = '-50px 0px',
    } = options;

    const [animatedItems, setAnimatedItems] = useState(new Set());
    const itemsRef = useRef(new Map());

    const { addElement, isIntersecting } = useMultipleIntersectionObserver({
        threshold,
        rootMargin,
        triggerOnce: true,
    });

    // Register item for animation
    const registerItem = useCallback(
        (id, element) => {
            if (!element) return;

            itemsRef.current.set(id, element);
            const cleanup = addElement(id, element);

            return () => {
                itemsRef.current.delete(id);
                cleanup();
            };
        },
        [addElement]
    );

    // Get animation styles for an item
    const getItemStyles = useCallback(
        (id, index = 0) => {
            const isItemIntersecting = triggerOnScroll ? isIntersecting[id] : true;
            const hasAnimated = animatedItems.has(id);
            const shouldAnimate = isItemIntersecting && !hasAnimated;

            if (shouldAnimate && !animatedItems.has(id)) {
                setAnimatedItems((prev) => new Set(prev).add(id));
            }

            const variant = animationVariants[animationType] || animationVariants.fadeIn;
            const delay = baseDelay + getStaggerDelay(index, staggerDelay);

            if (!shouldAnimate && !hasAnimated) {
                return variant.initial;
            }

            return {
                ...variant.animate,
                transition: `all ${duration}ms ${easing} ${delay}ms`,
            };
        },
        [
            triggerOnScroll,
            isIntersecting,
            animatedItems,
            animationType,
            baseDelay,
            staggerDelay,
            duration,
            easing,
        ]
    );

    // Reset all animations
    const resetAll = useCallback(() => {
        setAnimatedItems(new Set());
    }, []);

    return {
        registerItem,
        getItemStyles,
        animatedItems,
        resetAll,
    };
};

export default useAnimationControl;