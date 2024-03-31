import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import Branding from './Branding';
import logoImage from '../assets/logo/NovaLogo.png';
import { logDebug } from '../utilities/Logger';

import useCustomTranslation from "../hooks/useCustomTranslation";

const AboutUs = () => {

    const { translate } = useCustomTranslation();

    useEffect(() => {
        // Log for debugging purposes
        logDebug('Visiting About Us page', 'green');
    }, []);

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Branding logoUrl={logoImage} width="30%" height="auto" />
                            <Typography component="h1" variant="h5">
                                {translate('About Us')}
                            </Typography>
                            <Box sx={{ mt: 1, width: '100%' }}>
                                <Typography paragraph>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse
                                    lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras
                                    elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod
                                    non, mi.
                                </Typography>
                                <Typography paragraph>
                                    Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum
                                    diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae,
                                    consequat in, pretium a, enim. Pellentesque congue.
                                </Typography>
                                <Typography paragraph>
                                    Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent
                                    egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue
                                    blandit sodales.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AboutUs;
