// useAppInitialization.js
import { useAuth } from './useAuth';
import useStoredTheme from './useStoredTheme';
import useStoredPreferences from './useStoredPreferences';
import useSyncLanguage from './useSyncLanguage';
import { useEffect } from 'react';

function useAppInitialization() {
    const { validateToken } = useAuth();
    useStoredTheme();
    useStoredPreferences();
    useSyncLanguage();

    // Validate token on initialization
    useEffect(() => {
        const checkToken = async () => {
            try {
                const isValid = await validateToken();
                if (!isValid) {
                    console.warn('Token validation failed on initialization');
                    // Clear any invalid tokens from storage
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Error validating token:', error);
                // Clear any invalid tokens from storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        };
        
        checkToken();
    }, [validateToken]);
}

export default useAppInitialization;
