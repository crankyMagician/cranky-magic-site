import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    Stack,
    IconButton,
    Fade,
    Container,
    useTheme,
    alpha,
    keyframes,
    Tooltip,
    CardActions
} from '@mui/material';
import {
    GitHub,
    Launch,
    PlayArrow,
    Code,
    CloudQueue,
    Security,
    Speed,
    Psychology,
    Visibility,
    Star,
    Assignment,
    MedicalServices,
    Quiz,
    CloudDownload,
    Group,
    TrendingUp,
    Business
} from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import ProjectCard from './ProjectCard';

// Animation keyframes
const projectFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const shimmerEffect = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const ProjectsSection = React.memo(({ onSectionView }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Track section visibility
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        if (onSectionView) {
            onSectionView();
        }
        return () => clearTimeout(timer);
    }, [onSectionView]);

    // Real projects based on resume data
    const projects = [
        {
            id: 'grant-management-system',
            title: translate('Grant Management System'),
            description: translate('A robust system to manage grant proposals with proprietary Machine Learning algorithms for grant categorization and user-grant matching.'),
            longDescription: translate('Worked in a team of three to create a comprehensive grant management platform featuring advanced ML algorithms for intelligent grant categorization and automated user-grant matching based on qualifications and interests.'),
            image: '/api/placeholder/400/240',
            technologies: ['Machine Learning', 'Python', 'React', 'Node.js', 'PostgreSQL', 'AI Algorithms'],
            category: 'fullstack',
            type: 'Personal Project',
            duration: 'Aug 2022 - Dec 2022',
            teamSize: 3,
            achievements: [
                translate('Developed proprietary ML algorithm for grant categorization'),
                translate('Created intelligent user-grant matching system'),
                translate('Built comprehensive proposal management workflow')
            ],
            githubUrl: '#',
            demoUrl: '#',
            featured: true,
            status: 'completed'
        },
        {
            id: 'vr-quiz-application',
            title: translate('VR Quiz Application'),
            description: translate('Full-stack Virtual Reality Quiz application with seamless web browser integration, achieving 20% improvement in user engagement.'),
            longDescription: translate('Co-developed an innovative VR quiz platform using Unity, C#, JavaScript, and Node.js with AWS integration. The application features cross-platform compatibility and enhanced user engagement through immersive VR experiences.'),
            image: '/api/placeholder/400/240',
            technologies: ['Unity', 'C#', 'JavaScript', 'Node.js', 'AWS', 'VR', 'WebXR'],
            category: 'vr',
            type: 'SunGlitch Project',
            duration: 'Aug 2022 - Dec 2022',
            teamSize: 2,
            achievements: [
                translate('20% improvement in user engagement'),
                translate('Seamless web browser integration'),
                translate('Cross-platform VR compatibility')
            ],
            githubUrl: '#',
            demoUrl: '#',
            featured: true,
            status: 'completed'
        },
        {
            id: 'patient-interaction-simulation',
            title: translate('Patient Interaction Simulation'),
            description: translate('Virtual Reality medical training simulation with 85% accuracy improvement in diagnostic testing and 95% user satisfaction rate.'),
            longDescription: translate('Led a 4-person team in developing an advanced VR medical training simulation using Unity and XR Toolkit with VOSK integration for voice recognition. The simulation focuses on patient vitals testing with remarkable accuracy improvements.'),
            image: '/api/placeholder/400/240',
            technologies: ['Unity', 'XR Toolkit', 'VOSK', 'C#', 'Medical AI', 'Voice Recognition'],
            category: 'vr',
            type: 'SunGlitch Project',
            duration: 'Jul 2021 - Jul 2022',
            teamSize: 4,
            achievements: [
                translate('85% improvement in diagnostic accuracy'),
                translate('95% user satisfaction rate'),
                translate('Recognition for usability excellence'),
                translate('Contributed to VR adoption in medical training')
            ],
            githubUrl: '#',
            demoUrl: '#',
            featured: true,
            status: 'completed'
        },
        {
            id: 'azure-migration-project',
            title: translate('Azure Cloud Migration'),
            description: translate('Enterprise IT infrastructure migration to Azure, improving system reliability by 25% and reducing operational costs by 30%.'),
            longDescription: translate('Collaborated with a 3-person team to migrate Kline and Specter law firm\'s complete IT infrastructure to Azure cloud platform. The project involved comprehensive planning, configuration, and optimization of cloud resources.'),
            image: '/api/placeholder/400/240',
            technologies: ['Microsoft Azure', 'Cloud Architecture', 'Virtual Machines', 'Networking', 'Security', 'DevOps'],
            category: 'cloud',
            type: 'Enterprise Project',
            duration: 'Sep 2019 - May 2020',
            teamSize: 3,
            achievements: [
                translate('25% improvement in system reliability'),
                translate('30% reduction in operational costs'),
                translate('Zero-downtime migration process'),
                translate('Enhanced security posture')
            ],
            githubUrl: null,
            demoUrl: null,
            featured: false,
            status: 'completed'
        },
        {
            id: 'dotnet-military-application',
            title: translate('.NET Military Application'),
            description: translate('Enterprise .NET application for Saudi Arabian military with 25% faster time-to-market and 50% faster deployment cycles.'),
            longDescription: translate('Led the complete development lifecycle of a mission-critical .NET application for military use, implementing comprehensive DevOps strategies and ensuring the highest security standards.'),
            image: '/api/placeholder/400/240',
            technologies: ['.NET', 'Blazor', 'JavaScript', 'Node.js', 'Jenkins', 'Docker', 'DevOps', 'Security'],
            category: 'enterprise',
            type: 'FiveDomains Project',
            duration: 'Jan 2023 - Jun 2023',
            teamSize: 6,
            achievements: [
                translate('25% reduction in time-to-market'),
                translate('50% faster deployment cycles'),
                translate('Zero-downtime deployments'),
                translate('15% ahead of schedule completion')
            ],
            githubUrl: null,
            demoUrl: null,
            featured: true,
            status: 'completed'
        },
        {
            id: 'xr-educational-applications',
            title: translate('XR Educational Applications'),
            description: translate('Extended Reality educational platforms increasing student engagement by 40% and learning outcomes by 30%.'),
            longDescription: translate('Developed multiple XR educational applications using Unity and XR Toolkit, focusing on immersive learning experiences that significantly improve educational outcomes and student engagement metrics.'),
            image: '/api/placeholder/400/240',
            technologies: ['Unity', 'XR Toolkit', 'C#', 'Educational Technology', 'UX Design', 'Analytics'],
            category: 'vr',
            type: 'SunGlitch Project',
            duration: 'Jul 2021 - Dec 2023',
            teamSize: 8,
            achievements: [
                translate('40% increase in student engagement'),
                translate('30% improvement in learning outcomes'),
                translate('Multiple successful deployments'),
                translate('Recognized for educational innovation')
            ],
            githubUrl: '#',
            demoUrl: '#',
            featured: false,
            status: 'completed'
        }
    ];

    // Project categories for filtering
    const categories = [
        { id: 'all', label: translate('All Projects'), icon: <Assignment />, count: projects.length },
        { id: 'fullstack', label: translate('Full Stack'), icon: <Code />, count: projects.filter(p => p.category === 'fullstack').length },
        { id: 'vr', label: translate('VR/XR'), icon: <PlayArrow />, count: projects.filter(p => p.category === 'vr').length },
        { id: 'cloud', label: translate('Cloud'), icon: <CloudQueue />, count: projects.filter(p => p.category === 'cloud').length },
        { id: 'enterprise', label: translate('Enterprise'), icon: <Business />, count: projects.filter(p => p.category === 'enterprise').length }
    ];

    // Analytics handlers
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        analytics.trackElementClick('project_category_filter', categoryId, {
            section: 'projects',
            previous_category: selectedCategory,
            project_count: filteredProjects.length
        });
    };

    const handleProjectView = (projectId, projectTitle) => {
        analytics.trackElementClick('project_card', projectId, {
            section: 'projects',
            project_title: projectTitle,
            category: selectedCategory
        });
    };

    const handleProjectLink = (projectId, linkType, url) => {
        analytics.trackLinkClick(`project_${linkType}`, url, {
            section: 'projects',
            project_id: projectId,
            link_type: linkType,
            is_external: true
        });
    };

    // Filter projects based on selected category
    const filteredProjects = selectedCategory === 'all'
        ? projects
        : projects.filter(project => project.category === selectedCategory);

    // Separate featured projects
    const featuredProjects = filteredProjects.filter(project => project.featured);
    const regularProjects = filteredProjects.filter(project => !project.featured);

    return (
        <Box
            id="projects-section"
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                position: 'relative'
            }}
        >
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
                            {translate('Featured Projects')}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '700px',
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            {translate('A showcase of innovative projects spanning VR/XR applications, enterprise solutions, and cloud migrations. Each project demonstrates technical excellence and measurable business impact.')}
                        </Typography>
                    </Box>
                </Fade>

                {/* Category Filter */}
                <Fade in={isVisible} timeout={1500}>
                    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                flexWrap: 'wrap',
                                gap: 1,
                                justifyContent: 'center'
                            }}
                        >
                            {categories.map((category) => (
                                <Chip
                                    key={category.id}
                                    icon={category.icon}
                                    label={`${category.label} (${category.count})`}
                                    onClick={() => handleCategoryFilter(category.id)}
                                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        fontWeight: 600,
                                        borderWidth: 2,
                                        borderColor: selectedCategory === category.id
                                            ? 'primary.main'
                                            : 'divider',
                                        backgroundColor: selectedCategory === category.id
                                            ? 'primary.main'
                                            : 'transparent',
                                        color: selectedCategory === category.id
                                            ? 'primary.contrastText'
                                            : 'text.primary',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: selectedCategory === category.id
                                                ? 'primary.dark'
                                                : alpha(theme.palette.primary.main, 0.1),
                                            borderColor: 'primary.main',
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Fade>

                {/* Featured Projects Section */}
                {featuredProjects.length > 0 && (
                    <Box sx={{ mb: 8 }}>
                        <Fade in={isVisible} timeout={2000}>
                            <Typography
                                variant="h4"
                                component="h3"
                                sx={{
                                    fontWeight: 700,
                                    mb: 4,
                                    textAlign: 'center',
                                    color: 'primary.main'
                                }}
                            >
                                {translate('Highlighted Work')}
                            </Typography>
                        </Fade>

                        <Grid container spacing={4}>
                            {featuredProjects.map((project, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={featuredProjects.length === 1 ? 12 : 6}
                                    key={project.id}
                                >
                                    <Fade
                                        in={isVisible}
                                        timeout={2000 + (index * 200)}
                                    >
                                        <Box>
                                            <ProjectCard
                                                project={project}
                                                featured={true}
                                                onView={() => handleProjectView(project.id, project.title)}
                                                onLinkClick={(linkType, url) => handleProjectLink(project.id, linkType, url)}
                                                animationDelay={index * 200}
                                            />
                                        </Box>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Regular Projects Section */}
                {regularProjects.length > 0 && (
                    <Box>
                        <Fade in={isVisible} timeout={2500}>
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
                                {translate('Additional Projects')}
                            </Typography>
                        </Fade>

                        <Grid container spacing={4}>
                            {regularProjects.map((project, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={project.id}>
                                    <Fade
                                        in={isVisible}
                                        timeout={3000 + (index * 150)}
                                    >
                                        <Box>
                                            <ProjectCard
                                                project={project}
                                                featured={false}
                                                onView={() => handleProjectView(project.id, project.title)}
                                                onLinkClick={(linkType, url) => handleProjectLink(project.id, linkType, url)}
                                                animationDelay={index * 150}
                                            />
                                        </Box>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Project Stats Summary */}
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
                            {translate('Project Impact Summary')}
                        </Typography>

                        <Grid container spacing={4}>
                            {[
                                {
                                    label: translate('Total Projects'),
                                    value: `${projects.length}+`,
                                    icon: <Assignment />,
                                    description: translate('Completed projects')
                                },
                                {
                                    label: translate('Team Members'),
                                    value: '20+',
                                    icon: <Group />,
                                    description: translate('Collaborated with')
                                },
                                {
                                    label: translate('Performance Gains'),
                                    value: '40%',
                                    icon: <TrendingUp />,
                                    description: translate('Average improvement')
                                },
                                {
                                    label: translate('User Satisfaction'),
                                    value: '95%',
                                    icon: <Star />,
                                    description: translate('Average rating')
                                }
                            ].map((stat, index) => (
                                <Grid item xs={6} md={3} key={stat.label}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            p: 3,
                                            borderRadius: 2,
                                            background: alpha(theme.palette.background.paper, 0.7),
                                            transition: 'all 0.3s',
                                            animation: `${projectFloat} 4s ease-in-out infinite`,
                                            animationDelay: `${index * 0.5}s`,
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
                                            {stat.icon}
                                        </Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 800,
                                                color: 'primary.main',
                                                mb: 0.5
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 600,
                                                mb: 0.5
                                            }}
                                        >
                                            {stat.label}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary'
                                            }}
                                        >
                                            {stat.description}
                                        </Typography>
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

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;