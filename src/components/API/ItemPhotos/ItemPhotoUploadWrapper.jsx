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
import ItemSelect from '../Items/ItemSelect';
import PNGPhotoUploader from '../../Photos/PNGPhotoUploader';
import { useUploadItemPhotoMutation, useGetPrimaryPhotoByItemIdQuery } from '../../../api/apiSlice';
import DebugImageLoader from "../../Photos/DebugImageLoader";

const ItemPhotoUploadWrapper = () => {
    const [selectedItem, setSelectedItem] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [uploadItemPhoto, { isLoading }] = useUploadItemPhotoMutation();

    const { data: primaryPhoto, isFetching } = useGetPrimaryPhotoByItemIdQuery(selectedItem, {
        skip: !selectedItem,
    });

    const handleItemChange = (event) => {
        setSelectedItem(event.target.value);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handlePhotoProcessed = useCallback(
        async (photoData) => {
            if (!selectedItem) {
                setErrorMessage('Please select an Item first.');
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
                setSuccessMessage('Photo uploaded successfully!');
                setErrorMessage('');
            } catch (error) {
                setErrorMessage(error.data?.error || 'Failed to upload photo. Please try again.');
                setSuccessMessage('');
            }
        },
        [selectedItem, uploadItemPhoto]
    );

    return (
        <Box component="section" className="w-full max-w-2xl mx-auto p-4">
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom className="text-center mb-4">
                        Upload Item Photo
                    </Typography>
                    <Divider className="mb-4" />

                    <Box className="flex flex-col gap-6">
                        <ItemSelect
                            value={selectedItem}
                            onChange={handleItemChange}
                            required
                            label="Select Item"
                        />

                        {selectedItem && (
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

export default ItemPhotoUploadWrapper;