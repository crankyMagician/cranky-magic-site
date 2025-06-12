import React, { useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import useAnalytics from '../analytics/hooks/useAnalytics';
import useScrollTracking from '../analytics/hooks/useScrollTracking';
import useCustomTranslation from '../hooks/useCustomTranslation';

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

    // Track scroll behavior on the landing page
    useScrollTracking({
        reportingThreshold: 10,
        trackDeepScrolls: true,
        trackBounceRate: true
    });

    // Component-level analytics tracking
    useEffect(() => {
        // Track feature view for portfolio landing
        analytics.trackFeatureView('portfolio_landing', {
            page_type: 'landing_page',
            sections: ['hero', 'skills', 'projects', 'framework', 'timeline', 'blog', 'contact']
        });

        // Track funnel start for portfolio journey
        analytics.trackFunnelStart('portfolio_journey', {
            entry_point: 'landing_page',
            user_type: 'visitor'
        });

        return () => {
            // Track maximum engagement on unmount
            analytics.trackFeatureComplete('portfolio_landing', {
                engagement_duration: Date.now() - window.performance.now()
            });
        };
    }, [analytics]);

    // Section visibility tracking
    const handleSectionView = (sectionName) => {
        analytics.trackElementClick('section_view', sectionName, {
            section_type: 'portfolio_section',
            interaction_type: 'scroll_into_view'
        });
    };

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Hero Section - Full viewport */}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                }}
            >
                <HeroSection onSectionView={() => handleSectionView('hero')} />
            </Box>

            {/* Skills Section */}
            <Box
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    backgroundColor: 'background.paper',
                    position: 'relative'
                }}
            >
                <Container maxWidth="xl">
                    <SkillsSection onSectionView={() => handleSectionView('skills')} />
                </Container>
            </Box>

            {/* Projects Section */}
            <Box
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    backgroundColor: 'background.default',
                    position: 'relative'
                }}
            >
                <Container maxWidth="xl">
                    <ProjectsSection onSectionView={() => handleSectionView('projects')} />
                </Container>
            </Box>

            {/* Framework Capabilities Section */}
            <Box
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    background: `linear-gradient(45deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}08 100%)`
                }}
            >
                <Container maxWidth="xl">
                    <FrameworkSection onSectionView={() => handleSectionView('framework')} />
                </Container>
            </Box>

            {/* Professional Timeline Section */}
            <Box
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    backgroundColor: 'background.default',
                    position: 'relative'
                }}
            >
                <Container maxWidth="xl">
                    <TimelineSection onSectionView={() => handleSectionView('timeline')} />
                </Container>
            </Box>

            {/* Blog/Articles Section */}
            <Box
                component="section"
                sx={{
                    py: { xs: 6, md: 10 },
                    backgroundColor: 'background.paper',
                    position: 'relative'
                }}
            >
                <Container maxWidth="xl">
                    <BlogSection onSectionView={() => handleSectionView('blog')} />
                </Container>
            </Box>

            {/* Contact Section */}
            <Box
                component="section"
                sx={{
                    py: { xs: 8, md: 12 },
                    backgroundColor: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark}20 0%, ${theme.palette.background.default} 100%)`
                        : `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.background.default} 100%)`,
                    position: 'relative'
                }}
            >
                <Container maxWidth="xl">
                    <ContactSection onSectionView={() => handleSectionView('contact')} />
                </Container>
            </Box>
        </Box>
    );
});

PortfolioLanding.displayName = 'PortfolioLanding';

export default PortfolioLanding;