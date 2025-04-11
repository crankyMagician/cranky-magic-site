import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../context/AnalyticsContext';
import { SCROLL_EVENTS } from '../constants/events';
import { throttle } from 'lodash';

/**
 * Hook for tracking scroll depth on pages
 *
 * @param {Object} options - Configuration options
 * @returns {Object} - Scroll tracking data
 */
export const useScrollTracking = (options = {}) => {
    const {
        throttleTime = 500,
        reportingThreshold = 10, // Report every 10% scroll depth by default
        maxScrollDepthToTrack = 100, // Maximum depth to track
        trackPagePathInEvent = true, // Include the page path in the event
        elementId = null // Specific element to track scrolling on (default is whole page)
    } = options;

    const { trackEvent } = useAnalytics();
    const location = useLocation();
    const [maxScrollDepth, setMaxScrollDepth] = useState(0);
    const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
    const [currentScrollDepth, setCurrentScrollDepth] = useState(0);
    const [documentHeight, setDocumentHeight] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const currentPathRef = useRef(location.pathname);

    // Calculate scroll depth based on current position
    const calculateScrollDepth = () => {
        let scrollTop, scrollHeight, clientHeight;

        if (elementId) {
            // Track scrolling on a specific element
            const element = document.getElementById(elementId);
            if (!element) return;

            scrollTop = element.scrollTop;
            scrollHeight = element.scrollHeight;
            clientHeight = element.clientHeight;
        } else {
            // Track scrolling on the entire page
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );
            clientHeight = window.innerHeight;
        }

        // Save values for reporting
        setViewportHeight(clientHeight);
        setDocumentHeight(scrollHeight);
        setCurrentScrollPosition(scrollTop);

        // Don't divide by zero
        if (scrollHeight <= clientHeight) {
            setCurrentScrollDepth(100);
            return 100;
        }

        // Calculate percentage scrolled
        const scrollPercent = Math.min(
            maxScrollDepthToTrack,
            Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
        );

        setCurrentScrollDepth(scrollPercent);
        return scrollPercent;
    };

    // Reset tracking when path changes
    useEffect(() => {
        if (currentPathRef.current !== location.pathname) {
            // Track final scroll depth for the previous page
            if (maxScrollDepth > 0) {
                trackEvent(SCROLL_EVENTS.FINAL_DEPTH, {
                    path: currentPathRef.current,
                    scroll_depth_pct: maxScrollDepth,
                    document_height_px: documentHeight,
                    viewport_height_px: viewportHeight
                });
            }

            // Reset for new page
            setMaxScrollDepth(0);
            currentPathRef.current = location.pathname;
        }
    }, [location.pathname, trackEvent, maxScrollDepth, documentHeight, viewportHeight]);

    // Set up scroll tracking
    useEffect(() => {
        // Handler for scroll events
        const handleScroll = throttle(() => {
            const scrollPercent = calculateScrollDepth();

            // Check if we've scrolled deeper than before
            if (scrollPercent > maxScrollDepth) {
                // Only track when we cross a reporting threshold
                const previousThreshold = Math.floor(maxScrollDepth / reportingThreshold) * reportingThreshold;
                const newThreshold = Math.floor(scrollPercent / reportingThreshold) * reportingThreshold;

                if (newThreshold > previousThreshold) {
                    // Track the new scroll depth threshold
                    trackEvent(SCROLL_EVENTS.DEPTH, {
                        ...(trackPagePathInEvent && { path: location.pathname }),
                        scroll_depth_pct: newThreshold,
                        document_height_px: documentHeight,
                        viewport_height_px: viewportHeight,
                        max_reached_pct: scrollPercent
                    });
                }

                setMaxScrollDepth(scrollPercent);
            }
        }, throttleTime);

        // Track initial scroll position (for pages that load already scrolled)
        setTimeout(calculateScrollDepth, 100);

        // Attach scroll event listener
        const targetElement = elementId ? document.getElementById(elementId) : window;
        if (targetElement) {
            targetElement.addEventListener('scroll', handleScroll);
        }

        // Clean up on unmount
        return () => {
            if (targetElement) {
                targetElement.removeEventListener('scroll', handleScroll);
            }

            // Track final scroll depth on unmount
            if (maxScrollDepth > 0) {
                trackEvent(SCROLL_EVENTS.FINAL_DEPTH, {
                    path: location.pathname,
                    scroll_depth_pct: maxScrollDepth,
                    document_height_px: documentHeight,
                    viewport_height_px: viewportHeight
                });
            }
        };
    }, [
        trackEvent,
        throttleTime,
        reportingThreshold,
        maxScrollDepth,
        location.pathname,
        documentHeight,
        viewportHeight,
        elementId,
        trackPagePathInEvent,
        maxScrollDepthToTrack
    ]);

    // Return useful scroll tracking data
    return {
        maxScrollDepth,
        currentScrollDepth,
        currentScrollPosition,
        documentHeight,
        viewportHeight,
        path: location.pathname
    };
};

export default useScrollTracking;