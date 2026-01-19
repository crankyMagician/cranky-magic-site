import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Container,
    useTheme,
    useMediaQuery,
    alpha,
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
import { projectsData as realProjectsData } from '../../data/projectsData';
import TechIcon from '../common/TechIcon';
import { getTechIcon } from '../../utils/techIconMapping';

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

    // Use real projects data from data file
    const projectsData = realProjectsData;

    // Project categories - updated to match real projects data
    const categories = useMemo(() => [
        { id: 'all', label: translate('All Projects'), count: projectsData.length },
        { id: 'fullstack', label: translate('Full Stack'), count: projectsData.filter(p => p.category === 'fullstack').length },
        { id: 'frontend', label: translate('Frontend'), count: projectsData.filter(p => p.category === 'frontend').length },
        { id: 'backend', label: translate('Backend'), count: projectsData.filter(p => p.category === 'backend').length },
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

                                {/* Tech Stack Display */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: project.featured ? 220 : 180,
                                        overflow: 'hidden',
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundImage: `
                                                repeating-linear-gradient(
                                                    0deg,
                                                    transparent,
                                                    transparent 40px,
                                                    ${alpha(theme.palette.primary.main, 0.03)} 40px,
                                                    ${alpha(theme.palette.primary.main, 0.03)} 41px
                                                ),
                                                repeating-linear-gradient(
                                                    90deg,
                                                    transparent,
                                                    transparent 40px,
                                                    ${alpha(theme.palette.primary.main, 0.03)} 40px,
                                                    ${alpha(theme.palette.primary.main, 0.03)} 41px
                                                )
                                            `,
                                            pointerEvents: 'none',
                                        },
                                    }}
                                >
                                    {/* Primary Tech Icon - Large */}
                                    {(() => {
                                        const primaryTech = project.stats?.language || project.technologies[0];
                                        const techInfo = getTechIcon(primaryTech);
                                        const IconComponent = techInfo?.icon;
                                        return (
                                            <Box
                                                className="project-image"
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: theme.transitions.create(['transform'], {
                                                        duration: theme.transitions.duration.standard,
                                                    }),
                                                }}
                                            >
                                                {IconComponent && (
                                                    <Box
                                                        sx={{
                                                            fontSize: project.featured ? 80 : 64,
                                                            color: techInfo.color || theme.palette.primary.main,
                                                            filter: `drop-shadow(0 4px 20px ${alpha(techInfo.color || theme.palette.primary.main, 0.4)})`,
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <IconComponent size={project.featured ? 80 : 64} />
                                                    </Box>
                                                )}
                                                {/* Secondary tech icons in a row */}
                                                <Stack
                                                    direction="row"
                                                    spacing={1.5}
                                                    sx={{
                                                        mt: 2,
                                                        opacity: 0.7,
                                                    }}
                                                >
                                                    {project.technologies.slice(1, 5).map((tech) => {
                                                        const secondaryTechInfo = getTechIcon(tech);
                                                        const SecondaryIcon = secondaryTechInfo?.icon;
                                                        return SecondaryIcon ? (
                                                            <Tooltip key={tech} title={tech} arrow>
                                                                <Box
                                                                    sx={{
                                                                        color: secondaryTechInfo.color || theme.palette.text.secondary,
                                                                        transition: 'transform 0.2s ease',
                                                                        '&:hover': {
                                                                            transform: 'scale(1.2)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <SecondaryIcon size={24} />
                                                                </Box>
                                                            </Tooltip>
                                                        ) : null;
                                                    })}
                                                </Stack>
                                            </Box>
                                        );
                                    })()}

                                    {/* Hover Overlay */}
                                    <Box
                                        className="project-overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: alpha(theme.palette.background.default, 0.95),
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
                                                icon={<TechIcon tech={tech} size={14} showTooltip={false} />}
                                                label={tech}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                    fontSize: '0.75rem',
                                                    '& .MuiChip-icon': {
                                                        marginLeft: '8px',
                                                    },
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
                            {/* Tech Stack Display */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    borderRadius: 2,
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundImage: `
                                            repeating-linear-gradient(
                                                0deg,
                                                transparent,
                                                transparent 40px,
                                                ${alpha(theme.palette.primary.main, 0.03)} 40px,
                                                ${alpha(theme.palette.primary.main, 0.03)} 41px
                                            ),
                                            repeating-linear-gradient(
                                                90deg,
                                                transparent,
                                                transparent 40px,
                                                ${alpha(theme.palette.primary.main, 0.03)} 40px,
                                                ${alpha(theme.palette.primary.main, 0.03)} 41px
                                            )
                                        `,
                                        pointerEvents: 'none',
                                    },
                                }}
                            >
                                {(() => {
                                    const primaryTech = selectedProject.stats?.language || selectedProject.technologies[0];
                                    const techInfo = getTechIcon(primaryTech);
                                    const IconComponent = techInfo?.icon;
                                    return (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {IconComponent && (
                                                <Box
                                                    sx={{
                                                        color: techInfo.color || theme.palette.primary.main,
                                                        filter: `drop-shadow(0 4px 20px ${alpha(techInfo.color || theme.palette.primary.main, 0.4)})`,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <IconComponent size={100} />
                                                </Box>
                                            )}
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                sx={{ opacity: 0.8 }}
                                            >
                                                {selectedProject.technologies.slice(1, 6).map((tech) => {
                                                    const secondaryTechInfo = getTechIcon(tech);
                                                    const SecondaryIcon = secondaryTechInfo?.icon;
                                                    return SecondaryIcon ? (
                                                        <Tooltip key={tech} title={tech} arrow>
                                                            <Box
                                                                sx={{
                                                                    color: secondaryTechInfo.color || theme.palette.text.secondary,
                                                                    transition: 'transform 0.2s ease',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.2)',
                                                                    },
                                                                }}
                                                            >
                                                                <SecondaryIcon size={32} />
                                                            </Box>
                                                        </Tooltip>
                                                    ) : null;
                                                })}
                                            </Stack>
                                        </Box>
                                    );
                                })()}
                            </Box>

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
                                            icon={<TechIcon tech={tech} size={16} showTooltip={false} />}
                                            label={tech}
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                                '& .MuiChip-icon': {
                                                    marginLeft: '8px',
                                                },
                                            }}
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