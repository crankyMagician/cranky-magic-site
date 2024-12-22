import React, { useState, useCallback, useEffect } from 'react';
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
import DebugImageLoader from "../../Photos/DebugImageLoader";


const MunchiePhotoUploadWrapper = () => {
    const [selectedMunchie, setSelectedMunchie] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [uploadMunchiePhoto, { isLoading }] = useUploadMunchiePhotoMutation();

    const { data: primaryPhoto, isFetching } = useGetPrimaryPhotoByMunchieIdQuery(selectedMunchie, {
        skip: !selectedMunchie,
    });

    const handleMunchieChange = (event) => {
        setSelectedMunchie(event.target.value);
        setErrorMessage('');
        setSuccessMessage('');
    };

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
                    is_primary: true,
                };

                await uploadMunchiePhoto(uploadData).unwrap();
                setSuccessMessage('Photo uploaded successfully!');
                setErrorMessage('');
            } catch (error) {
                setErrorMessage(error.data?.error || 'Failed to upload photo. Please try again.');
                setSuccessMessage('');
            }
        },
        [selectedMunchie, uploadMunchiePhoto]
    );

    return (
        <Box component="section" className="w-full max-w-2xl mx-auto p-4">
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom className="text-center mb-4">
                        Upload Munchie Photo
                    </Typography>
                    <Divider className="mb-4" />

                    <Box className="flex flex-col gap-6">
                        <MunchieSelect
                            value={selectedMunchie}
                            onChange={handleMunchieChange}
                            required
                            label="Select Munchie"
                        />

                        {selectedMunchie && (
                            <Fade in={true}>
                                <Box className="flex flex-col gap-4">
                                    {primaryPhoto?.data?.base64_data && (
                                        <DebugImageLoader base64String={primaryPhoto.data.base64_data} />
                                    )}

                                    <Box className="w-full" sx={{ width: 300, height: 300 }}>
                                        {isFetching && <CircularProgress />}

                                        {!isFetching && !primaryPhoto?.data?.base64_data && (
                                            <Paper elevation={0} sx={{ padding: 2 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    No photo available. Please upload a PNG.
                                                </Typography>
                                            </Paper>
                                        )}

                                        <PNGPhotoUploader
                                            onPhotoProcessed={handlePhotoProcessed}
                                            backgroundBase64={primaryPhoto?.data?.base64_data || ''}
                                        />
                                    </Box>
                                </Box>
                            </Fade>
                        )}

                        {isLoading && <CircularProgress />}

                        {errorMessage && (
                            <Fade in={!!errorMessage}>
                                <Alert severity="error" onClose={() => setErrorMessage('')}>
                                    {errorMessage}
                                </Alert>
                            </Fade>
                        )}

                        {successMessage && (
                            <Fade in={!!successMessage}>
                                <Alert severity="success" onClose={() => setSuccessMessage('')}>
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
