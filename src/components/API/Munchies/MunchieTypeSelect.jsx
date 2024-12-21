import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box
} from '@mui/material';
import { useGetAllTypesQuery } from '../../../api/apiSlice';

const MunchieTypeSelect = ({ value, onChange, required = false, label = "Type", fullWidth = true }) => {
    const { data: types, isLoading, error } = useGetAllTypesQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>Loading types...</span>
            </Box>
        );
    }

    if (error) {
        return null;
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
                {types?.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                        {type.type_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MunchieTypeSelect;