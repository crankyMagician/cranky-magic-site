// src/routes/RouteContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    getCurrentRoute,
    generateBreadcrumbs,
    getPageTitle
} from './routeHelpers';
import useAnalytics from '../analytics/hooks/useAnalytics';
import useAuth from '../hooks/useAuth';

// Create context
const RouteContext = createContext(null);

/**
 * Route Provider component
 * Provides route-related information to the entire application
 */
export const RouteProvider = ({ children }) => {
    const location = useLocation();
    const analytics = useAnalytics();
    const { isAuthenticated, roles } = useAuth();

    // State for current route information
    const [currentRoute, setCurrentRoute] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [pageTitle, setPageTitle] = useState('Application');

    // Refs for tracking previous state and debouncing
    const prevPathRef = useRef(location.pathname);
    const trackingTimeoutRef = useRef(null);
    const analyticsProcessedRef = useRef(new Set());

    // Update route information when location changes
    useEffect(() => {
        // Clear any pending tracking
        if (trackingTimeoutRef.current) {
            clearTimeout(trackingTimeoutRef.current);
        }

        // Only update if the path has actually changed
        if (prevPathRef.current !== location.pathname) {
            const route = getCurrentRoute(location.pathname);
            setCurrentRoute(route);

            // Generate breadcrumbs
            const newBreadcrumbs = generateBreadcrumbs(location.pathname);
            setBreadcrumbs(newBreadcrumbs);

            // Update page title
            const newTitle = getPageTitle(route, 'Application');
            setPageTitle(newTitle);
            document.title = newTitle;

            // Build a unique key for this route change to prevent duplicates
            const analyticsKey = `${location.pathname}|${Date.now()}`;

            // Track page view with analytics - with debounce to avoid double-tracking
            if (analytics && !analyticsProcessedRef.current.has(analyticsKey)) {
                // Add to processed set
                analyticsProcessedRef.current.add(analyticsKey);

                // Limit set size to prevent memory leaks
                if (analyticsProcessedRef.current.size > 20) {
                    analyticsProcessedRef.current.clear();
                }

                // Debounce tracking to prevent duplicate events
                trackingTimeoutRef.current = setTimeout(() => {
                    // Track both page view and detailed route information
                    if (analytics.trackPageView) {
                        analytics.trackPageView(location.pathname, newTitle);
                    }

                    // Track more detailed route event with metadata
                    if (analytics.trackEvent) {
                        analytics.trackEvent('route_changed', {
                            path: location.pathname,
                            title: newTitle,
                            route_name: route?.meta?.title || 'Unknown Route',
                            route_group: route?.meta?.nav?.group || 'none',
                            requires_auth: !!route?.auth,
                            has_roles: route?.roles?.length > 0 ? true : false,
                            roles: route?.roles || [],
                            referrer: document.referrer,
                            query_params: location.search,
                            timestamp: Date.now()
                        });
                    }
                }, 300);
            }

            // Update previous path
            prevPathRef.current = location.pathname;
        }
    }, [location.pathname, location.search, analytics, isAuthenticated]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (trackingTimeoutRef.current) {
                clearTimeout(trackingTimeoutRef.current);
            }
        };
    }, []);

    // Value to provide through context
    const contextValue = {
        currentRoute,
        breadcrumbs,
        pageTitle,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        isAuthenticated,
        userRoles: roles || [],

        // Helper functions
        isCurrentRoute: (path) => location.pathname === path,
        isRouteActive: (path) => location.pathname.startsWith(path),
    };

    return (
        <RouteContext.Provider value={contextValue}>
            {children}
        </RouteContext.Provider>
    );
};

/**
 * Custom hook to use route context
 */
export const useRouteContext = () => {
    const context = useContext(RouteContext);

    if (!context) {
        throw new Error('useRouteContext must be used within a RouteProvider');
    }

    return context;
};

export default RouteContext;