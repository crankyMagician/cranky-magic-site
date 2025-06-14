import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Stack,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Grow,
    Skeleton
} from '@mui/material';
import {
    AccessTime,
    ArrowForward,
    BookmarkBorder,
    Bookmark,
    Share,
    CalendarToday
} from '@mui/icons-material';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import {INTERACTION_EVENTS} from "../../analytics/constants/events";
import useCustomTranslation from '../../hooks/useCustomTranslation';

const BlogCard = React.memo(({ post, index = 0 }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { trackEvent } = useAnalytics();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageLoaded, setImageLoaded] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    // Destructure post properties with defaults
    const {
        id,
        title = '',
        excerpt = '',
        date = '',
        readTime = '',
        tags = [],
        image = '',
        author = {},
        category = '',
        views = 0
    } = post;

    const handleCardClick = () => {
        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'blog_card',
            element_id: id || title,
            post_title: title,
            post_category: category,
            section: 'blog'
        });
    };

    const handleBookmarkClick = (event) => {
        event.stopPropagation();
        setBookmarked(!bookmarked);

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'bookmark_button',
            element_id: id || title,
            action: bookmarked ? 'unbookmark' : 'bookmark',
            post_title: title,
            section: 'blog'
        });
    };

    const handleShareClick = (event) => {
        event.stopPropagation();

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'share_button',
            element_id: id || title,
            post_title: title,
            section: 'blog'
        });

        // Share functionality
        if (navigator.share) {
            navigator.share({
                title: title,
                text: excerpt,
                url: window.location.href
            }).catch((error) => console.log('Error sharing:', error));
        }
    };

    const handleTagClick = (event, tag) => {
        event.stopPropagation();

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'blog_tag',
            element_id: tag,
            post_title: title,
            section: 'blog'
        });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Grow in timeout={500 + index * 100}>
            <Card
                onClick={handleCardClick}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.02)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                        transform: isMobile ? 'none' : 'translateY(-8px)',
                        boxShadow: theme.shadows[12],
                        borderColor: theme.palette.primary.main,
                        '& .blog-image': {
                            transform: 'scale(1.05)'
                        },
                        '& .read-more-icon': {
                            transform: 'translateX(4px)'
                        }
                    }
                }}
            >
                {/* Image */}
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                    {!imageLoaded && (
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    )}
                    <CardMedia
                        component="img"
                        image={image}
                        alt={title}
                        className="blog-image"
                        onLoad={() => setImageLoaded(true)}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            display: imageLoaded ? 'block' : 'none'
                        }}
                    />

                    {/* Category badge */}
                    {category && (
                        <Chip
                            label={category}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                backgroundColor: theme.palette.background.paper,
                                fontWeight: 600,
                                boxShadow: 2
                            }}
                        />
                    )}

                    {/* Action buttons */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 0.5
                        }}
                    >
                        <Tooltip title={bookmarked ? translate('Remove bookmark') : translate('Bookmark')}>
                            <IconButton
                                size="small"
                                onClick={handleBookmarkClick}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: 2,
                                    '&:hover': {
                                        backgroundColor: theme.palette.background.paper,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                {bookmarked ? (
                                    <Bookmark sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                                ) : (
                                    <BookmarkBorder sx={{ fontSize: 20 }} />
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={translate('Share')}>
                            <IconButton
                                size="small"
                                onClick={handleShareClick}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: 2,
                                    '&:hover': {
                                        backgroundColor: theme.palette.background.paper,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <Share sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Title */}
                    <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Excerpt */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '3.6em'
                        }}
                    >
                        {excerpt}
                    </Typography>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{
                                flexWrap: 'wrap',
                                gap: 0.5,
                                mb: 2
                            }}
                        >
                            {tags.slice(0, 3).map((tag, tagIndex) => (
                                <Chip
                                    key={tagIndex}
                                    label={tag}
                                    size="small"
                                    onClick={(e) => handleTagClick(e, tag)}
                                    sx={{
                                        fontSize: '0.75rem',
                                        height: 'auto',
                                        py: 0.25,
                                        backgroundColor: `${theme.palette.primary.main}11`,
                                        color: theme.palette.primary.main,
                                        border: `1px solid ${theme.palette.primary.main}33`,
                                        '&:hover': {
                                            backgroundColor: `${theme.palette.primary.main}22`,
                                            borderColor: theme.palette.primary.main
                                        }
                                    }}
                                />
                            ))}
                            {tags.length > 3 && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    +{tags.length - 3}
                                </Typography>
                            )}
                        </Stack>
                    )}

                    {/* Author and metadata */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 'auto'
                        }}
                    >
                        {/* Author info */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                src={author.avatar}
                                alt={author.name}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 1
                                }}
                            >
                                {author.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                    {author.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday sx={{ fontSize: 12, mr: 0.5 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(date)}
                                        </Typography>
                                    </Box>
                                    {readTime && (
                                        <>
                                            <Typography variant="caption" color="text.secondary">•</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTime sx={{ fontSize: 12, mr: 0.5 }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {readTime}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>

                {/* Actions */}
                <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        <Typography variant="body2">
                            {translate('Read More')}
                        </Typography>
                        <ArrowForward
                            className="read-more-icon"
                            sx={{
                                fontSize: 20,
                                transition: 'transform 0.3s ease'
                            }}
                        />
                    </Box>
                </CardActions>
            </Card>
        </Grow>
    );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;