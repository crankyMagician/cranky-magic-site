import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Stack,
    Fade,
    useTheme,
    alpha,
    IconButton,
    Tooltip,
    Container,
    useMediaQuery
} from '@mui/material';
import {
    Code,
    Language,
    Storage,
    Cloud,
    Palette,
    DeviceHub,
    Security,
    Speed,
    Psychology,
    TrendingUp,
    WebAsset,
    DataObject,
    Api,
    Brush,
    GitHub
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
    sectionAnimations,
} from '../../animations/portfolioAnimations';
import {
    PORTFOLIO_SECTIONS,
    ANALYTICS_EVENTS,
} from './utils/portfolioConstants';
import SkillCard from './SkillCard';

const SkillsSection = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedCategory, setSelectedCategory] = useState('all');

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

    const filterAnimation = useAnimationControl({
        animationType: 'fadeInUp',
        duration: ANIMATION_DURATION.NORMAL,
        delay: ANIMATION_DELAY.MEDIUM,
        triggerOnScroll: true,
        triggerOnce: true,
    });

    const { registerItem, getItemStyles } = useStaggerAnimation({
        animationType: 'fadeInUp',
        baseDelay: ANIMATION_DELAY.MEDIUM,
        staggerDelay: ANIMATION_DELAY.STAGGER_BASE,
        duration: ANIMATION_DURATION.NORMAL,
        triggerOnScroll: true,
    });

    // Skill categories data
    const skillCategories = useMemo(() => [
        {
            id: 'frontend',
            title: translate('Frontend Development'),
            icon: <WebAsset />,
            color: theme.palette.primary.main,
            skills: [
                { name: 'React/Next.js', level: 95, icon: <Code />, experience: '5+ years' },
                { name: 'TypeScript', level: 90, icon: <DataObject />, experience: '4+ years' },
                { name: 'Material-UI', level: 92, icon: <Palette />, experience: '4+ years' },
                { name: 'Redux/RTK', level: 88, icon: <DeviceHub />, experience: '4+ years' },
                { name: 'CSS/Sass', level: 90, icon: <Brush />, experience: '6+ years' },
                { name: 'Tailwind CSS', level: 85, icon: <Palette />, experience: '2+ years' }
            ]
        },
        {
            id: 'backend',
            title: translate('Backend Development'),
            icon: <Api />,
            color: theme.palette.secondary.main,
            skills: [
                { name: 'Node.js', level: 88, icon: <Code />, experience: '4+ years' },
                { name: 'Python', level: 85, icon: <Code />, experience: '3+ years' },
                { name: 'Express.js', level: 90, icon: <Api />, experience: '4+ years' },
                { name: 'GraphQL', level: 82, icon: <Language />, experience: '2+ years' },
                { name: 'REST APIs', level: 92, icon: <Api />, experience: '5+ years' },
                { name: 'Microservices', level: 80, icon: <DeviceHub />, experience: '2+ years' }
            ]
        },
        {
            id: 'database',
            title: translate('Database & Storage'),
            icon: <Storage />,
            color: theme.palette.success.main,
            skills: [
                { name: 'PostgreSQL', level: 88, icon: <Storage />, experience: '4+ years' },
                { name: 'MongoDB', level: 85, icon: <Storage />, experience: '3+ years' },
                { name: 'Redis', level: 82, icon: <Speed />, experience: '3+ years' },
                { name: 'Elasticsearch', level: 78, icon: <Storage />, experience: '2+ years' },
                { name: 'MySQL', level: 85, icon: <Storage />, experience: '4+ years' },
                { name: 'DynamoDB', level: 75, icon: <Cloud />, experience: '1+ years' }
            ]
        },
        {
            id: 'devops',
            title: translate('DevOps & Cloud'),
            icon: <Cloud />,
            color: theme.palette.info.main,
            skills: [
                { name: 'AWS', level: 85, icon: <Cloud />, experience: '3+ years' },
                { name: 'Docker', level: 88, icon: <DeviceHub />, experience: '4+ years' },
                { name: 'Kubernetes', level: 78, icon: <DeviceHub />, experience: '2+ years' },
                { name: 'CI/CD', level: 90, icon: <Speed />, experience: '4+ years' },
                { name: 'Terraform', level: 75, icon: <Cloud />, experience: '2+ years' },
                { name: 'GitHub Actions', level: 85, icon: <GitHub />, experience: '3+ years' }
            ]
        },
        {
            id: 'tools',
            title: translate('Tools & Technologies'),
            icon: <DeviceHub />,
            color: theme.palette.warning.main,
            skills: [
                { name: 'Git', level: 95, icon: <GitHub />, experience: '6+ years' },
                { name: 'Webpack', level: 85, icon: <DeviceHub />, experience: '4+ years' },
                { name: 'Jest/Testing', level: 88, icon: <Security />, experience: '4+ years' },
                { name: 'Agile/Scrum', level: 90, icon: <TrendingUp />, experience: '4+ years' },
                { name: 'Machine Learning', level: 75, icon: <Psychology />, experience: '2+ years' },
                { name: 'WebGL', level: 70, icon: <Brush />, experience: '1+ years' },
                { name: 'Linux/Unix', level: 80, icon: <Security />, experience: '3+ years' }
            ]
        }
    ], [translate, theme]);

    // Filter categories
    const categories = useMemo(() => [
        { id: 'all', label: translate('All Skills'), icon: <Code /> },
        { id: 'frontend', label: translate('Frontend'), icon: <WebAsset /> },
        { id: 'backend', label: translate('Backend'), icon: <Api /> },
        { id: 'database', label: translate('Database'), icon: <Storage /> },
        { id: 'devops', label: translate('DevOps'), icon: <Cloud /> },
        { id: 'tools', label: translate('Tools'), icon: <DeviceHub /> }
    ], [translate]);

    // Analytics handlers
    const handleCategoryFilter = useCallback((categoryId) => {
        setSelectedCategory(categoryId);
        analytics.trackElementClick('skill_category_filter', categoryId, {
            section: 'skills',
            previous_category: selectedCategory,
            filter_type: 'category'
        });
    }, [analytics, selectedCategory]);

    const handleSkillClick = useCallback((skillName, category) => {
        analytics.trackElementClick('skill_item', skillName, {
            section: 'skills',
            category: category,
            skill_level: skillCategories
                .find(cat => cat.id === category)
                ?.skills.find(skill => skill.name === skillName)?.level
        });
    }, [analytics, skillCategories]);

    // Filter skills based on selected category
    const filteredCategories = useMemo(() => {
        return selectedCategory === 'all'
            ? skillCategories
            : skillCategories.filter(cat => cat.id === selectedCategory);
    }, [selectedCategory, skillCategories]);

    // Summary statistics
    const skillStats = useMemo(() => [
        {
            label: translate('Total Skills'),
            value: skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)
        },
        {
            label: translate('Years Experience'),
            value: '6+'
        },
        {
            label: translate('Projects Completed'),
            value: '50+'
        },
        {
            label: translate('Technologies Mastered'),
            value: skillCategories.filter(cat =>
                cat.skills.some(skill => skill.level >= 85)
            ).length
        }
    ], [skillCategories, translate]);

    return (
        <Box
            ref={sectionRef}
            id={PORTFOLIO_SECTIONS.SKILLS}
            component="section"
            sx={{
                py: { xs: 6, md: 10 },
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden'
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
                    opacity: 0.03,
                    background: `radial-gradient(circle at 30% 20%, ${theme.palette.primary.main} 0%, transparent 40%),
                                 radial-gradient(circle at 70% 80%, ${theme.palette.secondary.main} 0%, transparent 40%)`,
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
                        {translate('Technical Skills')}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                        {translate('Building scalable applications with modern technologies')}
                    </Typography>
                </Box>

                {/* Category Filter */}
                <Box
                    ref={filterAnimation.ref}
                    sx={{
                        mb: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        ...filterAnimation.animationStyles,
                    }}
                >
                    {categories.map((category) => (
                        <Chip
                            key={category.id}
                            icon={category.icon}
                            label={category.label}
                            onClick={() => handleCategoryFilter(category.id)}
                            color={selectedCategory === category.id ? 'primary' : 'default'}
                            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                            sx={{
                                transition: theme.transitions.create(['all'], {
                                    duration: theme.transitions.duration.short,
                                }),
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4],
                                },
                            }}
                        />
                    ))}
                </Box>

                {/* Skills Grid */}
                <Grid container spacing={4}>
                    {filteredCategories.map((category, categoryIndex) => (
                        <Grid
                            item
                            xs={12}
                            key={category.id}
                            ref={(el) => registerItem(`category-${category.id}`, el)}
                            sx={getItemStyles(`category-${category.id}`, categoryIndex)}
                        >
                            <Card
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    transition: theme.transitions.create(['transform', 'box-shadow'], {
                                        duration: theme.transitions.duration.short,
                                    }),
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[8],
                                    },
                                }}
                            >
                                {/* Category Header */}
                                <Box
                                    sx={{
                                        p: 3,
                                        background: alpha(category.color, 0.1),
                                        borderBottom: `3px solid ${category.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: category.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '2rem',
                                            opacity: 0.9,
                                        }}
                                    >
                                        {category.icon}
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        }}
                                    >
                                        {category.title}
                                    </Typography>
                                </Box>

                                {/* Skills Content */}
                                <CardContent sx={{ p: 4 }}>
                                    <Grid container spacing={3}>
                                        {category.skills.map((skill, skillIndex) => (
                                            <Grid item xs={12} sm={6} md={4} key={skill.name}>
                                                <SkillCard
                                                    skill={skill}
                                                    categoryColor={category.color}
                                                    animationDelay={skillIndex * 100}
                                                    onClick={() => handleSkillClick(skill.name, category.id)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Summary Statistics */}
                <Fade in={isIntersecting} timeout={1000}>
                    <Box sx={{ mt: 8, textAlign: 'center' }}>
                        <Grid container spacing={3} justifyContent="center">
                            {skillStats.map((stat, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                            transition: theme.transitions.create(['transform'], {
                                                duration: theme.transitions.duration.short,
                                            }),
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 800,
                                                color: 'primary.main',
                                                mb: 0.5,
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {stat.label}
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

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;