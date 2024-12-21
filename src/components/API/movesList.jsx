import React, {useEffect} from 'react';
import {
    Box,
    CircularProgress,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    Grid,
    Paper,
} from '@mui/material';
import { useGetAllMovesQuery } from "../../api/apiSlice";

const MovesList = () => {
    const { data, error, isLoading, isSuccess } = useGetAllMovesQuery();

    useEffect(() => {
        console.log({ data, error, isLoading, isSuccess });
    }, [data, error, isLoading, isSuccess]);

    const moves = Array.isArray(data) ? data : data?.moves || [];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress aria-label="Loading moves" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" role="alert">
                Error: {error.message}
            </Alert>
        );
    }

    if (!moves.length) {
        return (
            <Typography variant="body1" color="textSecondary" align="center">
                No moves available.
            </Typography>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="h4" component="h1" gutterBottom>
                Move List
            </Typography>
            {moves.map((move) => (
                <Paper key={move.id} elevation={3} sx={{ mb: 2, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {move.move_name}
                    </Typography>
                    <Divider />
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Typography variant="body2">Power: {move.power}</Typography>
                        <Typography variant="body2">Accuracy: {move.accuracy}</Typography>
                        <Typography variant="body2">PP: {move.pp}</Typography>
                        <Typography variant="body2">Category: {move.category}</Typography>
                        <Typography variant="body2">Munchie Type ID: {move.munchie_type_id}</Typography>
                        <Typography variant="body2">Critical Hit Ratio: {move.high_critical_hit_ratio ? 'Yes' : 'No'}</Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default MovesList;


