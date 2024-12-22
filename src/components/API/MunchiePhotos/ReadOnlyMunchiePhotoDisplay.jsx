import React, { useState } from 'react';
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
import { useGetPrimaryPhotoByMunchieIdQuery } from '../../../api/apiSlice';

const ReadOnlyMunchiePhotoDisplay = ({ munchieId }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const {
        data: primaryPhoto,
        isFetching,
        isError: isFetchError
    } = useGetPrimaryPhotoByMunchieIdQuery(munchieId, {
        skip: !munchieId,
    });

    return (
        <Container
            maxWidth={false}
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                minHeight: '100vh',
            }}
        >
            <Card
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 'md',
                    height: 'fit-content',
                    minHeight: '80vh',
                }}
            >
                <CardContent
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        py: 4
                    }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h5" component="h2">
                                Munchie Photo
                            </Typography>
                            <Tooltip title="View your Munchie's photo">
                                <IconButton size="small" aria-label="Help">
                                    <Help />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Divider sx={{ mt: 2 }} />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                        {munchieId && (
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
                                                    Loading photo...
                                                </Typography>
                                            </Box>
                                        ) : isFetchError ? (
                                            <Alert severity="error" sx={{ width: '100%' }}>
                                                Failed to load photo
                                            </Alert>
                                        ) : !primaryPhoto?.data?.base64_data ? (
                                            <Paper sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <PhotoCamera color="action" />
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    sx={{ mt: 1 }}
                                                >
                                                    No photo available
                                                </Typography>
                                            </Paper>
                                        ) : (
                                            <Box
                                                component="img"
                                                src={`data:image/png;base64,${primaryPhoto.data.base64_data}`}
                                                alt="Munchie photo"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: 1
                                                }}
                                                onError={() => {
                                                    setErrorMessage('Failed to load image');
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Fade>
                        )}

                        {!munchieId && (
                            <Alert severity="warning" sx={{ width: '100%' }}>
                                No munchie ID provided
                            </Alert>
                        )}

                        {errorMessage && (
                            <Box sx={{ width: '100%', maxWidth: 400 }}>
                                <Fade in={!!errorMessage}>
                                    <Alert
                                        severity="error"
                                        onClose={() => setErrorMessage('')}
                                        role="alert"
                                    >
                                        {errorMessage}
                                    </Alert>
                                </Fade>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ReadOnlyMunchiePhotoDisplay;