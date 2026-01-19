import React, { useCallback, useMemo, useRef } from 'react';
import { Box, Container, Typography, Button, Grid, useTheme, IconButton } from '@mui/material';
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

const HeroSection = ({ onScrollToNext = () => {} }) => {
    const theme = useTheme();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = currentTheme === 'dark';

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

    // Background gradient based on theme
    const backgroundGradient = useMemo(() => {
        if (isDarkMode) {
            return `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`;
        }
        return `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`;
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
            }}
        >
            <Container maxWidth="lg">
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