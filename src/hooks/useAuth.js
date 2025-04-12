/**
 * Custom hook for authentication functionality
 * Provides authentication state and methods
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useLoginMutation,
    useLogoutMutation,
    useDecodeTokenMutation
} from '../api/apiSlice';
import {
    selectCurrentToken,
    selectIsAuthenticated,
    selectCurrentUser,
    selectUserRoles,
    selectUserBusinesses,
    selectActiveBusiness,
    setAuthentication
} from "../reducers/authReducer";
import AuthTokenService from '../services/AuthTokenService';
import useAnalytics from '../analytics/hooks/useAnalytics';

export const useAuth = () => {
    const dispatch = useDispatch();
    const analytics = useAnalytics();

    // Use RTK Query hooks
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
    const [decodeToken] = useDecodeTokenMutation();

    // Get auth state from Redux
    const token = useSelector(selectCurrentToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const roles = useSelector(selectUserRoles);
    const businesses = useSelector(selectUserBusinesses);
    const activeBusiness = useSelector(selectActiveBusiness);

    // Initialize authentication state from storage on component mount
    useEffect(() => {
        const { isAuthenticated: storedAuth, user, authToken, roles, businesses, activeBusiness } = AuthTokenService.getAuthInfo();

        if (storedAuth && authToken) {
            dispatch(setAuthentication({
                isAuthenticated: storedAuth,
                user,
                token: authToken,
                roles,
                businesses,
                activeBusiness
            }));
        }
    }, [dispatch]);

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
                    method: 'email'
                });

                return !!result.token;
            }
            return false;
        } catch (error) {
            // Track login failure
            analytics.trackEvent('login_failure', {
                reason: error.data?.message || 'Unknown error',
                status: error.status
            });

            console.error('Login failed:', error);
            return false;
        }
    };

    // Logout handler - using RTK Query mutation
    const handleLogout = async () => {
        try {
            // Track logout attempt
            analytics.trackEvent('logout_attempt');

            // RTK Query will handle the API call and clearing Redux state
            await logout().unwrap();

            // Track successful logout
            analytics.trackEvent('logout_success');

            return true;
        } catch (error) {
            // Track logout failure
            analytics.trackEvent('logout_failure', {
                reason: error.data?.message || 'Unknown error'
            });

            console.error('Logout error:', error);
            // Even if API call fails, ensure local logout
            AuthTokenService.clearAuthInfo();
            return false;
        }
    };

    // Validate token with backend
    const validateToken = async () => {
        if (!token) return false;

        try {
            const response = await decodeToken({ token }).unwrap();
            return !!response.decoded;
        } catch (error) {
            // Token invalid, ensure logout
            await handleLogout();
            return false;
        }
    };

    // Check if user has a specific role
    const hasRole = (roleName) => {
        return roles.includes(roleName);
    };

    // Check if user has a specific business role
    const hasBusinessRole = (businessId, roleName) => {
        const business = businesses.find(b => b.id === businessId);
        return business && business.role === roleName;
    };

    return {
        // Auth state
        isAuthenticated,
        token,
        user,
        roles,
        businesses,
        activeBusiness,

        // Auth loading states
        isLoginLoading,
        isLogoutLoading,

        // Auth methods
        login: handleLogin,
        logout: handleLogout,
        validateToken,

        // Role checking
        hasRole,
        hasBusinessRole,
    };
};

export default useAuth;