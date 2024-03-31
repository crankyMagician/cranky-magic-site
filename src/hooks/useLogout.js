import  AuthTokenService  from '../services/AuthTokenService'; // Adjust the path as necessary
import { useDispatch } from 'react-redux';
import { clearAuthentication } from '../reducers/authReducer';
import { useNavigate } from 'react-router-dom';


export function useLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return function handleLogout() {
        // Clear authentication info from localStorage
        AuthTokenService.clearAuthInfo();

        // Update Redux state to reflect logout
        dispatch(clearAuthentication());

        // Redirect to the login page
        navigate('/login');
    };
}
