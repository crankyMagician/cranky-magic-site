import React, { useState, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    useTheme,
    useMediaQuery,
    Fade,
    Chip,
    Stack
} from '@mui/material';
import { ArrowForward, LocalOffer } from '@mui/icons-material';
import BlogCard from './BlogCard';

import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from "../../analytics/hooks/useAnalytics";
import {INTERACTION_EVENTS} from "../../analytics/constants/events";

const BlogSection = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { trackEvent } = useAnalytics();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [selectedTag, setSelectedTag] = useState('all');

    // Blog posts data
    const blogPosts = useMemo(() => [
        {
            id: 1,
            title: translate('Building Scalable React Applications'),
            excerpt: translate('Learn the best practices for building large-scale React applications with Redux Toolkit and RTK Query...'),
            date: '2025-06-01',
            readTime: '8 min read',
            tags: ['React', 'Redux', 'Architecture'],
            image: 'https://via.placeholder.com/400x250',
            author: {
                name: 'CrankyMagician',
                avatar: 'https://via.placeholder.com/50'
            }
        },
        {
            id: 2,
            title: translate('Mastering Material-UI Theming'),
            excerpt: translate('Deep dive into creating custom themes and component overrides in Material-UI v5...'),
            date: '2025-05-28',
            readTime: '6 min read',
            tags: ['Material-UI', 'Design', 'React'],
            image: 'https://via.placeholder.com/400x250',
            author: {
                name: 'CrankyMagician',
                avatar: 'https://via.placeholder.com/50'
            }
        },
        {
            id: 3,
            title: translate('Advanced React Performance Optimization'),
            excerpt: translate('Techniques for optimizing React applications including memoization, code splitting, and virtualization...'),
            date: '2025-05-20',
            readTime: '10 min read',
            tags: ['React', 'Performance', 'Optimization'],
            image: 'https://via.placeholder.com/400x250',
            author: {
                name: 'CrankyMagician',
                avatar: 'https://via.placeholder.com/50'
            }
        },
        {
            id: 4,
            title: translate('Real-time Analytics Implementation'),
            excerpt: translate('How to implement comprehensive analytics tracking in React applications with custom hooks...'),
            date: '2025-05-15',
            readTime: '7 min read',
            tags: ['Analytics', 'React', 'Hooks'],
            image: 'https://via.placeholder.com/400x250',
            author: {
                name: 'CrankyMagician',
                avatar: 'https://via.placeholder.com/50'
            }
        },
        {
            id: 5,
            title: translate('Building Magic with Three.js'),
            excerpt: translate('Creating stunning 3D visualizations and animations in React using Three.js...'),
            date: '2025-05-10',
            readTime: '12 min read',
            tags: ['Three.js', 'React', 'Animation'],
            image: 'https://via.placeholder.com/400x250',
            author: {
                name: 'CrankyMagician',
                avatar: 'https://via.placeholder.com/50'
            }
        },
        {
            id: 6,
            title: translate('State Management Evolution'),
            excerpt: translate('From Redux to RTK Query: The evolution of state management in modern React applications...'),
            date: '2025-05-05',
            readTime: '9 min read',
            tags: ['Redux', 'State Management', 'React'],
            image: 'https://via.placeholder.com/400x250',
            author: {
                name: 'CrankyMagician',
                avatar: 'https://via.placeholder.com/50'
            }
        }
    ], [translate]);

    // Extract unique tags
    const allTags = useMemo(() => {
        const tags = new Set(['all']);
        blogPosts.forEach(post => {
            post.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [blogPosts]);

    // Filter posts by selected tag
    const filteredPosts = useMemo(() => {
        if (selectedTag === 'all') return blogPosts;
        return blogPosts.filter(post => post.tags.includes(selectedTag));
    }, [selectedTag, blogPosts]);

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'chip',
            element_id: `blog_tag_${tag}`,
            section: 'blog',
            tag: tag
        });
    };

    const handleViewAllClick = () => {
        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'button',
            element_id: 'view_all_posts',
            section: 'blog'
        });
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Container maxWidth="lg">
                <Fade in timeout={800}>
                    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {translate('Latest Blog Posts')}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                maxWidth: '600px',
                                mx: 'auto',
                                mb: 4,
                                fontSize: { xs: '1rem', md: '1.125rem' }
                            }}
                        >
                            {translate('Insights, tutorials, and magic from the world of web development')}
                        </Typography>

                        {/* Tag filters */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 1,
                                mb: 4
                            }}
                        >
                            {allTags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag === 'all' ? translate('All Posts') : tag}
                                    onClick={() => handleTagClick(tag)}
                                    color={selectedTag === tag ? 'primary' : 'default'}
                                    variant={selectedTag === tag ? 'filled' : 'outlined'}
                                    icon={tag === 'all' ? <LocalOffer /> : undefined}
                                    sx={{
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 2
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Fade>

                {/* Blog posts grid */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {filteredPosts.map((post, index) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Fade in timeout={800 + index * 100}>
                                <Box>
                                    <BlogCard post={post} />
                                </Box>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* View all posts button */}
                <Fade in timeout={1200}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={handleViewAllClick}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.125rem',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 30px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            {translate('View All Posts')}
                        </Button>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
});

BlogSection.displayName = 'BlogSection';

export default BlogSection;