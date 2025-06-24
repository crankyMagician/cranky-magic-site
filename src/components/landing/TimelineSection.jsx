import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Chip,
    Stack,
    Button,
    useTheme,
    useMediaQuery,
    alpha,
    Divider,
    IconButton,
    Collapse,
    Grid,
    Avatar,
    AvatarGroup,
    Tooltip,
    Paper,
} from '@mui/material';
import {
    Work,
    School,
    Code,
    EmojiEvents,
    CalendarToday,
    LocationOn,
    ExpandMore,
    ExpandLess,
    ArrowForward,
    Circle,
    CheckCircle,
    Groups,
    Rocket,
    Stars,
    TrendingUp,
    Computer,
    Architecture,
    Campaign,
    GitHub,
    LinkedIn,
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

const TimelineSection = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [expandedItem, setExpandedItem] = useState(null);
    const [showAllItems, setShowAllItems] = useState(false);

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
        animationType: 'fadeInLeft',
        baseDelay: ANIMATION_DELAY.MEDIUM,
        staggerDelay: ANIMATION_DELAY.STAGGER_BASE * 2,
        duration: ANIMATION_DURATION.NORMAL,
        triggerOnScroll: true,
    });

    // Timeline data
    const timelineData = useMemo(() => [
        {
            id: 'senior-fullstack-2023',
            date: '2023 - Present',
            title: 'Senior Full Stack Developer',
            company: 'Tech Innovation Corp',
            location: 'San Francisco, CA',
            type: 'work',
            icon: <Work />,
            color: theme.palette.primary.main,
            description: 'Leading development of cloud-native applications and mentoring junior developers',
            achievements: [
                'Architected microservices reducing system latency by 40%',
                'Led team of 5 developers on flagship product',
                'Implemented CI/CD pipeline saving 20 hours/week',
                'Mentored 3 junior developers to mid-level positions'
            ],
            technologies: ['React', 'Node.js', 'AWS', 'Kubernetes', 'GraphQL'],
            impact: {
                users: '100K+',
                performance: '+40%',
                teamSize: 5
            }
        },
        {
            id: 'fullstack-2021',
            date: '2021 - 2023',
            title: 'Full Stack Developer',
            company: 'Digital Solutions Inc',
            location: 'New York, NY',
            type: 'work',
            icon: <Code />,
            color: theme.palette.secondary.main,
            description: 'Developed and maintained enterprise web applications for Fortune 500 clients',
            achievements: [
                'Built real-time analytics dashboard used by 50K+ users',
                'Reduced application load time by 60%',
                'Integrated third-party APIs for payment processing',
                'Received "Developer of the Year" award'
            ],
            technologies: ['React', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
            impact: {
                revenue: '+$2M',
                efficiency: '+35%',
                clients: 15
            }
        },
        {
            id: 'frontend-2019',
            date: '2019 - 2021',
            title: 'Frontend Developer',
            company: 'Creative Agency',
            location: 'Los Angeles, CA',
            type: 'work',
            icon: <Computer />,
            color: theme.palette.info.main,
            description: 'Created engaging user interfaces for various client projects',
            achievements: [
                'Developed 20+ responsive websites',
                'Improved SEO scores by average of 40 points',
                'Established component library used across projects',
                'Trained team on React best practices'
            ],
            technologies: ['React', 'Vue.js', 'Sass', 'Webpack', 'Jest'],
            impact: {
                projects: 20,
                satisfaction: '95%',
                codeReuse: '70%'
            }
        },
        {
            id: 'certification-aws',
            date: '2022',
            title: 'AWS Solutions Architect',
            company: 'Amazon Web Services',
            type: 'certification',
            icon: <EmojiEvents />,
            color: theme.palette.warning.main,
            description: 'Achieved AWS Solutions Architect Associate certification',
            achievements: [
                'Mastered cloud architecture principles',
                'Designed scalable and resilient systems',
                'Implemented cost-optimization strategies',
                'Applied knowledge to production systems'
            ],
            technologies: ['AWS', 'Cloud Architecture', 'DevOps', 'Security'],
        },
        {
            id: 'degree-cs',
            date: '2015 - 2019',
            title: 'Bachelor of Computer Science',
            company: 'University of California',
            location: 'Berkeley, CA',
            type: 'education',
            icon: <School />,
            color: theme.palette.success.main,
            description: 'Graduated with honors, specialized in Software Engineering',
            achievements: [
                'Dean\'s List for 4 consecutive semesters',
                'Led university hackathon winning team',
                'Published research paper on ML applications',
                'Teaching assistant for Data Structures course'
            ],
            technologies: ['Java', 'Python', 'C++', 'Algorithms', 'ML'],
            impact: {
                gpa: '3.8',
                projects: 15,
                awards: 3
            }
        },
        {
            id: 'freelance-2018',
            date: '2018 - 2019',
            title: 'Freelance Developer',
            company: 'Self-Employed',
            type: 'work',
            icon: <Rocket />,
            color: theme.palette.primary.dark,
            description: 'Provided web development services to small businesses',
            achievements: [
                'Completed 10+ client projects on time',
                'Built e-commerce platform generating $500K revenue',
                'Maintained 5-star rating on freelance platforms',
                'Established long-term client relationships'
            ],
            technologies: ['WordPress', 'PHP', 'JavaScript', 'MySQL'],
            impact: {
                clients: 10,
                rating: '5.0',
                revenue: '$100K+'
            }
        },
    ], [theme]);

    // Filter timeline items for display
    const displayedItems = useMemo(() => {
        if (showAllItems) {
            return timelineData;
        }
        return timelineData.slice(0, CONTENT_LIMITS.MAX_TIMELINE_ITEMS);
    }, [timelineData, showAllItems]);

    // Career statistics
    const careerStats = useMemo(() => [
        {
            label: translate('Years Experience'),
            value: '6+',
            icon: <TrendingUp />,
            color: theme.palette.primary.main,
        },
        {
            label: translate('Companies'),
            value: '4',
            icon: <Work />,
            color: theme.palette.secondary.main,
        },
        {
            label: translate('Projects Delivered'),
            value: '50+',
            icon: <CheckCircle />,
            color: theme.palette.success.main,
        },
        {
            label: translate('Team Members Led'),
            value: '15+',
            icon: <Groups />,
            color: theme.palette.info.main,
        },
    ], [translate, theme]);

    // Handlers
    const handleItemExpand = useCallback((itemId) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);

        if (expandedItem !== itemId) {
            const item = timelineData.find(i => i.id === itemId);
            analytics.trackElementClick('timeline_expand', itemId, {
                section: 'timeline',
                item_title: item?.title,
                item_type: item?.type,
            });
        }
    }, [expandedItem, analytics, timelineData]);

    const handleShowMore = useCallback(() => {
        setShowAllItems(true);
        analytics.trackElementClick('timeline_show_more', 'button', {
            section: 'timeline',
            total_items: timelineData.length,
        });
    }, [analytics, timelineData.length]);

    const getItemIcon = useCallback((item) => {
        switch (item.type) {
            case 'work':
                return item.icon || <Work />;
            case 'education':
                return <School />;
            case 'certification':
                return <EmojiEvents />;
            default:
                return <Circle />;
        }
    }, []);

    const getItemTypeLabel = useCallback((type) => {
        switch (type) {
            case 'work':
                return translate('Experience');
            case 'education':
                return translate('Education');
            case 'certification':
                return translate('Certification');
            default:
                return '';
        }
    }, [translate]);

    return (
        <Box
            ref={sectionRef}
            id={PORTFOLIO_SECTIONS.TIMELINE}
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
                    top: '50%',
                    left: '-20%',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                    transform: 'translateY(-50%)',
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
                        {translate('Professional Journey')}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                        {translate('A timeline of growth, achievements, and continuous learning')}
                    </Typography>
                </Box>

                {/* Career Stats */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {careerStats.map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    backgroundColor: alpha(stat.color, 0.05),
                                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                                    transition: theme.transitions.create(['transform', 'box-shadow'], {
                                        duration: theme.transitions.duration.short,
                                    }),
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[4],
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        color: stat.color,
                                        mb: 1,
                                        '& svg': {
                                            fontSize: 32,
                                        },
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        color: stat.color,
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    {stat.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Timeline Container */}
                <Box sx={{ position: 'relative' }}>
                    {/* Timeline Line */}
                    {!isMobile && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                bottom: 0,
                                width: 2,
                                backgroundColor: theme.palette.divider,
                                transform: 'translateX(-50%)',
                                zIndex: 0,
                            }}
                        />
                    )}

                    {/* Timeline Items */}
                    <Stack spacing={4}>
                        {displayedItems.map((item, index) => (
                            <Box
                                key={item.id}
                                ref={(el) => registerItem(item.id, el)}
                                sx={{
                                    ...getItemStyles(item.id, index),
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : index % 2 === 0 ? 'row' : 'row-reverse',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                            >
                                {/* Timeline Dot */}
                                {!isMobile && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            backgroundColor: item.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            boxShadow: theme.shadows[4],
                                            zIndex: 1,
                                        }}
                                    >
                                        {getItemIcon(item)}
                                    </Box>
                                )}

                                {/* Content Card */}
                                <Box
                                    sx={{
                                        width: isMobile ? '100%' : 'calc(50% - 40px)',
                                        pr: index % 2 === 0 && !isMobile ? 4 : 0,
                                        pl: index % 2 !== 0 && !isMobile ? 4 : 0,
                                    }}
                                >
                                    <Card
                                        elevation={3}
                                        sx={{
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: theme.transitions.create(['transform', 'box-shadow'], {
                                                duration: theme.transitions.duration.short,
                                            }),
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: theme.shadows[8],
                                            },
                                            borderTop: `4px solid ${item.color}`,
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Header */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    mb: 2,
                                                }}
                                            >
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="primary"
                                                        sx={{ fontWeight: 600 }}
                                                    >
                                                        {item.company}
                                                    </Typography>
                                                    {item.location && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            <LocationOn sx={{ fontSize: 16 }} />
                                                            {item.location}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                {isMobile && (
                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            backgroundColor: alpha(item.color, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: item.color,
                                                            flexShrink: 0,
                                                            ml: 2,
                                                        }}
                                                    >
                                                        {getItemIcon(item)}
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Date and Type */}
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                                sx={{ mb: 2 }}
                                            >
                                                <Chip
                                                    icon={<CalendarToday sx={{ fontSize: 16 }} />}
                                                    label={item.date}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: alpha(item.color, 0.3),
                                                        '& .MuiChip-icon': {
                                                            color: item.color,
                                                        },
                                                    }}
                                                />
                                                <Chip
                                                    label={getItemTypeLabel(item.type)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(item.color, 0.1),
                                                        color: item.color,
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </Stack>

                                            {/* Description */}
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                paragraph
                                            >
                                                {item.description}
                                            </Typography>

                                            {/* Technologies */}
                                            {item.technologies && (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    flexWrap="wrap"
                                                    sx={{ mb: 2, gap: 0.5 }}
                                                >
                                                    {item.technologies.map((tech) => (
                                                        <Chip
                                                            key={tech}
                                                            label={tech}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: theme.palette.divider,
                                                                fontSize: '0.75rem',
                                                                height: 24,
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            )}

                                            {/* Expand/Collapse Button */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    mt: 2,
                                                }}
                                            >
                                                {item.impact && (
                                                    <Stack direction="row" spacing={2}>
                                                        {Object.entries(item.impact).slice(0, 2).map(([key, value]) => (
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
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleItemExpand(item.id)}
                                                    sx={{
                                                        transform: expandedItem === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        transition: theme.transitions.create(['transform'], {
                                                            duration: theme.transitions.duration.short,
                                                        }),
                                                    }}
                                                >
                                                    <ExpandMore />
                                                </IconButton>
                                            </Box>

                                            {/* Expanded Content */}
                                            <Collapse in={expandedItem === item.id}>
                                                <Divider sx={{ my: 2 }} />
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ mb: 2, fontWeight: 600 }}
                                                >
                                                    Key Achievements:
                                                </Typography>
                                                <Stack spacing={1}>
                                                    {item.achievements.map((achievement, idx) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <CheckCircle
                                                                sx={{
                                                                    fontSize: 18,
                                                                    color: item.color,
                                                                    mt: 0.3,
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {achievement}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                                {item.impact && Object.keys(item.impact).length > 2 && (
                                                    <>
                                                        <Divider sx={{ my: 2 }} />
                                                        <Grid container spacing={2}>
                                                            {Object.entries(item.impact).map(([key, value]) => (
                                                                <Grid item xs={4} key={key}>
                                                                    <Box sx={{ textAlign: 'center' }}>
                                                                        <Typography
                                                                            variant="h6"
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
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </>
                                                )}
                                            </Collapse>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                        ))}
                    </Stack>

                    {/* Show More Button */}
                    {!showAllItems && timelineData.length > CONTENT_LIMITS.MAX_TIMELINE_ITEMS && (
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                endIcon={<ArrowForward />}
                                onClick={handleShowMore}
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
                                View Full Timeline ({timelineData.length - CONTENT_LIMITS.MAX_TIMELINE_ITEMS} more)
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Call to Action */}
                <Box
                    sx={{
                        mt: 8,
                        p: 4,
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                    >
                        {translate("Let's Build Something Together")}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                    >
                        {translate("I'm always interested in new opportunities and exciting projects")}
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        sx={{ mt: 3 }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<LinkedIn />}
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                px: 3,
                                textTransform: 'none',
                            }}
                        >
                            Connect on LinkedIn
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<GitHub />}
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                px: 3,
                                textTransform: 'none',
                            }}
                        >
                            View GitHub
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
});

TimelineSection.displayName = 'TimelineSection';

export default TimelineSection;