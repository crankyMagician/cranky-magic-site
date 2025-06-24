import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Container,
    useTheme,
    useMediaQuery,
    alpha,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    GitHub,
    Launch,
    Code,
    Visibility,
    Star,
    FolderOpen,
    ArrowForward,
    Close,
    CalendarToday,
    Group,
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
    CONTENT_LIMITS,
} from './utils/portfolioConstants';

const ProjectsSection = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);
    const [imageLoadingStates, setImageLoadingStates] = useState({});

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
        animationType: 'scaleIn',
        baseDelay: ANIMATION_DELAY.MEDIUM,
        staggerDelay: ANIMATION_DELAY.STAGGER_BASE * 2,
        duration: ANIMATION_DURATION.NORMAL,
        triggerOnScroll: true,
    });

    // Projects data
    const projectsData = useMemo(() => [
        {
            id: 'ecommerce-platform',
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard',
            longDescription: 'A comprehensive e-commerce platform built with React, Node.js, and PostgreSQL. Features include real-time inventory management, Stripe payment integration, advanced search and filtering, user authentication, order tracking, and a powerful admin dashboard for analytics and management.',
            image: '/assets/images/projects/ecommerce.jpg',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker'],
            category: 'fullstack',
            featured: true,
            demoUrl: 'https://demo.example.com/ecommerce',
            githubUrl: 'https://github.com/username/ecommerce',
            stats: {
                users: '10K+',
                orders: '50K+',
                uptime: '99.9%'
            },
            date: '2024',
            teamSize: 4,
        },
        {
            id: 'ai-dashboard',
            title: 'AI Analytics Dashboard',
            description: 'Real-time data visualization dashboard with ML-powered insights and predictive analytics',
            longDescription: 'An advanced analytics dashboard that leverages machine learning for predictive insights. Built with React, D3.js, and Python backend. Features include real-time data streaming, customizable widgets, automated reporting, and ML-powered anomaly detection.',
            image: '/assets/images/projects/ai-dashboard.jpg',
            technologies: ['React', 'D3.js', 'Python', 'TensorFlow', 'WebSocket', 'MongoDB'],
            category: 'frontend',
            featured: true,
            demoUrl: 'https://demo.example.com/analytics',
            githubUrl: 'https://github.com/username/ai-dashboard',
            stats: {
                dataPoints: '1M+',
                predictions: '95%',
                performance: '60fps'
            },
            date: '2024',
            teamSize: 3,
        },
        {
            id: 'mobile-app',
            title: 'Task Management Mobile App',
            description: 'Cross-platform mobile application for team collaboration and task management',
            longDescription: 'A React Native application for team collaboration with real-time updates, push notifications, and offline support. Features include task assignment, progress tracking, team chat, file sharing, and calendar integration.',
            image: '/assets/images/projects/mobile-app.jpg',
            technologies: ['React Native', 'Firebase', 'Redux', 'Node.js', 'Socket.io'],
            category: 'mobile',
            featured: false,
            demoUrl: 'https://demo.example.com/mobile',
            githubUrl: 'https://github.com/username/task-app',
            stats: {
                downloads: '25K+',
                rating: '4.8',
                platforms: '2'
            },
            date: '2023',
            teamSize: 2,
        },
        {
            id: 'blockchain-voting',
            title: 'Blockchain Voting System',
            description: 'Secure, transparent voting platform built on Ethereum blockchain',
            longDescription: 'A decentralized voting application ensuring transparency and security through blockchain technology. Built with Solidity smart contracts, Web3.js, and React. Features include voter verification, real-time results, and immutable vote records.',
            image: '/assets/images/projects/blockchain.jpg',
            technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS', 'Truffle'],
            category: 'blockchain',
            featured: true,
            githubUrl: 'https://github.com/username/blockchain-voting',
            stats: {
                votes: '100K+',
                gasOptimized: '40%',
                security: 'A+'
            },
            date: '2023',
            teamSize: 5,
        },
        {
            id: 'video-streaming',
            title: 'Video Streaming Platform',
            description: 'Scalable video streaming service with adaptive bitrate and CDN integration',
            longDescription: 'A Netflix-like streaming platform with adaptive bitrate streaming, CDN integration, and personalized recommendations. Built with React, Node.js, and AWS services. Features include 4K streaming, offline downloads, and AI-powered content recommendations.',
            image: '/assets/images/projects/streaming.jpg',
            technologies: ['React', 'Node.js', 'AWS', 'FFmpeg', 'Redis', 'ElasticSearch'],
            category: 'fullstack',
            featured: false,
            demoUrl: 'https://demo.example.com/streaming',
            stats: {
                streams: '1M+',
                quality: '4K',
                latency: '<50ms'
            },
            date: '2023',
            teamSize: 6,
        },
        {
            id: 'iot-dashboard',
            title: 'IoT Device Management',
            description: 'Real-time IoT device monitoring and control dashboard',
            longDescription: 'A comprehensive IoT platform for device management, monitoring, and control. Features real-time data visualization, device provisioning, firmware updates, and alerting systems. Built with React, Node.js, and MQTT.',
            image: '/assets/images/projects/iot.jpg',
            technologies: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'Grafana', 'Docker'],
            category: 'fullstack',
            featured: false,
            githubUrl: 'https://github.com/username/iot-platform',
            stats: {
                devices: '50K+',
                dataPoints: '10M+',
                uptime: '99.95%'
            },
            date: '2022',
            teamSize: 4,
        },
    ], []);

    // Project categories
    const categories = useMemo(() => [
        { id: 'all', label: translate('All Projects'), count: projectsData.length },
        { id: 'fullstack', label: translate('Full Stack'), count: projectsData.filter(p => p.category === 'fullstack').length },
        { id: 'frontend', label: translate('Frontend'), count: projectsData.filter(p => p.category === 'frontend').length },
        { id: 'mobile', label: translate('Mobile'), count: projectsData.filter(p => p.category === 'mobile').length },
        { id: 'blockchain', label: translate('Blockchain'), count: projectsData.filter(p => p.category === 'blockchain').length },
    ], [projectsData, translate]);

    // Filter projects
    const filteredProjects = useMemo(() => {
        const filtered = selectedCategory === 'all'
            ? projectsData
            : projectsData.filter(project => project.category === selectedCategory);

        // Sort by featured first, then by date
        return filtered.sort((a, b) => {
            if (a.featured !== b.featured) return b.featured ? 1 : -1;
            return b.date.localeCompare(a.date);
        });
    }, [selectedCategory, projectsData]);

    // Limited projects for initial display
    const displayedProjects = useMemo(() => {
        return filteredProjects.slice(0, CONTENT_LIMITS.MAX_PROJECTS_DISPLAY);
    }, [filteredProjects]);

    // Handlers
    const handleCategoryChange = useCallback((categoryId) => {
        setSelectedCategory(categoryId);
        analytics.trackElementClick('project_category_filter', categoryId, {
            section: 'projects',
            previous_category: selectedCategory,
        });
    }, [analytics, selectedCategory]);

    const handleProjectClick = useCallback((project) => {
        setSelectedProject(project);
        analytics.trackElementClick('project_view_details', project.id, {
            section: 'projects',
            project_title: project.title,
            category: project.category,
        });
    }, [analytics]);

    const handleProjectAction = useCallback((action, project, url) => {
        analytics.trackElementClick(`project_${action}`, project.id, {
            section: 'projects',
            project_title: project.title,
            action_url: url,
        });

        if (url) {
            window.open(url, '_blank', 'noopener noreferrer');
        }
    }, [analytics]);

    const handleImageLoad = useCallback((projectId) => {
        setImageLoadingStates(prev => ({ ...prev, [projectId]: 'loaded' }));
    }, []);

    const handleImageError = useCallback((projectId) => {
        setImageLoadingStates(prev => ({ ...prev, [projectId]: 'error' }));
    }, []);

    return (
        <Box
            ref={sectionRef}
            id={PORTFOLIO_SECTIONS.PROJECTS}
            component="section"
            sx={{
                py: { xs: 6, md: 10 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: theme.palette.primary.main,
                    opacity: 0.03,
                    filter: 'blur(100px)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg">
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
                        {translate('Featured Projects')}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                        {translate('Showcasing innovative solutions and technical excellence')}
                    </Typography>
                </Box>

                {/* Category Filter */}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        mb: 4,
                        overflowX: 'auto',
                        pb: 1,
                        justifyContent: { xs: 'flex-start', md: 'center' },
                        '&::-webkit-scrollbar': {
                            height: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.divider,
                            borderRadius: 2,
                        },
                    }}
                >
                    {categories.map((category) => (
                        <Chip
                            key={category.id}
                            label={`${category.label} (${category.count})`}
                            onClick={() => handleCategoryChange(category.id)}
                            color={selectedCategory === category.id ? 'primary' : 'default'}
                            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                            sx={{
                                minWidth: 'fit-content',
                                transition: theme.transitions.create(['all'], {
                                    duration: theme.transitions.duration.short,
                                }),
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[2],
                                },
                            }}
                        />
                    ))}
                </Stack>

                {/* Projects Grid */}
                <Grid container spacing={4}>
                    {displayedProjects.map((project, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={project.featured ? 6 : 4}
                            key={project.id}
                            ref={(el) => registerItem(project.id, el)}
                            sx={getItemStyles(project.id, index)}
                        >
                            <Card
                                elevation={project.featured ? 8 : 3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: theme.transitions.create(['transform', 'box-shadow'], {
                                        duration: theme.transitions.duration.short,
                                    }),
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[12],
                                        '& .project-overlay': {
                                            opacity: 1,
                                        },
                                        '& .project-image': {
                                            transform: 'scale(1.05)',
                                        },
                                    },
                                }}
                                onClick={() => handleProjectClick(project)}
                            >
                                {/* Featured Badge */}
                                {project.featured && (
                                    <Chip
                                        icon={<Star />}
                                        label="Featured"
                                        size="small"
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            zIndex: 1,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.9),
                                        }}
                                    />
                                )}

                                {/* Project Image */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        paddingTop: '56.25%', // 16:9 aspect ratio
                                        overflow: 'hidden',
                                        backgroundColor: theme.palette.action.hover,
                                    }}
                                >
                                    {imageLoadingStates[project.id] !== 'loaded' && (
                                        <Skeleton
                                            variant="rectangular"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        />
                                    )}
                                    <Box
                                        component="img"
                                        className="project-image"
                                        src={project.image}
                                        alt={project.title}
                                        onLoad={() => handleImageLoad(project.id)}
                                        onError={() => handleImageError(project.id)}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: theme.transitions.create(['transform'], {
                                                duration: theme.transitions.duration.standard,
                                            }),
                                            display: imageLoadingStates[project.id] === 'error' ? 'none' : 'block',
                                        }}
                                    />

                                    {/* Hover Overlay */}
                                    <Box
                                        className="project-overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: alpha(theme.palette.background.default, 0.9),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: theme.transitions.create(['opacity'], {
                                                duration: theme.transitions.duration.short,
                                            }),
                                        }}
                                    >
                                        <Stack direction="row" spacing={2}>
                                            {project.demoUrl && (
                                                <Tooltip title="View Demo">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProjectAction('demo', project, project.demoUrl);
                                                        }}
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                            },
                                                        }}
                                                    >
                                                        <Launch />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {project.githubUrl && (
                                                <Tooltip title="View Code">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProjectAction('github', project, project.githubUrl);
                                                        }}
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                            },
                                                        }}
                                                    >
                                                        <GitHub />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    color="primary"
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                        },
                                                    }}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                </Box>

                                {/* Project Content */}
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        }}
                                    >
                                        {project.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        paragraph
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            mb: 2,
                                        }}
                                    >
                                        {project.description}
                                    </Typography>

                                    {/* Technology Stack */}
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        sx={{ mb: 2, gap: 1 }}
                                    >
                                        {project.technologies.slice(0, 4).map((tech) => (
                                            <Chip
                                                key={tech}
                                                label={tech}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <Chip
                                                label={`+${project.technologies.length - 4}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        )}
                                    </Stack>

                                    {/* Project Stats */}
                                    {project.stats && (
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            sx={{
                                                mt: 'auto',
                                                pt: 2,
                                                borderTop: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            {Object.entries(project.stats).map(([key, value]) => (
                                                <Box key={key}>
                                                    <Typography
                                                        variant="body2"
                                                        color="primary"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        {value}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{ textTransform: 'capitalize' }}
                                                    >
                                                        {key}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* View More Button */}
                {filteredProjects.length > CONTENT_LIMITS.MAX_PROJECTS_DISPLAY && (
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => {
                                analytics.trackElementClick('view_all_projects', 'button', {
                                    section: 'projects',
                                    total_projects: filteredProjects.length,
                                });
                            }}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    transform: 'translateX(4px)',
                                },
                            }}
                        >
                            View All Projects ({filteredProjects.length})
                        </Button>
                    </Box>
                )}
            </Container>

            {/* Project Detail Dialog */}
            <Dialog
                open={Boolean(selectedProject)}
                onClose={() => setSelectedProject(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxHeight: '90vh',
                    },
                }}
            >
                {selectedProject && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                                    {selectedProject.title}
                                </Typography>
                                <IconButton
                                    onClick={() => setSelectedProject(null)}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    <Close />
                                </IconButton>
                            </Stack>
                        </DialogTitle>

                        <DialogContent dividers>
                            {/* Project Image */}
                            <Box
                                component="img"
                                src={selectedProject.image}
                                alt={selectedProject.title}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 1,
                                    mb: 3,
                                }}
                            />

                            {/* Project Details */}
                            <Typography variant="body1" paragraph>
                                {selectedProject.longDescription}
                            </Typography>

                            {/* Technologies */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Technologies Used
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                                    {selectedProject.technologies.map((tech) => (
                                        <Chip
                                            key={tech}
                                            label={tech}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            {/* Project Info */}
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <CalendarToday color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            Year
                                        </Typography>
                                        <Typography variant="h6">
                                            {selectedProject.date}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Group color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            Team Size
                                        </Typography>
                                        <Typography variant="h6">
                                            {selectedProject.teamSize}
                                        </Typography>
                                    </Box>
                                </Grid>
                                {selectedProject.stats && Object.entries(selectedProject.stats).slice(0, 2).map(([key, value]) => (
                                    <Grid item xs={6} sm={3} key={key}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <Code color="action" />
                                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                                {key}
                                            </Typography>
                                            <Typography variant="h6">
                                                {value}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
                            {selectedProject.githubUrl && (
                                <Button
                                    startIcon={<GitHub />}
                                    onClick={() => handleProjectAction('github', selectedProject, selectedProject.githubUrl)}
                                >
                                    View Code
                                </Button>
                            )}
                            {selectedProject.demoUrl && (
                                <Button
                                    variant="contained"
                                    startIcon={<Launch />}
                                    onClick={() => handleProjectAction('demo', selectedProject, selectedProject.demoUrl)}
                                >
                                    View Demo
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;