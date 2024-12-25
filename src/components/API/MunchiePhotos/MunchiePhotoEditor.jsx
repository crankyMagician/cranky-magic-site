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
    Tooltip,
    IconButton,
    Button,
} from '@mui/material';
import { Help, PhotoCamera } from '@mui/icons-material';
import PNGPhotoUploader from '../../Photos/PNGPhotoUploader';
import { useUploadMunchiePhotoMutation, useGetPrimaryPhotoByMunchieIdQuery } from '../../../api/apiSlice';

const MunchiePhotoEditor = ({ munchieId }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [uploadMunchiePhoto, { isLoading: isUploading }] = useUploadMunchiePhotoMutation();
    const {
        data: primaryPhoto,
        isFetching,
        isError: isFetchError,
    } = useGetPrimaryPhotoByMunchieIdQuery(munchieId);

    const handlePhotoProcessed = useCallback(
        async (photoData) => {
            try {
                const uploadData = {
                    munchie_id: munchieId,
                    file_name: photoData.file_name,
                    base64_data: photoData.base64_data,
                    is_primary: true,
                };

                await uploadMunchiePhoto(uploadData).unwrap();
                setSuccessMessage('Photo uploaded successfully! The image will be displayed shortly.');
                setErrorMessage('');
            } catch (error) {
                const errorMsg = error.data?.error || 'Failed to upload photo. Please try again.';
                setErrorMessage(errorMsg);
                setSuccessMessage('');
            }
        },
        [munchieId, uploadMunchiePhoto]
    );

    return (
        <Card elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Edit Munchie Photo
                </Typography>
                <Tooltip title="Upload a PNG image for this Munchie. The image will be automatically resized and optimized.">
                    <IconButton size="small" aria-label="Help">
                        <Help />
                    </IconButton>
                </Tooltip>
                <Divider sx={{ mt: 2, mb: 2 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box
                    sx={{
                        width: 300,
                        height: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {isFetching ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Loading current photo...
                            </Typography>
                        </Box>
                    ) : isFetchError ? (
                        <Alert severity="error" sx={{ width: '100%' }}>
                            Failed to load current photo
                        </Alert>
                    ) : !primaryPhoto?.data?.base64_data ? (
                        <Paper sx={{ p: 2, textAlign: 'center', width: '100%' }}>
                            <PhotoCamera color="action" />
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                No photo available. Upload a PNG image.
                            </Typography>
                        </Paper>
                    ) : (
                        <img
                            src={`data:image/png;base64,${primaryPhoto.data.base64_data}`}
                            alt="Current Munchie"
                            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
                        />
                    )}
                </Box>

                <PNGPhotoUploader
                    onPhotoProcessed={handlePhotoProcessed}
                    backgroundBase64={primaryPhoto?.data?.base64_data || ''}
                    areaWidth="300px"
                    areaHeight="300px"
                />

                {isUploading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2">Uploading photo...</Typography>
                    </Box>
                )}

                {(errorMessage || successMessage) && (
                    <Box sx={{ width: '100%', maxWidth: 400 }}>
                        {errorMessage && (
                            <Fade in={!!errorMessage}>
                                <Alert
                                    severity="error"
                                    onClose={() => setErrorMessage('')}
                                    role="alert"
                                >
                                    {errorMessage}
                                </Alert>
                            </Fade>
                        )}

                        {successMessage && (
                            <Fade in={!!successMessage}>
                                <Alert
                                    severity="success"
                                    onClose={() => setSuccessMessage('')}
                                    role="alert"
                                >
                                    {successMessage}
                                </Alert>
                            </Fade>
                        )}
                    </Box>
                )}
            </Box>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                Finish Editing
            </Button>
        </Card>
    );
};

export default MunchiePhotoEditor;
