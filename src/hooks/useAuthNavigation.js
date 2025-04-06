import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthNavigation = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return {
        handleLogout
    };
}; 