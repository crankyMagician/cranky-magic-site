import React, { useState, useEffect } from 'react';
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
    keyframes,
    IconButton,
    Tooltip,
    Container
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
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import SkillCard from './SkillCard';

// Magical glow animation for skill progress bars
const skillGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px currentColor, 
                0 0 10px currentColor;
  }
  50% { 
    box-shadow: 0 0 10px currentColor, 
                0 0 20px currentColor, 
                0 0 30px currentColor;
  }
`;

const levitate = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

const SkillsSection = React.memo(({ onSectionView }) => {
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

    // Comprehensive skills data based on resume
    const skillCategories = [
        {
            id: 'frontend',
            title: translate('Frontend Development'),
            icon: <WebAsset />,
            color: theme.palette.primary.main,
            skills: [
                { name: 'React', level: 95, icon: <Code />, experience: '4+ years' },
                { name: 'JavaScript', level: 90, icon: <Language />, experience: '5+ years' },
                { name: 'TypeScript', level: 85, icon: <DataObject />, experience: '3+ years' },
                { name: 'HTML/CSS', level: 92, icon: <Brush />, experience: '5+ years' },
                { name: 'Material-UI', level: 88, icon: <Palette />, experience: '3+ years' },
                { name: 'Blazor', level: 80, icon: <WebAsset />, experience: '2+ years' }
            ]
        },
        {
            id: 'backend',
            title: translate('Backend Development'),
            icon: <Api />,
            color: theme.palette.secondary.main,
            skills: [
                { name: 'Node.js', level: 85, icon: <DeviceHub />, experience: '3+ years' },
                { name: 'C#/.NET', level: 90, icon: <Code />, experience: '4+ years' },
                { name: 'Python', level: 82, icon: <Psychology />, experience: '3+ years' },
                { name: 'Java', level: 75, icon: <Code />, experience: '2+ years' },
                { name: 'RESTful APIs', level: 88, icon: <Api />, experience: '4+ years' },
                { name: 'Microservices', level: 80, icon: <DeviceHub />, experience: '2+ years' }
            ]
        },
        {
            id: 'database',
            title: translate('Database & Storage'),
            icon: <Storage />,
            color: theme.palette.success.main,
            skills: [
                { name: 'MySQL', level: 85, icon: <Storage />, experience: '4+ years' },
                { name: 'MongoDB', level: 80, icon: <Storage />, experience: '3+ years' },
                { name: 'PostgreSQL', level: 82, icon: <Storage />, experience: '3+ years' },
                { name: 'SQL Server', level: 88, icon: <Storage />, experience: '4+ years' },
                { name: 'Redis', level: 70, icon: <Speed />, experience: '1+ years' }
            ]
        },
        {
            id: 'devops',
            title: translate('DevOps & Cloud'),
            icon: <Cloud />,
            color: theme.palette.warning.main,
            skills: [
                { name: 'AWS', level: 85, icon: <Cloud />, experience: '3+ years' },
                { name: 'Azure', level: 88, icon: <Cloud />, experience: '4+ years' },
                { name: 'Docker', level: 80, icon: <DeviceHub />, experience: '3+ years' },
                { name: 'Jenkins', level: 75, icon: <TrendingUp />, experience: '2+ years' },
                { name: 'Git', level: 92, icon: <GitHub />, experience: '5+ years' },
                { name: 'CI/CD', level: 85, icon: <TrendingUp />, experience: '3+ years' }
            ]
        },
        {
            id: 'tools',
            title: translate('Tools & Technologies'),
            icon: <DeviceHub />,
            color: theme.palette.info.main,
            skills: [
                { name: 'Unity', level: 85, icon: <DeviceHub />, experience: '3+ years' },
                { name: 'Agile/Scrum', level: 90, icon: <TrendingUp />, experience: '4+ years' },
                { name: 'Machine Learning', level: 75, icon: <Psychology />, experience: '2+ years' },
                { name: 'WebGL', level: 70, icon: <Brush />, experience: '1+ years' },
                { name: 'Linux/Unix', level: 80, icon: <Security />, experience: '3+ years' }
            ]
        }
    ];

    // Filter categories
    const categories = [
        { id: 'all', label: translate('All Skills'), icon: <Code /> },
        { id: 'frontend', label: translate('Frontend'), icon: <WebAsset /> },
        { id: 'backend', label: translate('Backend'), icon: <Api /> },
        { id: 'database', label: translate('Database'), icon: <Storage /> },
        { id: 'devops', label: translate('DevOps'), icon: <Cloud /> },
        { id: 'tools', label: translate('Tools'), icon: <DeviceHub /> }
    ];

    // Analytics handlers
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        analytics.trackElementClick('skill_category_filter', categoryId, {
            section: 'skills',
            previous_category: selectedCategory,
            filter_type: 'category'
        });
    };

    const handleSkillClick = (skillName, category) => {
        analytics.trackElementClick('skill_item', skillName, {
            section: 'skills',
            category: category,
            skill_level: skillCategories
                .find(cat => cat.id === category)
                ?.skills.find(skill => skill.name === skillName)?.level
        });
    };

    // Filter skills based on selected category
    const filteredCategories = selectedCategory === 'all'
        ? skillCategories
        : skillCategories.filter(cat => cat.id === selectedCategory);

    return (
        <Box
            id="skills-section"
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                position: 'relative'
            }}
        >
            {/* Section Header */}
            <Container maxWidth="lg">
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
                            {translate('Technical Skills')}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '600px',
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            {translate('A comprehensive overview of my technical expertise and proficiency levels across various technologies and frameworks.')}
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
                                justifyContent: 'center',
                                maxWidth: '100%'
                            }}
                        >
                            {categories.map((category) => (
                                <Chip
                                    key={category.id}
                                    icon={category.icon}
                                    label={category.label}
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

                {/* Skills Grid */}
                <Grid container spacing={4}>
                    {filteredCategories.map((category, categoryIndex) => (
                        <Grid item xs={12} key={category.id}>
                            <Fade
                                in={isVisible}
                                timeout={2000 + (categoryIndex * 200)}
                            >
                                <Card
                                    elevation={3}
                                    sx={{
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        background: theme.palette.mode === 'dark'
                                            ? `linear-gradient(135deg, ${alpha(category.color, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
                                            : `linear-gradient(135deg, ${alpha(category.color, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
                                        border: `1px solid ${alpha(category.color, 0.2)}`,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `${levitate} 6s ease-in-out infinite`,
                                        animationDelay: `${categoryIndex * 0.5}s`,
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 32px ${alpha(category.color, 0.2)}`,
                                            border: `1px solid ${alpha(category.color, 0.4)}`
                                        }
                                    }}
                                >
                                    {/* Category Header */}
                                    <Box
                                        sx={{
                                            background: `linear-gradient(135deg, ${category.color} 0%, ${alpha(category.color, 0.8)} 100%)`,
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
                                            {category.icon}
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '1.25rem', md: '1.5rem' }
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
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* Skills Summary */}
                <Fade in={isVisible} timeout={3000}>
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
                                mb: 2,
                                color: 'primary.main'
                            }}
                        >
                            {translate('Professional Summary')}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '800px',
                                mx: 'auto',
                                lineHeight: 1.7,
                                fontSize: '1.1rem'
                            }}
                        >
                            {translate('With over 5 years of experience in full-stack development, I specialize in creating scalable, user-friendly applications using modern technologies. My expertise spans from frontend frameworks like React to cloud platforms like AWS and Azure, enabling me to deliver comprehensive solutions that drive business success.')}
                        </Typography>

                        {/* Key Stats */}
                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            {[
                                { label: translate('Years Experience'), value: '5+', icon: <TrendingUp /> },
                                { label: translate('Technologies Mastered'), value: '25+', icon: <Code /> },
                                { label: translate('Projects Completed'), value: '50+', icon: <WebAsset /> },
                                { label: translate('Certifications'), value: '10+', icon: <Security /> }
                            ].map((stat, index) => (
                                <Grid item xs={6} md={3} key={stat.label}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            p: 2,
                                            borderRadius: 2,
                                            background: alpha(theme.palette.primary.main, 0.05),
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                background: alpha(theme.palette.primary.main, 0.1),
                                                transform: 'translateY(-4px)'
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'primary.main',
                                                fontSize: '2rem',
                                                mb: 1
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 800,
                                                color: 'primary.main',
                                                mb: 0.5
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontWeight: 600
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