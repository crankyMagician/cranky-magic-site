import posthog from 'posthog-js';
import { getConsentStatus } from './index';

const posthogProvider = {
    /**
     * Initialize the PostHog tracking provider
     */
    initialize: async (initialData) => {
        // Get API key from environment variables
        const POSTHOG_API_KEY = process.env.REACT_APP_POSTHOG_API_KEY || 'phc_YOUR_DEFAULT_KEY';
        const POSTHOG_HOST = process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com';

        // Check for existing consent
        const hasConsent = getConsentStatus();

        return new Promise((resolve) => {
            // Initialize PostHog with configuration
            posthog.init(POSTHOG_API_KEY, {
                api_host: POSTHOG_HOST,
                // Configuration options
                loaded: () => {
                    console.log('[Analytics:PostHog] Initialized');
                    resolve(true);
                },
                capture_pageview: false, // We'll handle this manually
                capture_pageleave: true,
                autocapture: false, // We'll handle events manually for better control
                disable_session_recording: process.env.NODE_ENV !== 'production', // Only record in production
                persistence: 'localStorage',
                opt_out_capturing_by_default: !hasConsent, // Default based on stored consent
            });

            // Register initial properties
            posthog.register({
                app_version: process.env.REACT_APP_VERSION || '1.0.0',
                environment: process.env.NODE_ENV,
                session_id: initialData.sessionId,
                device_info: initialData.deviceInfo,
                attribution: initialData.attributionData
            });
        });
    },

    /**
     * Identify a user in PostHog
     */
    identify: (userId, traits) => {
        if (!getConsentStatus()) return;

        try {
            posthog.identify(userId, traits);
            console.log(`[Analytics:PostHog] User identified: ${userId}`);
        } catch (error) {
            console.error('[Analytics:PostHog] Error identifying user:', error);
        }
    },

    /**
     * Track an event in PostHog
     */
    trackEvent: (eventName, properties) => {
        if (!getConsentStatus()) return;

        try {
            posthog.capture(eventName, properties);
        } catch (error) {
            console.error(`[Analytics:PostHog] Error tracking event ${eventName}:`, error);
        }
    },

    /**
     * Track a page view in PostHog
     */
    trackPageView: (url, properties) => {
        if (!getConsentStatus()) return;

        try {
            posthog.capture('$pageview', {
                $current_url: url,
                ...properties
            });
        } catch (error) {
            console.error('[Analytics:PostHog] Error tracking page view:', error);
        }
    },

    /**
     * Set user consent status
     */
    setConsent: (consentGiven) => {
        try {
            if (consentGiven) {
                posthog.opt_in_capturing();
            } else {
                posthog.opt_out_capturing();
            }
        } catch (error) {
            console.error('[Analytics:PostHog] Error setting consent:', error);
        }
    },

    /**
     * Get the actual PostHog instance (for advanced usage)
     */
    getInstance: () => posthog
};

export default posthogProvider;