import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TokenDecoder from '../utilities/TokenDecoder';
import AuthTokenService from '../services/AuthTokenService';
import { setCredentials } from '../reducers/authReducer';
import { useDecodeTokenMutation } from '../api/apiSlice';

const useAppInitialization = () => {
    const dispatch = useDispatch();
    const [decodeToken] = useDecodeTokenMutation();

    useEffect(() => {
        const checkToken = async () => {
            const { authToken, user } = AuthTokenService.getAuthInfo();
            if (!authToken) {
                console.log('No token found');
                return;
            }

            try {
                // First decode locally to check expiration
                const decodedToken = TokenDecoder.decode(authToken);
                if (!decodedToken) {
                    console.error('Invalid token format');
                    AuthTokenService.clearAuthInfo();
                    return;
                }

                // Check if token is expired
                if (TokenDecoder.isExpired(authToken)) {
                    console.log('Token expired');
                    AuthTokenService.clearAuthInfo();
                    return;
                }

                // Validate token with backend
                try {
                    const response = await decodeToken({ token: authToken }).unwrap();

                    if (response.decoded) {
                        // Update auth state with decoded token data
                        dispatch(setCredentials({
                            user: {
                                id: decodedToken.id,
                                email: decodedToken.email,
                                phoneNumber: decodedToken.phoneNumber,
                                username: decodedToken.username
                            },
                            token: authToken,
                            roles: decodedToken.roles || [],
                            businesses: decodedToken.businesses || [],
                            activeBusiness: decodedToken.activeBusiness || null
                        }));

                        // If we're on the login page, redirect to dashboard
                        if (window.location.pathname === '/login') {
                            window.location.href = '/dashboard';
                        }
                    } else {
                        // Token invalid
                        AuthTokenService.clearAuthInfo();
                    }
                } catch (apiError) {
                    console.error('API token validation failed:', apiError);
                    AuthTokenService.clearAuthInfo();
                }
            } catch (error) {
                console.error('Error validating token:', error);
                AuthTokenService.clearAuthInfo();
            }
        };

        checkToken();
    }, [dispatch, decodeToken]);
};

export default useAppInitialization;