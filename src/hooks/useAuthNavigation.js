import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useAuthNavigation = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleRedirectToLogin = () => {
        navigate('/login');
    };

    const handleRedirectToDashboard = () => {
        navigate('/dashboard');
    };

    return {
        handleLogout,
        handleRedirectToLogin,
        handleRedirectToDashboard
    };
};

export default useAuthNavigation;