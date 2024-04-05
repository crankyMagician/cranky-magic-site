import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Grid, useTheme } from '@mui/material';
import Branding from './Branding';
import logoImage from '../assets/logo/default_logo.png';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

// Import the useCustomTranslation hook
import useCustomTranslation from "../hooks/useCustomTranslation";

const Footer = () => {
    const theme = useTheme();
    const logoUrl = logoImage;

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                py: 6, // Increased padding for top and bottom for more breathing space
            }}
        >
            <Container maxWidth="lg">
                {/* Links */}
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <Typography variant="h6" component="h6" fontWeight="bold" textAlign="center">
                            <RouterLink
                                to="/about-us"
                                style={{ color: theme.palette.primary.contrastText, textDecoration: 'none' }}>
                                {translate('About us')}
                            </RouterLink>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <Typography variant="h6" component="h6" fontWeight="bold" textAlign="center">
                            <RouterLink
                                to="/contact-us"
                                style={{ color: theme.palette.primary.contrastText, textDecoration: 'none' }}>
                                {translate('Contact')}
                            </RouterLink>
                        </Typography>
                    </Grid>
                </Grid>


                <Box sx={{ my: 5 }}>
                    <hr style={{ borderColor: theme.palette.primary.contrastText }} />
                </Box>

                {/* Description */}
                <Box textAlign="center" my={5}>
                    <Typography variant="body1">
                        {translate('Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt distinctio earum repellat quaerat voluptatibus placeat nam, commodi optio pariatur est quia magnam eum harum corrupti dicta, aliquam sequi voluptate quas.')}
                    </Typography>
                </Box>

                {/* Branding Logo */}
                <Box display="flex" justifyContent="center" alignItems="center" my={5}>
                    <Branding logoUrl={logoUrl} />
                </Box>

                {/* Social Links */}
                <Box textAlign="center" my={5}>
                    <Link href="https://www.linkedin.com" color="inherit">
                        <LinkedInIcon sx={{ mx: 1 }} />
                    </Link>
                    <Link href="https://www.facebook.com" color="inherit">
                        <FacebookIcon sx={{ mx: 1 }} />
                    </Link>
                    <Link href="https://www.instagram.com" color="inherit">
                        <InstagramIcon sx={{ mx: 1 }} />
                    </Link>
                </Box>

                {/* Copyright */}
                <Box
                    textAlign="center"
                    py={3}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }}
                >
                    © 2024 {translate('Copyright:')}
                    <Link href="https://blazarsoftware.com/" color="inherit" underline="hover">
                        {translate('Company Name')}
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
