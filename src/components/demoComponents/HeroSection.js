import React from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import useCustomTranslation from "../../hooks/useCustomTranslation"; // Import the custom hook
import heroBackgroundImage from '../../assets/images/hero_image.webp'; // Path to your hero background image

const HeroSection = () => {
    const { translate } = useCustomTranslation(); // Use the custom hook

    return (
        <Box
            sx={{
                position: 'relative',
                py: 10, // Padding top & bottom
                textAlign: 'center', // Ensure text alignment is centered
            }}
        >
            {/* Background Image with Reduced Opacity */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${heroBackgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1, // Ensure the overlay is behind the text
                    opacity: 0.7, // Reduce the background image opacity
                }}
            />
            {/* Container for Text */}
            <Container maxWidth="lg">
                {/* Semi-Transparent Box around the Text */}
                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', p: 4, display: 'inline-block' }}>
                    <Typography
                        component="h1"
                        variant="h2"
                        sx={{ fontWeight: 'bold', mb: 3, color: 'white', textAlign: 'center' }}
                    >
                        {translate('Welcome to Our Website')}
                    </Typography>
                    <Typography
                        component="p"
                        variant="h5"
                        sx={{ mb: 4, color: 'white', textAlign: 'center' }}
                    >
                        {translate('Empowering your business with innovative digital solutions.')}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroSection;
