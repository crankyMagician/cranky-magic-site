// src/components/common/OverrideStyleToggle.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOverrideStyle } from '../../reducers/themeSlice';
import {
    FormControl,
    FormLabel,
    ToggleButtonGroup,
    ToggleButton,
    Box,
    Tooltip,
    Typography
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GridOnIcon from '@mui/icons-material/GridOn';
import useCustomTranslation from "../../hooks/useCustomTranslation";

const OverrideStyleToggle = () => {
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const currentOverrideStyle = useSelector(state => state.theme.overrideStyle);

    const handleChange = (event, newStyle) => {
        if (newStyle !== null) {
            dispatch(setOverrideStyle(newStyle));
            // Optionally save to localStorage
            localStorage.setItem('themeOverrideStyle', newStyle);
        }
    };

    const styles = [
        {
            value: 'cranky',
            label: 'Magical',
            icon: <AutoAwesomeIcon />,
            description: 'Enchanted effects with sparkles and mystical animations'
        },
        {
            value: 'spatial',
            label: 'Matrix',
            icon: <GridOnIcon />,
            description: 'Cyberpunk theme with digital effects and holographic elements'
        }
    ];

    return (
        <Box sx={{ my: 2 }}>
            <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">
                        {translate('ComponentStyle') || 'Component Style'}
                    </Typography>
                </FormLabel>
                <ToggleButtonGroup
                    value={currentOverrideStyle}
                    exclusive
                    onChange={handleChange}
                    aria-label="component style"
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            px: 2,
                            py: 1,
                            gap: 1,
                            '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            },
                        },
                    }}
                >
                    {styles.map((style) => (
                        <Tooltip key={style.value} title={style.description} arrow>
                            <ToggleButton value={style.value} aria-label={style.label}>
                                {style.icon}
                                <Typography variant="button" sx={{ ml: 0.5 }}>
                                    {style.label}
                                </Typography>
                            </ToggleButton>
                        </Tooltip>
                    ))}
                </ToggleButtonGroup>
            </FormControl>
        </Box>
    );
};

export default OverrideStyleToggle;