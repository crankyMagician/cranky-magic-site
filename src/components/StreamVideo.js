import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import useCustomTranslation from "../hooks/useCustomTranslation"; // Import the custom hook
import ResponsiveVideoEmbed from '../utilities/ResponsiveVideoEmbed'; // Utility for embedding videos responsively

const StreamVideo = () => {
    const { translate } = useCustomTranslation(); // Use the custom hook

    const videoUrl = "https://www.youtube.com/embed/4AuhCvfFpws"; // YouTube embed link

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography component="h1" variant="h5">
                                {translate('Stream Video')}
                            </Typography>
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <ResponsiveVideoEmbed url={videoUrl} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default StreamVideo;
