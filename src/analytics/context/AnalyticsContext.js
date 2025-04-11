import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthTokenService from '../../services/AuthTokenService';
import { getDeviceInfo } from '../utils/deviceInfo';
import { getAttributionData } from '../utils/marketingAttribution';

// Create the context
export const AnalyticsContext = createContext(null);

// Create a custom hook to use the analytics context
export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};

// Core analytics values and methods will be exposed through this provider
export const AnalyticsProvider = ({ children, analyticsProviders }) => {
    // Initialize analytics state
    const [providers, setProviders] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [attributionData, setAttributionData] = useState(null);
    const [userProperties, setUserProperties] = useState({});
    const [navigationHistory, setNavigationHistory] = useState([]);

    // Initialize analytics providers and session
    useEffect(() => {
        const initAnalytics = async () => {
            // Generate a unique session ID
            const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            setSessionId(newSessionId);
            setSessionStartTime(Date.now());

            // Get device and browser info
            const deviceData = await getDeviceInfo();
            setDeviceInfo(deviceData);

            // Get attribution data (UTM params, referrer)
            const attribution = getAttributionData();
            setAttributionData(attribution);

            // Initialize analytics providers
            try {
                // Initialize each provider with session and device data
                const initializedProviders = {};
                for (const [name, provider] of Object.entries(analyticsProviders)) {
                    initializedProviders[name] = await provider.initialize({
                        sessionId: newSessionId,
                        deviceInfo: deviceData,
                        attribution
                    });
                }
                setProviders(initializedProviders);

                // Check if user is authenticated and identify them if so
                const { isAuthenticated, user } = AuthTokenService.getAuthInfo();
                if (isAuthenticated && user) {
                    identifyUser(user, initializedProviders);
                }

                setInitialized(true);
                console.log("[Analytics] System initialized");
            } catch (error) {
                console.error("[Analytics] Initialization error:", error);
            }
        };

        initAnalytics();

        // Track session end on unmount
        return () => {
            if (initialized && providers) {
                trackEvent('session_end', {
                    session_duration_ms: Date.now() - sessionStartTime
                });
            }
        };
    }, [analyticsProviders]);

    // Method to track events across all providers
    const trackEvent = (eventName, properties = {}) => {
        if (!initialized || !providers) return;

        // Enrich event with standard properties
        const enrichedProperties = {
            ...properties,
            session_id: sessionId,
            timestamp: Date.now(),
            path: window.location.pathname,
            url: window.location.href,
            // Add other common properties here
        };

        // Track event across all providers
        Object.values(providers).forEach(provider => {
            if (provider && typeof provider.trackEvent === 'function') {
                provider.trackEvent(eventName, enrichedProperties);
            }
        });

        // Debug logging in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] Event: ${eventName}`, enrichedProperties);
        }
    };

    // Method to track page views
    const trackPageView = (path, title) => {
        if (!initialized || !providers) return;

        const pageViewProperties = {
            path,
            title,
            referrer: document.referrer,
            timestamp: Date.now()
        };

        // Track page view in all providers
        Object.values(providers).forEach(provider => {
            if (provider && typeof provider.trackPageView === 'function') {
                provider.trackPageView(path, pageViewProperties);
            }
        });

        // Also track as a standard event
        trackEvent('page_view', pageViewProperties);

        // Update navigation history
        setNavigationHistory(prev => [...prev, {
            path,
            title,
            timestamp: Date.now()
        }]);
    };

    // Method to identify users
    const identifyUser = (user, providersToUse = providers) => {
        if (!user || !providersToUse) return;

        const userProps = {
            id: user.id,
            username: user.username,
            // Add non-sensitive user properties as needed
        };

        // Update user properties in state
        setUserProperties(userProps);

        // Identify user in all providers
        Object.values(providersToUse).forEach(provider => {
            if (provider && typeof provider.identify === 'function') {
                provider.identify(user.id, userProps);
            }
        });

        console.log("[Analytics] User identified:", user.id);
    };

    // Method to track API calls
    const trackApiCall = (endpoint, method, status, duration, payload = null, error = null) => {
        if (!initialized || !providers) return;

        trackEvent('api_call', {
            endpoint,
            method,
            status,
            duration_ms: duration,
            has_payload: !!payload,
            error: error ? error.message : null,
            success: !error
        });
    };

    // Method to track errors
    const trackError = (error, errorInfo = {}) => {
        if (!initialized || !providers) return;

        const errorData = {
            message: error.message,
            stack: error.stack,
            ...errorInfo
        };

        // Track error in all providers
        Object.values(providers).forEach(provider => {
            if (provider && typeof provider.trackError === 'function') {
                provider.trackError(error, errorData);
            }
        });

        // Also track as a standard event
        trackEvent('error', errorData);
    };

    // Method to handle user consent for tracking
    const setConsent = (consentGiven) => {
        if (!providers) return;

        // Update consent across all providers
        Object.values(providers).forEach(provider => {
            if (provider && typeof provider.setConsent === 'function') {
                provider.setConsent(consentGiven);
            }
        });

        // Store consent in localStorage
        localStorage.setItem('analytics_consent', consentGiven ? 'true' : 'false');
        console.log(`[Analytics] Consent ${consentGiven ? 'given' : 'withdrawn'}`);

        // If consent given, track consent event
        if (consentGiven) {
            trackEvent('consent_given', {
                timestamp: Date.now()
            });
        }
    };

    // Expose analytics methods and data through context
    const contextValue = {
        // Core tracking methods
        trackEvent,
        trackPageView,
        trackApiCall,
        trackError,
        identifyUser,
        setConsent,

        // State properties
        initialized,
        sessionId,
        deviceInfo,
        attributionData,
        userProperties,
        navigationHistory,

        // Additional helpers
        getSessionDuration: () => Date.now() - sessionStartTime
    };

    return (
        <AnalyticsContext.Provider value={contextValue}>
            {children}
        </AnalyticsContext.Provider>
    );
};