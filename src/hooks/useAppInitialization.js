import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TokenDecoder from '../utilities/TokenDecoder';
import AuthTokenService from '../services/AuthTokenService';
import { setCredentials } from '../reducers/authReducer';

const useAppInitialization = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkToken = async () => {
            const { authToken, user } = AuthTokenService.getAuthInfo();
            if (!authToken) {
                console.log('No token found during app initialization');
                return;
            }

            try {
                // First decode locally to check expiration and extract basic info
                const decodedToken = TokenDecoder.decode(authToken);
                if (!decodedToken) {
                    console.error('Invalid token format during app initialization');
                    AuthTokenService.clearAuthInfo();
                    return;
                }

                // Check if token is expired
                if (TokenDecoder.isExpired(authToken)) {
                    console.log('Token expired during app initialization');
                    AuthTokenService.clearAuthInfo();
                    return;
                }

                console.log('Token validation successful, extracting auth info:', {
                    userId: decodedToken.id,
                    hasActiveBusinessId: !!decodedToken.activeBusinessId,
                    businessCount: decodedToken.businesses?.length || 0,
                    exp: new Date(decodedToken.exp * 1000).toLocaleString()
                });

                // Use AuthTokenService to parse and store the complete auth info
                const parsedToken = AuthTokenService.parseToken();
                if (!parsedToken) {
                    console.error('Failed to parse token during app initialization');
                    AuthTokenService.clearAuthInfo();
                    return;
                }

                // Get the refreshed auth info (which includes the parsed token data)
                const authInfo = AuthTokenService.getAuthInfo();
                if (!authInfo.isAuthenticated) {
                    console.error('Auth info invalid after token parsing');
                    return;
                }

                // Update Redux state with the parsed auth info (LOCAL ONLY - NO API CALL)
                dispatch(setCredentials({
                    user: authInfo.user,
                    token: authToken,
                    roles: authInfo.roles || [],
                    businesses: authInfo.businesses || [],
                    activeBusiness: authInfo.activeBusiness || null
                }));

                console.log('App initialization complete (local token decode):', {
                    userId: authInfo.user?.id,
                    activeBusinessId: authInfo.activeBusiness?.id,
                    businessCount: authInfo.businesses?.length || 0
                });

                // If we're on the login page, redirect to dashboard
                if (window.location.pathname === '/login') {
                    window.location.href = '/dashboard';
                }

            } catch (error) {
                console.error('Error during app initialization token validation:', error);
                AuthTokenService.clearAuthInfo();
            }
        };

        checkToken();
    }, [dispatch]);
};

export default useAppInitialization;