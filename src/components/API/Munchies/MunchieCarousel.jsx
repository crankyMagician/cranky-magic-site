import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    Card,
    CircularProgress,
    Alert,
    useTheme,
    useMediaQuery,
    Typography,
    Container
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useGetAllMunchieIdsQuery } from '../../../api/apiSlice';
import MunchieDisplay from './MunchieDisplay';

const MunchieCarousel = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data: munchieIds, isLoading, error } = useGetAllMunchieIdsQuery();

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? munchieIds.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === munchieIds.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [munchieIds]);

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
                role="status"
                aria-label="Loading munchies"
            >
                <CircularProgress />
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

    return (
        <Container maxWidth="xl">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <Typography variant="h6" component="div">
                        Munchie {currentIndex + 1} of {munchieIds.length}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={handlePrevious}
                            aria-label="Previous munchie"
                            color="primary"
                            sx={{
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            aria-label="Next munchie"
                            color="primary"
                            sx={{
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <ArrowForward />
                        </IconButton>
                    </Box>
                </Box>

                <Card
                    elevation={3}
                    sx={{
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        p: 2
                    }}
                >
                    <MunchieDisplay
                        munchieId={munchieIds[currentIndex]}
                        key={munchieIds[currentIndex]}
                    />
                </Card>

                {!isMobile && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 2
                    }}>
                        <Button
                            variant="contained"
                            onClick={handlePrevious}
                            startIcon={<ArrowBack />}
                            aria-label="Previous munchie"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<ArrowForward />}
                            aria-label="Next munchie"
                        >
                            Next
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default MunchieCarousel;