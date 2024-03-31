import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from '../reducers/themeSlice';
import ThemeService from '../services/ThemeService';

const useStoredTheme = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Get the theme from storage
        const storedTheme = ThemeService.getTheme();
        if (storedTheme) {
            // Dispatch setTheme with the stored value
            dispatch(setTheme(storedTheme));
        }
    }, [dispatch]);
};

export default useStoredTheme;