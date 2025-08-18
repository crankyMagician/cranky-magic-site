# Routing System Documentation

This document describes the new centralized routing system implemented in our application. The system is designed to create a single source of truth for all application routes, ensuring consistent navigation, access control, and metadata throughout the application.

## Key Components

### 1. Route Configuration (`routeConfig.js`)

The central registry of all application routes. Each route contains:

- **path**: The URL path
- **component**: The React component to render
- **exact**: Whether the path requires exact matching
- **auth**: Authentication requirements (true = authentication required)
- **roles**: Array of allowed roles (empty = all roles allowed)
- **meta**: Additional metadata:
    - **title**: Page title
    - **description**: Page description
    - **icon**: Material-UI icon component
    - **nav**: Navigation display settings
        - **label**: Text to show in navigation
        - **group**: Navigation group this belongs to
        - **order**: Display order within group
        - **showInNav**: Whether to display in navigation components
        - **showInFooter**: Whether to display in footer

### 2. Route Helpers (`routeHelpers.js`)

Utility functions for working with routes:

- **getAllRoutes**: Get all defined routes
- **getRouteByPath**: Get a specific route by path
- **getCurrentRoute**: Get current route based on pathname
- **getNavigationRoutes**: Get routes that should appear in navigation
- **getFooterRoutes**: Get routes that should appear in footer
- **getGroupedNavigationRoutes**: Get routes grouped by navigation group
- **sortRoutesByOrder**: Sort routes by navigation order
- **getPageTitle**: Generate page title from route
- **generateBreadcrumbs**: Generate breadcrumbs from current pathname

### 3. Route Guards (`routeGuards.js`)

Components and HOCs for protecting routes:

- **AuthGuard**: Protects routes requiring authentication
- **GuestGuard**: Prevents authenticated users from accessing guest-only routes
- **RoleGuard**: Protects routes requiring specific roles
- **withAuthGuard**: HOC to wrap a component with authentication protection
- **withGuestGuard**: HOC to wrap a component with guest protection
- **withRoleGuard**: HOC to wrap a component with role protection

### 4. Navigation Configuration (`navigationConfig.js`)

Defines how navigation groups appear in the UI and provides adapters for different navigation components:

- **navigationGroups**: Configuration for navigation groups
- **getSortedNavigationGroups**: Get navigation groups sorted by order
- **getNavigationGroupsForComponent**: Get navigation groups for a specific component type
- **adaptRoutesForSidebar**: Adapt routes for sidebar components
- **adaptRoutesForMegaMenu**: Adapt routes for MegaMenu component
- **adaptRoutesForFooter**: Adapt routes for Footer component

### 5. Route Context (`RouteContext.js`)

Provides route information across the application:

- **RouteProvider**: Provider component that tracks current route and related info
- **useRouteContext**: Hook to access route context information

## Usage Examples

### 1. Defining a New Route

```javascript
// In routeConfig.js
{
    path: '/dashboard',
    component: DashboardPage,
    exact: true,
    auth: true, // Requires authentication
    roles: ['admin', 'manager'], // Role-based access control
    meta: {
        title: 'Dashboard',
        description: 'Admin dashboard and analytics',
        icon: <DashboardIcon />,
        nav: {
            label: 'Dashboard',
            group: 'main',
            order: 1,
            showInNav: true,
            showInFooter: false,
        }
    }
}
```

### 2. Using Route Guards

```jsx
// In component file
import { AuthGuard } from '../routes/routeGuards';

// For a route requiring authentication
<AuthGuard>
  <SensitiveComponent />
</AuthGuard>

// For a route requiring specific roles
<AuthGuard requiredRoles={['admin', 'manager']}>
  <AdminComponent />
</AuthGuard>
```

### 3. Using Route Context

```jsx
// In a component
import { useRouteContext } from '../routes';

const MyComponent = () => {
  const { currentRoute, breadcrumbs, pageTitle } = useRouteContext();
  
  return (
    <div>
      <h1>{pageTitle}</h1>
      {/* Component content */}
    </div>
  );
};
```

### 4. Using Navigation Adapters

```jsx
// In a navigation component
import { routes, adaptRoutesForSidebar, useRouteContext } from '../../routes';

const SidebarComponent = () => {
  const { isAuthenticated, userRoles } = useRouteContext();
  
  // Get sidebar navigation items
  const sidebarGroups = adaptRoutesForSidebar(routes, isAuthenticated, userRoles);
  
  return (
    <div>
      {sidebarGroups.map(group => (
        <div key={group.label}>
          <h3>{group.label}</h3>
          <ul>
            {group.items.map(item => (
              <li key={item.path}>
                <a href={item.path}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
```

## Best Practices

1. **Central Definition**: Always define new routes in `routeConfig.js`.
2. **Component Organization**: Keep route components in a logical folder structure.
3. **Authentication**: Use the appropriate guards for protected routes.
4. **Consistent Metadata**: Always provide complete metadata for routes.
5. **Route Context**: Use the route context for accessing route information rather than duplicating logic.
6. **Navigation Adapters**: Use the provided adapters for navigation components instead of hard-coding routes.

## Extending the System

### Adding New Route Types

1. Define the new route type in `routeConfig.js`.
2. Update the `routeGuards.js` if special protection is needed.
3. Add helper functions in `routeHelpers.js` if needed.
4. Update navigation adapters if the new route type needs special handling.

### Adding New Navigation Components

1. Create a new adapter function in `navigationConfig.js`.
2. Configure which navigation groups should appear in the new component.
3. Use the adapter in your component to get properly formatted navigation items.