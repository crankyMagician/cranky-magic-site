// src/routes/routeHelpers.js
import React from 'react';
import routes from './routeConfig';

/**
 * Get all defined routes
 * @returns {Array} Array of route objects
 */
export const getAllRoutes = () => routes;

/**
 * Get a specific route by path
 * @param {string} path - Route path to find
 * @returns {Object|null} Route object or null if not found
 */
export const getRouteByPath = (path) => {
    return routes.find(route => route.path === path) || null;
};

/**
 * Get current route based on pathname
 * @param {string} pathname - Current location pathname
 * @returns {Object|null} Current route object or null if not found
 */
export const getCurrentRoute = (pathname) => {
    // Find exact match first
    const exactMatch = routes.find(route => route.path === pathname);
    if (exactMatch) return exactMatch;

    // If no exact match, find potential nested route
    // Sort routes by path length (descending) to match longest path first
    const sortedRoutes = [...routes].sort((a, b) => b.path.length - a.path.length);

    return sortedRoutes.find(route => {
        // Skip exact matching routes (we already checked those)
        if (route.exact) return false;

        // Check if pathname starts with route path
        return pathname.startsWith(route.path);
    }) || null;
};

/**
 * Get all routes that should appear in navigation
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {Array} userRoles - Array of user roles
 * @returns {Array} Array of route objects that should appear in navigation
 */
export const getNavigationRoutes = (isAuthenticated, userRoles = []) => {
    return routes.filter(route => {
        // Check if route should appear in navigation
        if (!route.meta?.nav?.showInNav) return false;

        // Check authentication requirements
        if (route.auth && !isAuthenticated) return false;

        // Check role requirements
        if (route.roles && route.roles.length > 0) {
            if (!userRoles.some(role => route.roles.includes(role))) return false;
        }

        return true;
    });
};

/**
 * Get all routes that should appear in the footer
 * @returns {Array} Array of route objects that should appear in footer
 */
export const getFooterRoutes = () => {
    return routes.filter(route => route.meta?.nav?.showInFooter);
};

/**
 * Get routes grouped by navigation group
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {Array} userRoles - Array of user roles
 * @returns {Object} Object with keys as group names and values as arrays of routes
 */
export const getGroupedNavigationRoutes = (isAuthenticated, userRoles = []) => {
    const navRoutes = getNavigationRoutes(isAuthenticated, userRoles);

    return navRoutes.reduce((groups, route) => {
        const group = route.meta?.nav?.group || 'other';

        if (!groups[group]) {
            groups[group] = [];
        }

        groups[group].push(route);
        return groups;
    }, {});
};

/**
 * Sort routes by their navigation order
 * @param {Array} routes - Array of route objects
 * @returns {Array} Sorted array of route objects
 */
export const sortRoutesByOrder = (routes) => {
    return [...routes].sort((a, b) => {
        const orderA = a.meta?.nav?.order || 9999;
        const orderB = b.meta?.nav?.order || 9999;
        return orderA - orderB;
    });
};

/**
 * Generate page title from route
 * @param {Object} route - Route object
 * @param {string} defaultTitle - Default title to use if route has no title
 * @returns {string} Page title
 */
export const getPageTitle = (route, defaultTitle = 'Application') => {
    if (!route) return defaultTitle;

    const routeTitle = route.meta?.title;
    if (!routeTitle) return defaultTitle;

    return `${routeTitle} | ${defaultTitle}`;
};

/**
 * Generate breadcrumbs from current pathname
 * @param {string} pathname - Current location pathname
 * @returns {Array} Array of breadcrumb objects with label and path
 */
export const generateBreadcrumbs = (pathname) => {
    if (pathname === '/') {
        return [{ label: 'Home', path: '/' }];
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    let currentPath = '';

    return [
        { label: 'Home', path: '/' },
        ...pathSegments.map(segment => {
            currentPath += `/${segment}`;

            // Try to find a matching route for this path segment
            const route = getRouteByPath(currentPath);
            const label = route?.meta?.title || segment.charAt(0).toUpperCase() + segment.slice(1);

            return { label, path: currentPath };
        })
    ];
};