import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Stack,
    IconButton,
    Collapse,
    useTheme,
    useMediaQuery,
    Fade,
    Avatar,
    Divider
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    CalendarToday,
    LocationOn,
    Work,
    School,
    EmojiEvents,
    Code,
    Circle
} from '@mui/icons-material';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { INTERACTION_EVENTS } from "../../analytics/constants/events";
import useCustomTranslation from '../../hooks/useCustomTranslation';

const TimelineCard = React.memo(({
                                     item, // Changed from 'event' to 'item' to match what's being passed
                                     index = 0,
                                     isLeft = false,
                                     isActive = false,
                                     expanded = false,
                                     onExpand,
                                     onClick,
                                     animationDelay = 0
                                 }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { trackEvent } = useAnalytics();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [internalExpanded, setInternalExpanded] = useState(expanded);

    // Use the expanded prop if provided, otherwise use internal state
    const isExpanded = onExpand ? expanded : internalExpanded;

    // Destructure item properties with defaults
    const {
        id,
        title = '',
        organization = '',
        company = '', // Added company as it's used in timelineData
        location = '',
        date = '',
        period = '', // Added period as it's used in timelineData
        endDate = '',
        type = 'work',
        description = '',
        highlights = [],
        achievements = [], // Added achievements as it's used in timelineData
        technologies = [],
        icon,
        color = theme.palette.primary.main,
        image
    } = item || {}; // Added null check for item

    // Get icon based on type
    const getTypeIcon = () => {
        if (icon) return icon;
        switch (type) {
            case 'work':
                return <Work />;
            case 'education':
                return <School />;
            case 'achievement':
                return <EmojiEvents />;
            case 'project':
                return <Code />;
            default:
                return <Work />;
        }
    };

    const handleExpandClick = (e) => {
        e.stopPropagation();

        if (onExpand) {
            onExpand();
        } else {
            setInternalExpanded(!internalExpanded);
        }

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'timeline_expand',
            element_id: id || title,
            action: isExpanded ? 'collapse' : 'expand',
            event_title: title,
            section: 'timeline'
        });
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'timeline_card',
            element_id: id || title,
            event_title: title,
            event_type: type,
            section: 'timeline'
        });
    };

    // Format date range - use period if available, otherwise construct from date/endDate
    const formatDateRange = () => {
        if (period) {
            return period;
        }
        if (endDate) {
            return `${date} - ${endDate}`;
        }
        return date;
    };

    // Use highlights or achievements (since timelineData uses achievements)
    const displayHighlights = highlights.length > 0 ? highlights : achievements;

    return (
        <Fade in timeout={500 + animationDelay}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'center' : isLeft ? 'flex-end' : 'flex-start',
                    width: '100%',
                    mb: 4,
                    position: 'relative'
                }}
            >
                {/* Timeline line and dot (desktop only) */}
                {!isMobile && (
                    <>
                        {/* Vertical line */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 2,
                                height: '100%',
                                backgroundColor: theme.palette.divider,
                                zIndex: 0
                            }}
                        />

                        {/* Timeline dot */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: isActive ? color : theme.palette.background.paper,
                                border: `3px solid ${color}`,
                                boxShadow: `0 0 0 4px ${theme.palette.background.default}`,
                                zIndex: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isActive && (
                                <Circle
                                    sx={{
                                        fontSize: 8,
                                        color: theme.palette.background.paper
                                    }}
                                />
                            )}
                        </Box>
                    </>
                )}

                {/* Card */}
                <Card
                    onClick={handleCardClick}
                    sx={{
                        width: isMobile ? '100%' : '45%',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                        backdropFilter: 'blur(10px)',
                        ...(isActive && {
                            borderColor: color,
                            boxShadow: `0 0 20px ${color}33`
                        }),
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                            borderColor: color
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${color} 0%, ${theme.palette.primary.light} 100%)`,
                            opacity: isActive ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }
                    }}
                >
                    <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            {/* Icon or Image */}
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: `${color}22`,
                                    color: color,
                                    mr: 2
                                }}
                                src={image}
                            >
                                {!image && getTypeIcon()}
                            </Avatar>

                            {/* Title and Organization */}
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 0.5,
                                        color: isActive ? color : 'text.primary'
                                    }}
                                >
                                    {title}
                                </Typography>
                                {(organization || company) && (
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500
                                        }}
                                    >
                                        {organization || company}
                                    </Typography>
                                )}
                            </Box>

                            {/* Expand button */}
                            {(displayHighlights.length > 0 || description) && (
                                <IconButton
                                    onClick={handleExpandClick}
                                    size="small"
                                    aria-label={isExpanded ? 'collapse' : 'expand'}
                                    sx={{
                                        ml: 1,
                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.3s'
                                    }}
                                >
                                    <ExpandMore />
                                </IconButton>
                            )}
                        </Box>

                        {/* Date and Location */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 0.5, sm: 2 }}
                            sx={{ mb: 2 }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatDateRange()}
                                </Typography>
                            </Box>
                            {location && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {location}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>

                        {/* Technologies */}
                        {technologies.length > 0 && (
                            <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                    mb: 2
                                }}
                            >
                                {technologies.slice(0, isExpanded ? technologies.length : 3).map((tech, techIndex) => (
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
                                                borderColor: color,
                                                backgroundColor: `${color}11`
                                            }
                                        }}
                                    />
                                ))}
                                {!isExpanded && technologies.length > 3 && (
                                    <Chip
                                        label={`+${technologies.length - 3}`}
                                        size="small"
                                        sx={{
                                            fontSize: '0.75rem',
                                            height: 'auto',
                                            py: 0.25,
                                            backgroundColor: `${color}22`,
                                            color: color,
                                            borderColor: color
                                        }}
                                    />
                                )}
                            </Stack>
                        )}

                        {/* Expandable content */}
                        <Collapse in={isExpanded} timeout="auto">
                            <Divider sx={{ my: 2 }} />

                            {/* Description */}
                            {description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: displayHighlights.length > 0 ? 2 : 0 }}
                                >
                                    {description}
                                </Typography>
                            )}

                            {/* Highlights/Achievements */}
                            {displayHighlights.length > 0 && (
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ mb: 1, fontWeight: 600 }}
                                    >
                                        {translate('Key Highlights')}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {displayHighlights.map((highlight, highlightIndex) => (
                                            <Box
                                                key={highlightIndex}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start'
                                                }}
                                            >
                                                <Circle
                                                    sx={{
                                                        fontSize: 6,
                                                        mr: 1,
                                                        mt: 0.5,
                                                        color: color
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {highlight}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Collapse>
                    </CardContent>
                </Card>
            </Box>
        </Fade>
    );
});

TimelineCard.displayName = 'TimelineCard';

export default TimelineCard;