import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Grid, useTheme, Paper, Divider } from '@mui/material';
import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

// Import the useCustomTranslation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

// Footer links configuration that matches routes in MainContent.js
const footerLinks = [
    {
        title: 'Company',
        items: [
            { label: 'Home', path: '/' },
            { label: 'About Us', path: '/about-us' },
            { label: 'Contact Us', path: '/contact-us' },
        ]
    },
    {
        title: 'Resources',
        items: [
            { label: 'Newsletter', path: '/newsletter-signup' },
            { label: 'Calendar', path: '/calendar' },
            { label: 'Video Stream', path: '/video-stream' },
        ]
    },
    {
        title: 'Legal',
        items: [
            { label: 'Terms of Service', path: '/terms' },
            { label: 'Privacy Policy', path: '/privacy' },
            { label: 'Cookie Policy', path: '/cookies' },
        ]
    }
];

// Social media links
const socialLinks = [
    { icon: <LinkedInIcon />, url: 'https://www.linkedin.com', label: 'LinkedIn' },
    { icon: <FacebookIcon />, url: 'https://www.facebook.com', label: 'Facebook' },
    { icon: <InstagramIcon />, url: 'https://www.instagram.com', label: 'Instagram' },
    { icon: <TwitterIcon />, url: 'https://www.twitter.com', label: 'Twitter' },
    { icon: <GitHubIcon />, url: 'https://www.github.com', label: 'GitHub' },
];

const Footer = () => {
    const theme = useTheme();
    const logoUrl = logoImage;

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'text.primary' : theme.palette.primary.contrastText,
                py: 6,
                mt: 'auto', // Push footer to the bottom
            }}
        >
            <Container maxWidth="lg">
                {/* Main footer content */}
                <Grid container spacing={4} justifyContent="space-between">
                    {/* Company info and logo */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Branding logoUrl={logoUrl} />
                            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                {translate('Company Name')}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {translate('Building innovative solutions for a better future. Our company is dedicated to delivering high-quality products and services to our clients.')}
                        </Typography>

                        {/* Social media links */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener"
                                    aria-label={social.label}
                                    sx={{
                                        color: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.2)',
                                        },
                                    }}
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Footer links */}
                    {footerLinks.map((section, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index}>
                            <Typography
                                variant="subtitle1"
                                component="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    pb: 1
                                }}
                            >
                                {translate(section.title)}
                            </Typography>
                            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                                {section.items.map((item, itemIndex) => (
                                    <Box component="li" key={itemIndex} sx={{ mb: 1 }}>
                                        <Link
                                            component={RouterLink}
                                            to={item.path}
                                            sx={{
                                                color: 'inherit',
                                                textDecoration: 'none',
                                                transition: 'color 0.2s',
                                                '&:hover': {
                                                    color: theme.palette.secondary.main,
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            {translate(item.label)}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Newsletter subscription teaser */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 4,
                        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom>
                                {translate('Subscribe to our Newsletter')}
                            </Typography>
                            <Typography variant="body2">
                                {translate('Stay updated with our latest news and updates. Join our newsletter for exclusive content.')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Link
                                component={RouterLink}
                                to="/newsletter-signup"
                                sx={{
                                    display: 'inline-block',
                                    px: 3,
                                    py: 1,
                                    bgcolor: theme.palette.secondary.main,
                                    color: theme.palette.secondary.contrastText,
                                    borderRadius: 1,
                                    textDecoration: 'none',
                                    fontWeight: 'medium',
                                    '&:hover': {
                                        bgcolor: theme.palette.secondary.dark,
                                    },
                                }}
                            >
                                {translate('Sign Up')}
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Copyright */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 3,
                        bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(0, 0, 0, 0.2)'
                            : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body2">
                        © {new Date().getFullYear()} {translate('Copyright:')}
                        <Link
                            href="https://example.com/"
                            color="inherit"
                            sx={{ ml: 0.5, fontWeight: 'medium' }}
                        >
                            {translate('Company Name')}
                        </Link>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {translate('All Rights Reserved')}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;