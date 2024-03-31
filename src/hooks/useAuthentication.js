import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '../reducers/authReducer';
import AuthTokenService from '../services/AuthTokenService';

const useAuthentication = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Use AuthTokenService to get authentication info
        const { isAuthenticated, user, authToken } = AuthTokenService.getAuthInfo();

        console.log(`Retrieved 'isAuthenticated' from localStorage:`, isAuthenticated);
        console.log(`Retrieved 'authToken' from localStorage:`, authToken);
        console.log(`Retrieved 'user' from localStorage:`, user);

        // Dispatch setAuthentication with the retrieved values
        dispatch(setAuthentication({
            isAuthenticated,
            user,
            token: authToken,
        }));
    }, [dispatch]);
};

export default useAuthentication;
