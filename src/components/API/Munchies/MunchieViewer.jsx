import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Alert,
    Typography,
    Paper,
    Stack,
    Container,
} from '@mui/material';
import { useGetAllMunchieIdsAndNamesQuery } from '../../../api/apiSlice';
import MunchieDisplay from './MunchieDisplay';

const MunchieViewer = () => {
    const { data: munchies, isLoading, isError, error } = useGetAllMunchieIdsAndNamesQuery();
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (munchies && currentIndex < munchies.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (munchies && currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleEdit = (munchieId, munchieName) => {
        navigate(`/munchies/manage/${munchieId}/${munchieName}`, { state: { munchieName } });
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
                role="status"
                aria-busy="true"
                aria-live="polite"
            >
                <CircularProgress aria-label="Loading Munchies" />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error?.message || 'Failed to load Munchie list. Please try again.'}
            </Alert>
        );
    }

    if (!munchies || munchies.length === 0) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No munchies available to display.
            </Typography>
        );
    }

    const currentMunchie = munchies[currentIndex];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Munchie Viewer
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <MunchieDisplay munchieId={currentMunchie.id} />
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
                    <Button
                        variant="outlined"
                        size="large"
                        disabled={currentIndex === 0}
                        onClick={handlePrevious}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleEdit(currentMunchie.id, currentMunchie.name)}
                    >
                        Edit {currentMunchie.name}
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        disabled={currentIndex === munchies.length - 1}
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};

export default MunchieViewer;
