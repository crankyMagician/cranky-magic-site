/**
 * Custom hook for authentication functionality
 * Provides authentication state and methods
 */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useLoginMutation,
    useLogoutMutation
} from '../api/apiSlice';
import {
    selectCurrentToken,
    selectIsAuthenticated,
    selectCurrentUser,
    selectUserRoles,
    selectUserBusinesses,
    selectActiveBusiness,
    selectActiveBusinessId,
    selectActiveBusinessRole,
    setAuthentication,
    switchActiveBusiness
} from "../reducers/authReducer";
import AuthTokenService from '../services/AuthTokenService';
import TokenDecoder from '../utilities/TokenDecoder';
import useAnalytics from '../analytics/hooks/useAnalytics';

export const useAuth = () => {
    const dispatch = useDispatch();
    const analytics = useAnalytics();

    // Use RTK Query hooks
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

    // Get auth state from Redux
    const token = useSelector(selectCurrentToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const roles = useSelector(selectUserRoles);
    const businesses = useSelector(selectUserBusinesses);
    const activeBusiness = useSelector(selectActiveBusiness);
    const activeBusinessId = useSelector(selectActiveBusinessId);
    const activeBusinessRole = useSelector(selectActiveBusinessRole);

    // Use a ref to track if we've already initialized
    const hasInitializedRef = useRef(false);

    // Initialize authentication state from storage on component mount
    useEffect(() => {
        // Skip if already initialized
        if (hasInitializedRef.current) {
            return;
        }

        const authInfo = AuthTokenService.getAuthInfo();
        const {
            isAuthenticated: storedAuth,
            user: storedUser,
            authToken,
            roles: storedRoles,
            businesses: storedBusinesses,
            activeBusiness: storedActiveBusiness
        } = authInfo;

        // Only dispatch if we have valid stored authentication data
        if (storedAuth && authToken) {
            // Check if the current Redux state differs from stored state
            // This prevents unnecessary dispatches
            const needsUpdate =
                isAuthenticated !== storedAuth ||
                token !== authToken ||
                JSON.stringify(user) !== JSON.stringify(storedUser) ||
                JSON.stringify(roles) !== JSON.stringify(storedRoles) ||
                JSON.stringify(businesses) !== JSON.stringify(storedBusinesses) ||
                JSON.stringify(activeBusiness) !== JSON.stringify(storedActiveBusiness);

            if (needsUpdate) {
                console.log('Initializing auth state from storage:', {
                    userId: storedUser?.id,
                    businessCount: storedBusinesses?.length || 0,
                    activeBusinessId: storedActiveBusiness?.id || null,
                    hasToken: !!authToken
                });

                dispatch(setAuthentication({
                    isAuthenticated: storedAuth,
                    user: storedUser,
                    token: authToken,
                    roles: storedRoles,
                    businesses: storedBusinesses,
                    activeBusiness: storedActiveBusiness
                }));
            }

            // Mark as initialized
            hasInitializedRef.current = true;
        }
    }, [dispatch, isAuthenticated, token, user, roles, businesses, activeBusiness]);

    // Login handler - using RTK Query mutation
    const handleLogin = async (credentials) => {
        try {
            // Track login attempt
            analytics.trackEvent('login_attempt', {
                method: 'email'
            });

            // RTK Query will handle the API call and update Redux state
            const result = await login(credentials).unwrap();

            if (result.token) {
                // Track successful login
                analytics.trackEvent('login_success', {
                    method: 'email',
                    user_id: result.user?.id,
                    business_count: result.businesses?.length || 0,
                    active_business_id: result.activeBusiness?.id || null
                });

                // Mark as initialized since we just logged in
                hasInitializedRef.current = true;

                return { success: true, data: result };
            }

            return { success: false, error: 'No token received' };
        } catch (error) {
            // Track failed login
            analytics.trackEvent('login_failed', {
                method: 'email',
                error: error.data?.message || error.message
            });

            return {
                success: false,
                error: error.data?.message || 'Login failed'
            };
        }
    };

    // Logout handler - using RTK Query mutation
    const handleLogout = async () => {
        try {
            // Track logout
            analytics.trackEvent('logout', {
                user_id: user?.id,
                active_business_id: activeBusinessId
            });

            // Call logout mutation
            await logout().unwrap();

            // Reset initialization flag
            hasInitializedRef.current = false;

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);

            // Even if API fails, clear local data
            AuthTokenService.clearAuthInfo();
            dispatch(logout());

            // Reset initialization flag
            hasInitializedRef.current = false;

            return {
                success: false,
                error: error.data?.message || 'Logout failed'
            };
        }
    };

    // Switch active business
    const switchActiveBusinessHandler = (businessId) => {
        const business = businesses.find(b => b.id === businessId);
        if (business) {
            // Update Redux state (which will also update localStorage)
            dispatch(switchActiveBusiness(business));

            // Track business switch
            analytics.trackEvent('switch_active_business', {
                from_business_id: activeBusinessId,
                to_business_id: businessId,
                user_id: user?.id
            });

            return { success: true, business };
        }

        return { success: false, error: 'Business not found' };
    };

    // Check if user has a specific role
    const hasRole = (roleName) => {
        return roles.some(role => role.name === roleName || role === roleName);
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roleNames) => {
        return roleNames.some(roleName => hasRole(roleName));
    };

    // Check if user has all of the specified roles
    const hasAllRoles = (roleNames) => {
        return roleNames.every(roleName => hasRole(roleName));
    };

    // Check if user has a specific business role
    const hasBusinessRole = (businessId, roleName) => {
        if (!businessId) return false;
        const business = businesses.find(b => b.id === businessId);
        return business?.role === roleName;
    };

    // Check if user is owner of a business
    const isBusinessOwner = (businessId = null) => {
        if (businessId) {
            return hasBusinessRole(businessId, 'owner');
        }
        return activeBusinessRole === 'owner';
    };

    // Validate token (LOCAL ONLY - NO API CALL)
    const validateToken = () => {
        if (!token) return false;

        try {
            // Decode token locally
            const decodedToken = TokenDecoder.decode(token);
            if (!decodedToken) return false;

            // Check if token is expired
            return !TokenDecoder.isExpired(token);
        } catch (error) {
            console.error('Local token validation error:', error);
            return false;
        }
    };

    // Get business by ID
    const getBusinessById = (businessId) => {
        return businesses.find(b => b.id === businessId) || null;
    };

    return {
        // Authentication state
        isAuthenticated,
        user,
        token,
        roles,
        businesses,
        activeBusiness,
        activeBusinessId, // This is the key addition for fixing the undefined business ID
        activeBusinessRole,

        // Loading states
        isLoginLoading,
        isLogoutLoading,

        // Methods
        login: handleLogin,
        logout: handleLogout,
        switchActiveBusiness: switchActiveBusinessHandler,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasBusinessRole,
        isBusinessOwner,
        validateToken,
        getBusinessById,
    };
};

export default useAuth;