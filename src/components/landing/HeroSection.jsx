import React, { useCallback, useMemo, useRef } from 'react';
import { Box, Container, Typography, Button, Grid, useTheme, IconButton, alpha } from '@mui/material';
import { useSelector } from 'react-redux';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import {
    PORTFOLIO_SECTIONS,
    EXTERNAL_LINKS,
    ANALYTICS_EVENTS,
} from './utils/portfolioConstants';
import { contactInfo } from '../../data/contactData';

// Geometric decorative shapes component
const GeometricDecorations = ({ isDarkMode, theme }) => (
    <>
        {/* Large teal glow orb - top right */}
        <Box
            sx={{
                position: 'absolute',
                top: '10%',
                right: '5%',
                width: { xs: 200, md: 400 },
                height: { xs: 200, md: 400 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                filter: 'blur(40px)',
                pointerEvents: 'none',
                animation: 'pulse 8s ease-in-out infinite',
                '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 0.8, transform: 'scale(1.1)' },
                },
            }}
        />
        {/* Smaller cyan glow orb - bottom left */}
        <Box
            sx={{
                position: 'absolute',
                bottom: '20%',
                left: '10%',
                width: { xs: 150, md: 300 },
                height: { xs: 150, md: 300 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.tertiary?.main || '#22D3EE', 0.12)} 0%, transparent 70%)`,
                filter: 'blur(60px)',
                pointerEvents: 'none',
                animation: 'float 6s ease-in-out infinite',
            }}
        />
        {/* Hexagon decoration - top left */}
        <Box
            sx={{
                position: 'absolute',
                top: '15%',
                left: '8%',
                width: { xs: 60, md: 120 },
                height: { xs: 70, md: 140 },
                opacity: 0.08,
                pointerEvents: 'none',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: theme.palette.primary.main,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                },
            }}
        />
        {/* Circle ring decoration - right side */}
        <Box
            sx={{
                position: 'absolute',
                top: '40%',
                right: '15%',
                width: { xs: 80, md: 160 },
                height: { xs: 80, md: 160 },
                borderRadius: '50%',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                pointerEvents: 'none',
            }}
        />
        {/* Small dots pattern - bottom right */}
        <Box
            sx={{
                position: 'absolute',
                bottom: '25%',
                right: '20%',
                width: 100,
                height: 100,
                opacity: 0.15,
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(${theme.palette.primary.main} 2px, transparent 2px)`,
                backgroundSize: '20px 20px',
            }}
        />
    </>
);

