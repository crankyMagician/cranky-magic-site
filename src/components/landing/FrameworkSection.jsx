import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    IconButton,
    Collapse,
    Container,
    useTheme,
    useMediaQuery,
    alpha,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    LinearProgress,
    Divider,
    Paper,
    Tooltip,
} from '@mui/material';
import {
    Code,
    Palette,
    Storage,
    Build,
    Speed,
    Security,
    CloudUpload,
    CheckCircle,
    ExpandMore,
    ExpandLess,
    DeviceHub,
    Api,
    Dashboard,
    Extension,
    Layers,
    Settings,
    Psychology,
    Analytics,
    Lock,
    Bolt,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useAnimationControl, useStaggerAnimation } from '../../hooks/useAnimationControl';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import {
    ANIMATION_DURATION,
    ANIMATION_DELAY,
    ANIMATION_EASING,
    createAnimationConfig,
} from '../../animations/portfolioAnimations';
import {
    PORTFOLIO_SECTIONS,
    ANALYTICS_EVENTS,
} from './utils/portfolioConstants';

const FrameworkSection = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [expandedFramework, setExpandedFramework] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Section visibility tracking
    const { ref: sectionRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.3,
        triggerOnce: false,
    });

    // Animation controls
    const titleAnimation = useAnimationControl({
        animationType: 'fadeInDown',
        duration: ANIMATION_DURATION.MEDIUM,
        delay: ANIMATION_DELAY.SHORT,
        triggerOnScroll: true,
        triggerOnce: true,
    });

    const { registerItem, getItemStyles } = useStaggerAnimation({
        animationType: 'fadeInUp',
        baseDelay: ANIMATION_DELAY.MEDIUM,
        staggerDelay: ANIMATION_DELAY.STAGGER_BASE * 1.5,
        duration: ANIMATION_DURATION.NORMAL,
        triggerOnScroll: true,
    });

    // Framework capabilities and features
    const frameworkFeatures = useMemo(() => [
        {
            id: 'react-ecosystem',
            title: translate('React Ecosystem'),
            description: translate('Modern React 18+ with hooks, concurrent features, and component-based architecture'),
            icon: <Code />,
            color: theme.palette.primary.main,
            features: [
                'React 18+ with Concurrent Features',
                'Custom Hooks & Context API',
                'Component Composition Patterns',
                'Performance Optimization',
                'Error Boundaries & Suspense'
            ],
            technologies: ['React', 'JSX', 'Hooks', 'Context', 'Suspense'],
            proficiency: 95,
        },
        {
            id: 'material-ui',
            title: translate('Material-UI Design System'),
            description: translate('Comprehensive theming with custom overrides, responsive design, and accessibility features'),
            icon: <Palette />,
            color: theme.palette.secondary.main,
            features: [
                'Advanced Theming & Customization',
                'Responsive Breakpoint System',
                'Component Style Overrides',
                'Dark/Light Mode Support',
                'Accessibility Compliance'
            ],
            technologies: ['Material-UI', 'CSS-in-JS', 'Theming', 'Responsive Design'],
            proficiency: 92,
        },
        {
            id: 'state-management',
            title: translate('State Management'),
            description: translate('Redux Toolkit with RTK Query for efficient state management and API caching'),
            icon: <Storage />,
            color: theme.palette.success.main,
            features: [
                'Redux Toolkit Integration',
                'RTK Query for API Management',
                'Normalized State Structure',
                'Time-Travel Debugging',
                'Persistent State Solutions'
            ],
            technologies: ['Redux Toolkit', 'RTK Query', 'Redux Persist', 'Immer'],
            proficiency: 90,
        },
        {
            id: 'build-tools',
            title: translate('Build & Development Tools'),
            description: translate('Modern build pipeline with optimization, bundling, and development workflows'),
            icon: <Build />,
            color: theme.palette.warning.main,
            features: [
                'Vite/Webpack Configuration',
                'Code Splitting & Lazy Loading',
                'Tree Shaking & Minification',
                'Hot Module Replacement',
                'Source Map Generation'
            ],
            technologies: ['Vite', 'Webpack', 'Babel', 'ESLint', 'Prettier'],
            proficiency: 88,
        },
        {
            id: 'performance',
            title: translate('Performance Optimization'),
            description: translate('Advanced techniques for optimal runtime performance and user experience'),
            icon: <Speed />,
            color: theme.palette.info.main,
            features: [
                'React.memo & useMemo Optimization',
                'Virtual Scrolling Implementation',
                'Image Lazy Loading',
                'Bundle Size Optimization',
                'Web Vitals Monitoring'
            ],
            technologies: ['React DevTools', 'Lighthouse', 'Bundle Analyzer', 'Performance API'],
            proficiency: 87,
        },
        {
            id: 'testing-security',
            title: translate('Testing & Security'),
            description: translate('Comprehensive testing strategies and security best practices'),
            icon: <Security />,
            color: theme.palette.error.main,
            features: [
                'Unit & Integration Testing',
                'E2E Testing with Cypress',
                'Security Headers Implementation',
                'OWASP Compliance',
                'Authentication & Authorization'
            ],
            technologies: ['Jest', 'React Testing Library', 'Cypress', 'Auth0', 'JWT'],
            proficiency: 85,
        },
        {
            id: 'deployment',
            title: translate('Deployment & DevOps'),
            description: translate('CI/CD pipelines with cloud deployment and monitoring'),
            icon: <CloudUpload />,
            color: theme.palette.primary.dark,
            features: [
                'GitHub Actions CI/CD',
                'Docker Containerization',
                'AWS/Vercel Deployment',
                'Environment Management',
                'Monitoring & Logging'
            ],
            technologies: ['Docker', 'GitHub Actions', 'AWS', 'Vercel', 'Sentry'],
            proficiency: 86,
        },
    ], [translate, theme]);

    // Additional capabilities showcase
    const additionalCapabilities = useMemo(() => [
        {
            category: translate('Frontend Architecture'),
            icon: <Layers />,
            items: [
                'Micro-frontend Architecture',
                'Module Federation',
                'Design System Implementation',
                'Atomic Design Methodology'
            ]
        },
        {
            category: translate('API Integration'),
            icon: <Api />,
            items: [
                'RESTful API Integration',
                'GraphQL Implementation',
                'Real-time WebSocket',
                'API Gateway Patterns'
            ]
        },
        {
            category: translate('Analytics & Monitoring'),
            icon: <Analytics />,
            items: [
                'Google Analytics Integration',
                'Custom Event Tracking',
                'Performance Monitoring',
                'Error Tracking & Reporting'
            ]
        },
        {
            category: translate('Advanced Features'),
            icon: <Psychology />,
            items: [
                'Progressive Web App (PWA)',
                'Offline Functionality',
                'Push Notifications',
                'AI/ML Integration'
            ]
        },
    ], [translate]);

    // Handlers
    const handleFrameworkExpand = useCallback((frameworkId) => {
        setExpandedFramework(expandedFramework === frameworkId ? null : frameworkId);

        if (expandedFramework !== frameworkId) {
            analytics.trackElementClick('framework_expand', frameworkId, {
                section: 'frameworks',
                framework_title: frameworkFeatures.find(f => f.id === frameworkId)?.title,
            });
        }
    }, [expandedFramework, analytics, frameworkFeatures]);

    const handleTechnologyClick = useCallback((technology, frameworkId) => {
        analytics.trackElementClick('technology_chip', technology, {
            section: 'frameworks',
            framework: frameworkId,
        });
    }, [analytics]);

    return (
        <Box
            ref={sectionRef}
            id={PORTFOLIO_SECTIONS.FRAMEWORKS}
            component="section"
            sx={{
                py: { xs: 6, md: 10 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.03,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(theme.palette.primary.main)}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative' }}>
                {/* Section Header */}
                <Box
                    ref={titleAnimation.ref}
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                        ...titleAnimation.animationStyles,
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            fontWeight: 800,
                            background: isDarkMode
                                ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`
                                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {translate('Framework & Architecture')}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                        {translate('Leveraging modern frameworks and best practices for scalable applications')}
                    </Typography>
                </Box>

                {/* Framework Cards Grid */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {frameworkFeatures.map((framework, index) => (
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                            key={framework.id}
                            ref={(el) => registerItem(framework.id, el)}
                            sx={getItemStyles(framework.id, index)}
                        >
                            <Card
                                elevation={hoveredCard === framework.id ? 8 : 2}
                                onMouseEnter={() => setHoveredCard(framework.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                sx={{
                                    height: '100%',
                                    borderRadius: 2,
                                    transition: theme.transitions.create(['transform', 'box-shadow'], {
                                        duration: theme.transitions.duration.short,
                                    }),
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    },
                                    border: `1px solid ${alpha(framework.color, 0.2)}`,
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Header */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            mb: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                backgroundColor: alpha(framework.color, 0.1),
                                                color: framework.color,
                                                mr: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {framework.icon}
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                                }}
                                            >
                                                {framework.title}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={framework.proficiency}
                                                sx={{
                                                    mt: 1,
                                                    height: 6,
                                                    borderRadius: 3,
                                                    backgroundColor: alpha(framework.color, 0.1),
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: framework.color,
                                                        borderRadius: 3,
                                                    },
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ mt: 0.5, display: 'block' }}
                                            >
                                                {framework.proficiency}% Proficiency
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleFrameworkExpand(framework.id)}
                                            sx={{
                                                ml: 1,
                                                transform: expandedFramework === framework.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: theme.transitions.create(['transform'], {
                                                    duration: theme.transitions.duration.short,
                                                }),
                                            }}
                                        >
                                            <ExpandMore />
                                        </IconButton>
                                    </Box>

                                    {/* Description */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        paragraph
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: expandedFramework === framework.id ? 'unset' : 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {framework.description}
                                    </Typography>

                                    {/* Technologies */}
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        sx={{ mb: 2, gap: 0.5 }}
                                    >
                                        {framework.technologies.map((tech) => (
                                            <Chip
                                                key={tech}
                                                label={tech}
                                                size="small"
                                                onClick={() => handleTechnologyClick(tech, framework.id)}
                                                sx={{
                                                    backgroundColor: alpha(framework.color, 0.1),
                                                    color: framework.color,
                                                    fontSize: '0.75rem',
                                                    height: 24,
                                                    '&:hover': {
                                                        backgroundColor: alpha(framework.color, 0.2),
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Stack>

                                    {/* Expanded Features */}
                                    <Collapse in={expandedFramework === framework.id}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ mb: 1, fontWeight: 600 }}
                                        >
                                            Key Features:
                                        </Typography>
                                        <List dense sx={{ py: 0 }}>
                                            {framework.features.map((feature, idx) => (
                                                <ListItem
                                                    key={idx}
                                                    sx={{
                                                        py: 0.5,
                                                        px: 0,
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 28 }}>
                                                        <CheckCircle
                                                            sx={{
                                                                fontSize: 16,
                                                                color: framework.color,
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={feature}
                                                        primaryTypographyProps={{
                                                            variant: 'body2',
                                                            fontSize: '0.875rem',
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Additional Capabilities Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h3"
                        textAlign="center"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 4,
                        }}
                    >
                        {translate('Additional Capabilities')}
                    </Typography>

                    <Grid container spacing={3}>
                        {additionalCapabilities.map((capability, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        p: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '50%',
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            mb: 2,
                                        }}
                                    >
                                        {capability.icon}
                                    </Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 2,
                                        }}
                                    >
                                        {capability.category}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {capability.items.map((item, idx) => (
                                            <Typography
                                                key={idx}
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5,
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: '50%',
                                                        backgroundColor: theme.palette.primary.main,
                                                    }}
                                                />
                                                {item}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Tech Stack Summary */}
                <Box
                    sx={{
                        mt: 6,
                        textAlign: 'center',
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[1],
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        sx={{ gap: 2 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Bolt color="primary" />
                            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                                {frameworkFeatures.length}+
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Core Technologies
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Extension color="secondary" />
                            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                                50+
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Libraries & Tools
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Settings color="success" />
                            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                                100%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Production Ready
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
});

FrameworkSection.displayName = 'FrameworkSection';

export default FrameworkSection;