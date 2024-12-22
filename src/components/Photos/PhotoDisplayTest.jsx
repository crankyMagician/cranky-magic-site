import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import ReadOnlyItemPhotoDisplay from '../API/ItemPhotos/ReadOnlyItemPhotoDisplay';
import ReadOnlyMunchiePhotoDisplay from '../API/MunchiePhotos/ReadOnlyMunchiePhotoDisplay';

const PhotoDisplayTest = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Photo Display Test
            </Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%' }}>
                        <ReadOnlyItemPhotoDisplay itemId={1} />
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%' }}>
                        <ReadOnlyMunchiePhotoDisplay munchieId={465} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PhotoDisplayTest;