// src/components/common/TypographyToggle.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTypography } from '../../reducers/themeSlice';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Chip,
    Divider
} from '@mui/material';
import ThemeService from "../../services/ThemeService";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import { getAllTypographies, getTypographiesByCategory } from '../../themes/typography';

const TypographyToggle = () => {
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const currentTypography = useSelector(state => state.theme.typography);

    useEffect(() => {
        const storedTypography = ThemeService.getTypography();
        if (storedTypography) {
            dispatch(setTypography(storedTypography));
        }
    }, [dispatch]);

    const handleChangeTypography = (event) => {
        const newTypography = event.target.value;
        dispatch(setTypography(newTypography));
        ThemeService.setTypography(newTypography);
    };

    // Get all typographies organized by category
    const futuristicTypographies = getTypographiesByCategory('futuristic');
    const modernTypographies = getTypographiesByCategory('modern');
    const businessTypographies = getTypographiesByCategory('business');
    const playfulTypographies = getTypographiesByCategory('playful');
    const uniqueTypographies = getTypographiesByCategory('unique');
    const warmTypographies = getTypographiesByCategory('warm');
    const freshTypographies = getTypographiesByCategory('fresh');
    const lightTypographies = getTypographiesByCategory('light');
    const boldTypographies = getTypographiesByCategory('bold');
    const retroTypographies = getTypographiesByCategory('retro');
    const accessibilityTypographies = getTypographiesByCategory('accessibility');

    // Helper function to render typography group
    const renderTypographyGroup = (typographies, groupLabel) => {
        if (typographies.length === 0) return null;

        return [
            <MenuItem key={`${groupLabel}-header`} disabled>
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    {groupLabel}
                </Typography>
            </MenuItem>,
            ...typographies.map((typography) => (
                <MenuItem key={typography.id} value={typography.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            {typography.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2">
                                {translate(typography.name)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {translate(typography.description)}
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
            ))
        ];
    };

    const currentTypographyInfo = getAllTypographies().find(t => t.id === currentTypography);

    return (
        <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="typography-select-label">{translate('Typography Style')}</InputLabel>
                <Select
                    labelId="typography-select-label"
                    id="typography-select"
                    value={currentTypography}
                    onChange={handleChangeTypography}
                    label={translate('Typography Style')}
                >
                    {renderTypographyGroup(futuristicTypographies, 'Futuristic')}
                    {futuristicTypographies.length > 0 && modernTypographies.length > 0 && <Divider key="divider-1" />}
                    {renderTypographyGroup(modernTypographies, 'Modern')}
                    {(futuristicTypographies.length > 0 || modernTypographies.length > 0) && businessTypographies.length > 0 && <Divider key="divider-2" />}
                    {renderTypographyGroup(businessTypographies, 'Business')}
                    {businessTypographies.length > 0 && playfulTypographies.length > 0 && <Divider key="divider-3" />}
                    {renderTypographyGroup(playfulTypographies, 'Playful')}
                    {playfulTypographies.length > 0 && uniqueTypographies.length > 0 && <Divider key="divider-4" />}
                    {renderTypographyGroup(uniqueTypographies, 'Unique')}
                    {uniqueTypographies.length > 0 && warmTypographies.length > 0 && <Divider key="divider-5" />}
                    {renderTypographyGroup(warmTypographies, 'Warm')}
                    {warmTypographies.length > 0 && freshTypographies.length > 0 && <Divider key="divider-6" />}
                    {renderTypographyGroup(freshTypographies, 'Fresh')}
                    {freshTypographies.length > 0 && lightTypographies.length > 0 && <Divider key="divider-7" />}
                    {renderTypographyGroup(lightTypographies, 'Light')}
                    {lightTypographies.length > 0 && boldTypographies.length > 0 && <Divider key="divider-8" />}
                    {renderTypographyGroup(boldTypographies, 'Bold')}
                    {boldTypographies.length > 0 && retroTypographies.length > 0 && <Divider key="divider-9" />}
                    {renderTypographyGroup(retroTypographies, 'Retro')}
                    {retroTypographies.length > 0 && accessibilityTypographies.length > 0 && <Divider key="divider-10" />}
                    {renderTypographyGroup(accessibilityTypographies, 'Accessibility')}
                </Select>
            </FormControl>

            {/* Current Typography Info */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                    {translate('Current Typography')}
                </Typography>
                <Typography variant="body2">
                    <strong>{currentTypographyInfo?.name || 'Unknown'}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {currentTypographyInfo?.description || ''}
                </Typography>
                {currentTypographyInfo?.tags && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                        {currentTypographyInfo.tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.6rem', height: 16 }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default TypographyToggle;