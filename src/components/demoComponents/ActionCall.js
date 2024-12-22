import React from 'react';
import { Container, Box, Typography, Button, Grid, useTheme } from '@mui/material';
import useCustomTranslation from "../../hooks/useCustomTranslation";
const ActionCall = () => {
    const theme = useTheme();
    const { translate } = useCustomTranslation(); // Use the custom hook for translations

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
                                {translate('Move fast, stay aligned, and build better - together')}
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                href="#start-trial"
                                sx={{
                                    mt: 2,
                                    ':hover': { bgcolor: theme.palette.secondary.dark }, // Dynamically adjusting hover background color using theme
                                }}
                            >
                                {translate('Get it free')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ActionCall;
