import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box
} from '@mui/material';
import { useGetAllEffectsQuery } from '../../../api/apiSlice';

const effectTypes = ['DAMAGE', 'STATUS', 'HEAL', 'RECOIL', 'OTHER', 'STAT_CHANGE'];

const EffectTypeSelect = ({ value, onChange, required = false, label = "Effect Type", fullWidth = true }) => {
    return (
        <FormControl required={required} fullWidth={fullWidth}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value || ''}
                onChange={onChange}
                label={label}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {effectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default EffectTypeSelect;