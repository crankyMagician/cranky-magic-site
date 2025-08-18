// src/routes/index.js
import routes from './routeConfig';
import * as routeHelpers from './routeHelpers';
import * as routeGuards from './routeGuards';
import navigationConfig from './navigationConfig';
import { RouteProvider, useRouteContext } from './RouteContext';

/**
 * Routes module
 *
 * This module centralizes all routing-related functionality:
 * - Route definitions
 * - Authentication guards
 * - Navigation structure
 * - Route context and helpers
 */

// Export everything from the module
export {
    routes,
    routeHelpers,
    routeGuards,
    navigationConfig,
    RouteProvider,
    useRouteContext
};

// Export commonly used individual exports
export const {
    AuthGuard,
    GuestGuard,
    RoleGuard,
    withAuthGuard,
    withGuestGuard,
    withRoleGuard
} = routeGuards;

export const {
    getAllRoutes,
    getRouteByPath,
    getCurrentRoute,
    getNavigationRoutes,
    getFooterRoutes,
    getGroupedNavigationRoutes,
    sortRoutesByOrder,
    getPageTitle,
    generateBreadcrumbs
} = routeHelpers;

// Export navigation configuration
export const {
    navigationGroups,
    getSortedNavigationGroups,
    getNavigationGroupsForComponent,
    adaptRoutesForSidebar,
    adaptRoutesForMegaMenu,
    adaptRoutesForFooter
} = navigationConfig;

// Default export
export default routes;