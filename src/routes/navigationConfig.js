// src/routes/navigationConfig.js
/**
 * Navigation group definitions
 * This configures how the navigation groups appear in the UI
 */
export const navigationGroups = {
    main: {
        label: 'Main',
        order: 1,
        showInSidebar: true,
        showInMegaMenu: true,
        showInFooter: true,
    },
    company: {
        label: 'Company',
        order: 2,
        showInSidebar: true,
        showInMegaMenu: true,
        showInFooter: true,
    },
    media: {
        label: 'Media',
        order: 3,
        showInSidebar: true,
        showInMegaMenu: true,
        showInFooter: true,
    },
    community: {
        label: 'Community',
        order: 4,
        showInSidebar: true,
        showInMegaMenu: true,
        showInFooter: true,
    },
    account: {
        label: 'Account',
        order: 5,
        showInSidebar: true,
        showInMegaMenu: true,
        showInFooter: false,
    },
    legal: {
        label: 'Legal',
        order: 6,
        showInSidebar: false,
        showInMegaMenu: false,
        showInFooter: true,
    },
    auth: {
        label: 'Authentication',
        order: 7,
        showInSidebar: false,
        showInMegaMenu: false,
        showInFooter: false,
    },
    demo: {
        label: 'Demo',
        order: 8,
        showInSidebar: true,
        showInMegaMenu: false,
        showInFooter: false,
    }
};

/**
 * Returns navigation groups sorted by order
 * @returns {Array} Sorted array of navigation group objects with keys
 */
export const getSortedNavigationGroups = () => {
    return Object.entries(navigationGroups)
        .map(([key, group]) => ({
            key,
            ...group
        }))
        .sort((a, b) => a.order - b.order);
};

/**
 * Get navigation groups for a specific component type
 * @param {string} componentType - Type of component ('sidebar', 'megaMenu', 'footer')
 * @returns {Array} Array of navigation group objects filtered for the component type
 */
export const getNavigationGroupsForComponent = (componentType) => {
    const propertyMap = {
        'sidebar': 'showInSidebar',
        'megaMenu': 'showInMegaMenu',
        'footer': 'showInFooter',
        'navbar': 'showInSidebar', // Navbar uses same config as sidebar for now
        'hoverbar': 'showInSidebar', // Hoverbar uses same config as sidebar for now
        'dashboard': 'showInSidebar', // Dashboard uses same config as sidebar for now
    };

    const property = propertyMap[componentType] || 'showInSidebar';

    return Object.entries(navigationGroups)
        .filter(([_, group]) => group[property])
        .map(([key, group]) => ({
            key,
            ...group
        }))
        .sort((a, b) => a.order - b.order);
};

/**
 * Navigation component adapters
 * These functions adapt the route data for different navigation components
 */

/**
 * Adapt routes for sidebar components
 * @param {Array} routes - Array of route objects
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {Array} userRoles - Array of user roles
 * @returns {Array} Adapted routes for sidebar
 */
export const adaptRoutesForSidebar = (routes, isAuthenticated, userRoles = []) => {
    const sidebarGroups = getNavigationGroupsForComponent('sidebar');

    // Filter routes that should appear in sidebar
    const sidebarRoutes = routes.filter(route => {
        // Check if route should appear in navigation
        if (!route.meta?.nav?.showInNav) return false;

        // Check if route's group should appear in sidebar
        const group = route.meta?.nav?.group || 'other';
        if (!sidebarGroups.some(g => g.key === group)) return false;

        // Check authentication requirements
        if (route.auth && !isAuthenticated) return false;

        // Check role requirements
        if (route.roles && route.roles.length > 0) {
            if (!userRoles.some(role => route.roles.includes(role))) return false;
        }

        return true;
    });

    // Group routes by their navigation group
    const groupedRoutes = sidebarRoutes.reduce((groups, route) => {
        const group = route.meta?.nav?.group || 'other';

        if (!groups[group]) {
            const groupConfig = sidebarGroups.find(g => g.key === group);
            groups[group] = {
                label: groupConfig?.label || group,
                order: groupConfig?.order || 999,
                items: []
            };
        }

        groups[group].items.push({
            path: route.path,
            label: route.meta?.nav?.label || route.meta?.title || 'Unnamed Route',
            icon: route.meta?.icon || null,
            exact: route.exact || false,
            order: route.meta?.nav?.order || 999
        });

        return groups;
    }, {});

    // Sort groups by order
    const sortedGroups = Object.values(groupedRoutes).sort((a, b) => a.order - b.order);

    // Sort items within each group by order
    sortedGroups.forEach(group => {
        group.items.sort((a, b) => a.order - b.order);
    });

    return sortedGroups;
};

/**
 * Adapt routes for the MegaMenu component
 * @param {Array} routes - Array of route objects
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {Array} userRoles - Array of user roles
 * @returns {Array} Adapted routes for MegaMenu
 */
export const adaptRoutesForMegaMenu = (routes, isAuthenticated, userRoles = []) => {
    const megaMenuGroups = getNavigationGroupsForComponent('megaMenu');

    // Similar to sidebar but with slight differences for mega menu format
    // Implementation similar to adaptRoutesForSidebar
    // ...

    // For now, we'll reuse the sidebar adapter with a different component type
    return adaptRoutesForSidebar(routes, isAuthenticated, userRoles);
};

/**
 * Adapt routes for the Footer component
 * @param {Array} routes - Array of route objects
 * @returns {Array} Adapted routes for Footer
 */
export const adaptRoutesForFooter = (routes) => {
    const footerGroups = getNavigationGroupsForComponent('footer');

    // Filter routes that should appear in footer
    const footerRoutes = routes.filter(route => {
        // Check if route should appear in footer
        if (!route.meta?.nav?.showInFooter) return false;

        // Check if route's group should appear in footer
        const group = route.meta?.nav?.group || 'other';
        if (!footerGroups.some(g => g.key === group)) return false;

        return true;
    });

    // Group routes by their navigation group
    const groupedRoutes = footerRoutes.reduce((groups, route) => {
        const group = route.meta?.nav?.group || 'other';

        if (!groups[group]) {
            const groupConfig = footerGroups.find(g => g.key === group);
            groups[group] = {
                title: groupConfig?.label || group,
                order: groupConfig?.order || 999,
                items: []
            };
        }

        groups[group].items.push({
            path: route.path,
            label: route.meta?.nav?.label || route.meta?.title || 'Unnamed Route',
        });

        return groups;
    }, {});

    // Sort groups by order
    const sortedGroups = Object.values(groupedRoutes)
        .sort((a, b) => a.order - b.order)
        .map(group => ({
            ...group,
            items: group.items.sort((a, b) => {
                const routeA = routes.find(r => r.path === a.path);
                const routeB = routes.find(r => r.path === b.path);
                const orderA = routeA?.meta?.nav?.order || 999;
                const orderB = routeB?.meta?.nav?.order || 999;
                return orderA - orderB;
            })
        }));

    return sortedGroups;
};

export default {
    navigationGroups,
    getSortedNavigationGroups,
    getNavigationGroupsForComponent,
    adaptRoutesForSidebar,
    adaptRoutesForMegaMenu,
    adaptRoutesForFooter
};