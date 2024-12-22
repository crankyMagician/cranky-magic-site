import React, { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Alert,
    Paper,
    CircularProgress,
    Card,
    CardContent,
    Fade,
    Divider,
} from '@mui/material';
import MunchieSelect from '../Munchies/MunchieSelect';
import PNGPhotoUploader from '../../Photos/PNGPhotoUploader';
import { useUploadMunchiePhotoMutation, useGetPrimaryPhotoByMunchieIdQuery } from '../../../api/apiSlice';

const MunchiePhotoUploadWrapper = () => {
    const [selectedMunchie, setSelectedMunchie] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadMunchiePhoto, { isLoading }] = useUploadMunchiePhotoMutation();

    // Using the query to get the primary photo. Skip if no munchie is selected.
    const { data: primaryPhoto, isFetching } = useGetPrimaryPhotoByMunchieIdQuery(selectedMunchie, {
        skip: !selectedMunchie,
    });

    // Clear messages when user selects a new munchie
    const handleMunchieChange = (event) => {
        setSelectedMunchie(event.target.value);
        setErrorMessage('');
        setSuccessMessage('');
    };

    // Process the photo upload
    const handlePhotoProcessed = useCallback(
        async (photoData) => {
            if (!selectedMunchie) {
                setErrorMessage('Please select a Munchie first.');
                return;
            }

            try {
                const uploadData = {
                    munchie_id: selectedMunchie,
                    file_name: photoData.file_name,
                    base64_data: photoData.base64_data,
                    is_primary: true, // Setting as primary photo
                };

                await uploadMunchiePhoto(uploadData).unwrap();
                setSuccessMessage('Photo uploaded successfully!');
                setErrorMessage('');
            } catch (error) {
                console.error('Upload error:', error);
                // Provide clear user feedback
                setErrorMessage(error.data?.error || 'Failed to upload photo. Please try again.');
                setSuccessMessage('');
            }
        },
        [selectedMunchie, uploadMunchiePhoto]
    );

    return (
        <Box
            component="section"
            className="w-full max-w-2xl mx-auto p-4"
            aria-label="Munchie photo upload section"
        >
            <Card elevation={3}>
                <CardContent>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        className="text-center mb-4"
                    >
                        Upload Munchie Photo
                    </Typography>
                    <Divider className="mb-4" />

                    <Box className="flex flex-col gap-6">
                        <MunchieSelect
                            value={selectedMunchie}
                            onChange={handleMunchieChange}
                            required
                            label="Select Munchie"
                            aria-label="Select a Munchie"
                        />

                        {/* Only show the uploader section if a Munchie is selected */}
                        {selectedMunchie && (
                            <Fade in={true}>
                                <Box
                                    className="w-full"
                                    aria-label="Photo uploader section"
                                    sx={{
                                        width: 300,
                                        height: 300,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {/* Show loading spinner while fetching existing photo */}
                                    {isFetching && (
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            width="100%"
                                            height="100%"
                                        >
                                            <CircularProgress />
                                        </Box>
                                    )}

                                    {/* If not fetching and no base64_data present, display a helpful message */}
                                    {!isFetching && !primaryPhoto?.base64_data && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                pointerEvents: 'none',
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                            }}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                No photo available. Please upload a PNG.
                                            </Typography>
                                        </Paper>
                                    )}

                                    {/* Our PNGPhotoUploader component. We pass the base64_data if it exists */}
                                    <PNGPhotoUploader
                                        onPhotoProcessed={handlePhotoProcessed}
                                        aria-label="PNG photo uploader"
                                        areaWidth="300px"
                                        areaHeight="300px"
                                        backgroundBase64={primaryPhoto?.base64_data || ''}
                                    />
                                </Box>
                            </Fade>
                        )}

                        {/* Show uploading spinner while isLoading is true */}
                        {isLoading && (
                            <Box
                                className="flex justify-center items-center p-4"
                                role="status"
                                aria-label="Uploading photo"
                            >
                                <CircularProgress />
                            </Box>
                        )}

                        {/* Error message with fade-in transition and close button */}
                        {errorMessage && (
                            <Fade in={!!errorMessage}>
                                <Alert
                                    severity="error"
                                    onClose={() => setErrorMessage('')}
                                    role="alert"
                                    aria-live="assertive" /* Accessibility: announce errors to screen readers */
                                >
                                    {errorMessage}
                                </Alert>
                            </Fade>
                        )}

                        {/* Success message with fade-in transition and close button */}
                        {successMessage && (
                            <Fade in={!!successMessage}>
                                <Alert
                                    severity="success"
                                    onClose={() => setSuccessMessage('')}
                                    role="alert"
                                    aria-live="polite" /* Accessibility: announce success to screen readers */
                                >
                                    {successMessage}
                                </Alert>
                            </Fade>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MunchiePhotoUploadWrapper;
