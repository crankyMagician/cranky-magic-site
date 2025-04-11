import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { SESSION_EVENTS } from '../constants/events';

/**
 * Hook for tracking user session metrics
 *
 * @param {Object} options - Configuration options
 * @returns {Object} - Session data
 */
export const useSessionTracking = (options = {}) => {
    const {
        heartbeatInterval = 60000, // 1 minute
        inactivityTimeout = 180000, // 3 minutes (user considered inactive after this time)
        activityEvents = ['mousemove', 'click', 'keypress', 'scroll', 'touchstart']
    } = options;

    const { trackEvent } = useAnalytics();

    // State
    const [isActive, setIsActive] = useState(true);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [activeDuration, setActiveDuration] = useState(0);
    const [inactiveDuration, setInactiveDuration] = useState(0);

    // Refs to store values between renders
    const sessionStartTimeRef = useRef(Date.now());
    const lastActiveTimeRef = useRef(Date.now());
    const activityTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const activeDurationIntervalRef = useRef(null);
    const inactiveDurationIntervalRef = useRef(null);

    // Track active/inactive status and session duration
    useEffect(() => {
        // Mark the start of the session
        trackEvent(SESSION_EVENTS.START, {
            timestamp: sessionStartTimeRef.current,
            session_id: null, // The AnalyticsContext will add the session ID
            user_agent: navigator.userAgent,
            referrer: document.referrer,
            landing_page: window.location.pathname
        });

        // Set up session duration tracking
        const sessionTrackingInterval = setInterval(() => {
            setSessionDuration(Date.now() - sessionStartTimeRef.current);
        }, 1000);

        // Set up active duration tracking
        activeDurationIntervalRef.current = setInterval(() => {
            if (isActive) {
                setActiveDuration(prev => prev + 1000);
            }
        }, 1000);

        // Set up inactive duration tracking
        inactiveDurationIntervalRef.current = setInterval(() => {
            if (!isActive) {
                setInactiveDuration(prev => prev + 1000);
            }
        }, 1000);

        // Set up heartbeat interval to periodically send session data
        heartbeatIntervalRef.current = setInterval(() => {
            trackEvent(SESSION_EVENTS.HEARTBEAT, {
                session_duration_ms: Date.now() - sessionStartTimeRef.current,
                active_duration_ms: activeDuration,
                inactive_duration_ms: inactiveDuration,
                is_active: isActive,
                current_page: window.location.pathname,
                time_since_last_activity_ms: Date.now() - lastActiveTimeRef.current
            });
        }, heartbeatInterval);

        // Handler for user activity
        const handleActivity = () => {
            // Get current state from ref to avoid closure issues
            const wasInactive = !isActive;

            // If user was inactive, track return to active state
            if (wasInactive) {
                const inactiveTime = Date.now() - lastActiveTimeRef.current;

                setIsActive(true);
                trackEvent(SESSION_EVENTS.USER_ACTIVE, {
                    inactive_duration_ms: inactiveTime,
                    session_duration_ms: Date.now() - sessionStartTimeRef.current
                });
            }

            // Update last active time
            lastActiveTimeRef.current = Date.now();

            // Clear existing timeout
            if (activityTimeoutRef.current) {
                clearTimeout(activityTimeoutRef.current);
            }

            // Set inactivity timeout
            activityTimeoutRef.current = setTimeout(() => {
                // If user is still active, mark as inactive
                if (isActive) {
                    setIsActive(false);

                    trackEvent(SESSION_EVENTS.USER_INACTIVE, {
                        active_duration_ms: Date.now() - lastActiveTimeRef.current,
                        session_duration_ms: Date.now() - sessionStartTimeRef.current,
                        last_active_page: window.location.pathname
                    });
                }
            }, inactivityTimeout);
        };

        // Add listeners for all activity events
        activityEvents.forEach(eventType => {
            window.addEventListener(eventType, handleActivity, { passive: true });
        });

        // Initialize the activity timer
        handleActivity();

        // Cleanup function
        return () => {
            // Clear all intervals and timeouts
            clearInterval(sessionTrackingInterval);
            clearInterval(heartbeatIntervalRef.current);
            clearInterval(activeDurationIntervalRef.current);
            clearInterval(inactiveDurationIntervalRef.current);
            clearTimeout(activityTimeoutRef.current);

            // Remove event listeners
            activityEvents.forEach(eventType => {
                window.removeEventListener(eventType, handleActivity);
            });

            // Track session end
            const endTime = Date.now();
            trackEvent(SESSION_EVENTS.END, {
                session_duration_ms: endTime - sessionStartTimeRef.current,
                active_duration_ms: activeDuration,
                inactive_duration_ms: inactiveDuration,
                end_reason: 'unmount',
                current_page: window.location.pathname
            });
        };
    }, [isActive, trackEvent, heartbeatInterval, inactivityTimeout, activityEvents, activeDuration, inactiveDuration]);

    // Also track visibility changes (user switching tabs or minimizing window)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // User switched away from tab
                trackEvent(SESSION_EVENTS.VISIBILITY_CHANGE, {
                    visibility: 'hidden',
                    session_duration_ms: Date.now() - sessionStartTimeRef.current,
                    active_duration_ms: activeDuration,
                    inactive_duration_ms: inactiveDuration,
                    current_page: window.location.pathname
                });

                // Consider user inactive
                if (isActive) {
                    setIsActive(false);

                    trackEvent(SESSION_EVENTS.USER_INACTIVE, {
                        active_duration_ms: activeDuration,
                        session_duration_ms: Date.now() - sessionStartTimeRef.current,
                        reason: 'visibility_change',
                        last_active_page: window.location.pathname
                    });
                }
            } else if (document.visibilityState === 'visible') {
                // User switched back to tab
                trackEvent(SESSION_EVENTS.VISIBILITY_CHANGE, {
                    visibility: 'visible',
                    session_duration_ms: Date.now() - sessionStartTimeRef.current,
                    active_duration_ms: activeDuration,
                    inactive_duration_ms: inactiveDuration,
                    current_page: window.location.pathname
                });

                // Consider the user active again
                const wasInactive = !isActive;
                if (wasInactive) {
                    setIsActive(true);
                    lastActiveTimeRef.current = Date.now();

                    trackEvent(SESSION_EVENTS.USER_ACTIVE, {
                        inactive_duration_ms: inactiveDuration,
                        session_duration_ms: Date.now() - sessionStartTimeRef.current,
                        reason: 'visibility_change'
                    });

                    // Restart inactivity timeout
                    if (activityTimeoutRef.current) {
                        clearTimeout(activityTimeoutRef.current);
                    }

                    activityTimeoutRef.current = setTimeout(() => {
                        if (isActive) {
                            setIsActive(false);

                            trackEvent(SESSION_EVENTS.USER_INACTIVE, {
                                active_duration_ms: Date.now() - lastActiveTimeRef.current,
                                session_duration_ms: Date.now() - sessionStartTimeRef.current,
                                reason: 'timeout',
                                last_active_page: window.location.pathname
                            });
                        }
                    }, inactivityTimeout);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isActive, trackEvent, inactivityTimeout, activeDuration, inactiveDuration]);

    // Also handle before unload to track when user closes tab or navigates away
    useEffect(() => {
        const handleBeforeUnload = () => {
            trackEvent(SESSION_EVENTS.END, {
                session_duration_ms: Date.now() - sessionStartTimeRef.current,
                active_duration_ms: activeDuration,
                inactive_duration_ms: inactiveDuration,
                end_reason: 'page_close',
                current_page: window.location.pathname
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [trackEvent, activeDuration, inactiveDuration]);

    // Return session data
    return {
        isActive,
        sessionDuration,
        activeDuration,
        inactiveDuration,
        sessionStartTime: sessionStartTimeRef.current,
        lastActiveTime: lastActiveTimeRef.current,
        getTimeSinceLastActivity: () => Date.now() - lastActiveTimeRef.current
    };
};

export default useSessionTracking;