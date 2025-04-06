// useAppInitialization.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TokenDecoder from '../utilities/TokenDecoder';
import AuthTokenService from '../services/AuthTokenService';
import { setCredentials } from '../reducers/authReducer';

const useAppInitialization = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkToken = () => {
            const token = AuthTokenService.getAuthInfo().authToken;
            if (!token) {
                console.log('No token found');
                return;
            }

            try {
                const decodedToken = TokenDecoder.decode(token);
                if (!decodedToken) {
                    console.error('Invalid token format');
                    AuthTokenService.clearAuthInfo();
                    return;
                }

                // Check if token is expired
                if (TokenDecoder.isExpired(token)) {
                    console.log('Token expired');
                    AuthTokenService.clearAuthInfo();
                    return;
                }

                // Update auth state with decoded token data
                dispatch(setCredentials({
                    user: {
                        id: decodedToken.id,
                        email: decodedToken.email,
                        phoneNumber: decodedToken.phoneNumber,
                        username: decodedToken.username
                    },
                    token,
                    roles: decodedToken.roles || [],
                    businesses: decodedToken.businesses || [],
                    activeBusiness: decodedToken.activeBusiness || null
                }));

                // If we're on the login page, redirect to dashboard
                if (window.location.pathname === '/login') {
                    window.location.href = '/dashboard';
                }
            } catch (error) {
                console.error('Error validating token:', error);
                AuthTokenService.clearAuthInfo();
            }
        };

        checkToken();
    }, [dispatch]);
};

export default useAppInitialization;
