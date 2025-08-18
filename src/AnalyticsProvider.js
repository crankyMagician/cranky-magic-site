import React from 'react';
import { AnalyticsProvider as CoreAnalyticsProvider } from './analytics/context/AnalyticsContext';
import { getAnalyticsProviders } from './analytics/providers';
import setupRtkQueryTracking from './analytics/middleware/rtkQueryTracking';
import { apiSlice } from './api/apiSlice';
import ErrorBoundary from './components/common/ErrorBoundary';

/**
 * Root Analytics Provider that initializes the analytics system
 */
const AnalyticsProvider = ({ children }) => {
    // Initialize analytics providers
    const analyticsProviders = getAnalyticsProviders();

    // Setup API tracking for RTK Query
    const setupApiTrackingMiddleware = (analytics) => {
        // Setup tracking for RTK Query
        setupRtkQueryTracking(apiSlice, analytics);

        console.log('[Analytics] RTK Query tracking initialized');
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