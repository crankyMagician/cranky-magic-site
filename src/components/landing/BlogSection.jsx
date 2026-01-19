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
    Container,
    useTheme,
    useMediaQuery,
    alpha,
    Skeleton,
    Avatar,
    IconButton,
    Tooltip,
    Paper,
    Divider,
} from '@mui/material';
import {
    CalendarToday,
    AccessTime,
    Person,
    LocalOffer,
    ArrowForward,
    BookmarkBorder,
    BookmarkAdded,
    Share,
    TrendingUp,
    Article,
    Code,
    Lightbulb,
    Build,
    Psychology,
    Security,
    Cloud,
    Speed,
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
    EXTERNAL_LINKS,
} from './utils/portfolioConstants';
import TechIcon from '../common/TechIcon';
import { hasTechIcon } from '../../utils/techIconMapping';

const BlogSection = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
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
        animationType: 'fadeInUp',
        baseDelay: ANIMATION_DELAY.MEDIUM,
        staggerDelay: ANIMATION_DELAY.STAGGER_BASE * 1.5,
        duration: ANIMATION_DURATION.NORMAL,
        triggerOnScroll: true,
    });

    // Blog posts data
    const blogPosts = useMemo(() => [
        {
            id: 'react-performance-2024',
            title: 'Optimizing React Performance: A Deep Dive',
            excerpt: 'Learn advanced techniques for optimizing React applications, including memoization, code splitting, and virtual scrolling implementation.',
            content: 'Performance optimization is crucial for modern React applications. This guide covers React.memo, useMemo, useCallback, and advanced patterns for maximum efficiency...',
            author: {
                name: 'John Doe',
                avatar: '/assets/images/avatar.jpg',
                role: 'Senior Developer'
            },
            date: '2024-01-15',
            readTime: 12,
            category: 'react',
            tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
            image: '/assets/images/blog/react-performance.jpg',
            featured: true,
            views: 5420,
            likes: 342,
        },
        {
            id: 'microservices-architecture',
            title: 'Building Scalable Microservices with Node.js',
            excerpt: 'A comprehensive guide to designing and implementing microservices architecture using Node.js, Docker, and Kubernetes.',
            content: 'Microservices architecture has become the go-to solution for building scalable applications. This article explores best practices, common patterns, and real-world implementations...',
            author: {
                name: 'John Doe',
                avatar: '/assets/images/avatar.jpg',
                role: 'Senior Developer'
            },
            date: '2024-01-10',
            readTime: 15,
            category: 'architecture',
            tags: ['Node.js', 'Microservices', 'Docker', 'Kubernetes'],
            image: '/assets/images/blog/microservices.jpg',
            featured: true,
            views: 4200,
            likes: 286,
        },
        {
            id: 'ai-web-development',
            title: 'Integrating AI into Web Applications',
            excerpt: 'Explore practical ways to integrate artificial intelligence and machine learning capabilities into modern web applications.',
            content: 'AI integration in web applications is no longer science fiction. From chatbots to recommendation systems, learn how to leverage AI APIs and frameworks...',
            author: {
                name: 'John Doe',
                avatar: '/assets/images/avatar.jpg',
                role: 'Senior Developer'
            },
            date: '2024-01-05',
            readTime: 10,
            category: 'ai',
            tags: ['AI', 'Machine Learning', 'TensorFlow', 'Web Development'],
            image: '/assets/images/blog/ai-integration.jpg',
            featured: false,
            views: 3800,
            likes: 215,
        },
        {
            id: 'aws-best-practices',
            title: 'AWS Best Practices for Modern Applications',
            excerpt: 'Master AWS services and learn best practices for building secure, scalable, and cost-effective cloud applications.',
            content: 'Amazon Web Services offers a vast array of services for modern applications. This guide covers EC2, S3, Lambda, RDS, and more with practical examples...',
            author: {
                name: 'John Doe',
                avatar: '/assets/images/avatar.jpg',
                role: 'Senior Developer'
            },
            date: '2023-12-28',
            readTime: 18,
            category: 'cloud',
            tags: ['AWS', 'Cloud', 'DevOps', 'Infrastructure'],
            image: '/assets/images/blog/aws-practices.jpg',
            featured: false,
            views: 3200,
            likes: 178,
        },
        {
            id: 'secure-authentication',
            title: 'Implementing Secure Authentication in 2024',
            excerpt: 'A complete guide to implementing secure authentication systems with JWT, OAuth 2.0, and modern security practices.',
            content: 'Security is paramount in modern web applications. Learn how to implement robust authentication systems using industry-standard protocols and best practices...',
            author: {
                name: 'John Doe',
                avatar: '/assets/images/avatar.jpg',
                role: 'Senior Developer'
            },
            date: '2023-12-20',
            readTime: 14,
            category: 'security',
            tags: ['Security', 'Authentication', 'JWT', 'OAuth'],
            image: '/assets/images/blog/authentication.jpg',
            featured: false,
            views: 2900,
            likes: 156,
        },
        {
            id: 'graphql-rest-comparison',
            title: 'GraphQL vs REST: Making the Right Choice',
            excerpt: 'An in-depth comparison of GraphQL and REST APIs, helping you choose the right approach for your next project.',
            content: 'The debate between GraphQL and REST continues. This article provides a balanced comparison, use cases, and migration strategies...',
            author: {
                name: 'John Doe',
                avatar: '/assets/images/avatar.jpg',
                role: 'Senior Developer'
            },
            date: '2023-12-15',
            readTime: 11,
            category: 'api',
            tags: ['GraphQL', 'REST', 'API Design', 'Backend'],
            image: '/assets/images/blog/graphql-rest.jpg',
            featured: false,
            views: 2600,
            likes: 142,
        },
    ], []);

    // Blog categories
    const categories = useMemo(() => [
        { id: 'all', label: translate('All Posts'), icon: <Article />, count: blogPosts.length },
        { id: 'react', label: translate('React'), icon: <Code />, count: blogPosts.filter(p => p.category === 'react').length },
        { id: 'architecture', label: translate('Architecture'), icon: <Build />, count: blogPosts.filter(p => p.category === 'architecture').length },
        { id: 'ai', label: translate('AI/ML'), icon: <Psychology />, count: blogPosts.filter(p => p.category === 'ai').length },
        { id: 'cloud', label: translate('Cloud'), icon: <Cloud />, count: blogPosts.filter(p => p.category === 'cloud').length },
        { id: 'security', label: translate('Security'), icon: <Security />, count: blogPosts.filter(p => p.category === 'security').length },
        { id: 'api', label: translate('API'), icon: <Speed />, count: blogPosts.filter(p => p.category === 'api').length },
    ], [blogPosts, translate]);

    // Filter posts
    const filteredPosts = useMemo(() => {
        if (selectedCategory === 'all') {
            return blogPosts;
        }
        return blogPosts.filter(post => post.category === selectedCategory);
    }, [selectedCategory, blogPosts]);

    // Display limited posts
    const displayedPosts = useMemo(() => {
        return filteredPosts.slice(0, CONTENT_LIMITS.MAX_BLOG_POSTS_DISPLAY);
    }, [filteredPosts]);

    // Popular tags
    const popularTags = useMemo(() => {
        const tagCounts = {};
        blogPosts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));
    }, [blogPosts]);

    // Handlers
    const handleCategoryChange = useCallback((categoryId) => {
        setSelectedCategory(categoryId);
        analytics.trackElementClick('blog_category_filter', categoryId, {
            section: 'blog',
            previous_category: selectedCategory,
        });
    }, [analytics, selectedCategory]);

    const handlePostClick = useCallback((post) => {
        analytics.trackElementClick('blog_post_click', post.id, {
            section: 'blog',
            post_title: post.title,
            category: post.category,
        });
    }, [analytics]);

    const handleBookmark = useCallback((e, postId) => {
        e.stopPropagation();
        const newBookmarks = new Set(bookmarkedPosts);

        if (newBookmarks.has(postId)) {
            newBookmarks.delete(postId);
        } else {
            newBookmarks.add(postId);
        }

        setBookmarkedPosts(newBookmarks);

        analytics.trackElementClick('blog_bookmark', postId, {
            section: 'blog',
            action: newBookmarks.has(postId) ? 'bookmark' : 'unbookmark',
        });
    }, [bookmarkedPosts, analytics]);

    const handleShare = useCallback((e, post) => {
        e.stopPropagation();

        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: `${window.location.origin}/blog/${post.id}`,
            }).catch(() => {});
        }

        analytics.trackElementClick('blog_share', post.id, {
            section: 'blog',
            post_title: post.title,
        });
    }, [analytics]);

    const handleImageLoad = useCallback((postId) => {
        setImageLoadingStates(prev => ({ ...prev, [postId]: 'loaded' }));
    }, []);

    const handleImageError = useCallback((postId) => {
        setImageLoadingStates(prev => ({ ...prev, [postId]: 'error' }));
    }, []);

    const formatDate = useCallback((dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, []);

    const getCategoryIcon = useCallback((categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.icon || <Article />;
    }, [categories]);

    return (
        <Box
            ref={sectionRef}
            id={PORTFOLIO_SECTIONS.BLOG}
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
                    right: '-15%',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 60%)`,
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
                        {translate('Blog & Insights')}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                        {translate('Sharing knowledge and experiences in web development')}
                    </Typography>
                </Box>

                {/* Category Filter */}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        mb: 6,
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
                            icon={category.icon}
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

                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid item xs={12} lg={9}>
                        <Grid container spacing={3}>
                            {displayedPosts.map((post, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={index === 0 && post.featured ? 12 : 6}
                                    key={post.id}
                                    ref={(el) => registerItem(post.id, el)}
                                    sx={getItemStyles(post.id, index)}
                                >
                                    <Card
                                        elevation={3}
                                        onClick={() => handlePostClick(post)}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: index === 0 && post.featured && !isMobile ? 'row' : 'column',
                                            cursor: 'pointer',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: theme.transitions.create(['transform', 'box-shadow'], {
                                                duration: theme.transitions.duration.short,
                                            }),
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: theme.shadows[8],
                                                '& .post-image': {
                                                    transform: 'scale(1.05)',
                                                },
                                            },
                                        }}
                                    >
                                        {/* Post Image */}
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: index === 0 && post.featured && !isMobile ? '50%' : '100%',
                                                paddingTop: index === 0 && post.featured && !isMobile ? 0 : '56.25%',
                                                height: index === 0 && post.featured && !isMobile ? 'auto' : undefined,
                                                overflow: 'hidden',
                                                backgroundColor: theme.palette.action.hover,
                                            }}
                                        >
                                            {imageLoadingStates[post.id] !== 'loaded' && (
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
                                                className="post-image"
                                                src={post.image}
                                                alt={post.title}
                                                onLoad={() => handleImageLoad(post.id)}
                                                onError={() => handleImageError(post.id)}
                                                sx={{
                                                    position: index === 0 && post.featured && !isMobile ? 'relative' : 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: theme.transitions.create(['transform'], {
                                                        duration: theme.transitions.duration.standard,
                                                    }),
                                                    display: imageLoadingStates[post.id] === 'error' ? 'none' : 'block',
                                                }}
                                            />
                                            {post.featured && (
                                                <Chip
                                                    icon={<TrendingUp />}
                                                    label="Featured"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 16,
                                                        left: 16,
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.9),
                                                        color: 'white',
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Post Content */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                flexGrow: 1,
                                                width: index === 0 && post.featured && !isMobile ? '50%' : '100%',
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                {/* Category & Date */}
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Chip
                                                        icon={getCategoryIcon(post.category)}
                                                        label={categories.find(c => c.id === post.category)?.label}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <CalendarToday sx={{ fontSize: 14 }} />
                                                        {formatDate(post.date)}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <AccessTime sx={{ fontSize: 14 }} />
                                                        {post.readTime} min read
                                                    </Typography>
                                                </Stack>

                                                {/* Title */}
                                                <Typography
                                                    variant={index === 0 && post.featured ? 'h4' : 'h6'}
                                                    component="h3"
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 700,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {post.title}
                                                </Typography>

                                                {/* Excerpt */}
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    paragraph
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: index === 0 && post.featured ? 4 : 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        mb: 2,
                                                    }}
                                                >
                                                    {post.excerpt}
                                                </Typography>

                                                {/* Author */}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <Avatar
                                                        src={post.author.avatar}
                                                        alt={post.author.name}
                                                        sx={{ width: 32, height: 32 }}
                                                    >
                                                        <Person />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 600 }}
                                                        >
                                                            {post.author.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {post.author.role}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Tags */}
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    flexWrap="wrap"
                                                    sx={{ gap: 0.5 }}
                                                >
                                                    {post.tags.slice(0, 3).map((tag) => (
                                                        <Chip
                                                            key={tag}
                                                            icon={hasTechIcon(tag) ? <TechIcon tech={tag} size={12} showTooltip={false} /> : undefined}
                                                            label={tag}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: '0.75rem',
                                                                borderColor: theme.palette.divider,
                                                                '& .MuiChip-icon': {
                                                                    marginLeft: '6px',
                                                                },
                                                            }}
                                                        />
                                                    ))}
                                                    {post.tags.length > 3 && (
                                                        <Chip
                                                            label={`+${post.tags.length - 3}`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: '0.75rem',
                                                                borderColor: theme.palette.divider,
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            </CardContent>

                                            {/* Actions */}
                                            <CardActions
                                                sx={{
                                                    px: 3,
                                                    py: 2,
                                                    borderTop: `1px solid ${theme.palette.divider}`,
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    sx={{
                                                        width: '100%',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {post.views.toLocaleString()} views
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {post.likes} likes
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Bookmark">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => handleBookmark(e, post.id)}
                                                                sx={{
                                                                    color: bookmarkedPosts.has(post.id)
                                                                        ? theme.palette.primary.main
                                                                        : theme.palette.text.secondary,
                                                                }}
                                                            >
                                                                {bookmarkedPosts.has(post.id) ? <BookmarkAdded /> : <BookmarkBorder />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Share">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => handleShare(e, post)}
                                                            >
                                                                <Share />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            </CardActions>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* View All Button */}
                        {filteredPosts.length > CONTENT_LIMITS.MAX_BLOG_POSTS_DISPLAY && (
                            <Box sx={{ textAlign: 'center', mt: 6 }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    onClick={() => {
                                        analytics.trackElementClick('view_all_posts', 'button', {
                                            section: 'blog',
                                            total_posts: filteredPosts.length,
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
                                    View All Posts ({filteredPosts.length})
                                </Button>
                            </Box>
                        )}
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} lg={3}>
                        <Box sx={{ position: 'sticky', top: 100 }}>
                            {/* Popular Tags */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ fontWeight: 700 }}
                                >
                                    {translate('Popular Tags')}
                                </Typography>
                                <Stack spacing={1}>
                                    {popularTags.map(({ tag, count }) => (
                                        <Box
                                            key={tag}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                py: 0.5,
                                            }}
                                        >
                                            <Chip
                                                icon={hasTechIcon(tag) ? <TechIcon tech={tag} size={14} showTooltip={false} /> : <LocalOffer sx={{ fontSize: 16 }} />}
                                                label={tag}
                                                size="small"
                                                variant="outlined"
                                                clickable
                                                sx={{
                                                    borderColor: theme.palette.divider,
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                    },
                                                    '& .MuiChip-icon': {
                                                        marginLeft: '6px',
                                                    },
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {count} posts
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>

                            {/* Newsletter Signup */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ fontWeight: 700 }}
                                >
                                    {translate('Stay Updated')}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    paragraph
                                >
                                    {translate('Get the latest articles and insights delivered to your inbox')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        textTransform: 'none',
                                        py: 1.5,
                                    }}
                                >
                                    Subscribe to Newsletter
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
});

BlogSection.displayName = 'BlogSection';

export default BlogSection;