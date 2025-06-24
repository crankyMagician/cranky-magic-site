import { useState, useEffect, useRef, useCallback } from 'react';
import { INTERSECTION_CONFIG } from '../components/landing/utils/portfolioConstants';

/**
 * Custom hook for Intersection Observer with advanced features
 * @param {Object} options - Configuration options
 * @param {number|number[]} options.threshold - Visibility threshold(s)
 * @param {string} options.root - Root element selector
 * @param {string} options.rootMargin - Root margin
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @param {Function} options.onChange - Callback when intersection changes
 * @param {boolean} options.initialValue - Initial visibility state
 * @param {number} options.delay - Delay before observing (ms)
 * @param {boolean} options.trackVisibility - Track visibility percentage
 * @param {boolean} options.freezeOnceVisible - Keep visible state once triggered
 * @returns {Object} - { ref, isIntersecting, entry, visibilityRatio }
 */
export const useIntersectionObserver = (options = {}) => {
    const {
        threshold = INTERSECTION_CONFIG.DEFAULT_THRESHOLD,
        root = null,
        rootMargin = INTERSECTION_CONFIG.ROOT_MARGIN,
        triggerOnce = false,
        onChange = null,
        initialValue = false,
        delay = 0,
        trackVisibility = false,
        freezeOnceVisible = false,
    } = options;

    const [entry, setEntry] = useState(null);
    const [isIntersecting, setIsIntersecting] = useState(initialValue);
    const [visibilityRatio, setVisibilityRatio] = useState(0);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    const elementRef = useRef(null);
    const observerRef = useRef(null);
    const unsubscribeRef = useRef(null);
    const delayTimeoutRef = useRef(null);
    const frozen = useRef(false);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (observerRef.current && elementRef.current) {
            observerRef.current.unobserve(elementRef.current);
        }
        if (delayTimeoutRef.current) {
            clearTimeout(delayTimeoutRef.current);
        }
    }, []);

    // Observer callback
    const observerCallback = useCallback(
        (entries) => {
            entries.forEach((entry) => {
                const isCurrentlyIntersecting = entry.isIntersecting;
                const ratio = entry.intersectionRatio;

                // Handle freeze on visible logic
                if (freezeOnceVisible && hasBeenVisible && !isCurrentlyIntersecting) {
                    return;
                }

                // Update entry state
                setEntry(entry);

                // Update visibility ratio if tracking
                if (trackVisibility) {
                    setVisibilityRatio(ratio);
                }

                // Update intersection state
                if (isCurrentlyIntersecting) {
                    setIsIntersecting(true);
                    setHasBeenVisible(true);

                    // Handle trigger once logic
                    if (triggerOnce && !frozen.current) {
                        frozen.current = true;
                        cleanup();
                    }
                } else if (!freezeOnceVisible) {
                    setIsIntersecting(false);
                }

                // Call onChange callback if provided
                if (onChange) {
                    onChange(isCurrentlyIntersecting, entry);
                }
            });
        },
        [
            triggerOnce,
            onChange,
            cleanup,
            trackVisibility,
            freezeOnceVisible,
            hasBeenVisible,
        ]
    );

    // Initialize observer
    const initializeObserver = useCallback(() => {
        cleanup();

        if (!elementRef.current) {
            return;
        }

        // Handle frozen state
        if (frozen.current) {
            return;
        }

        // Get root element if selector provided
        const rootElement = root
            ? typeof root === 'string'
                ? document.querySelector(root)
                : root
            : null;

        // Create observer options
        const observerOptions = {
            root: rootElement,
            rootMargin,
            threshold: Array.isArray(threshold) ? threshold : [threshold],
        };

        // Create new observer
        try {
            observerRef.current = new IntersectionObserver(
                observerCallback,
                observerOptions
            );

            // Start observing with delay if specified
            if (delay > 0) {
                delayTimeoutRef.current = setTimeout(() => {
                    if (elementRef.current && observerRef.current) {
                        observerRef.current.observe(elementRef.current);
                    }
                }, delay);
            } else {
                observerRef.current.observe(elementRef.current);
            }
        } catch (error) {
            console.error('Failed to create IntersectionObserver:', error);
            // Fallback to visible state if observer fails
            setIsIntersecting(true);
        }
    }, [root, rootMargin, threshold, observerCallback, cleanup, delay]);

    // Effect to setup observer
    useEffect(() => {
        initializeObserver();

        // Cleanup on unmount
        return () => {
            cleanup();
        };
    }, [initializeObserver, cleanup]);

    // Ref callback to handle element changes
    const setRef = useCallback(
        (node) => {
            if (elementRef.current) {
                // Cleanup previous element
                cleanup();
            }

            elementRef.current = node;

            if (node) {
                // Reinitialize observer for new element
                initializeObserver();
            }
        },
        [cleanup, initializeObserver]
    );

    // Manual trigger function
    const trigger = useCallback(() => {
        setIsIntersecting(true);
        setHasBeenVisible(true);
    }, []);

    // Reset function
    const reset = useCallback(() => {
        frozen.current = false;
        setIsIntersecting(initialValue);
        setHasBeenVisible(false);
        setVisibilityRatio(0);
        initializeObserver();
    }, [initialValue, initializeObserver]);

    return {
        ref: setRef,
        isIntersecting,
        entry,
        visibilityRatio,
        hasBeenVisible,
        trigger,
        reset,
    };
};

/**
 * Hook for observing multiple elements
 * @param {Object} options - Same options as useIntersectionObserver
 * @returns {Object} - { refs, entries, isIntersecting }
 */
