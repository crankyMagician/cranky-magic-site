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
import { useGetAllMovesQuery } from '../features/api/apiSlice';
const MoveSelect = ({
                        value,
                        onChange,
                        required = false,
                        label = "Move",
                        fullWidth = true
                    }) => {
    const { data: moves, isLoading, error } = useGetAllMovesQuery();
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>Loading moves...</span>
            </Box>
        );
    }
    if (error) {
        return null;
    }
    const getCategoryColor = (category) => {
        switch (category) {
            case 'PHYSICAL':
                return '#e57373';  // Light Red
            case 'SPECIAL':
                return '#64b5f6';  // Light Blue
            default:
                return '#90a4ae';  // Light Gray
        }
    };
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
                {moves?.map((move) => (
                    <MenuItem key={move.id} value={move.id}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%',
                            justifyContent: 'space-between'
                        }}>
                            <Typography>{move.move_name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={move.category}
                                    size="small"
                                    sx={{
                                        backgroundColor: getCategoryColor(move.category),
                                        color: 'white'
                                    }}
                                />
                                {move.power && (
                                    <Typography variant="body2" color="textSecondary">
                                        Power: {move.power}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
export default MoveSelect;