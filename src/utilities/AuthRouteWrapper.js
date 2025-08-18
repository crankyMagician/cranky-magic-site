/**
 * Component for protecting routes that require authentication
 * Redirects to login if user is not authenticated
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAnalytics from '../analytics/hooks/useAnalytics';

const AuthRouteWrapper = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, user, hasRole } = useAuth();
    const location = useLocation();
    const analytics = useAnalytics();

    // Check if user is authenticated
    if (!isAuthenticated) {
        // Track unauthorized access attempt
        analytics.trackEvent('unauthorized_access_attempt', {
            path: location.pathname,
            requiresAuth: true
        });

        // Redirect to login page with return URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check for required roles if specified
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => hasRole(role));

        if (!hasRequiredRole) {
            // Track insufficient permissions
            analytics.trackEvent('insufficient_permissions', {
                path: location.pathname,
                userId: user?.id,
                requiredRoles
            });

            // Redirect to unauthorized page
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Track successful authorized access
    analytics.trackEvent('authorized_access', {
        path: location.pathname,
        userId: user?.id,
        requiredRoles: requiredRoles.length > 0 ? requiredRoles : []
    });

    // If authenticated and has required roles, render the protected component
    return children;
};

export default AuthRouteWrapper;