import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box
} from '@mui/material';
import { useGetAllMunchiesQuery } from '../../../api/apiSlice';

const MunchieSelect = ({ value, onChange, required = false, label = "Munchie", fullWidth = true }) => {
    const { data: munchies, isLoading, error } = useGetAllMunchiesQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>Loading munchies...</span>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ color: 'error.main', textAlign: 'center' }}>
                <span>Failed to load munchies. Please try again.</span>
            </Box>
        );
    }

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
                {munchies?.map((munchie) => (
                    <MenuItem key={munchie.id} value={munchie.id}>
                        {munchie.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MunchieSelect;
