import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Base64ToImage from './Base64ToImage';

const Dropzone = styled(Box, {
    shouldForwardProp: (prop) =>
        prop !== 'isDragging' && prop !== 'areaWidth' && prop !== 'areaHeight' && prop !== 'backgroundImage',
})(({ theme, isDragging, areaWidth, areaHeight, backgroundImage }) => ({
    border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    width: areaWidth || '100%',
    height: areaHeight || '200px',
    position: 'relative',
    overflow: 'hidden',
}));

const getDataImageUrlWithHeader = (base64) => {
    if (!base64) return null;
    const hasHeader = base64.startsWith('data:image/');
    return hasHeader ? base64 : `data:image/png;base64,${base64}`;
};

const PNGPhotoUploader = ({ onPhotoProcessed, areaWidth, areaHeight, backgroundBase64 }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileProcessing = async (file) => {
        console.log('Starting file processing:', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
        });

        if (!file.name.toLowerCase().endsWith('.png')) {
            console.warn('Invalid file type:', file.type);
            setErrorMessage('Only PNG files are allowed.');
            return;
        }

        try {
            setErrorMessage('');
            setLoading(true);

            const image = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                image.src = e.target.result;
            };

            reader.onerror = (error) => {
                console.error('FileReader error:', error);
                setErrorMessage('Failed to read the file.');
                setLoading(false);
            };

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                const maxSize = Math.max(image.width, image.height);
                const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(maxSize)));

                canvas.width = nextPowerOfTwo;
                canvas.height = nextPowerOfTwo;

                context.fillStyle = 'transparent';
                context.fillRect(0, 0, canvas.width, canvas.height);

                const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
                const x = (canvas.width - image.width * scale) / 2;
                const y = (canvas.height - image.height * scale) / 2;

                context.drawImage(image, x, y, image.width * scale, image.height * scale);

                const base64Data = canvas.toDataURL('image/png').split(',')[1];

                onPhotoProcessed({
                    file_name: file.name,
                    base64_data: base64Data,
                });

                setLoading(false);
            };

            image.onerror = (error) => {
                console.error('Image loading error:', error);
                setErrorMessage('Failed to load the image.');
                setLoading(false);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Processing error:', error);
            setErrorMessage('An error occurred while processing the image.');
            setLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) handleFileProcessing(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) handleFileProcessing(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const validatedBackground = getDataImageUrlWithHeader(backgroundBase64);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={2}
        >
            {errorMessage && (
                <Alert severity="error" role="alert" aria-live="assertive">
                    {errorMessage}
                </Alert>
            )}

            <Dropzone
                isDragging={isDragging}
                areaWidth={areaWidth}
                areaHeight={areaHeight}
                backgroundImage={validatedBackground}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('photo-upload').click()}
                aria-label="Drag and drop area for PNG uploads"
            >
                <Typography variant="body1" color="textSecondary">
                    {isDragging
                        ? 'Drop your PNG file here'
                        : 'Drag & Drop a PNG file or click to upload'}
                </Typography>

                <input
                    accept=".png"
                    id="photo-upload"
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    aria-label="PNG file input"
                />

                {loading && (
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 10 }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </Dropzone>
        </Box>
    );
};

export default PNGPhotoUploader;
