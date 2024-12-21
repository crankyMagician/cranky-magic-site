import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box
} from '@mui/material';
import { useGetAllItemsQuery } from '../../../api/apiSlice';

const ItemSelect = ({ value, onChange, required = false, label = "Item", fullWidth = true }) => {
    const { data: items, isLoading, error } = useGetAllItemsQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>Loading items...</span>
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
                {items?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ItemSelect;