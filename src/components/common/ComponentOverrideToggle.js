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
    Paper,
    alpha,
    useTheme,
    Chip,
    ListItemIcon,
    ListItemText,
    Fade,
    Zoom
} from '@mui/material';
import ThemeService from "../../services/ThemeService";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import { getAllComponentOverrides } from '../../themes/muicomponents';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import BoltIcon from '@mui/icons-material/Bolt';
import SpaIcon from '@mui/icons-material/Spa';
import GridOnIcon from '@mui/icons-material/GridOn';
import StyleIcon from '@mui/icons-material/Style';
import PaletteIcon from '@mui/icons-material/Palette';

const ComponentOverrideToggle = () => {
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const theme = useTheme();
    const currentComponentOverride = useSelector(state => state.theme.componentOverride);
    const currentAnimation = useSelector(state => state.theme.animation);

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

    const getIcon = (overrideId) => {
        const icons = {
            cranky: <AutoAwesomeIcon sx={{ color: theme.palette.primary.main }} />,
            wizard: <AutoAwesomeIcon sx={{ color: theme.palette.secondary.main }} />,
            clean: <GridOnIcon />,
            minimal: <SpaIcon />,
            developer: <CodeIcon />,
            lightning: <BoltIcon sx={{ color: '#FFD700' }} />,
            classic: <DesignServicesIcon />,
            default: <StyleIcon />
        };
        return icons[overrideId] || <PaletteIcon />;
    };

    const isAnimated = currentAnimation && currentAnimation !== 'none';

    return (
        <Zoom in={true} timeout={500}>
            <Paper
                elevation={isAnimated ? 3 : 1}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: isAnimated ? theme.shadows[6] : theme.shadows[2],
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                    }
                }}
            >
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="component-override-select-label">
                        {translate('Component Style')}
                    </InputLabel>
                    <Select
                        labelId="component-override-select-label"
                        id="component-override-select"
                        value={currentComponentOverride}
                        onChange={handleChangeComponentOverride}
                        label={translate('Component Style')}
                        renderValue={(selected) => {
                            const override = componentOverrides.find(o => o.id === selected);
                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getIcon(selected)}
                                    <Typography variant="body2">
                                        {override ? translate(override.name) : selected}
                                    </Typography>
                                    {override?.isPremium && (
                                        <Chip
                                            label="Premium"
                                            size="small"
                                            color="primary"
                                            sx={{ ml: 'auto' }}
                                        />
                                    )}
                                </Box>
                            );
                        }}
                    >
                        {componentOverrides.map((override) => (
                            <MenuItem
                                key={override.id}
                                value={override.id}
                                sx={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    {getIcon(override.id)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2">
                                                {translate(override.name)}
                                            </Typography>
                                            {override.isPremium && (
                                                <Chip
                                                    label="Premium"
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {translate(override.description)}
                                        </Typography>
                                    }
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
        </Zoom>
    );
};

export default ComponentOverrideToggle;