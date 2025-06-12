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
            duration: '8+ months',
            status: 'current',
            icon: <Architecture />,
            color: theme.palette.primary.main,
            description: translate('Leading enterprise architecture and React modernization initiatives'),
            achievements: [
                translate('Spearheaded migrating legacy system to React framework (40% scalability improvement)'),
                translate('Developed cloud-based solutions reducing operational costs by 20%'),
                translate('Accelerated project timelines by 15% using Agile methodologies'),
                translate('Improved code quality and reduced post-deployment bugs by 30%')
            ],
            technologies: ['React', 'JavaScript', 'Cloud Solutions', 'Agile', 'Code Review'],
            teamSize: 6,
            impact: 'High'
        },
        {
            id: 'consulting-owner',
            category: 'entrepreneurial',
            type: 'business',
            title: translate('Owner'),
            company: 'Three Dogs and a Dude Consulting, LLC',
            location: 'Philadelphia, PA',
            period: 'Aug. 2019 – Present',
            duration: '5+ years',
            status: 'ongoing',
            icon: <Business />,
            color: theme.palette.secondary.main,
            description: translate('Managing consulting business with multiple high-profile clients'),
            achievements: [
                translate('Built successful consulting practice serving enterprise clients'),
                translate('Delivered projects across multiple industries and technologies'),
                translate('Maintained long-term client relationships and repeat business'),
                translate('Specialized in .NET, Unity, and cloud solutions')
            ],
            technologies: ['Business Development', 'Client Management', 'Project Leadership'],
            impact: 'Very High'
        },
        {
            id: 'prestasports',
            category: 'professional',
            type: 'work',
            title: translate('Senior Developer'),
            company: 'PrestaSports (Client)',
            location: 'Philadelphia, PA',
            period: 'June 2023 – April 2024',
            duration: '10 months',
            status: 'completed',
            icon: <Code />,
            color: theme.palette.success.main,
            description: translate('Cross-platform development and backend infrastructure leadership'),
            achievements: [
                translate('Improved macOS and Windows communication reliability by 40%'),
                translate('Increased server response speed by 35% and user satisfaction by 25%'),
                translate('Enhanced team productivity by 30% through Agile practices'),
                translate('Identified and resolved 50+ critical issues through code reviews')
            ],
            technologies: ['Unity', '.NET', 'Java', 'Bluetooth', 'APIs', 'Agile'],
            teamSize: 8,
            impact: 'High'
        },
        {
            id: 'fivedomains',
            category: 'professional',
            type: 'work',
            title: translate('Subject Matter Expert'),
            company: 'FiveDomains (Client)',
            location: 'Riyadh, Saudi Arabia',
            period: 'Jan. 2023 – June 2023',
            duration: '6 months',
            status: 'completed',
            icon: <Security />,
            color: theme.palette.error.main,
            description: translate('Led .NET application development for Saudi Arabian military'),
            achievements: [
                translate('Reduced time-to-market by 25% and deployment cycles by 50%'),
                translate('Increased operational efficiency by 30% with responsive frontend'),
                translate('Improved data processing time by 40% and system reliability by 35%'),
                translate('Completed project 15% ahead of schedule with zero-downtime deployments')
            ],
            technologies: ['.NET', 'Blazor', 'JavaScript', 'Node.js', 'Jenkins', 'Docker'],
            teamSize: 12,
            impact: 'Very High'
        },
        {
            id: 'sunglitch',
            category: 'professional',
            type: 'work',
            title: translate('Developer'),
            company: 'SunGlitch (Client)',
            location: 'Philadelphia, PA',
            period: 'July 2021 – Dec. 2023',
            duration: '2.5 years',
            status: 'completed',
            icon: <Psychology />,
            color: theme.palette.info.main,
            description: translate('Extended Reality (XR) educational application development'),
            achievements: [
                translate('Increased student engagement by 40% and learning outcomes by 30%'),
                translate('Reduced task completion time by 40% with process-optimization systems'),
                translate('Successfully delivered 3 high-impact XR projects'),
                translate('Coordinated cross-functional teams across art, leadership, and development')
            ],
            technologies: ['Unity', 'XR Toolkit', '.NET', 'PostgreSQL', 'Educational Technology'],
            teamSize: 15,
            impact: 'High'
        },
        {
            id: 'openpath',
            category: 'professional',
            type: 'work',
            title: translate('DevOps Engineer'),
            company: 'OpenPath Products (Client)',
            location: 'Annapolis, MD',
            period: 'Dec 2020 – July 2021',
            duration: '8 months',
            status: 'completed',
            icon: <Cloud />,
            color: theme.palette.warning.main,
            description: translate('DevOps automation and AWS infrastructure optimization'),
            achievements: [
                translate('Reduced development cycles by 50% through pipeline automation'),
                translate('Enhanced developer productivity by 25% and reduced system downtime'),
                translate('Ensured 99% uptime for critical applications'),
                translate('Resolved incidents 30% faster through proactive monitoring')
            ],
            technologies: ['Python', 'Jenkins', 'Docker', 'AWS', 'CI/CD', 'Monitoring'],
            teamSize: 4,
            impact: 'High'
        },
        {
            id: 'kline-specter',
            category: 'professional',
            type: 'work',
            title: translate('IT Technician'),
            company: 'Kline and Specter',
            location: 'Philadelphia, PA',
            period: 'Aug. 2019 – Sep. 2020',
            duration: '1 year',
            status: 'completed',
            icon: <Work />,
            color: theme.palette.grey[600],
            description: translate('IT infrastructure and cloud migration projects'),
            achievements: [
                translate('Resolved 200+ technical issues and reduced system downtime by 30%'),
                translate('Reduced support requests by 50% through comprehensive documentation'),
                translate('Boosted workflow efficiency by 40% with cloud storage solutions'),
                translate('Successfully migrated email system to Office 365')
            ],
            technologies: ['Confluence', 'Office 365', 'Cloud Storage', 'Virtualization'],
            teamSize: 3,
            impact: 'Medium'
        },
        {
            id: 'education',
            category: 'education',
            type: 'education',
            title: translate('Bachelor of Science in Computer Science'),
            company: 'Wilmington University',
            location: 'Wilmington, DE',
            period: 'Dec. 2023',
            duration: '4 years',
            status: 'completed',
            icon: <School />,
            color: theme.palette.success.main,
            description: translate('Computer Science with AI Minor - Summa Cum Laude (3.95 GPA)'),
            achievements: [
                translate('Graduated Summa Cum Laude with 3.95/4.00 GPA'),
                translate('Specialized in Artificial Intelligence and Machine Learning'),
                translate('Completed advanced coursework in algorithms and data structures'),
                translate('Studied computer vision and image analysis')
            ],
            technologies: ['AI/ML', 'Computer Vision', 'Algorithms', 'Data Structures', 'Mathematics'],
            impact: 'Foundation'
        },
        {
            id: 'military',
            category: 'leadership',
            type: 'military',
            title: translate('Team Leader'),
            company: 'US Army KS NG',
            location: 'Lawrence, KS',
            period: 'May 2012 – January 2017',
            duration: '5 years',
            status: 'completed',
            icon: <Military />,
            color: theme.palette.error.dark,
            description: translate('Military leadership and strategic planning'),
            achievements: [
                translate('Awarded Soldier of the Year for exceptional performance (2015-2016)'),
                translate('Developed and implemented strategic plans for mission objectives'),
                translate('Provided leadership and guidance to team members'),
                translate('Enhanced team performance and member development')
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
                                    variant={activeCategory === category.id ? 'filled' : 'outlined'}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        fontWeight: 600,
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
                            {translate('Career Highlights')}
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={4}
                            justifyContent="center"
                            alignItems="center"
                        >
                            {[
                                {
                                    label: translate('Years Experience'),
                                    value: '12+',
                                    description: translate('Professional & Military')
                                },
                                {
                                    label: translate('Companies Served'),
                                    value: '8+',
                                    description: translate('Enterprise & Consulting')
                                },
                                {
                                    label: translate('Team Members Led'),
                                    value: '50+',
                                    description: translate('Across Various Projects')
                                },
                                {
                                    label: translate('Performance Impact'),
                                    value: '40%',
                                    description: translate('Average Improvement')
                                }
                            ].map((stat, index) => (
                                <Box
                                    key={stat.label}
                                    sx={{
                                        textAlign: 'center',
                                        minWidth: 120
                                    }}
                                >
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
                                            fontWeight: 600,
                                            color: 'text.primary',
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
                            ))}
                        </Stack>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
});

TimelineSection.displayName = 'TimelineSection';

export default TimelineSection;