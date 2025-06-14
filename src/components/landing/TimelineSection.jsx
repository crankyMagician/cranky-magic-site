import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    Fade,
    Container,
    useTheme,
    alpha,
    keyframes,
    Avatar,
    IconButton,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Divider,
    Button
} from '@mui/material';
import {
    Work,
    School,
    LocationOn,
    DateRange,
    TrendingUp,
    ExpandMore,
    ExpandLess,
    CheckCircle,
    Groups,
    Business,
    Star,
    Timeline as TimelineIcon,
    MilitaryTech as Military,
    VolunteerActivism,
    Code,
    Cloud,
    Security,
    Psychology,
    Architecture,
    Speed
} from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import TimelineCard from './TimelineCard';

// Animation keyframes
const timelineFlow = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

const pulseAnimation = keyframes`
    0%, 100% {
        transform: scale(1);
        opacity: 0.7;
    }
    50% {
        transform: scale(1.1);
        opacity: 1;
    }
`;

const TimelineSection = React.memo(({ onSectionView }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const [isVisible, setIsVisible] = useState(false);
    const [expandedItems, setExpandedItems] = useState(new Set(['current']));
    const [activeCategory, setActiveCategory] = useState('all');

    // Track section visibility
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        if (onSectionView) {
            onSectionView();
        }
        return () => clearTimeout(timer);
    }, [onSectionView]);

    // Professional timeline data based on resume
    const timelineData = [
        {
            id: 'current',
            category: 'professional',
            type: 'work',
            title: translate('Solutions Architect'),
            company: 'GoWell Benefits',
            location: 'Philadelphia, PA',
            period: 'April 2024 – Current',
            duration: '9+ months',
            status: 'current',
            icon: <Architecture />,
            color: theme.palette.primary.main,
            description: translate('Leading enterprise-wide Azure cloud infrastructure design and implementation'),
            achievements: [
                translate('Achieved 99.95% uptime for critical production systems'),
                translate('Reduced infrastructure costs by 45% through optimized cloud architecture'),
                translate('Implemented comprehensive security monitoring reducing incidents by 78%'),
                translate('Designed scalable CI/CD pipelines increasing deployment frequency by 400%')
            ],
            technologies: ['Azure', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'Bicep'],
            teamSize: 15,
            impact: 'Enterprise'
        },
        {
            id: 'prevature',
            category: 'professional',
            type: 'work',
            title: translate('Site Reliability Engineer'),
            company: 'Prevature',
            location: 'Philadelphia, PA',
            period: 'February 2023 – April 2024',
            duration: '1 year 3 months',
            icon: <Cloud />,
            color: theme.palette.secondary.main,
            description: translate('Ensured high availability and performance of cloud infrastructure'),
            achievements: [
                translate('Maintained 99.9% uptime across all production services'),
                translate('Reduced incident response time by 60% through automated monitoring'),
                translate('Implemented disaster recovery procedures with RTO < 4 hours'),
                translate('Optimized database performance improving query speed by 70%')
            ],
            technologies: ['AWS', 'Python', 'Ansible', 'Prometheus', 'Grafana', 'PostgreSQL'],
            teamSize: 8,
            impact: 'High'
        },
        {
            id: 'ziegler',
            category: 'professional',
            type: 'work',
            title: translate('QA Engineer'),
            company: 'Ziegler Aerospace',
            location: 'Birmingham, AL',
            period: 'October 2021 – October 2022',
            duration: '1 year',
            icon: <Security />,
            color: theme.palette.success.main,
            description: translate('Led quality assurance for mission-critical aerospace software'),
            achievements: [
                translate('Developed automated testing framework reducing test time by 80%'),
                translate('Achieved 95% code coverage across critical systems'),
                translate('Identified and resolved 200+ critical bugs before production'),
                translate('Implemented continuous testing in CI/CD pipeline')
            ],
            technologies: ['Selenium', 'Jest', 'Python', 'Jenkins', 'TestRail', 'JIRA'],
            teamSize: 12,
            impact: 'Critical'
        },
        {
            id: 'gowell_early',
            category: 'professional',
            type: 'work',
            title: translate('Support Specialist'),
            company: 'GoWell Benefits',
            location: 'Philadelphia, PA',
            period: 'March 2021 – October 2021',
            duration: '8 months',
            icon: <Psychology />,
            color: theme.palette.info.main,
            description: translate('Provided technical support and implemented process improvements'),
            achievements: [
                translate('Resolved 95% of tickets within SLA timeframe'),
                translate('Created knowledge base reducing repeat tickets by 40%'),
                translate('Trained 15+ new team members on support procedures'),
                translate('Implemented ticket automation saving 20 hours weekly')
            ],
            technologies: ['ServiceNow', 'SQL', 'PowerShell', 'Active Directory'],
            teamSize: 25,
            impact: 'Operational'
        },
        {
            id: 'selfemployed',
            category: 'entrepreneurial',
            type: 'work',
            title: translate('Full Stack Developer'),
            company: 'Self-Employed',
            location: 'Philadelphia, PA',
            period: 'March 2020 – March 2021',
            duration: '1 year',
            icon: <Code />,
            color: theme.palette.warning.main,
            description: translate('Built custom web applications for small businesses'),
            achievements: [
                translate('Delivered 15+ production applications on time and budget'),
                translate('Achieved 100% client satisfaction rating'),
                translate('Generated $50K+ in revenue through consulting'),
                translate('Built reusable component library accelerating development by 60%')
            ],
            technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'GraphQL', 'Next.js'],
            clients: 15,
            impact: 'Business'
        },
        {
            id: 'petsmart',
            category: 'entrepreneurial',
            type: 'work',
            title: translate('Inventory Manager'),
            company: 'PetSmart',
            location: 'Philadelphia, PA',
            period: 'June 2018 – March 2020',
            duration: '1 year 10 months',
            icon: <Business />,
            color: theme.palette.error.main,
            description: translate('Managed inventory operations and implemented efficiency improvements'),
            achievements: [
                translate('Reduced inventory shrinkage by 35% through improved processes'),
                translate('Increased inventory accuracy to 99.2%'),
                translate('Led team of 10 associates in daily operations'),
                translate('Implemented new tracking system saving $15K annually')
            ],
            technologies: ['SAP', 'Excel', 'Inventory Management', 'Data Analysis'],
            teamSize: 10,
            impact: 'Operational'
        },
        {
            id: 'airforce',
            category: 'leadership',
            type: 'military',
            title: translate('Technical Sergeant (E-6)'),
            company: 'United States Air Force',
            location: 'Shaw AFB, SC',
            period: 'March 2008 – June 2018',
            duration: '10 years 4 months',
            icon: <Military />,
            color: theme.palette.primary.dark,
            description: translate('Led technical teams in maintaining critical defense systems'),
            achievements: [
                translate('Managed $5M+ in equipment with zero loss'),
                translate('Led 20+ airmen in critical operations'),
                translate('Earned 5 Air Force Achievement Medals'),
                translate('Achieved 100% mission success rate over 10 years'),
                translate('Completed 3 overseas deployments supporting combat operations')
            ],
            technologies: ['Leadership', 'Strategic Planning', 'Team Management', 'Military Operations'],
            teamSize: 20,
            impact: 'High'
        },
        {
            id: 'volunteer',
            category: 'volunteer',
            type: 'volunteer',
            title: translate('Volunteer Instructor'),
            company: 'Cyber Dojo',
            location: 'Philadelphia, PA',
            period: 'January 2021 – Current',
            duration: '4+ years',
            status: 'ongoing',
            icon: <VolunteerActivism />,
            color: theme.palette.info.main,
            description: translate('Teaching web development and programming to children'),
            achievements: [
                translate('Developed curriculum for web development and programming education'),
                translate('Adapted teaching methods for diverse learning needs'),
                translate('Maintained safe and inclusive learning environment'),
                translate('Tracked student progress and provided regular updates to parents')
            ],
            technologies: ['Education', 'Curriculum Development', 'Web Development Teaching'],
            impact: 'Community'
        }
    ];

    // Timeline categories
    const categories = [
        { id: 'all', label: translate('All Timeline'), icon: <TimelineIcon />, count: timelineData.length },
        { id: 'professional', label: translate('Professional'), icon: <Work />, count: timelineData.filter(item => item.category === 'professional').length },
        { id: 'entrepreneurial', label: translate('Business'), icon: <Business />, count: timelineData.filter(item => item.category === 'entrepreneurial').length },
        { id: 'education', label: translate('Education'), icon: <School />, count: timelineData.filter(item => item.category === 'education').length },
        { id: 'leadership', label: translate('Leadership'), icon: <Military />, count: timelineData.filter(item => item.category === 'leadership').length },
        { id: 'volunteer', label: translate('Volunteer'), icon: <VolunteerActivism />, count: timelineData.filter(item => item.category === 'volunteer').length }
    ];

    // Analytics handlers
    const handleCategoryFilter = (categoryId) => {
        setActiveCategory(categoryId);
        analytics.trackElementClick('timeline_category_filter', categoryId, {
            section: 'timeline',
            previous_category: activeCategory
        });
    };

    const handleTimelineItemExpand = (itemId) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);

        analytics.trackElementClick('timeline_item_expand', itemId, {
            section: 'timeline',
            expanded: !expandedItems.has(itemId)
        });
    };

    const handleTimelineItemClick = (itemId, itemTitle) => {
        analytics.trackElementClick('timeline_item', itemId, {
            section: 'timeline',
            item_title: itemTitle,
            category: activeCategory
        });
    };

    // Filter timeline data
    const filteredTimeline = activeCategory === 'all'
        ? timelineData
        : timelineData.filter(item => item.category === activeCategory);

    // Sort by period (most recent first)
    const sortedTimeline = [...filteredTimeline].sort((a, b) => {
        // Current/ongoing items first
        if (a.status === 'current' || a.status === 'ongoing') return -1;
        if (b.status === 'current' || b.status === 'ongoing') return 1;

        // Then by year (extract year from period)
        const yearA = parseInt(a.period.split('–')[0].trim().split(' ').pop());
        const yearB = parseInt(b.period.split('–')[0].trim().split(' ').pop());
        return yearB - yearA;
    });

    return (
        <Box
            id="timeline-section"
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
                            {translate('Professional Timeline')}
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
                            {translate('A comprehensive journey through my professional development, from military service to enterprise solutions architecture, showcasing growth and measurable impact.')}
                        </Typography>
                    </Box>
                </Fade>

                {/* Category Filters */}
                <Fade in={isVisible} timeout={1500}>
                    <Box sx={{ mb: 6 }}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                gap: 2
                            }}
                        >
                            {categories.map(category => (
                                <Chip
                                    key={category.id}
                                    label={`${category.label} (${category.count})`}
                                    icon={category.icon}
                                    onClick={() => handleCategoryFilter(category.id)}
                                    size="medium"
                                    variant={activeCategory === category.id ? 'filled' : 'outlined'}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        borderWidth: 2,
                                        borderColor: activeCategory === category.id
                                            ? 'primary.main'
                                            : 'divider',
                                        backgroundColor: activeCategory === category.id
                                            ? 'primary.main'
                                            : 'transparent',
                                        color: activeCategory === category.id
                                            ? 'primary.contrastText'
                                            : 'text.primary',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: activeCategory === category.id
                                                ? 'primary.dark'
                                                : alpha(theme.palette.primary.main, 0.1),
                                            borderColor: 'primary.main',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Fade>

                {/* Timeline */}
                <Box sx={{ position: 'relative' }}>
                    {/* Timeline Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: '24px', md: '50%' },
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            transform: { md: 'translateX(-50%)' },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(180deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.3)} 50%, transparent 100%)`,
                                backgroundSize: '100% 200%',
                                animation: `${timelineFlow} 3s ease-in-out infinite`
                            }
                        }}
                    />

                    {/* Timeline Items */}
                    {sortedTimeline.map((item, index) => (
                        <Fade
                            key={item.id}
                            in={isVisible}
                            timeout={2000 + (index * 200)}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    mb: 4,
                                    display: 'flex',
                                    flexDirection: { xs: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                                    alignItems: 'center'
                                }}
                            >
                                {/* Timeline Dot */}
                                <Box
                                    sx={{
                                        position: { xs: 'absolute', md: 'relative' },
                                        left: { xs: '12px', md: 'auto' },
                                        transform: { xs: 'translateX(-50%)', md: 'none' },
                                        zIndex: 2,
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: item.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        boxShadow: `0 0 0 4px ${theme.palette.background.default}, 0 0 20px ${alpha(item.color, 0.4)}`,
                                        animation: item.status === 'current' || item.status === 'ongoing'
                                            ? `${pulseAnimation} 2s ease-in-out infinite`
                                            : 'none'
                                    }}
                                >
                                    {item.icon}
                                </Box>

                                {/* Timeline Card */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        ml: { xs: 4, md: index % 2 === 0 ? 3 : 0 },
                                        mr: { xs: 0, md: index % 2 === 0 ? 0 : 3 },
                                        maxWidth: { md: 'calc(50% - 24px)' }
                                    }}
                                >
                                    <TimelineCard
                                        item={item}
                                        index={index}
                                        isLeft={index % 2 !== 0}
                                        isActive={item.status === 'current' || item.status === 'ongoing'}
                                        expanded={expandedItems.has(item.id)}
                                        onExpand={() => handleTimelineItemExpand(item.id)}
                                        onClick={() => handleTimelineItemClick(item.id, item.title)}
                                        animationDelay={index * 200}
                                    />
                                </Box>
                            </Box>
                        </Fade>
                    ))}
                </Box>

                {/* Timeline Summary */}
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
                            {translate('Career Journey Summary')}
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={4}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    {timelineData.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {translate('Career Positions')}
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                    15+
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {translate('Years Experience')}
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                                    5
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {translate('Industries')}
                                </Typography>
                            </Box>
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            href="/resume"
                            sx={{
                                mt: 4,
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[8]
                                }
                            }}
                        >
                            {translate('View Full Resume')}
                        </Button>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
});

TimelineSection.displayName = 'TimelineSection';

export default TimelineSection;