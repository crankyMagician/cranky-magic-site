import React from 'react';
import { Box, Container, Typography, Link, Stack, useTheme, alpha, IconButton, Tooltip } from '@mui/material';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

// Import geometric decorations
import { GlowOrb, Hexagon, CircleRing, Diamond, FloatingLine } from '../common/GeometricDecorations';

// Import the useCustomTranslation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

// Social/contact links
const contactLinks = [
    { icon: <LinkedInIcon />, url: 'https://www.linkedin.com/in/sam-redpath', label: 'LinkedIn' },
    { icon: <GitHubIcon />, url: 'https://github.com/crankyMagician', label: 'GitHub' },
    { icon: <EmailIcon />, url: 'mailto:website@crankymagician.com', label: 'Email' },
];

const Footer = () => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const isProfessionalDark = theme.palette.mode === 'dark';

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                py: { xs: 6, md: 8 },
                mt: 'auto',
                borderTop: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Geometric Decorations */}
            {isProfessionalDark && (
                <>
                    <GlowOrb
                        position={{ top: '-20%', left: '5%' }}
                        size={{ xs: 150, md: 250 }}
                        color={theme.palette.primary.main}
                        opacity={0.08}
                        animate={false}
                    />
                    <GlowOrb
                        position={{ bottom: '-30%', right: '10%' }}
                        size={{ xs: 180, md: 300 }}
                        color={theme.palette.tertiary?.main || '#22D3EE'}
                        opacity={0.06}
                        animate={false}
                    />
                    <Hexagon
                        position={{ top: '20%', right: '8%' }}
                        size={{ xs: 40, md: 70 }}
                        opacity={0.04}
                        rotate={15}
                    />
                    <CircleRing
                        position={{ bottom: '30%', left: '12%' }}
                        size={{ xs: 50, md: 80 }}
                        opacity={0.06}
                    />
                    <Diamond
                        position={{ top: '40%', left: '5%' }}
                        size={{ xs: 20, md: 35 }}
                        opacity={0.05}
                    />
                    <FloatingLine
                        position={{ bottom: '20%', right: '15%' }}
                        width={{ xs: 60, md: 100 }}
                        rotate={-30}
                        opacity={0.06}
                    />
                </>
            )}

            {/* Grid pattern overlay */}
            {isProfessionalDark && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                            repeating-linear-gradient(
                                0deg,
                                transparent,
                                transparent 60px,
                                ${alpha(theme.palette.primary.main, 0.02)} 60px,
                                ${alpha(theme.palette.primary.main, 0.02)} 61px
                            ),
                            repeating-linear-gradient(
                                90deg,
                                transparent,
                                transparent 60px,
                                ${alpha(theme.palette.primary.main, 0.02)} 60px,
                                ${alpha(theme.palette.primary.main, 0.02)} 61px
                            )
                        `,
                        pointerEvents: 'none',
                    }}
                />
            )}

            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 }, position: 'relative', zIndex: 1 }}>
                {/* Main footer content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    {/* Name/Brand */}
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            background: isProfessionalDark
                                ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.tertiary?.main || '#22D3EE'} 100%)`
                                : theme.palette.text.primary,
                            backgroundClip: isProfessionalDark ? 'text' : 'unset',
                            WebkitBackgroundClip: isProfessionalDark ? 'text' : 'unset',
                            WebkitTextFillColor: isProfessionalDark ? 'transparent' : 'unset',
                        }}
                    >
                        {translate('Company Name')}
                    </Typography>

                    {/* Tagline */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            maxWidth: 500,
                        }}
                    >
                        Full Stack Developer & Cloud Architect
                    </Typography>

                    {/* Social/Contact Links */}
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mb: 4 }}
                    >
                        {contactLinks.map((contact, index) => (
                            <Tooltip key={index} title={contact.label} arrow>
                                <IconButton
                                    component={Link}
                                    href={contact.url}
                                    target={contact.url.startsWith('mailto') ? '_self' : '_blank'}
                                    rel="noopener noreferrer"
                                    aria-label={contact.label}
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                            transform: 'translateY(-3px)',
                                            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        },
                                    }}
                                >
                                    {contact.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Stack>

                    {/* Divider line */}
                    <Box
                        sx={{
                            width: { xs: 100, md: 150 },
                            height: 2,
                            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                            mb: 4,
                        }}
                    />

                    {/* Copyright */}
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} {translate('Company Name')}. All rights reserved.
                    </Typography>

                    {/* Built with */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            opacity: 0.7,
                        }}
                    >
                        Built with React & Material-UI
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
