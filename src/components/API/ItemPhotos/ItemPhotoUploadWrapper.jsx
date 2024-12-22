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
    Container
} from '@mui/material';
import { Help, PhotoCamera } from '@mui/icons-material';
import ItemSelect from '../Items/ItemSelect';
import PNGPhotoUploader from '../../Photos/PNGPhotoUploader';
import { useUploadItemPhotoMutation, useGetPrimaryPhotoByItemIdQuery } from '../../../api/apiSlice';
// import DebugImageLoader from "../../Photos/DebugImageLoader";

const ItemPhotoUploadWrapper = () => {
    const [selectedItem, setSelectedItem] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [uploadItemPhoto, { isLoading: isUploading }] = useUploadItemPhotoMutation();
    const {
        data: primaryPhoto,
        isFetching,
        isError: isFetchError
    } = useGetPrimaryPhotoByItemIdQuery(selectedItem, {
        skip: !selectedItem,
    });

    const handleItemChange = (event) => {
        const value = event.target.value;
        setSelectedItem(value);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handlePhotoProcessed = useCallback(
        async (photoData) => {
            if (!selectedItem) {
                setErrorMessage('Please select an Item before uploading a photo.');
                return;
            }

            try {
                const uploadData = {
                    item_id: selectedItem,
                    file_name: photoData.file_name,
                    base64_data: photoData.base64_data,
                    is_primary: true,
                };

                await uploadItemPhoto(uploadData).unwrap();
                setSuccessMessage('Photo uploaded successfully! The image will be displayed shortly.');
                setErrorMessage('');
            } catch (error) {
                const errorMsg = error.data?.error || 'Failed to upload photo. Please try again.';
                setErrorMessage(errorMsg);
                setSuccessMessage('');
            }
        },
        [selectedItem, uploadItemPhoto]
    );

    return (
        <Container
            maxWidth={false}
            sx={{
                height: '100%',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Card
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 'md',
                    minHeight: '80vh',
                    height: 'fit-content'
                }}
            >
                <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    py: 4
                }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h5" component="h2">
                                Upload Item Photo
                            </Typography>
                            <Tooltip title="Upload a PNG image for your selected Item. The image will be automatically resized and optimized.">
                                <IconButton size="small" aria-label="Help">
                                    <Help />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Divider sx={{ mt: 2 }} />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                        <Box sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
                            <ItemSelect
                                value={selectedItem}
                                onChange={handleItemChange}
                                required
                                label="Select Item"
                                aria-label="Select an Item for photo upload"
                            />
                        </Box>

                        {selectedItem && (
                            <Fade in={true}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        width: 300,
                                        height: 300,
                                        mt: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
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
                                            <Paper sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                width: '100%'
                                            }}>
                                                <PhotoCamera color="action" />
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    sx={{ mt: 1 }}
                                                >
                                                    No photo available. Upload a PNG image.
                                                </Typography>
                                            </Paper>
                                        ) : null}

                                        <PNGPhotoUploader
                                            onPhotoProcessed={handlePhotoProcessed}
                                            backgroundBase64={primaryPhoto?.data?.base64_data || ''}
                                            areaWidth="300px"
                                            areaHeight="300px"
                                        />
                                    </Box>
                                </Box>
                            </Fade>
                        )}

                        {isUploading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2">
                                    Uploading photo...
                                </Typography>
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
                </CardContent>
            </Card>
        </Container>
    );
};

export default ItemPhotoUploadWrapper;