const HeroSection = ({ onScrollToNext = () => {} }) => {
    const theme = useTheme();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = theme.palette.mode === 'dark';

    const containerRef = useRef(null);

    // Intersection observer for section visibility
    const { ref: sectionRef } = useIntersectionObserver({
        threshold: 0.5,
        triggerOnce: false,
    });

    // Handle CTA button click
    const handleCTAClick = useCallback(() => {
        if (window.analytics) {
            window.analytics.track(ANALYTICS_EVENTS.CTA_CLICK, {
                location: 'hero_section',
                action: 'view_projects',
            });
        }

        // Smooth scroll to projects section
        const projectsSection = document.getElementById(PORTFOLIO_SECTIONS.PROJECTS);
        if (projectsSection) {
            projectsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, []);

    // Handle social link clicks
    const handleSocialClick = useCallback((platform, url) => {
        if (window.analytics) {
            window.analytics.track(ANALYTICS_EVENTS.SOCIAL_LINK_CLICK, {
                platform,
                location: 'hero_section',
            });
        }
        window.open(url, '_blank', 'noopener noreferrer');
    }, []);

    // Handle scroll down indicator click
    const handleScrollDown = useCallback(() => {
        onScrollToNext();
    }, [onScrollToNext]);

    // Social links configuration
    const socialLinks = useMemo(() => [
        {
            icon: GitHubIcon,
            label: 'GitHub',
            url: EXTERNAL_LINKS.GITHUB,
            color: isDarkMode ? '#ffffff' : '#24292e',
        },
        {
            icon: LinkedInIcon,
            label: 'LinkedIn',
            url: EXTERNAL_LINKS.LINKEDIN,
            color: '#0077b5',
        },
        {
            icon: EmailIcon,
            label: 'Email',
            url: `mailto:${contactInfo.email}`,
            color: isDarkMode ? '#ffffff' : '#000000',
        },
    ], [isDarkMode]);

    // Background gradient based on theme - professional dark uses teal-tinted gradient
    const backgroundGradient = useMemo(() => {
        if (isDarkMode) {
            // Check if using professional dark theme (teal-tinted gradient)
            const isProfessionalDark = currentTheme === 'professional_dark';
            if (isProfessionalDark) {
                return 'linear-gradient(135deg, #0C1222 0%, #0F172A 50%, #134E4A 100%)';
            }
            return `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900] || '#1a1a1a'} 100%)`;
        }
        return `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100] || '#f5f5f5'} 100%)`;
    }, [isDarkMode, theme, currentTheme]);

    // Grid pattern overlay for depth
    const gridPattern = useMemo(() => {
        if (!isDarkMode) return 'none';
        return `
            repeating-linear-gradient(
                0deg,
                transparent,
                transparent 50px,
                ${alpha(theme.palette.primary.main, 0.03)} 50px,
                ${alpha(theme.palette.primary.main, 0.03)} 51px
            ),
            repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                ${alpha(theme.palette.primary.main, 0.03)} 50px,
                ${alpha(theme.palette.primary.main, 0.03)} 51px
            )
        `;
    }, [isDarkMode, theme]);

    return (
        <Box
            ref={(el) => {
                containerRef.current = el;
                sectionRef(el);
            }}
            id={PORTFOLIO_SECTIONS.HERO}
            component="section"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                background: backgroundGradient,
                overflow: 'hidden',
                pt: { xs: 8, md: 0 },
                pb: { xs: 8, md: 0 },
                // Float animation keyframes
                '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            }}
        >
            {/* Grid pattern overlay */}
            {isDarkMode && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: gridPattern,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />
            )}

            {/* Geometric decorations */}
            <GeometricDecorations isDarkMode={isDarkMode} theme={theme} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4} alignItems="center">
                    {/* Content Column */}
                    <Grid item xs={12} md={12}>
                        <Box>
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                    fontWeight: 800,
                                    color: theme.palette.primary.main,
                                    textAlign: { xs: 'center', md: 'left' },
                                    mb: 2,
                                }}
                            >
                                Full Stack Developer & Solutions Architect
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                component="h2"
                                color="text.secondary"
                                paragraph
                                sx={{
                                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                                    textAlign: { xs: 'center', md: 'left' },
                                    mb: 4,
                                    lineHeight: 1.6,
                                }}
                            >
                                Crafting scalable solutions across web, mobile, and cloud platforms.
                                Specializing in React, .NET, Python, and modern cloud architecture with 5+ years of experience.
                            </Typography>
                        </Box>

                        {/* CTA Buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                mb: 4,
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleCTAClick}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    boxShadow: theme.shadows[4],
                                    '&:hover': {
                                        boxShadow: theme.shadows[8],
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: theme.transitions.create(['box-shadow', 'transform'], {
                                        duration: theme.transitions.duration.short,
                                    }),
                                }}
                            >
                                View My Projects
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                href={EXTERNAL_LINKS.RESUME}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: theme.transitions.create(['transform'], {
                                        duration: theme.transitions.duration.short,
                                    }),
                                }}
                            >
                                Download Resume
                            </Button>
                        </Box>

                        {/* Social Links */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                justifyContent: { xs: 'center', md: 'flex-start' },
                            }}
                        >
                            {socialLinks.map((social, index) => (
                                <IconButton
                                    key={social.label}
                                    aria-label={social.label}
                                    onClick={() => handleSocialClick(social.label, social.url)}
                                    sx={{
                                        color: social.color,
                                        backgroundColor: isDarkMode
                                            ? 'rgba(255, 255, 255, 0.08)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                        '&:hover': {
                                            backgroundColor: isDarkMode
                                                ? 'rgba(255, 255, 255, 0.16)'
                                                : 'rgba(0, 0, 0, 0.08)',
                                            transform: 'translateY(-4px)',
                                        },
                                        transition: theme.transitions.create(['background-color', 'transform'], {
                                            duration: theme.transitions.duration.short,
                                        }),
                                    }}
                                >
                                    <social.icon />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Scroll Down Indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: theme.spacing(4),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    cursor: 'pointer',
                    display: { xs: 'none', md: 'block' },
                    animation: 'float 2s ease-in-out infinite',
                }}
                onClick={handleScrollDown}
            >
                <IconButton
                    aria-label="Scroll to next section"
                    sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            color: theme.palette.text.primary,
                        },
                    }}
                >
                    <KeyboardArrowDownIcon sx={{ fontSize: 32 }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default HeroSection;