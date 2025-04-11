import React from 'react';
import { AnalyticsProvider as CoreAnalyticsProvider } from './analytics/context/AnalyticsContext';
import { getAnalyticsProviders } from './analytics/providers';
import setupApiTracking from './analytics/middleware/apiTracking';
import axiosServices from './utilities/axios';
import { api } from './api/api';
import ErrorBoundary from './components/common/ErrorBoundary'; // assume this exists or create it

/**
 * Root Analytics Provider that initializes the analytics system
 *
 * This component should wrap the application at a high level,
 * ideally just inside the Redux Provider and Router
 */
const AnalyticsProvider = ({ children }) => {
    // Initialize analytics providers
    const analyticsProviders = getAnalyticsProviders();

    // Setup API tracking for all API instances
    // This is done in a React effect inside the AnalyticsContext component
    // to ensure the analytics context is initialized first.
    const setupApiTrackingMiddleware = (analytics) => {
        // Setup tracking for main axios instance
        setupApiTracking(axiosServices, analytics);

        // Setup tracking for additional API instances if used
        setupApiTracking(api, analytics);

        console.log('[Analytics] API tracking initialized');
    };

    return (
        <ErrorBoundary fallback={<div>Something went wrong with analytics. The application will continue to function.</div>}>
            <CoreAnalyticsProvider
                analyticsProviders={analyticsProviders}
                onInitialized={setupApiTrackingMiddleware}
            >
                {children}
            </CoreAnalyticsProvider>
        </ErrorBoundary>
    );
};

export default AnalyticsProvider;
