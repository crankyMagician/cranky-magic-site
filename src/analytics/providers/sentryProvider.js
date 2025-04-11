import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { getConsentStatus } from './index';

const sentryProvider = {
    /**
     * Initialize the Sentry error tracking provider
     */
    initialize: async (initialData) => {
        // Get Sentry DSN from environment variables
        const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || '';
        const SENTRY_ENVIRONMENT = process.env.NODE_ENV;
        const SENTRY_RELEASE = process.env.REACT_APP_VERSION || '1.0.0';

        // Check for existing consent
        const hasConsent = getConsentStatus();

        if (!SENTRY_DSN) {
            console.warn('[Analytics:Sentry] No DSN provided, skipping initialization');
            return false;
        }

        return new Promise((resolve) => {
            try {
                Sentry.init({
                    dsn: SENTRY_DSN,
                    integrations: [new BrowserTracing()],
                    environment: SENTRY_ENVIRONMENT,
                    release: SENTRY_RELEASE,

                    // Performance sampling
                    tracesSampleRate: 0.1, // Sample only 10% of transactions

                    // Only enable if user has given consent
                    enabled: hasConsent,

                    // Customize behavior
                    beforeSend: (event) => {
                        // Don't send events if consent is withdrawn
                        if (!getConsentStatus()) {
                            return null;
                        }

                        // Filter PII or sensitive data if needed
                        return event;
                    },

                    // Set initial scope data
                    initialScope: {
                        tags: {
                            session_id: initialData.sessionId,
                        },
                        context: {
                            device: initialData.deviceInfo,
                            attribution: initialData.attributionData
                        }
                    }
                });

                console.log('[Analytics:Sentry] Initialized');
                resolve(true);
            } catch (error) {
                console.error('[Analytics:Sentry] Initialization failed:', error);
                resolve(false);
            }
        });
    },

    /**
     * Identify a user in Sentry
     */
    identify: (userId, traits) => {
        if (!getConsentStatus()) return;

        try {
            Sentry.setUser({
                id: userId,
                ...traits
            });
            console.log(`[Analytics:Sentry] User identified: ${userId}`);
        } catch (error) {
            console.error('[Analytics:Sentry] Error identifying user:', error);
        }
    },

    /**
     * Track an error in Sentry
     */
    trackError: (error, errorInfo = {}) => {
        if (!getConsentStatus()) return;

        try {
            Sentry.withScope((scope) => {
                // Add additional context to the error
                Object.entries(errorInfo).forEach(([key, value]) => {
                    scope.setExtra(key, value);
                });

                // Capture the exception
                Sentry.captureException(error);
            });
        } catch (e) {
            console.error('[Analytics:Sentry] Error tracking error:', e);
        }
    },

    /**
     * Track a breadcrumb in Sentry
     * Useful for tracking user actions leading up to an error
     */
    trackBreadcrumb: (message, data = {}, category = 'action') => {
        if (!getConsentStatus()) return;

        try {
            Sentry.addBreadcrumb({
                message,
                data,
                category,
                level: 'info',
            });
        } catch (error) {
            console.error('[Analytics:Sentry] Error adding breadcrumb:', error);
        }
    },

    /**
     * Set user consent status
     */
    setConsent: (consentGiven) => {
        try {
            if (consentGiven) {
                Sentry.startSession();
            } else {
                Sentry.endSession();
                // Clear user data when consent is withdrawn
                // Use getCurrentScope() instead of configureScope
                const currentScope = Sentry.getCurrentScope();
                currentScope.clear();
            }
        } catch (error) {
            console.error('[Analytics:Sentry] Error setting consent:', error);
        }
    },

    /**
     * Get the Sentry instance (for advanced usage)
     */
    getInstance: () => Sentry
};

export default sentryProvider;