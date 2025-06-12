import React from 'react';
import { Box, Typography, Alert, Paper } from '@mui/material';

const ReadOnlyPNGDisplay = ({
                                base64Data,
                                alt = 'Image',
                                width = '300px',
                                height = '300px'
                            }) => {
    const getDataImageUrlWithHeader = (base64) => {
        if (!base64) return null;
        return base64.startsWith('data:image/') ? base64 : `data:image/png;base64,${base64}`;
    };

    const validatedImageUrl = getDataImageUrlWithHeader(base64Data);

    if (!validatedImageUrl) {
        return (
            <Alert severity="error" sx={{ width: '100%' }}>
                Invalid image data
            </Alert>
        );
    }

    return (
        <Paper
            elevation={1}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 1,
                width,
                height
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default'
                }}
            >
                <img
                    src={validatedImageUrl}
                    alt={alt}
                    style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%'
                    }}
                    onError={(e) => {
                        console.error('Failed to load image');
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </Box>
        </Paper>
    );
};

export default ReadOnlyPNGDisplay;