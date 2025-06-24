import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Container, Typography, Button, Grid, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { useAnimationControl, useAnimationOrchestrator } from '../../hooks/useAnimationControl';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import {
    ANIMATION_DURATION,
    ANIMATION_DELAY,
    ANIMATION_EASING,
    animationVariants,
    sectionAnimations,
    createAnimationConfig,
} from '../../animations/portfolioAnimations';
import {
    PORTFOLIO_SECTIONS,
    SCROLL_CONFIG,
    EXTERNAL_LINKS,
    ANALYTICS_EVENTS,
} from './utils/portfolioConstants';
import WizardAvatar from './WizardAvatar';

const HeroSection = ({ onScrollToNext = () => {} }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = currentTheme === 'dark';

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const containerRef = useRef(null);
    const controls = useAnimationControl({
        animationType: 'fadeIn',
        duration: ANIMATION_DURATION.NORMAL,
        delay: ANIMATION_DELAY.NONE,
        triggerOnScroll: false,
    });

    // Setup animation controls for different elements
    const titleAnimation = useAnimationControl({
        animationType: 'fadeInDown',
        duration: ANIMATION_DURATION.SLOW,
        delay: ANIMATION_DELAY.SHORT,
        easing: ANIMATION_EASING.EASE_OUT,
        triggerOnScroll: false,
    });

    const subtitleAnimation = useAnimationControl({
        animationType: 'fadeInUp',
        duration: ANIMATION_DURATION.MEDIUM,
        delay: ANIMATION_DELAY.MEDIUM,
        easing: ANIMATION_EASING.EASE_OUT,
        triggerOnScroll: false,
    });

    const ctaAnimation = useAnimationControl({
        animationType: 'scaleIn',
        duration: ANIMATION_DURATION.MEDIUM,
        delay: ANIMATION_DELAY.LONG,
        easing: ANIMATION_EASING.ELASTIC,
        triggerOnScroll: false,
    });

    const socialAnimation = useAnimationControl({
        animationType: 'fadeInLeft',
        duration: ANIMATION_DURATION.NORMAL,
        delay: ANIMATION_DELAY.LONG + 100,
        easing: ANIMATION_EASING.EASE_OUT,
        triggerOnScroll: false,
    });

    const avatarAnimation = useAnimationControl({
        animationType: 'fadeInRight',
        duration: ANIMATION_DURATION.SLOW,
        delay: ANIMATION_DELAY.MEDIUM,
        easing: ANIMATION_EASING.EASE_OUT,
        triggerOnScroll: false,
    });

    // Orchestrate the hero section animations
    const { startSequence } = useAnimationOrchestrator(
        [titleAnimation, subtitleAnimation, ctaAnimation, socialAnimation, avatarAnimation],
        {
            sequential: false,
            autoStart: true,
        }
    );

    // Intersection observer for section visibility
    const { ref: sectionRef, isIntersecting } = useIntersectionObserver({
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
            url: 'mailto:contact@example.com',
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
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    background: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.main} 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${theme.palette.secondary.main} 0%, transparent 50%)`,
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    {/* Content Column */}
                    <Grid item xs={12} md={7}>
                        <Box
                            sx={{ ...titleAnimation.animationStyles }}
                        >
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                    fontWeight: 800,
                                    background: isDarkMode
                                        ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`
                                        : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textAlign: { xs: 'center', md: 'left' },
                                    mb: 2,
                                }}
                            >
                                Full Stack Developer
                            </Typography>
                        </Box>

                        <Box
                            sx={{ ...subtitleAnimation.animationStyles }}
                        >
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
                                Building exceptional digital experiences with modern web technologies.
                                Specializing in React, Node.js, and cloud architecture.
                            </Typography>
                        </Box>

                        {/* CTA Buttons */}
                        <Box
                            sx={{
                                ...ctaAnimation.animationStyles,
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
                                ...socialAnimation.animationStyles,
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

                    {/* Avatar Column */}
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                ...avatarAnimation.animationStyles,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <WizardAvatar
                                size={isMobile ? 280 : isTablet ? 320 : 400}
                                animated={true}
                            />

                            {/* Decorative elements */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '10%',
                                    left: '10%',
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: theme.palette.primary.main,
                                    opacity: 0.1,
                                    filter: 'blur(40px)',
                                    animation: 'pulse 3s ease-in-out infinite',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '20%',
                                    right: '10%',
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: theme.palette.secondary.main,
                                    opacity: 0.1,
                                    filter: 'blur(60px)',
                                    animation: 'pulse 4s ease-in-out infinite 1s',
                                }}
                            />
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