import React, { useState } from 'react';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Base64ToImage from './Base64ToImage';

// We rename $isDragging, $areaWidth, and $areaHeight to isDragging, areaWidth, areaHeight,
// and use shouldForwardProp to prevent them from being passed to the DOM.
const Dropzone = styled(Box, {
    shouldForwardProp: (prop) =>
        prop !== 'isDragging' && prop !== 'areaWidth' && prop !== 'areaHeight',
})(({ theme, isDragging, areaWidth, areaHeight }) => ({
    border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
    cursor: 'pointer',
    width: areaWidth || '100%',
    height: areaHeight || '200px',
    position: 'relative',
    overflow: 'hidden',
}));

const PNGPhotoUploader = ({ onPhotoProcessed, areaWidth, areaHeight, backgroundBase64 }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Internal function to handle file processing
    const handleFileProcessing = async (file) => {
        if (!file.name.toLowerCase().endsWith('.png')) {
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

            // When the image loads, convert it to the largest power-of-two dimension
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                // Determine the largest dimension and make it a power of two
                const maxSize = Math.max(image.width, image.height);
                const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(maxSize)));

                canvas.width = nextPowerOfTwo;
                canvas.height = nextPowerOfTwo;

                // Fill the canvas with transparency and draw the image
                context.fillStyle = 'transparent';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                // Convert to base64 PNG
                const base64Data = canvas.toDataURL('image/png').split(',')[1];

                // Provide feedback through our onPhotoProcessed callback
                onPhotoProcessed({
                    file_name: file.name,
                    base64_data: base64Data,
                });

                setLoading(false);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            setErrorMessage('An error occurred while processing the image.');
            setLoading(false);
        }
    };

    // Handle file selection
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileProcessing(file);
        }
    };

    // Handle file drop
    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileProcessing(file);
        }
    };

    // Handle drag over
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    // Handle drag leave
    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={2}
        >
            {/* Display error message if any */}
            {errorMessage && (
                <Alert severity="error" role="alert" aria-live="assertive">
                    {errorMessage}
                </Alert>
            )}

            {/* Main dropzone area */}
            <Dropzone
                isDragging={isDragging}
                areaWidth={areaWidth}
                areaHeight={areaHeight}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('photo-upload').click()}
                aria-label="Drag and drop area for PNG uploads"
            >
                {/* If backgroundBase64 exists, display as a background image */}
                {backgroundBase64 && (
                    <Base64ToImage base64={backgroundBase64} />
                )}
                <Typography variant="body1" color="textSecondary">
                    {isDragging
                        ? 'Drop your PNG file here'
                        : 'Drag & Drop a PNG file or click to upload'}
                </Typography>

                {/* Hidden input for file upload */}
                <input
                    accept=".png"
                    id="photo-upload"
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    aria-label="PNG file input"
                />

                {/* Loading overlay when processing */}
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
