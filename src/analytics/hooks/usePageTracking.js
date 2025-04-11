import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../context/AnalyticsContext';
import { PAGE_EVENTS } from '../constants/events';

/**
 * Hook for tracking page views and time spent on pages
 *
 * @param {Object} options - Configuration options
 * @returns {Object} - Time tracking data
 */
export const usePageTracking = (options = {}) => {
    const {
        reportTimeOnExit = true,
        minimumTimeThreshold = 500 // ms
    } = options;

    const location = useLocation();
    const { trackPageView, trackEvent } = useAnalytics();
    const [startTime, setStartTime] = useState(Date.now());
    const [timeSpent, setTimeSpent] = useState(0);
    const prevPathRef = useRef(null);
    const intervalRef = useRef(null);

    // Track page views when route changes
    useEffect(() => {
        const path = location.pathname;
        const title = document.title;

        // If there was a previous path, track exit time for that page
        if (prevPathRef.current && prevPathRef.current !== path) {
            const timeOnPage = Date.now() - startTime;

            // Only track if we spent some meaningful time on the page
            if (timeOnPage > minimumTimeThreshold && reportTimeOnExit) {
                trackEvent(PAGE_EVENTS.EXIT, {
                    previous_path: prevPathRef.current,
                    next_path: path,
                    time_spent_ms: timeOnPage
                });

                trackEvent(PAGE_EVENTS.TIME_ON_PAGE, {
                    path: prevPathRef.current,
                    time_spent_ms: timeOnPage
                });
            }
        }

        // Track new page view
        trackPageView(path, title);

        // Reset timer
        setStartTime(Date.now());
        prevPathRef.current = path;

        // Start interval timer for tracking active time
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeSpent(prevTimeSpent => prevTimeSpent + 1000);
        }, 1000);

        // Clean up on unmount or page change
        return () => {
            clearInterval(intervalRef.current);

            // Final time tracking on unmount
            const finalTimeOnPage = Date.now() - startTime;
            if (finalTimeOnPage > minimumTimeThreshold && reportTimeOnExit) {
                trackEvent(PAGE_EVENTS.EXIT, {
                    path,
                    time_spent_ms: finalTimeOnPage,
                    exit_type: 'unmount'
                });

                trackEvent(PAGE_EVENTS.TIME_ON_PAGE, {
                    path,
                    time_spent_ms: finalTimeOnPage
                });
            }
        };
    }, [location, trackPageView, trackEvent, minimumTimeThreshold, reportTimeOnExit]);

    // Set up visibility change tracking (tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            const path = location.pathname;
            const currentTime = Date.now();
            const timeOnPage = currentTime - startTime;

            if (document.visibilityState === 'hidden') {
                // User switched away from tab
                trackEvent(PAGE_EVENTS.VISIBILITY_CHANGE, {
                    state: 'hidden',
                    path,
                    time_spent_ms: timeOnPage
                });

                // Pause the interval timer
                clearInterval(intervalRef.current);
            } else if (document.visibilityState === 'visible') {
                // User switched back to tab
                trackEvent(PAGE_EVENTS.VISIBILITY_CHANGE, {
                    state: 'visible',
                    path
                });

                // Restart the interval timer
                intervalRef.current = setInterval(() => {
                    setTimeSpent(prevTimeSpent => prevTimeSpent + 1000);
                }, 1000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [trackEvent, location, startTime]);

    // Return data about current page session
    return {
        path: location.pathname,
        startTime,
        timeSpent,
        activeTracking: !!intervalRef.current
    };
};

export default usePageTracking;