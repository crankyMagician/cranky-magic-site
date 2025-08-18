// src/routes/routeGuards.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAnalytics from '../analytics/hooks/useAnalytics';

/**
 * Authentication guard component that protects routes
 * Replaces the old AuthRouteWrapper with a more flexible implementation
 */
export const AuthGuard = ({ children, requiredRoles = [], redirectPath = '/login' }) => {
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
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
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

/**
 * Guest guard component that prevents authenticated users from
 * accessing routes meant for guests (like login page)
 */
export const GuestGuard = ({ children, redirectPath = '/' }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        // Redirect to home or specified path
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

/**
 * Role-based guard component that checks for specific user roles
 */
export const RoleGuard = ({ children, roles = [], redirectPath = '/unauthorized' }) => {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();
    const analytics = useAnalytics();

    // Check if user is authenticated first
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has any of the required roles
    const hasRequiredRole = roles.some(role => hasRole(role));

    if (!hasRequiredRole) {
        // Track insufficient permissions
        analytics.trackEvent('insufficient_permissions', {
            path: location.pathname,
            requiredRoles: roles
        });

        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

/**
 * HOC that wraps a component with authentication protection
 * @param {Component} Component - Component to protect
 * @param {Object} guardProps - Props for the AuthGuard
 */
export const withAuthGuard = (Component, guardProps = {}) => {
    return (props) => (
        <AuthGuard {...guardProps}>
            <Component {...props} />
        </AuthGuard>
    );
};

/**
 * HOC that wraps a component with guest protection
 * @param {Component} Component - Component to protect
 * @param {Object} guardProps - Props for the GuestGuard
 */
export const withGuestGuard = (Component, guardProps = {}) => {
    return (props) => (
        <GuestGuard {...guardProps}>
            <Component {...props} />
        </GuestGuard>
    );
};

/**
 * HOC that wraps a component with role protection
 * @param {Component} Component - Component to protect
 * @param {Object} guardProps - Props for the RoleGuard
 */
export const withRoleGuard = (Component, guardProps = {}) => {
    return (props) => (
        <RoleGuard {...guardProps}>
            <Component {...props} />
        </RoleGuard>
    );
};