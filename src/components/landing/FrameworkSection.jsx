import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    Fade,
    Container,
    useTheme,
    alpha,
    keyframes,
    Stack,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Code,
    Palette,
    Speed,
    Security,
    CloudQueue,
    Responsive,
    Analytics,
    Language,
    Dashboard,
    Api,
    Psychology,
    Storage,
    BugReport,
    ExpandMore,
    CheckCircle,
    Architecture,
    Integration,
    AutoAwesome,
    Lightbulb,
    Build,
    Tune,
    Verified,
    Timeline,
    School,
    Groups, TrendingUp
} from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';

// Animation keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px ${props => props.glowColor || 'currentColor'};
  }
  50% { 
    box-shadow: 0 0 20px ${props => props.glowColor || 'currentColor'}, 
                0 0 30px ${props => props.glowColor || 'currentColor'};
  }
`;

const codeFlow = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

const FrameworkSection = React.memo(({ onSectionView }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);
    const [expandedAccordion, setExpandedAccordion] = useState('architecture');

    // Track section visibility
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        if (onSectionView) {
            onSectionView();
        }
        return () => clearTimeout(timer);
    }, [onSectionView]);

    // Framework capabilities and features
    const frameworkFeatures = [
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
            technologies: ['React', 'JSX', 'Hooks', 'Context', 'Suspense']
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
            technologies: ['Material-UI', 'CSS-in-JS', 'Theming', 'Responsive Design']
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
                'Optimistic Updates',
                'Normalized State Structure',
                'DevTools Integration'
            ],
            technologies: ['Redux Toolkit', 'RTK Query', 'Immer', 'Reselect']
        },
        {
            id: 'analytics-tracking',
            title: translate('Analytics & Tracking'),
            description: translate('Comprehensive user behavior tracking with privacy-first approach and GDPR compliance'),
            icon: <Analytics />,
            color: theme.palette.info.main,
            features: [
                'User Behavior Analytics',
                'Performance Monitoring',
                'Error Tracking & Reporting',
                'GDPR Compliant Data Collection',
                'Custom Event Tracking'
            ],
            technologies: ['Custom Analytics', 'Web Vitals', 'Error Boundaries', 'Privacy Controls']
        },
        {
            id: 'internationalization',
            title: translate('Internationalization'),
            description: translate('Multi-language support with dynamic loading and RTL language compatibility'),
            icon: <Language />,
            color: theme.palette.warning.main,
            features: [
                'Multi-Language Support',
                'Dynamic Language Loading',
                'RTL Language Support',
                'Pluralization Rules',
                'Number & Date Formatting'
            ],
            technologies: ['i18next', 'React-i18next', 'Language Detection', 'ICU']
        },
        {
            id: 'authentication',
            title: translate('Authentication & Security'),
            description: translate('Secure authentication with role-based access control and token management'),
            icon: <Security />,
            color: theme.palette.error.main,
            features: [
                'JWT Token Authentication',
                'Role-Based Access Control',
                'Secure Route Protection',
                'Session Management',
                'Multi-Factor Authentication'
            ],
            technologies: ['JWT', 'Auth Guards', 'Encryption', 'Session Storage']
        }
    ];

    // Development practices and methodologies
    const developmentPractices = [
        {
            category: translate('Architecture'),
            icon: <Architecture />,
            practices: [
                translate('Component-Driven Development'),
                translate('Atomic Design Principles'),
                translate('Clean Code Architecture'),
                translate('Separation of Concerns'),
                translate('SOLID Principles')
            ]
        },
        {
            category: translate('Performance'),
            icon: <Speed />,
            practices: [
                translate('Code Splitting & Lazy Loading'),
                translate('Bundle Size Optimization'),
                translate('Memoization Strategies'),
                translate('Virtual Scrolling'),
                translate('Image Optimization')
            ]
        },
        {
            category: translate('Testing'),
            icon: <BugReport />,
            practices: [
                translate('Unit Testing with Jest'),
                translate('Component Testing'),
                translate('Integration Testing'),
                translate('End-to-End Testing'),
                translate('Test-Driven Development')
            ]
        },
        {
            category: translate('DevOps'),
            icon: <CloudQueue />,
            practices: [
                translate('CI/CD Pipeline Integration'),
                translate('Automated Testing'),
                translate('Code Quality Gates'),
                translate('Deployment Automation'),
                translate('Environment Management')
            ]
        }
    ];

    // Analytics handlers
    const handleFeatureClick = (featureId) => {
        setActiveFeature(activeFeature === featureId ? null : featureId);
        analytics.trackElementClick('framework_feature', featureId, {
            section: 'framework',
            feature_type: 'capability',
            expanded: activeFeature !== featureId
        });
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : false);
        analytics.trackElementClick('framework_accordion', panel, {
            section: 'framework',
            expanded: isExpanded
        });
    };

    const handleTechnologyClick = (technology, category) => {
        analytics.trackElementClick('framework_technology', technology, {
            section: 'framework',
            category: category
        });
    };

    return (
        <Box
            id="framework-section"
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                    zIndex: -1
                }}
            />

            <Container maxWidth="lg">
                {/* Section Header */}
                <Fade in={isVisible} timeout={1000}>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            {translate('Framework Capabilities')}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '800px',
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            {translate('A comprehensive development framework showcasing modern React patterns, advanced state management, and production-ready features that power scalable applications.')}
                        </Typography>
                    </Box>
                </Fade>

                {/* Core Framework Features */}
                <Grid container spacing={4} sx={{ mb: 8 }}>
                    {frameworkFeatures.map((feature, index) => (
                        <Grid item xs={12} md={6} lg={4} key={feature.id}>
                            <Fade in={isVisible} timeout={1500 + (index * 200)}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        cursor: 'pointer',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        background: `linear-gradient(135deg, ${alpha(feature.color, 0.1)} 0%, ${theme.palette.background.paper} 100%)`,
                                        border: `1px solid ${alpha(feature.color, 0.2)}`,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `${floatAnimation} 6s ease-in-out infinite`,
                                        animationDelay: `${index * 0.5}s`,
                                        '&:hover': {
                                            transform: 'translateY(-12px) scale(1.02)',
                                            boxShadow: `0 16px 40px ${alpha(feature.color, 0.3)}`,
                                            border: `1px solid ${feature.color}`
                                        }
                                    }}
                                    onClick={() => handleFeatureClick(feature.id)}
                                >
                                    {/* Feature Header */}
                                    <Box
                                        sx={{
                                            background: `linear-gradient(135deg, ${feature.color} 0%, ${alpha(feature.color, 0.8)} 100%)`,
                                            color: 'white',
                                            p: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                fontSize: '2rem',
                                                opacity: 0.9
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1.125rem'
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                    </Box>

                                    {/* Feature Content */}
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 3,
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>

                                        {/* Feature List */}
                                        <List dense sx={{ py: 0 }}>
                                            {feature.features.map((featureItem, idx) => (
                                                <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <CheckCircle
                                                            sx={{
                                                                fontSize: '1rem',
                                                                color: feature.color
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={featureItem}
                                                        primaryTypographyProps={{
                                                            variant: 'body2',
                                                            sx: { fontWeight: 500 }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>

                                        {/* Technology Tags */}
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            sx={{
                                                mt: 2,
                                                flexWrap: 'wrap',
                                                gap: 0.5
                                            }}
                                        >
                                            {feature.technologies.map((tech) => (
                                                <Chip
                                                    key={tech}
                                                    label={tech}
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTechnologyClick(tech, feature.id);
                                                    }}
                                                    sx={{
                                                        borderColor: alpha(feature.color, 0.4),
                                                        color: feature.color,
                                                        fontSize: '0.75rem',
                                                        '&:hover': {
                                                            backgroundColor: alpha(feature.color, 0.1),
                                                            borderColor: feature.color
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* Development Practices Section */}
                <Fade in={isVisible} timeout={3000}>
                    <Box sx={{ mb: 6 }}>
                        <Typography
                            variant="h4"
                            component="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 4,
                                textAlign: 'center',
                                color: 'text.primary'
                            }}
                        >
                            {translate('Development Practices')}
                        </Typography>

                        <Grid container spacing={3}>
                            {developmentPractices.map((practice, index) => (
                                <Grid item xs={12} sm={6} md={3} key={practice.category}>
                                    <Accordion
                                        expanded={expandedAccordion === practice.category.toLowerCase()}
                                        onChange={handleAccordionChange(practice.category.toLowerCase())}
                                        sx={{
                                            borderRadius: 2,
                                            '&:before': { display: 'none' },
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                                            animation: `${floatAnimation} 8s ease-in-out infinite`,
                                            animationDelay: `${index * 0.3}s`
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            sx={{
                                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ color: 'primary.main' }}>
                                                    {practice.icon}
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {practice.category}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                {practice.practices.map((item, idx) => (
                                                    <ListItem key={idx} sx={{ px: 0 }}>
                                                        <ListItemIcon sx={{ minWidth: 28 }}>
                                                            <Verified
                                                                sx={{
                                                                    fontSize: '0.875rem',
                                                                    color: 'success.main'
                                                                }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={item}
                                                            primaryTypographyProps={{
                                                                variant: 'body2'
                                                            }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Fade>

                {/* Framework Benefits Summary */}
                <Fade in={isVisible} timeout={3500}>
                    <Box
                        sx={{
                            mt: 8,
                            p: 4,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            textAlign: 'center'
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                color: 'primary.main'
                            }}
                        >
                            {translate('Why This Framework?')}
                        </Typography>

                        <Grid container spacing={4}>
                            {[
                                {
                                    title: translate('Scalability'),
                                    description: translate('Built to handle enterprise-level applications'),
                                    icon: <TrendingUp />,
                                    metric: '100K+ Users'
                                },
                                {
                                    title: translate('Performance'),
                                    description: translate('Optimized for speed and efficiency'),
                                    icon: <Speed />,
                                    metric: '<100ms Response'
                                },
                                {
                                    title: translate('Maintainability'),
                                    description: translate('Clean architecture and documentation'),
                                    icon: <Build />,
                                    metric: '95% Code Coverage'
                                },
                                {
                                    title: translate('Developer Experience'),
                                    description: translate('Modern tooling and best practices'),
                                    icon: <School />,
                                    metric: '5-Star Rating'
                                }
                            ].map((benefit, index) => (
                                <Grid item xs={6} md={3} key={benefit.title}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            background: alpha(theme.palette.background.paper, 0.8),
                                            transition: 'all 0.3s',
                                            animation: `${floatAnimation} 5s ease-in-out infinite`,
                                            animationDelay: `${index * 0.4}s`,
                                            '&:hover': {
                                                background: alpha(theme.palette.primary.main, 0.1),
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'primary.main',
                                                fontSize: '2.5rem',
                                                mb: 1
                                            }}
                                        >
                                            {benefit.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'primary.main',
                                                mb: 1
                                            }}
                                        >
                                            {benefit.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 2,
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {benefit.description}
                                        </Typography>
                                        <Chip
                                            label={benefit.metric}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
});

FrameworkSection.displayName = 'FrameworkSection';

export default FrameworkSection;