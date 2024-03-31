import React from 'react';
import { Container, Box, Typography, Button, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom for navigation
import useCustomTranslation from "../hooks/useCustomTranslation";

const ActionCallContact = () => {
    const theme = useTheme();
    const { translate } = useCustomTranslation(); // Use the custom hook for translations
    const navigate = useNavigate(); // Hook for navigation

    // Function to handle navigation
    const handleContactClick = () => {
        navigate('/contact-us'); // Navigate to the contact us page or section
    };

    return (
        <Container component="section" maxWidth="lg">
            <Box sx={{
                my: 4,
                py: 5,
                backgroundColor: theme.palette.primary.main, // Using theme for background color
                color: theme.palette.primary.contrastText, // Using theme for text color
                borderRadius: 2,
            }}>
                <Grid container justifyContent="center" alignItems="center" spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" component="h2" gutterBottom>
                                {translate('Have questions? We’re here to help.')}
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleContactClick} // Use onClick to handle navigation
                                sx={{
                                    mt: 2,
                                    ':hover': { bgcolor: theme.palette.secondary.dark }, // Dynamically adjusting hover background color using theme
                                }}
                            >
                                {translate('Contact Us')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ActionCallContact;
