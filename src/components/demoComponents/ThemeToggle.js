import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../reducers/themeSlice'; // Ensure setTheme is imported
import { Select, MenuItem } from '@mui/material';
import ThemeService from "../../services/ThemeService";

// Import the useCustomTranslation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const [currentTheme, setCurrentTheme] = useState('light'); // Default theme

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    useEffect(() => {
        const storedTheme = ThemeService.getTheme();
        if (storedTheme) {
            setCurrentTheme(storedTheme);
        }
    }, []);

    const handleChangeTheme = (event) => {
        const newTheme = event.target.value;
        dispatch(setTheme(newTheme));
        ThemeService.setTheme(newTheme); // Update theme in local storage
        setCurrentTheme(newTheme);
    };

    // Updated theme options with High Contrast added
    const themes = [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'High Contrast', value: 'high_contrast' }, // New High Contrast theme option
        { label: 'Alternative', value: 'altTheme' },
        { label: 'Professional', value: 'professional' },
        { label: 'Corporate Memphis', value: 'memphis' },
        { label: 'Startup', value: 'startup' },
        { label: 'Sunset', value: 'sunset' },
        { label: 'Mint', value: 'mint' },
        { label: 'Retro Neon', value: 'retro_neon' },
    ];

    return (
        <Select
            value={currentTheme}
            onChange={handleChangeTheme}
            variant="outlined"
        >
            {themes.map((theme) => (
                <MenuItem key={theme.value} value={theme.value}>
                    {translate(theme.label)}
                </MenuItem>
            ))}
        </Select>
    );
};

export default ThemeToggle;
