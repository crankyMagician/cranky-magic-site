// src/components/common/ThemeToggle.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../reducers/themeSlice';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';
import ThemeService from "../../services/ThemeService";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import BusinessIcon from '@mui/icons-material/Business';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GradientIcon from '@mui/icons-material/Gradient';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const currentTheme = useSelector(state => state.theme.mode);

    useEffect(() => {
        const storedTheme = ThemeService.getTheme();
        if (storedTheme) {
            dispatch(setTheme(storedTheme));
        }
    }, [dispatch]);

    const handleChangeTheme = (event) => {
        const newTheme = event.target.value;
        dispatch(setTheme(newTheme));
        ThemeService.setTheme(newTheme);
    };

    const themes = [
        { label: 'Light', value: 'light', icon: <LightModeIcon /> },
        { label: 'Dark', value: 'dark', icon: <DarkModeIcon /> },
        { label: 'High Contrast', value: 'high_contrast', icon: <SettingsBrightnessIcon /> },
        { label: 'Munchie', value: 'munchie', icon: <LightbulbIcon /> },
        { label: 'Munchie Dark', value: 'munchie_dark', icon: <LightbulbIcon /> },
        { label: 'Alternative', value: 'altTheme', icon: <ColorLensIcon /> },
        { label: 'Professional', value: 'professional', icon: <BusinessIcon /> },
        { label: 'Corporate Memphis', value: 'memphis', icon: <PaletteIcon /> },
        { label: 'Startup', value: 'startup', icon: <CodeIcon /> },
        { label: 'Sunset', value: 'sunset', icon: <WbTwilightIcon /> },
        { label: 'Mint', value: 'mint', icon: <FilterVintageIcon /> },
        { label: 'Retro Neon', value: 'retro_neon', icon: <GradientIcon /> },
        // Add your new color schemes
        { label: 'CS Color V1', value: 'cs_color_27_v1', icon: <AutoAwesomeIcon /> },
        { label: 'CS Color V2', value: 'cs_color_30_v2', icon: <AutoAwesomeIcon /> },
        { label: 'CS Color V3', value: 'cs_color_23_v3', icon: <AutoAwesomeIcon /> },
        { label: 'CS Color V4', value: 'cs_color_29_v4', icon: <AutoAwesomeIcon /> },
        { label: 'CS Color V5', value: 'cs_color_31_v5', icon: <AutoAwesomeIcon /> },
    ];

    return (
        <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="theme-select-label">{translate('Theme')}</InputLabel>
                <Select
                    labelId="theme-select-label"
                    id="theme-select"
                    value={currentTheme}
                    onChange={handleChangeTheme}
                    label={translate('Theme')}
                >
                    {themes.map((theme) => (
                        <MenuItem key={theme.value} value={theme.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {theme.icon && (
                                    <Box sx={{ mr: 1 }}>
                                        {theme.icon}
                                    </Box>
                                )}
                                {translate(theme.label)}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default ThemeToggle;