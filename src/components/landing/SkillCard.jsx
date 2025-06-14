import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    useTheme,
    useMediaQuery,
    Chip,
    Stack,
    Grow,
    Fade
} from '@mui/material';

import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from "../../analytics/hooks/useAnalytics";
import {INTERACTION_EVENTS} from "../../analytics/constants/events";

const SkillCard = React.memo(({ skill, index = 0, onClick }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { trackEvent } = useAnalytics();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [hovered, setHovered] = useState(false);

    // Destructure skill properties with defaults
    const {
        name = '',
        level = 0,
        category = '',
        icon = null,
        color = theme.palette.primary.main,
        tags = [],
        experience = '',
        description = ''
    } = skill;

    // Calculate proficiency label
    const proficiencyLabel = useMemo(() => {
        if (level >= 90) return translate('Expert');
        if (level >= 75) return translate('Advanced');
        if (level >= 60) return translate('Proficient');
        if (level >= 40) return translate('Intermediate');
        return translate('Beginner');
    }, [level, translate]);

    // Get gradient colors based on proficiency
    const gradientColors = useMemo(() => {
        const baseColor = color || theme.palette.primary.main;
        if (level >= 90) return [baseColor, theme.palette.success.main];
        if (level >= 75) return [baseColor, theme.palette.info.main];
        return [baseColor, theme.palette.primary.light];
    }, [level, color, theme]);

    const handleClick = () => {
        if (onClick) {
            onClick(skill);
        }

        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'skill_card',
            element_id: name,
            skill_name: name,
            skill_level: level,
            skill_category: category,
            section: 'skills'
        });
    };

    const handleMouseEnter = () => {
        setHovered(true);
        trackEvent(INTERACTION_EVENTS.HOVER, {
            element_type: 'skill_card',
            element_id: name,
            section: 'skills'
        });
    };

    return (
        <Grow in timeout={300 + index * 100}>
            <Card
                sx={{
                    height: '100%',
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.02)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: isMobile ? 'none' : 'translateY(-8px) scale(1.02)',
                        boxShadow: theme.shadows[8],
                        borderColor: color || theme.palette.primary.main,
                        '& .skill-progress': {
                            transform: 'scaleX(1.1)'
                        }
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
                        opacity: hovered ? 1 : 0.7,
                        transition: 'opacity 0.3s ease'
                    }
                }}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setHovered(false)}
            >
                <CardContent>
                    {/* Header with icon and title */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        {icon && (
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: `${color}22` || `${theme.palette.primary.main}22`,
                                    color: color || theme.palette.primary.main,
                                    mr: 2,
                                    flexShrink: 0,
                                    transition: 'all 0.3s ease',
                                    ...(hovered && {
                                        transform: 'rotate(10deg) scale(1.1)',
                                        backgroundColor: `${color}33` || `${theme.palette.primary.main}33`
                                    })
                                }}
                            >
                                {typeof icon === 'string' ? (
                                    <Typography variant="h5">{icon}</Typography>
                                ) : (
                                    React.cloneElement(icon, { sx: { fontSize: 28 } })
                                )}
                            </Box>
                        )}

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                    fontWeight: 600,
                                    mb: 0.5,
                                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                                }}
                            >
                                {name}
                            </Typography>

                            {category && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                                >
                                    {category}
                                </Typography>
                            )}
                        </Box>

                        {/* Proficiency badge */}
                        <Chip
                            label={proficiencyLabel}
                            size="small"
                            sx={{
                                backgroundColor: `${color}22` || `${theme.palette.primary.main}22`,
                                color: color || theme.palette.primary.main,
                                fontWeight: 600,
                                borderRadius: 1
                            }}
                        />
                    </Box>

                    {/* Description */}
                    {description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, minHeight: '2.5em' }}
                        >
                            {description}
                        </Typography>
                    )}

                    {/* Progress bar */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {translate('Proficiency')}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {level}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={level}
                            className="skill-progress"
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: `linear-gradient(90deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`
                                }
                            }}
                        />
                    </Box>

                    {/* Experience info */}
                    {experience && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mb: 2 }}
                        >
                            {experience}
                        </Typography>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <Fade in={hovered} timeout={300}>
                            <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                    mt: 'auto'
                                }}
                            >
                                {tags.map((tag, tagIndex) => (
                                    <Chip
                                        key={tagIndex}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontSize: '0.75rem',
                                            height: 'auto',
                                            py: 0.25,
                                            borderColor: theme.palette.divider,
                                            color: theme.palette.text.secondary,
                                            '&:hover': {
                                                borderColor: color || theme.palette.primary.main,
                                                color: color || theme.palette.primary.main
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Fade>
                    )}
                </CardContent>
            </Card>
        </Grow>
    );
});

SkillCard.displayName = 'SkillCard';

export default SkillCard;