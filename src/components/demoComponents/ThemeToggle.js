// src/components/common/ThemeToggle.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, selectAvailableThemes } from '../../reducers/themeSlice';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Tooltip,
    Box,
    Typography,
    Divider,
    Slider,
    Stack
} from '@mui/material';
import ThemeService from "../../services/ThemeService";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import BusinessIcon from '@mui/icons-material/Business';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GradientIcon from '@mui/icons-material/Gradient';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const currentTheme = useSelector(state => state.theme.mode);
    const [themePrefs, setThemePrefs] = useState(ThemeService.getThemePreferences());

    useEffect(() => {
        // Get stored theme and preferences
        const storedTheme = ThemeService.getTheme();
        if (storedTheme) {
            dispatch(setTheme(storedTheme));
        }
        setThemePrefs(ThemeService.getThemePreferences());
    }, [dispatch]);

    // Handle theme mode change
    const handleChangeTheme = (event) => {
        const newTheme = event.target.value;
        dispatch(setTheme(newTheme));
        ThemeService.setTheme(newTheme);
    };

    // Update a theme preference
    const updatePreference = (key, value) => {
        const newPrefs = { ...themePrefs, [key]: value };
        setThemePrefs(newPrefs);
        ThemeService.setThemePreferences(newPrefs);
    };

    // Toggle dark/light mode (only for spatial themes)
    const toggleDarkMode = () => {
        if (currentTheme === 'dark' || currentTheme === 'light') {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            dispatch(setTheme(newTheme));
            ThemeService.setTheme(newTheme);
        }
    };

    // Animation level labels
    const animationLabels = {
        none: translate('None'),
        low: translate('Low'),
        medium: translate('Medium'),
        high: translate('High'),
    };

    // Map animation level to slider value
    const animationLevelToValue = (level) => {
        switch(level) {
            case 'none': return 0;
            case 'low': return 1;
            case 'medium': return 2;
            case 'high': return 3;
            default: return 2;
        }
    };

    // Map slider value to animation level
    const valueToAnimationLevel = (value) => {
        switch(value) {
            case 0: return 'none';
            case 1: return 'low';
            case 2: return 'medium';
            case 3: return 'high';
            default: return 'medium';
        }
    };

    // All available themes with icons
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
    ];

    // Get the name of the current theme
    const currentThemeName = themes.find(t => t.value === currentTheme)?.label || 'Light';

    // Is current theme a spatial theme (light or dark)
    const isSpatialTheme = currentTheme === 'light' || currentTheme === 'dark';

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

            {isSpatialTheme && (
                <>
                    <Divider sx={{ my: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            {translate('Spatial Theme Options')}
                        </Typography>
                    </Divider>

                    <Stack spacing={2}>
                        {/* Quick Dark/Light Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={currentTheme === 'dark'}
                                    onChange={toggleDarkMode}
                                    color="primary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {currentTheme === 'dark' ? <DarkModeIcon sx={{ mr: 1 }} /> : <LightModeIcon sx={{ mr: 1 }} />}
                                    {translate(currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode')}
                                </Box>
                            }
                        />

                        {/* High Contrast Mode */}
                        <Tooltip title={translate('Increases contrast for better readability')}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={themePrefs.highContrast}
                                        onChange={(e) => updatePreference('highContrast', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessibilityNewIcon sx={{ mr: 1 }} />
                                        {translate('High Contrast')}
                                    </Box>
                                }
                            />
                        </Tooltip>

                        {/* Reduced Motion */}
                        <Tooltip title={translate('Reduces animation for accessibility needs')}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={themePrefs.reducedMotion}
                                        onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SpeedIcon sx={{ mr: 1 }} />
                                        {translate('Reduced Motion')}
                                    </Box>
                                }
                            />
                        </Tooltip>

                        {/* Animation Level Slider */}
                        <Box sx={{ px: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {translate('Animation Level')}: {translate(animationLabels[themePrefs.animationLevel])}
                            </Typography>
                            <Slider
                                value={animationLevelToValue(themePrefs.animationLevel)}
                                onChange={(_, value) => updatePreference('animationLevel', valueToAnimationLevel(value))}
                                step={1}
                                marks
                                min={0}
                                max={3}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => translate(animationLabels[valueToAnimationLevel(value)])}
                            />
                        </Box>

                        {/* Special Effects */}
                        <Tooltip title={translate('Toggle futuristic visual effects')}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={themePrefs.useScanlines}
                                        onChange={(e) => updatePreference('useScanlines', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AutoFixHighIcon sx={{ mr: 1 }} />
                                        {translate('Matrix Scanlines')}
                                    </Box>
                                }
                            />
                        </Tooltip>

                        <Tooltip title={translate('Toggle glow effects on elements')}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={themePrefs.useGlowEffects}
                                        onChange={(e) => updatePreference('useGlowEffects', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AutoFixHighIcon sx={{ mr: 1 }} />
                                        {translate('Glow Effects')}
                                    </Box>
                                }
                            />
                        </Tooltip>
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default ThemeToggle;