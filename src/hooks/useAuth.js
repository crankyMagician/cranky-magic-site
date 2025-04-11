import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useLogoutMutation, useDecodeTokenMutation } from '../api/apiSlice';
import {
    selectCurrentToken,
    selectIsAuthenticated,
    setCredentials,
    setError,
    logout,
    setAuthentication
} from "../reducers/authReducer";
import AuthTokenService from '../services/AuthTokenService';

export const useAuth = () => {
    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [logoutApi] = useLogoutMutation();
    const [decodeToken] = useDecodeTokenMutation();
    const token = useSelector(selectCurrentToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Initialize authentication state from storage
    useEffect(() => {
        const { isAuthenticated: storedAuth, user, authToken } = AuthTokenService.getAuthInfo();
        
        if (storedAuth && authToken) {
            dispatch(setAuthentication({
                isAuthenticated: storedAuth,
                user,
                token: authToken,
            }));
        }
    }, [dispatch]);

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials).unwrap();
            if (response.token) {
                dispatch(setCredentials({
                    user: response.user,
                    token: response.token
                }));
                return true;
            }
            return false;
        } catch (error) {
            dispatch(setError(error.data?.message || 'Login failed'));
            return false;
        }
    };

    const handleLogout = async () => {
        try {
            if (token) {
                await logoutApi({ token });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch(logout());
        }
    };

    const validateToken = async () => {
        if (!token) return false;
        try {
            const response = await decodeToken({ token }).unwrap();
            return !!response.decoded;
        } catch (error) {
            dispatch(logout());
            return false;
        }
    };

    return {
        isAuthenticated,
        token,
        login: handleLogin,
        logout: handleLogout,
        validateToken,
    };
}; 