import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import useAnalytics from '../analytics/hooks/useAnalytics';
import useScrollTracking from '../analytics/hooks/useScrollTracking';
import useCustomTranslation from '../hooks/useCustomTranslation';
import { useAnimationOrchestrator } from '../hooks/useAnimationControl';
import { useMultipleIntersectionObserver } from '../hooks/useIntersectionObserver';
import {
    PORTFOLIO_SECTIONS,
    SECTION_ORDER,
    SCROLL_CONFIG,
    ANALYTICS_EVENTS,
    LAYOUT_CONFIG,
} from '../components/landing/utils/portfolioConstants';
import {
    ANIMATION_DURATION,
    ANIMATION_DELAY,
    sectionAnimations,
} from '../animations/portfolioAnimations';

// Landing page section imports
import HeroSection from '../components/landing/HeroSection';
import SkillsSection from '../components/landing/SkillsSection';
import ProjectsSection from '../components/landing/ProjectsSection';
import FrameworkSection from '../components/landing/FrameworkSection';
import TimelineSection from '../components/landing/TimelineSection';
import BlogSection from '../components/landing/BlogSection';
import ContactSection from '../components/landing/ContactSection';

const PortfolioLanding = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = currentTheme === 'dark';

    const pageLoadTimeRef = useRef(Date.now());
    const sectionViewsRef = useRef(new Set());
    const lastScrollPositionRef = useRef(0);

    // Setup intersection observer for section visibility
    const { addElement, isIntersecting } = useMultipleIntersectionObserver({
        threshold: 0.3,
        rootMargin: '-100px 0px',
    });

    // Stabilized scroll tracking with debouncing
    useScrollTracking({
        reportingThreshold: 25, // Increased threshold to reduce noise
        trackDeepScrolls: true,
        trackBounceRate: true,
        debounceDelay: SCROLL_CONFIG.DEBOUNCE_DELAY,
    });

    // Component mount analytics
    useEffect(() => {
        // Track page view with proper timing
        const initDelay = setTimeout(() => {
            analytics.trackFeatureView('portfolio_landing', {
                page_type: 'landing_page',
                theme_mode: currentTheme,
                sections_available: SECTION_ORDER,
                load_time: Date.now() - pageLoadTimeRef.current,
            });

            analytics.trackFunnelStart('portfolio_journey', {
                entry_point: 'landing_page',
                user_type: 'visitor',
                device_type: theme.breakpoints.down('sm') ? 'mobile' : 'desktop',
            });
        }, 100); // Small delay to ensure proper initialization

        return () => {
            clearTimeout(initDelay);

            // Track engagement metrics on unmount
            const engagementDuration = Date.now() - pageLoadTimeRef.current;
            const viewedSections = Array.from(sectionViewsRef.current);

            analytics.trackFeatureComplete('portfolio_landing', {
                engagement_duration: engagementDuration,
                sections_viewed: viewedSections,
                sections_viewed_count: viewedSections.length,
                completion_rate: (viewedSections.length / SECTION_ORDER.length) * 100,
            });
        };
    }, [analytics, currentTheme, theme.breakpoints]);

    // Section visibility handler with debouncing
    const handleSectionView = useCallback((sectionName) => {
        // Prevent duplicate tracking
        if (sectionViewsRef.current.has(sectionName)) {
            return;
        }

        sectionViewsRef.current.add(sectionName);

        // Track section view
        analytics.trackElementClick('section_view', sectionName, {
            section_type: 'portfolio_section',
            interaction_type: 'scroll_into_view',
            section_index: SECTION_ORDER.indexOf(`${sectionName}-section`),
            time_since_load: Date.now() - pageLoadTimeRef.current,
        });

        // Track funnel progression
        if (sectionName === 'projects') {
            analytics.trackFunnelStep('portfolio_journey', 'projects_viewed', {
                previous_sections: Array.from(sectionViewsRef.current),
            });
        } else if (sectionName === 'contact') {
            analytics.trackFunnelStep('portfolio_journey', 'contact_reached', {
                sections_viewed: Array.from(sectionViewsRef.current),
            });
        }
    }, [analytics]);

    // Smooth scroll to next section
    const handleScrollToNext = useCallback((currentSectionId) => {
        const currentIndex = SECTION_ORDER.indexOf(currentSectionId);
        if (currentIndex < SECTION_ORDER.length - 1) {
            const nextSectionId = SECTION_ORDER[currentIndex + 1];
            const nextSection = document.getElementById(nextSectionId);

            if (nextSection) {
                const headerOffset = LAYOUT_CONFIG.HEADER_HEIGHT;
                const elementPosition = nextSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        }
    }, []);

    // Register sections for intersection observer
    useEffect(() => {
        const cleanupFunctions = [];

        SECTION_ORDER.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                const cleanup = addElement(sectionId, element);
                if (cleanup) {
                    cleanupFunctions.push(cleanup);
                }
            }
        });

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [addElement]);

    // Handle section visibility changes
    useEffect(() => {
        Object.entries(isIntersecting).forEach(([sectionId, isVisible]) => {
            if (isVisible) {
                const sectionName = sectionId.replace('-section', '');
                handleSectionView(sectionName);
            }
        });
    }, [isIntersecting, handleSectionView]);

    // Background styles based on theme
    const getBackgroundStyle = useCallback((variant = 'default') => {
        const backgrounds = {
            default: isDarkMode ? theme.palette.background.default : theme.palette.background.default,
            paper: isDarkMode ? theme.palette.background.paper : theme.palette.background.paper,
            gradient: isDarkMode
                ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`
                : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`,
            primaryGradient: isDarkMode
                ? `linear-gradient(135deg, ${theme.palette.primary.dark}15 0%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.background.paper} 100%)`,
            secondaryGradient: isDarkMode
                ? `linear-gradient(45deg, ${theme.palette.background.paper} 0%, ${theme.palette.secondary.dark}10 100%)`
                : `linear-gradient(45deg, ${theme.palette.background.paper} 0%, ${theme.palette.secondary.main}08 100%)`,
        };

        return backgrounds[variant] || backgrounds.default;
    }, [isDarkMode, theme]);

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Hero Section - Full viewport */}
            <Box
                id={PORTFOLIO_SECTIONS.HERO}
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    background: getBackgroundStyle('gradient'),
                }}
            >
                <HeroSection
                    onScrollToNext={() => handleScrollToNext(PORTFOLIO_SECTIONS.HERO)}
                />
            </Box>

            {/* Skills Section */}
            <Box
                id={PORTFOLIO_SECTIONS.SKILLS}
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    background: getBackgroundStyle('paper'),
                    position: 'relative',
                }}
            >
                <Container maxWidth="xl">
                    <SkillsSection />
                </Container>
            </Box>

            {/* Projects Section */}
            <Box
                id={PORTFOLIO_SECTIONS.PROJECTS}
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    background: getBackgroundStyle('default'),
                    position: 'relative',
                }}
            >
                <Container maxWidth="xl">
                    <ProjectsSection />
                </Container>
            </Box>

            {/* Framework Capabilities Section */}
            <Box
                id={PORTFOLIO_SECTIONS.FRAMEWORKS}
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    background: getBackgroundStyle('primaryGradient'),
                    position: 'relative',
                }}
            >
                <Container maxWidth="xl">
                    <FrameworkSection />
                </Container>
            </Box>

            {/* Professional Timeline Section */}
            <Box
                id={PORTFOLIO_SECTIONS.TIMELINE}
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    background: getBackgroundStyle('default'),
                    position: 'relative',
                }}
            >
                <Container maxWidth="xl">
                    <TimelineSection />
                </Container>
            </Box>

            {/* Blog/Articles Section */}
            <Box
                id={PORTFOLIO_SECTIONS.BLOG}
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    background: getBackgroundStyle('paper'),
                    position: 'relative',
                }}
            >
                <Container maxWidth="xl">
                    <BlogSection />
                </Container>
            </Box>

            {/* Contact Section */}
            <Box
                id={PORTFOLIO_SECTIONS.CONTACT}
                component="section"
                sx={{
                    py: { xs: 8, md: 12 },
                    background: getBackgroundStyle('secondaryGradient'),
                    position: 'relative',
                }}
            >
                <Container maxWidth="xl">
                    <ContactSection />
                </Container>
            </Box>
        </Box>
    );
});

PortfolioLanding.displayName = 'PortfolioLanding';

export default PortfolioLanding;