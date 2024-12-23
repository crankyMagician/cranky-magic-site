import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box,
    Chip,
    Typography
} from '@mui/material';
import { useGetAllAbilitiesQuery } from '../../../api/apiSlice';
const AbilitySelect = ({
                           value,
                           onChange,
                           required = false,
                           label = "Ability",
                           fullWidth = true
                       }) => {
    const { data: abilities, isLoading, error } = useGetAllAbilitiesQuery();
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>Loading abilities...</span>
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
                {abilities?.map((ability) => (
                    <MenuItem key={ability.id} value={ability.id}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%',
                            justifyContent: 'space-between'
                        }}>
                            <Typography>{ability.ability_name}</Typography>
                            {ability.is_hidden && (
                                <Chip
                                    label="Hidden"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
export default AbilitySelect;