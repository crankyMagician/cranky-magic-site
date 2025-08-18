// src/components/common/ThemeToggle.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setComponentOverride } from '../../reducers/themeSlice';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Grid,
    Chip,
    Divider
} from '@mui/material';
import ThemeService from "../../services/ThemeService";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import { getAllThemes, getThemesByCategory } from '../../themes/themeRegistry';
import { getAllComponentOverrides } from '../../themes/muicomponents';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const currentTheme = useSelector(state => state.theme.mode);
    const currentComponentOverride = useSelector(state => state.theme.componentOverride);

    useEffect(() => {
        const storedTheme = ThemeService.getTheme();
        const storedComponentOverride = ThemeService.getComponentOverride();
        if (storedTheme) {
            dispatch(setTheme(storedTheme));
        }
        if (storedComponentOverride) {
            dispatch(setComponentOverride(storedComponentOverride));
        }
    }, [dispatch]);

    const handleChangeTheme = (event) => {
        const newTheme = event.target.value;
        dispatch(setTheme(newTheme));
        ThemeService.setTheme(newTheme);
    };

    const handleChangeComponentOverride = (event) => {
        const newOverride = event.target.value;
        dispatch(setComponentOverride(newOverride));
        ThemeService.setComponentOverride(newOverride);
    };

    // Get all themes organized by category
    const lightThemes = getThemesByCategory('light');
    const darkThemes = getThemesByCategory('dark');
    const customThemes = getThemesByCategory('custom');

    // Get all component overrides
    const componentOverrides = getAllComponentOverrides();

    // Helper function to render theme group
    const renderThemeGroup = (themes, groupLabel) => {
        if (themes.length === 0) return null;

        return [
            <MenuItem key={`${groupLabel}-header`} disabled>
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    {groupLabel}
                </Typography>
            </MenuItem>,
            ...themes.map((theme) => (
                <MenuItem key={theme.id} value={theme.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            {theme.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2">
                                {translate(theme.name)}
                            </Typography>
                            {theme.isNew && (
                                <Chip
                                    label="NEW"
                                    size="small"
                                    color="primary"
                                    sx={{ ml: 1, height: 16, fontSize: '0.6rem' }}
                                />
                            )}
                        </Box>
                    </Box>
                </MenuItem>
            ))
        ];
    };

    return (
        <Box sx={{ minWidth: 180 }}>
            <Grid container spacing={2}>
                {/* Theme Selection */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="theme-select-label">{translate('Color Theme')}</InputLabel>
                        <Select
                            labelId="theme-select-label"
                            id="theme-select"
                            value={currentTheme}
                            onChange={handleChangeTheme}
                            label={translate('Color Theme')}
                        >
                            {renderThemeGroup(lightThemes, 'Light Themes')}
                            {lightThemes.length > 0 && darkThemes.length > 0 && <Divider key="divider-1" />}
                            {renderThemeGroup(darkThemes, 'Dark Themes')}
                            {(lightThemes.length > 0 || darkThemes.length > 0) && customThemes.length > 0 && <Divider key="divider-2" />}
                            {renderThemeGroup(customThemes, 'Custom Themes')}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Component Override Selection */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="component-override-select-label">{translate('Style Override')}</InputLabel>
                        <Select
                            labelId="component-override-select-label"
                            id="component-override-select"
                            value={currentComponentOverride}
                            onChange={handleChangeComponentOverride}
                            label={translate('Style Override')}
                        >
                            {componentOverrides.map((override) => (
                                <MenuItem key={override.id} value={override.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                            {override.icon}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2">
                                                {translate(override.name)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {translate(override.description)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Current Theme Info */}
                <Grid item xs={12}>
                    <Box sx={{ mt: 1, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            {translate('Current Configuration')}
                        </Typography>
                        <Typography variant="body2">
                            <strong>{translate('Theme')}:</strong> {ThemeService.getThemeDisplayName(currentTheme)}
                        </Typography>
                        <Typography variant="body2">
                            <strong>{translate('Style')}:</strong> {componentOverrides.find(o => o.id === currentComponentOverride)?.name || 'Unknown'}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ThemeToggle;