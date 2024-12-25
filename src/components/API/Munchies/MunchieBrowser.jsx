import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Typography,
    Grid,
} from '@mui/material';
import { useGetPaginatedMunchiesQuery } from '../../../api/apiSlice';
import ComprehensiveMunchieManager from './ComprehensiveMunchieManager';

const MunchieBrowser = () => {
    const [page, setPage] = useState(0);
    const [selectedMunchie, setSelectedMunchie] = useState(null);

    const { data, isLoading, error } = useGetPaginatedMunchiesQuery({ page, limit: 1 });

    const handleNext = () => {
        if (data && data.has_next) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (page > 0) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress aria-label="Loading Munchies..." />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Failed to load munchies. Please try again.
            </Alert>
        );
    }

    const munchies = data?.results || [];
    const hasPrevious = data?.has_previous || false;
    const hasNext = data?.has_next || false;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Munchie Browser
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        {munchies.length > 0 && (
                            <ComprehensiveMunchieManager
                                munchieId={munchies[0].id}
                                munchieName={munchies[0].name}
                            />
                        )}
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 4,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handlePrevious}
                        disabled={!hasPrevious}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!hasNext}
                    >
                        Next
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default MunchieBrowser;
