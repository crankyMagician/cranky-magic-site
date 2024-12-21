import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box
} from '@mui/material';
import { useGetAllStatusConditionsQuery } from '../../../api/apiSlice';

const StatusConditionSelect = ({ value, onChange, required = false, label = "Status Condition", fullWidth = true }) => {
    const { data: statusConditions, isLoading, error } = useGetAllStatusConditionsQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>Loading status conditions...</span>
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
                {statusConditions?.map((condition) => (
                    <MenuItem key={condition.id} value={condition.id}>
                        {condition.condition_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default StatusConditionSelect;