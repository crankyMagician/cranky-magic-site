import posthogProvider from './posthogProvider';
import sentryProvider from './sentryProvider';

// Configure which providers to use based on environment
const getActiveProviders = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';

    const providers = {};

    // Add PostHog provider for all environments
    providers.posthog = posthogProvider;

    // Add Sentry for error tracking in production (and optionally dev)
    if (isProduction || (isDevelopment && process.env.REACT_APP_ENABLE_DEV_ERROR_TRACKING === 'true')) {
        providers.sentry = sentryProvider;
    }

    // Add additional providers here as needed
    // e.g., providers.googleAnalytics = googleAnalyticsProvider;

    return providers;
};

export const getAnalyticsProviders = () => {
    // Get appropriate providers for current environment
    return getActiveProviders();
};

// Helper to get privacy consent status
export const getConsentStatus = () => {
    return localStorage.getItem('analytics_consent') === 'true';
};

// Export individual providers for direct access if needed
export { posthogProvider, sentryProvider };