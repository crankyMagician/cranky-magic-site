import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { INTERACTION_EVENTS } from '../constants/events';

/**
 * Hook for detecting when a user is about to exit the site
 *
 * @param {Object} options - Configuration options
 * @returns {Object} - Exit intent detection data and callbacks
 */
export const useExitIntent = (options = {}) => {
    const {
        threshold = 10, // How many pixels from the top to trigger detection
        delay = 1000, // Minimum time between detections
        maxDisplays = 1, // Max number of times to trigger in a session
        sensitivity = 20, // Mouse speed sensitivity
        enableInMobile = false, // Whether to enable on mobile devices
        onDetected = null, // Callback when exit intent is detected
        cookieName = 'exit_intent_shown', // Cookie for tracking exit intent
        cookieExpireDays = 30 // Cookie expiration in days
    } = options;

    const { trackEvent } = useAnalytics();

    // State
    const [exitIntentDetected, setExitIntentDetected] = useState(false);
    const [displayCount, setDisplayCount] = useState(0);

    // Refs
    const lastDisplayTime = useRef(0);
    const mouseY = useRef(null);
    const mouseX = useRef(null);
    const mouseSpeed = useRef(0);
    const hasCookie = useRef(checkCookie(cookieName));
    const hasExited = useRef(false);

    // Track whether this is a mobile device
    const isMobile = useRef(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    // Disable on mobile if not explicitly enabled
    const isEnabled = !isMobile.current || enableInMobile;

    // Set up exit intent detection
    useEffect(() => {
        if (!isEnabled) return;

        // Don't set up detection if already shown max times
        if (hasCookie.current && displayCount >= maxDisplays) return;

        // Handler for mouse movement
        const handleMouseMove = (e) => {
            // Calculate mouse speed
            if (mouseY.current !== null && mouseX.current !== null) {
                const deltaY = Math.abs(e.clientY - mouseY.current);
                const deltaX = Math.abs(e.clientX - mouseX.current);
                mouseSpeed.current = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
            }

            // Update mouse position
            mouseY.current = e.clientY;
            mouseX.current = e.clientX;
        };

        // Handler for mouse leaving the viewport
        const handleMouseLeave = (e) => {
            // Exit if already shown max times or recently shown
            if (
                displayCount >= maxDisplays ||
                Date.now() - lastDisplayTime.current < delay ||
                hasExited.current
            ) {
                return;
            }

            // Check if the mouse is leaving through the top with sufficient speed
            if (
                e.clientY <= threshold &&
                mouseSpeed.current > sensitivity
            ) {
                // Exit intent detected
                handleExitIntent();
            }
        };

        // Handler for tab visibility changes (tab switching)
        const handleVisibilityChange = () => {
            // Only trigger on switching to hidden state (leaving the tab)
            if (
                document.visibilityState === 'hidden' &&
                displayCount < maxDisplays &&
                Date.now() - lastDisplayTime.current >= delay &&
                !hasExited.current
            ) {
                // Exit intent via tab switch detected
                handleExitIntent('tab_switch');
            }
        };

        // Handler for before unload (page close/navigation)
        const handleBeforeUnload = () => {
            // Only track and don't show dialog (just for analytics)
            if (!hasExited.current) {
                hasExited.current = true;

                trackEvent(INTERACTION_EVENTS.EXIT_INTENT, {
                    trigger_type: 'page_close',
                    session_duration_ms: Date.now() - window.performance.timing.navigationStart,
                    page_path: window.location.pathname,
                    display_count: displayCount,
                    exit_detected: true
                });
            }
        };

        // Handler for exit intent detection
        const handleExitIntent = (triggerType = 'mouse_exit') => {
            setExitIntentDetected(true);
            setDisplayCount(count => count + 1);
            lastDisplayTime.current = Date.now();

            // Set cookie
            setCookie(cookieName, 'true', cookieExpireDays);
            hasCookie.current = true;

            // Track the event
            trackEvent(INTERACTION_EVENTS.EXIT_INTENT, {
                trigger_type: triggerType,
                session_duration_ms: Date.now() - window.performance.timing.navigationStart,
                page_path: window.location.pathname,
                page_title: document.title,
                display_count: displayCount + 1,
                mouse_position_y: mouseY.current,
                mouse_speed: mouseSpeed.current
            });

            // Call provided callback if exists
            if (onDetected && typeof onDetected === 'function') {
                onDetected({
                    triggerType,
                    displayCount: displayCount + 1,
                    mousePosition: { x: mouseX.current, y: mouseY.current },
                    mouseSpeed: mouseSpeed.current
                });
            }
        };

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup on unmount
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [
        isEnabled,
        displayCount,
        threshold,
        sensitivity,
        delay,
        maxDisplays,
        onDetected,
        trackEvent,
        cookieName,
        cookieExpireDays
    ]);

    // Reset exit intent detection
    const resetExitIntent = () => {
        setExitIntentDetected(false);
    };

    // Cookie helper functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    function checkCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length) === 'true';
            }
        }
        return false;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        hasCookie.current = false;
    }

    // Return values and methods
    return {
        exitIntentDetected,
        displayCount,
        resetExitIntent,
        clearCookie: () => deleteCookie(cookieName),
        resetCounter: () => {
            setDisplayCount(0);
            deleteCookie(cookieName);
        },
        isEnabled
    };
};

export default useExitIntent;