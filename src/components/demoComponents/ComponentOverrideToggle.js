// src/components/common/ComponentOverrideToggle.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setComponentOverride } from '../../reducers/themeSlice';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Grid
} from '@mui/material';
import ThemeService from "../../services/ThemeService";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import { getAllComponentOverrides } from '../../themes/muicomponents';

const ComponentOverrideToggle = () => {
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const currentComponentOverride = useSelector(state => state.theme.componentOverride);

    useEffect(() => {
        const storedComponentOverride = ThemeService.getComponentOverride();
        if (storedComponentOverride) {
            dispatch(setComponentOverride(storedComponentOverride));
        }
    }, [dispatch]);

    const handleChangeComponentOverride = (event) => {
        const newOverride = event.target.value;
        dispatch(setComponentOverride(newOverride));
        ThemeService.setComponentOverride(newOverride);
    };

    // Get all component overrides
    const componentOverrides = getAllComponentOverrides();

    return (
        <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="component-override-select-label">{translate('Component Style')}</InputLabel>
                <Select
                    labelId="component-override-select-label"
                    id="component-override-select"
                    value={currentComponentOverride}
                    onChange={handleChangeComponentOverride}
                    label={translate('Component Style')}
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
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {translate(override.description)}
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Current Override Info */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                    {translate('Current Style')}
                </Typography>
                <Typography variant="body2">
                    <strong>{componentOverrides.find(o => o.id === currentComponentOverride)?.name || 'Unknown'}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {componentOverrides.find(o => o.id === currentComponentOverride)?.description || ''}
                </Typography>
            </Box>
        </Box>
    );
};

export default ComponentOverrideToggle;