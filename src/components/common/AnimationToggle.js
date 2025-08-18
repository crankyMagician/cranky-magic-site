// src/components/common/AnimationToggle.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setAnimation,
    setAnimationSpeed,
    toggleReducedMotion,
    selectCurrentAnimation,
    selectAnimationSpeed,
    selectReducedMotion,
} from '../../reducers/themeSlice';
import {
    Box,
    Card,
    CardContent,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Slider,
    Switch,
    FormControlLabel,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    Collapse,
    Alert,
    Paper,
    Grid,
    alpha,
    useTheme,
    Fade,
    Zoom,
    Grow,
} from '@mui/material';
import {
    AutoAwesome,  // Added this import
    Opacity as SimpleIcon,
    Diamond as ElegantIcon,
    ElectricBolt as DynamicIcon,
    BubbleChart as PlayfulIcon,
    Block as NoneIcon,
    Speed as SpeedIcon,
    AccessibilityNew as A11yIcon,
    PlayArrow as PlayIcon,
    RestartAlt as ResetIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import AnimationService from '../../services/AnimationService';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { getAllAnimations } from '../../themes/animations';
import { fadeInSparkle } from '../../themes/animations';

const AnimationToggle = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { translate } = useCustomTranslation();

    const currentAnimation = useSelector(selectCurrentAnimation);
    const animationSpeed = useSelector(selectAnimationSpeed);
    const reducedMotion = useSelector(selectReducedMotion);

    const [expanded, setExpanded] = useState(true);
    const [demoActive, setDemoActive] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const animations = getAllAnimations();
    const isAnimated = currentAnimation !== 'none' && !reducedMotion;

    useEffect(() => {
        // Initialize animation service on mount
        AnimationService.init();
    }, []);

    const handleAnimationChange = (event, newAnimation) => {
        if (newAnimation !== null) {
            dispatch(setAnimation(newAnimation));
            // Trigger demo animation
            setDemoActive(false);
            setTimeout(() => setDemoActive(true), 100);
            setTimeout(() => setDemoActive(false), 2000);
        }
    };

    const handleSpeedChange = (event, newValue) => {
        dispatch(setAnimationSpeed(newValue));
    };

    const handleReducedMotionToggle = (event) => {
        dispatch(toggleReducedMotion());
    };

    const handleReset = () => {
        dispatch(setAnimation('magical'));
        dispatch(setAnimationSpeed(1));
        if (reducedMotion) {
            dispatch(toggleReducedMotion());
        }
        // Trigger demo
        setDemoActive(true);
        setTimeout(() => setDemoActive(false), 2000);
    };

    const handlePlayDemo = () => {
        setDemoActive(true);
        setTimeout(() => setDemoActive(false), 3000);
    };

    const getAnimationIcon = (animationId) => {
        const icons = {
            magical: <AutoAwesome />,  // Fixed: changed from MagicalIcon
            simple: <SimpleIcon />,
            elegant: <ElegantIcon />,
            dynamic: <DynamicIcon />,
            playful: <PlayfulIcon />,
            none: <NoneIcon />,
        };
        return icons[animationId] || <AutoAwesome />;  // Fixed: using AutoAwesome
    };

    const getSpeedLabel = (value) => {
        if (value < 0.5) return translate('Very Slow');
        if (value < 0.8) return translate('Slow');
        if (value < 1.2) return translate('Normal');
        if (value < 1.8) return translate('Fast');
        return translate('Very Fast');
    };

    const getSpeedColor = (value) => {
        if (value < 0.5) return 'error';
        if (value < 0.8) return 'warning';
        if (value < 1.2) return 'primary';
        if (value < 1.8) return 'info';
        return 'success';
    };

    return (
        <Zoom in={true} timeout={500}>
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'visible',
                    background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: 'all 0.3s ease',
                    animation: demoActive && isAnimated && currentAnimation === 'magical'
                        ? `${fadeInSparkle} 1s ease-out`
                        : 'none',
                    '&:hover': {
                        boxShadow: isAnimated ? theme.shadows[8] : theme.shadows[2],
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                }}
            >
                <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoAwesome  // Fixed: using AutoAwesome
                                sx={{
                                    color: theme.palette.primary.main,
                                    animation: isAnimated ? 'spin 3s linear infinite' : 'none',
                                }}
                            />
                            <Typography variant="h6" fontWeight="bold">
                                {translate('Animation Settings')}
                            </Typography>
                            {isAnimated && (
                                <Chip
                                    label={translate('Active')}
                                    color="success"
                                    size="small"
                                    sx={{ animation: 'pulse 2s infinite' }}
                                />
                            )}
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title={translate('Play Demo')}>
                                <IconButton
                                    onClick={handlePlayDemo}
                                    color="primary"
                                    disabled={!isAnimated}
                                >
                                    <PlayIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={translate('Reset Defaults')}>
                                <IconButton onClick={handleReset} color="default">
                                    <ResetIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={translate(expanded ? 'Collapse' : 'Expand')}>
                                <IconButton onClick={() => setExpanded(!expanded)}>
                                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>

                    <Collapse in={expanded} timeout="auto">
                        <Stack spacing={3}>
                            {/* Animation Mode Selection */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
                                    {translate('Animation Style')}
                                </Typography>
                                <ToggleButtonGroup
                                    value={currentAnimation}
                                    exclusive
                                    onChange={handleAnimationChange}
                                    fullWidth
                                    size="medium"
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            py: 1.5,
                                            transition: 'all 0.3s ease',
                                            '&.Mui-selected': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                                borderColor: theme.palette.primary.main,
                                                transform: 'scale(1.05)',
                                            },
                                        },
                                    }}
                                >
                                    {animations.map((anim) => (
                                        <ToggleButton
                                            key={anim.id}
                                            value={anim.id}
                                            disabled={reducedMotion && anim.id !== 'none'}
                                        >
                                            <Stack spacing={0.5} alignItems="center">
                                                {getAnimationIcon(anim.id)}
                                                <Typography variant="caption" fontWeight="medium">
                                                    {translate(anim.name)}
                                                </Typography>
                                            </Stack>
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>

                                {/* Animation Description */}
                                <Fade in={true} key={currentAnimation}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            mt: 2,
                                            p: 1.5,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            {translate(animations.find(a => a.id === currentAnimation)?.description || '')}
                                        </Typography>
                                    </Paper>
                                </Fade>
                            </Box>

                            <Divider />

                            {/* Animation Speed Control */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <SpeedIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                    <Typography variant="subtitle2" sx={{ flex: 1 }}>
                                        {translate('Animation Speed')}
                                    </Typography>
                                    <Chip
                                        label={getSpeedLabel(animationSpeed)}
                                        color={getSpeedColor(animationSpeed)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Typography variant="caption" color="text.secondary">
                                            {translate('Slow')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Slider
                                            value={animationSpeed}
                                            onChange={handleSpeedChange}
                                            min={0.1}
                                            max={3}
                                            step={0.1}
                                            marks={[
                                                { value: 0.5, label: '0.5x' },
                                                { value: 1, label: '1x' },
                                                { value: 1.5, label: '1.5x' },
                                                { value: 2, label: '2x' },
                                                { value: 2.5, label: '2.5x' },
                                            ]}
                                            disabled={!isAnimated}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => `${value}x`}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="caption" color="text.secondary">
                                            {translate('Fast')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider />

                            {/* Accessibility Options */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <A11yIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                    <Typography variant="subtitle2">
                                        {translate('Accessibility')}
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={reducedMotion}
                                            onChange={handleReducedMotionToggle}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2">
                                                {translate('Reduce Motion')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {translate('Minimize animations for users sensitive to motion')}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>

                            {/* Info Section */}
                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                    onClick={() => setShowInfo(!showInfo)}
                                >
                                    <InfoIcon sx={{ fontSize: 18, color: theme.palette.info.main }} />
                                    <Typography variant="caption" color="info.main">
                                        {translate('Animation Tips')}
                                    </Typography>
                                </Box>
                                <Collapse in={showInfo}>
                                    <Alert severity="info" sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <Typography variant="body2">
                                                • {translate('Magical: Best for showcasing and presentations')}
                                            </Typography>
                                            <Typography variant="body2">
                                                • {translate('Simple: Clean transitions for professional use')}
                                            </Typography>
                                            <Typography variant="body2">
                                                • {translate('Dynamic: Eye-catching effects for modern apps')}
                                            </Typography>
                                            <Typography variant="body2">
                                                • {translate('None: Disable all animations for performance')}
                                            </Typography>
                                        </Stack>
                                    </Alert>
                                </Collapse>
                            </Box>
                        </Stack>
                    </Collapse>
                </CardContent>

                {/* Demo Animation Overlay */}
                {demoActive && isAnimated && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            right: -10,
                            bottom: -10,
                            pointerEvents: 'none',
                            borderRadius: 2,
                            border: `2px solid ${theme.palette.primary.main}`,
                            animation: 'pulse 1s ease-out',
                            boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
                        }}
                    />
                )}
            </Card>
        </Zoom>
    );
};

export default AnimationToggle;