export const useMultipleIntersectionObserver = (options = {}) => {
    const {
        threshold = INTERSECTION_CONFIG.DEFAULT_THRESHOLD,
        root = null,
        rootMargin = INTERSECTION_CONFIG.ROOT_MARGIN,
        triggerOnce = false,
        onChange = null,
        freezeOnceVisible = false,
    } = options;

    const [entries, setEntries] = useState({});
    const [isIntersecting, setIsIntersecting] = useState({});

    const observerRef = useRef(null);
    const elementsRef = useRef(new Map());
    const hasBeenVisibleRef = useRef(new Set());

    // Observer callback
    const observerCallback = useCallback(
        (observerEntries) => {
            const newEntries = {};
            const newIsIntersecting = {};

            observerEntries.forEach((entry) => {
                const id = entry.target.getAttribute('data-observer-id');
                if (!id) return;

                const isCurrentlyIntersecting = entry.isIntersecting;

                // Handle freeze on visible logic
                if (
                    freezeOnceVisible &&
                    hasBeenVisibleRef.current.has(id) &&
                    !isCurrentlyIntersecting
                ) {
                    newIsIntersecting[id] = true;
                    return;
                }

                newEntries[id] = entry;
                newIsIntersecting[id] = isCurrentlyIntersecting;

                if (isCurrentlyIntersecting) {
                    hasBeenVisibleRef.current.add(id);

                    // Handle trigger once
                    if (triggerOnce && observerRef.current) {
                        observerRef.current.unobserve(entry.target);
                    }
                }

                // Call onChange callback
                if (onChange) {
                    onChange(id, isCurrentlyIntersecting, entry);
                }
            });

            setEntries((prev) => ({ ...prev, ...newEntries }));
            setIsIntersecting((prev) => ({ ...prev, ...newIsIntersecting }));
        },
        [triggerOnce, onChange, freezeOnceVisible]
    );

    // Initialize observer
    useEffect(() => {
        // Get root element
        const rootElement = root
            ? typeof root === 'string'
                ? document.querySelector(root)
                : root
            : null;

        // Create observer
        try {
            observerRef.current = new IntersectionObserver(observerCallback, {
                root: rootElement,
                rootMargin,
                threshold: Array.isArray(threshold) ? threshold : [threshold],
            });
        } catch (error) {
            console.error('Failed to create IntersectionObserver:', error);
        }

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [root, rootMargin, threshold, observerCallback]);

    // Ref callback for adding elements
    const addElement = useCallback((id, element) => {
        if (!element || !observerRef.current) return;

        // Set data attribute for identification
        element.setAttribute('data-observer-id', id);

        // Store element reference
        elementsRef.current.set(id, element);

        // Start observing
        observerRef.current.observe(element);

        return () => {
            if (observerRef.current && elementsRef.current.has(id)) {
                observerRef.current.unobserve(element);
                elementsRef.current.delete(id);
            }
        };
    }, []);

    // Remove element function
    const removeElement = useCallback((id) => {
        const element = elementsRef.current.get(id);
        if (element && observerRef.current) {
            observerRef.current.unobserve(element);
            elementsRef.current.delete(id);
            setEntries((prev) => {
                const newEntries = { ...prev };
                delete newEntries[id];
                return newEntries;
            });
            setIsIntersecting((prev) => {
                const newIsIntersecting = { ...prev };
                delete newIsIntersecting[id];
                return newIsIntersecting;
            });
        }
    }, []);

    // Reset all observations
    const reset = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            elementsRef.current.forEach((element) => {
                observerRef.current.observe(element);
            });
        }
        hasBeenVisibleRef.current.clear();
        setEntries({});
        setIsIntersecting({});
    }, []);

    return {
        addElement,
        removeElement,
        entries,
        isIntersecting,
        reset,
    };
};

/**
 * Hook for progressive visibility tracking
 * @param {Object} options - Configuration options
 * @returns {Object} - { ref, visibilityPercentage, isFullyVisible, isPartiallyVisible }
 */
export const useProgressiveVisibility = (options = {}) => {
    const {
        thresholds = INTERSECTION_CONFIG.PROGRESSIVE_THRESHOLDS,
        rootMargin = INTERSECTION_CONFIG.ROOT_MARGIN,
        onChange = null,
    } = options;

    const [visibilityPercentage, setVisibilityPercentage] = useState(0);
    const [isFullyVisible, setIsFullyVisible] = useState(false);
    const [isPartiallyVisible, setIsPartiallyVisible] = useState(false);

    const { ref, entry } = useIntersectionObserver({
        threshold: thresholds,
        rootMargin,
        trackVisibility: true,
        onChange: (isIntersecting, entry) => {
            if (entry) {
                const percentage = Math.round(entry.intersectionRatio * 100);
                setVisibilityPercentage(percentage);
                setIsFullyVisible(entry.intersectionRatio >= 0.95);
                setIsPartiallyVisible(entry.intersectionRatio > 0);

                if (onChange) {
                    onChange(percentage, entry);
                }
            }
        },
    });

    return {
        ref,
        visibilityPercentage,
        isFullyVisible,
        isPartiallyVisible,
        entry,
    };
};

// Export a simplified version for basic use cases
export const useIsVisible = (options = {}) => {
    const { ref, isIntersecting } = useIntersectionObserver({
        triggerOnce: true,
        ...options,
    });

    return [ref, isIntersecting];
};

export default useIntersectionObserver;