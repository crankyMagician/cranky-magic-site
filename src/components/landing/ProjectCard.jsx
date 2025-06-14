import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Box,
    Button,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Fade,
    Grow
} from '@mui/material';
import {
    GitHub,
    Language,
    Launch,
    Code,
    Visibility,
    StarBorder,
    Star,
    CalendarToday
} from '@mui/icons-material';

import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from "../../analytics/hooks/useAnalytics";
import {INTERACTION_EVENTS} from "../../analytics/constants/events";

const ProjectCard = React.memo(({ project, index = 0, onViewDetails }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { trackEvent } = useAnalytics();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageLoaded, setImageLoaded] = useState(false);
    const [starred, setStarred] = useState(false);

    // Destructure project properties with defaults
    const {
        id,
        title = '',
        description = '',
        image = 'https://via.placeholder.com/400x250',
        technologies = [],
        liveUrl = '',
        githubUrl = '',
        codeUrl = '',
        category = '',
        date = '',
        featured = false,
        metrics = {}
    } = project;

    const handleCardClick = () => {
        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'project_card',
            element_id: id || title,
            project_title: title,
            project_category: category,
            section: 'projects'
        });

        if (onViewDetails) {
            onViewDetails(project);
        }
    };

    const handleLinkClick = (event, linkType, url) => {
        event.stopPropagation();

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'project_link',
            element_id: `${linkType}_${id || title}`,
            link_type: linkType,
            project_title: title,
            section: 'projects'
        });

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleStarClick = (event) => {
        event.stopPropagation();
        setStarred(!starred);

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'star_button',
            element_id: id || title,
            action: starred ? 'unstar' : 'star',
            project_title: title,
            section: 'projects'
        });
    };

    return (
        <Grow in timeout={500 + index * 100}>
            <Card
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
                        '& .project-image': {
                            transform: 'scale(1.05)'
                        },
                        '& .project-overlay': {
                            opacity: 1
                        }
                    }
                }}
                onClick={handleCardClick}
            >
                {/* Featured badge */}
                {featured && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            zIndex: 2
                        }}
                    >
                        <Chip
                            label={translate('Featured')}
                            color="primary"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                boxShadow: 2
                            }}
                        />
                    </Box>
                )}

                {/* Star button */}
                <IconButton
                    onClick={handleStarClick}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    {starred ? (
                        <Star sx={{ color: theme.palette.warning.main }} />
                    ) : (
                        <StarBorder />
                    )}
                </IconButton>

                {/* Project image */}
                <Box sx={{ position: 'relative', paddingTop: '62.5%' }}>
                    <CardMedia
                        component="img"
                        image={image}
                        alt={title}
                        className="project-image"
                        onLoad={() => setImageLoaded(true)}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            opacity: imageLoaded ? 1 : 0
                        }}
                    />

                    {/* Overlay with quick actions */}
                    <Box
                        className="project-overlay"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    >
                        {liveUrl && (
                            <Tooltip title={translate('View Live')}>
                                <IconButton
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    onClick={(e) => handleLinkClick(e, 'live', liveUrl)}
                                >
                                    <Launch />
                                </IconButton>
                            </Tooltip>
                        )}
                        {githubUrl && (
                            <Tooltip title={translate('View Code')}>
                                <IconButton
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#333',
                                        color: theme.palette.mode === 'dark' ? '#333' : '#fff',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark' ? '#ddd' : '#555',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    onClick={(e) => handleLinkClick(e, 'github', githubUrl)}
                                >
                                    <GitHub />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Category and date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        {category && (
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    letterSpacing: 1
                                }}
                            >
                                {category}
                            </Typography>
                        )}
                        {date && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {date}
                                </Typography>
                            </Box>
                        )}
                    </Box>

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
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Description */}
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
                        {description}
                    </Typography>

                    {/* Technologies */}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                            flexWrap: 'wrap',
                            gap: 0.5,
                            mb: 2
                        }}
                    >
                        {technologies.slice(0, 4).map((tech, techIndex) => (
                            <Chip
                                key={techIndex}
                                label={tech}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.75rem',
                                    height: 'auto',
                                    py: 0.25,
                                    borderColor: theme.palette.divider,
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: `${theme.palette.primary.main}11`
                                    }
                                }}
                            />
                        ))}
                        {technologies.length > 4 && (
                            <Chip
                                label={`+${technologies.length - 4}`}
                                size="small"
                                sx={{
                                    fontSize: '0.75rem',
                                    height: 'auto',
                                    py: 0.25,
                                    backgroundColor: theme.palette.action.selected
                                }}
                            />
                        )}
                    </Stack>

                    {/* Metrics */}
                    {Object.keys(metrics).length > 0 && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                            {metrics.views && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {metrics.views}
                                    </Typography>
                                </Box>
                            )}
                            {metrics.likes && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Star sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {metrics.likes}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </CardContent>

                {/* Actions */}
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Code />}
                        sx={{
                            textTransform: 'none',
                            borderColor: theme.palette.divider,
                            color: theme.palette.text.primary,
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: `${theme.palette.primary.main}11`
                            }
                        }}
                    >
                        {translate('View Details')}
                    </Button>
                </CardActions>
            </Card>
        </Grow>
    );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;