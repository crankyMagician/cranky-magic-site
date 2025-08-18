// src/pages/Example.js
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    Typography,
    Button,
    Box,
    Grid,
    Paper,
    Divider,
    Chip,
    Stack,
    LinearProgress,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
    IconButton,
    Fab,
    Tooltip,
    Zoom,
    Fade,
    Grow,
    Slide,
    Collapse,
    ToggleButtonGroup,
    ToggleButton,
    Tab,
    Tabs,
    Avatar,
    Badge,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemIcon,
    alpha,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slider,
    Rating,
    Skeleton,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Backdrop,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';

// Import all toggle components
import ThemeToggle from "../components/demoComponents/ThemeToggle";
import OverrideStyleToggle from "../components/common/OverrideStyleToggle";
import LanguageSwitcher from "../components/demoComponents/LanguageSwitcher";
import PreferenceSelector from "../components/demoComponents/PreferenceSelector";
import TypographyToggle from "../components/demoComponents/TypographyToggle";
import ComponentOverrideToggle from "../components/common/ComponentOverrideToggle";
import AnimationToggle from "../components/common/AnimationToggle";

// Import icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import AnimationIcon from '@mui/icons-material/Animation';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import SpeedIcon from '@mui/icons-material/Speed';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import WavesIcon from '@mui/icons-material/Waves';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import LensBlurIcon from '@mui/icons-material/LensBlur';
import TuneIcon from '@mui/icons-material/Tune';
import PrintIcon from '@mui/icons-material/Print';
import FileCopyIcon from '@mui/icons-material/FileCopy';

// Import hooks and utilities
import useCustomTranslation from "../hooks/useCustomTranslation";
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/material/styles';

// Import animation classes and utilities
import { magicalAnimationClasses } from '../themes/animations/magicalAnimations';
import { getAllThemes } from '../themes/themeRegistry';
import { getAllComponentOverrides } from '../themes/muicomponents';
import { getAllTypographies } from '../themes/typography';
import { getAllAnimations, fadeInSparkle } from '../themes/animations';
import AnimationService from '../services/AnimationService';
import ThemeService from '../services/ThemeService';

// Define animation keyframes for demos
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
`;

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
  50% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.8), 0 0 40px rgba(147, 51, 234, 0.6); }
`;

const Example = () => {
    const { translate } = useCustomTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    // Redux state
    const currentThemeName = useSelector(state => state.theme.mode);
    const currentComponentOverride = useSelector(state => state.theme.componentOverride);
    const currentTypography = useSelector(state => state.theme.typography);
    const currentAnimation = useSelector(state => state.theme.animation);
    const animationSpeed = useSelector(state => state.theme.animationSpeed);
    const reducedMotion = useSelector(state => state.theme.reducedMotion);

    // State for interactive demos
    const [tabValue, setTabValue] = useState(0);
    const [switchChecked, setSwitchChecked] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [animationDemo, setAnimationDemo] = useState('sparkle');
    const [textFieldValue, setTextFieldValue] = useState('');
    const [showAlert, setShowAlert] = useState(true);

    // Animation demo states
    const [demoActive, setDemoActive] = useState({});
    const [animationSpeed2, setAnimationSpeed2] = useState(1);
    const [selectedAnimation, setSelectedAnimation] = useState('magical');
    const [triggerAnimation, setTriggerAnimation] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [accordionExpanded, setAccordionExpanded] = useState('panel1');
    const [ratingValue, setRatingValue] = useState(3);

    // Export/Import state
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [importData, setImportData] = useState('');
    const [copied, setCopied] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [configJson, setConfigJson] = useState('');

    // Animation demo ref
    const animationBoxRef = useRef(null);

    // Get all options for display
    const themes = getAllThemes();
    const componentOverrides = getAllComponentOverrides();
    const typographies = getAllTypographies();
    const animations = getAllAnimations();

    // Function to trigger animation on specific element
    const triggerElementAnimation = (elementId) => {
        setDemoActive(prev => ({ ...prev, [elementId]: true }));
        setTimeout(() => {
            setDemoActive(prev => ({ ...prev, [elementId]: false }));
        }, 2000);
    };

    // Animation examples data
    const animationExamples = [
        {
            name: 'Fade In Sparkle',
            animation: fadeInSparkle,
            duration: '1s',
            description: 'Magical entrance with sparkle effect'
        },
        {
            name: 'Pulse',
            animation: pulseAnimation,
            duration: '1s',
            description: 'Rhythmic scaling effect'
        },
        {
            name: 'Shake',
            animation: shakeAnimation,
            duration: '0.5s',
            description: 'Attention-grabbing shake'
        },
        {
            name: 'Rotate',
            animation: rotateAnimation,
            duration: '2s',
            description: 'Continuous rotation'
        },
        {
            name: 'Bounce',
            animation: bounceAnimation,
            duration: '1s',
            description: 'Playful bounce effect'
        },
        {
            name: 'Glow',
            animation: glowAnimation,
            duration: '2s',
            description: 'Mystical glow effect'
        }
    ];

    // Apply animation classes dynamically
    useEffect(() => {
        if (animationBoxRef.current) {
            animationBoxRef.current.className = '';
            animationBoxRef.current.classList.add(animationDemo);
        }
    }, [animationDemo]);

    // Export current configuration
    const exportConfiguration = () => {
        const config = {
            theme: currentThemeName,
            componentOverride: currentComponentOverride,
            typography: currentTypography,
            animation: currentAnimation,
            animationSpeed: animationSpeed,
            reducedMotion: reducedMotion,
            timestamp: new Date().toISOString(),
            version: '2.0',
            appName: 'Cranky Magician Theme System',
        };

        const configString = JSON.stringify(config, null, 2);
        setConfigJson(configString);
        setExportDialogOpen(true);
    };

    const handleCopyConfig = () => {
        navigator.clipboard.writeText(configJson).then(() => {
            setCopied(true);
            setSnackbarMessage(translate('Configuration copied to clipboard!'));
            setTimeout(() => setCopied(false), 3000);
        });
    };

    const handleDownloadConfig = () => {
        const blob = new Blob([configJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cranky-theme-config-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setSnackbarMessage(translate('Configuration downloaded!'));
    };

    // Import configuration
    const importConfiguration = () => {
        try {
            const config = JSON.parse(importData);

            // Validate config
            if (!config.theme || !config.componentOverride || !config.typography) {
                throw new Error('Invalid configuration format');
            }

            // Apply configuration
            if (config.theme) {
                dispatch({ type: 'theme/setTheme', payload: config.theme });
            }
            if (config.componentOverride) {
                dispatch({ type: 'theme/setComponentOverride', payload: config.componentOverride });
            }
            if (config.typography) {
                dispatch({ type: 'theme/setTypography', payload: config.typography });
            }
            if (config.animation) {
                dispatch({ type: 'theme/setAnimation', payload: config.animation });
            }
            if (config.animationSpeed) {
                dispatch({ type: 'theme/setAnimationSpeed', payload: config.animationSpeed });
            }
            if (config.reducedMotion !== undefined) {
                if (config.reducedMotion !== reducedMotion) {
                    dispatch({ type: 'theme/toggleReducedMotion' });
                }
            }

            setSnackbarMessage(translate('Configuration imported successfully!'));
            setImportData('');
            setImportDialogOpen(false);
        } catch (error) {
            setSnackbarMessage(translate('Invalid configuration format'));
        }
    };

    // Extract font family information from the theme
    const fontInfo = {
        h1: theme.typography.h1?.fontFamily || 'default',
        h2: theme.typography.h2?.fontFamily || 'default',
        h3: theme.typography.h3?.fontFamily || 'default',
        h4: theme.typography.h4?.fontFamily || 'default',
        h5: theme.typography.h5?.fontFamily || 'default',
        h6: theme.typography.h6?.fontFamily || 'default',
        body1: theme.typography.body1?.fontFamily || 'default',
        body2: theme.typography.body2?.fontFamily || 'default',
        button: theme.typography.button?.fontFamily || 'default',
    };

    // Animation options for demo
    const animationOptions = [
        { value: 'sparkle-slow', label: 'Sparkle Slow' },
        { value: 'sparkle-fast', label: 'Sparkle Fast' },
        { value: 'glow-pulse', label: 'Glow Pulse' },
        { value: 'levitate', label: 'Levitate' },
        { value: 'float-mystical', label: 'Mystical Float' },
        { value: 'lightning-continuous', label: 'Lightning' },
        { value: 'energy-pulse', label: 'Energy Pulse' },
        { value: 'portal-spin', label: 'Portal Spin' },
        { value: 'glitch', label: 'Glitch' },
        { value: 'aurora-wave', label: 'Aurora Wave' },
        { value: 'morph', label: 'Morph' },
        { value: 'wave', label: 'Wave' },
    ];

    const isAnimated = currentAnimation !== 'none' && !reducedMotion;

    // Speed dial actions
    const speedDialActions = [
        { icon: <FileCopyIcon />, name: 'Copy' },
        { icon: <SaveIcon />, name: 'Save' },
        { icon: <PrintIcon />, name: 'Print' },
        { icon: <ShareIcon />, name: 'Share' },
    ];

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Grid container spacing={4}>
                {/* Header with Export/Import Actions */}
                <Grid item xs={12}>
                    <Box sx={{ position: 'relative' }}>
                        <Typography
                            variant="h1"
                            className="magical-heading"
                            sx={{
                                mb: 2,
                                textAlign: 'center',
                                fontWeight: 900,
                                animation: isAnimated ? 'pulse 2s infinite' : 'none',
                            }}
                        >
                            {translate('WelcomeTitle') || 'Cranky Magician Theme System'}
                        </Typography>
                        <Typography
                            variant="h2"
                            className="glowing"
                            sx={{
                                mb: 4,
                                textAlign: 'center',
                                opacity: 0.9,
                            }}
                        >
                            {translate('SubtitleExploringColorsTypography') || 'Explore Magical Themes & Animations'}
                        </Typography>

                        {/* Export/Import Buttons */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            display: 'flex',
                            gap: 1,
                        }}>
                            <Tooltip title="Export Configuration">
                                <IconButton
                                    onClick={exportConfiguration}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                                        }
                                    }}
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Import Configuration">
                                <IconButton
                                    onClick={() => setImportDialogOpen(true)}
                                    sx={{
                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                                        }
                                    }}
                                >
                                    <UploadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="View Code">
                                <IconButton
                                    onClick={() => {
                                        const config = {
                                            theme: currentThemeName,
                                            componentOverride: currentComponentOverride,
                                            typography: currentTypography,
                                            animation: currentAnimation,
                                            animationSpeed: animationSpeed,
                                            reducedMotion: reducedMotion,
                                        };
                                        setConfigJson(JSON.stringify(config, null, 2));
                                        setExportDialogOpen(true);
                                    }}
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.info.main, 0.2),
                                        }
                                    }}
                                >
                                    <CodeIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Grid>

                {/* Theme Controls Section */}
                <Grid item xs={12}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            background: alpha(theme.palette.background.paper, 0.9),
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
                            🎨 Theme Configuration Center
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Theme Selection */}
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Theme Settings')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Choose your magical theme palette
                                    </Typography>
                                    <ThemeToggle />
                                    <Box sx={{ mt: 2, p: 2, borderRadius: 1, bgcolor: 'background.default' }}>
                                        <Chip
                                            label={`Current: ${currentThemeName}`}
                                            color="primary"
                                            icon={<AutoAwesomeIcon />}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Component Style Override */}
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Component Style')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Select component style override
                                    </Typography>
                                    <ComponentOverrideToggle />
                                </Paper>
                            </Grid>

                            {/* Typography Selection */}
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Typography Style')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Choose your font system
                                    </Typography>
                                    <TypographyToggle />
                                </Paper>
                            </Grid>

                            {/* Animation Settings - ENHANCED */}
                            <Grid item xs={12} lg={6}>
                                <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h5" gutterBottom>
                                        <AnimationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        {translate('Animation Settings')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Control animation styles and speed
                                    </Typography>
                                    <AnimationToggle />
                                </Paper>
                            </Grid>

                            {/* Navigation & Language */}
                            <Grid item xs={12} md={6} lg={3}>
                                <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Navigation Preference')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Select navigation style
                                    </Typography>
                                    <PreferenceSelector />
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6} lg={3}>
                                <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Language Settings')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Choose your language
                                    </Typography>
                                    <LanguageSwitcher />
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {translate('HelloWorld') || 'Hello, Magical World!'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Configuration Summary Bar */}
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 3,
                                p: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Active Configuration:
                                </Typography>
                                <Chip size="small" label={`Theme: ${currentThemeName}`} color="primary" />
                                <Chip size="small" label={`Style: ${currentComponentOverride}`} color="secondary" />
                                <Chip size="small" label={`Typography: ${currentTypography}`} />
                                <Chip
                                    size="small"
                                    label={`Animation: ${currentAnimation}`}
                                    color={isAnimated ? "success" : "default"}
                                />
                                {reducedMotion && (
                                    <Chip size="small" label="Reduced Motion" color="warning" />
                                )}
                                <Box sx={{ flexGrow: 1 }} />
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SettingsIcon />}
                                    onClick={exportConfiguration}
                                >
                                    Export All
                                </Button>
                            </Stack>
                        </Paper>
                    </Paper>
                </Grid>

                {/* Enhanced Component Gallery with Animation Demos */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
                            ✨ Component & Animation Gallery
                        </Typography>

                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
                            <Tab label="Animations" icon={<AnimationIcon />} />
                            <Tab label="Buttons" />
                            <Tab label="Inputs" />
                            <Tab label="Feedback" />
                            <Tab label="Surfaces" />
                            <Tab label="Navigation" />
                            <Tab label="Advanced" />
                        </Tabs>

                        {/* Animations Tab - NEW */}
                        <Box hidden={tabValue !== 0}>
                            <Grid container spacing={3}>
                                {/* Animation Speed Control */}
                                <Grid item xs={12}>
                                    <Paper elevation={1} sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Animation Playground
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Speed Control
                                                </Typography>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <SlowMotionVideoIcon />
                                                    <Slider
                                                        value={animationSpeed2}
                                                        onChange={(e, v) => setAnimationSpeed2(v)}
                                                        min={0.1}
                                                        max={3}
                                                        step={0.1}
                                                        marks={[
                                                            { value: 0.5, label: '0.5x' },
                                                            { value: 1, label: '1x' },
                                                            { value: 2, label: '2x' },
                                                        ]}
                                                        valueLabelDisplay="auto"
                                                    />
                                                    <FlashOnIcon />
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Trigger All Animations
                                                </Typography>
                                                <Stack direction="row" spacing={2}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<PlayArrowIcon />}
                                                        onClick={() => {
                                                            setTriggerAnimation(true);
                                                            setTimeout(() => setTriggerAnimation(false), 3000);
                                                        }}
                                                    >
                                                        Play All
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<RefreshIcon />}
                                                        onClick={() => setTriggerAnimation(false)}
                                                    >
                                                        Reset
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* Animation Examples Grid */}
                                {animationExamples.map((example, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={example.name}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                animation: triggerAnimation
                                                    ? `${example.animation} ${example.duration} ease-in-out ${index * 0.1}s`
                                                    : 'none',
                                                animationDuration: `${parseFloat(example.duration) / animationSpeed2}s`,
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {example.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {example.description}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 2,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        textAlign: 'center',
                                                        animation: demoActive[example.name]
                                                            ? `${example.animation} ${example.duration} ease-in-out`
                                                            : 'none',
                                                        animationDuration: `${parseFloat(example.duration) / animationSpeed2}s`,
                                                    }}
                                                >
                                                    <AutoAwesomeIcon sx={{ fontSize: 40 }} />
                                                </Box>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    onClick={() => triggerElementAnimation(example.name)}
                                                    startIcon={<PlayArrowIcon />}
                                                >
                                                    Trigger
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}

                                {/* Interactive Animation Demo */}
                                <Grid item xs={12}>
                                    <Paper elevation={1} sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Interactive Demo - Try Different Animations
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={8}>
                                                <ToggleButtonGroup
                                                    value={animationDemo}
                                                    exclusive
                                                    onChange={(e, value) => value && setAnimationDemo(value)}
                                                    size="small"
                                                    sx={{ flexWrap: 'wrap', gap: 0.5 }}
                                                >
                                                    {animationOptions.map(option => (
                                                        <ToggleButton
                                                            key={option.value}
                                                            value={option.value}
                                                            sx={{ fontSize: '0.75rem', px: 1 }}
                                                        >
                                                            {option.label}
                                                        </ToggleButton>
                                                    ))}
                                                </ToggleButtonGroup>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Box
                                                    ref={animationBoxRef}
                                                    className={animationDemo}
                                                    sx={{
                                                        p: 4,
                                                        borderRadius: 3,
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                                        color: 'white',
                                                        textAlign: 'center',
                                                        minHeight: 120,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <StarIcon sx={{ fontSize: 48 }} />
                                                    <Typography variant="h6">
                                                        {animationDemo.replace(/-/g, ' ').toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Buttons Tab */}
                        <Box hidden={tabValue !== 1}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AutoAwesomeIcon />}
                                            sx={{
                                                animation: isAnimated ? `${pulseAnimation} 2s infinite` : 'none'
                                            }}
                                        >
                                            Magical Primary
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<BoltIcon />}
                                            sx={{
                                                '&:hover': {
                                                    animation: `${shakeAnimation} 0.5s`
                                                }
                                            }}
                                        >
                                            Lightning Secondary
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            endIcon={<SendIcon />}
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateX(10px)',
                                                }
                                            }}
                                        >
                                            Outlined Send
                                        </Button>
                                        <Button variant="text" color="primary">
                                            Text Button
                                        </Button>
                                        <Button variant="contained" disabled>
                                            Disabled
                                        </Button>
                                        <Grow in={true} timeout={1000}>
                                            <IconButton color="primary">
                                                <FavoriteIcon />
                                            </IconButton>
                                        </Grow>
                                        <Zoom in={true} timeout={500}>
                                            <IconButton color="secondary">
                                                <ShareIcon />
                                            </IconButton>
                                        </Zoom>
                                        <Fab
                                            color="primary"
                                            size="small"
                                            sx={{
                                                animation: isAnimated ? `${rotateAnimation} 3s linear infinite` : 'none'
                                            }}
                                        >
                                            <AddIcon />
                                        </Fab>
                                        <Fab color="secondary" variant="extended">
                                            <EditIcon sx={{ mr: 1 }} />
                                            Edit
                                        </Fab>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Inputs Tab */}
                        <Box hidden={tabValue !== 2}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Magical Input"
                                        variant="outlined"
                                        value={textFieldValue}
                                        onChange={(e) => setTextFieldValue(e.target.value)}
                                        helperText="Type something magical..."
                                        InputProps={{
                                            startAdornment: <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />,
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                },
                                                '&.Mui-focused': {
                                                    animation: `${glowAnimation} 2s infinite`,
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Multiline Spell"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        defaultValue="Cast your spell here..."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={3} alignItems="center">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={switchChecked}
                                                    onChange={(e) => setSwitchChecked(e.target.checked)}
                                                />
                                            }
                                            label="Magic Mode"
                                        />
                                        <Chip
                                            label="Magical Chip"
                                            color="primary"
                                            onDelete={() => {}}
                                            deleteIcon={<StarIcon />}
                                            sx={{
                                                animation: isAnimated && switchChecked ? `${bounceAnimation} 1s infinite` : 'none'
                                            }}
                                        />
                                        <Chip
                                            label="Clickable"
                                            color="secondary"
                                            onClick={() => {}}
                                            icon={<BoltIcon />}
                                        />
                                        <Chip
                                            label="Success"
                                            color="success"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Rating Component
                                    </Typography>
                                    <Rating
                                        value={ratingValue}
                                        onChange={(event, newValue) => {
                                            setRatingValue(newValue);
                                        }}
                                        size="large"
                                        sx={{
                                            '& .MuiRating-icon': {
                                                transition: 'all 0.3s ease',
                                            },
                                            '& .MuiRating-iconFilled': {
                                                animation: isAnimated ? `${pulseAnimation} 1s` : 'none',
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Feedback Tab */}
                        <Box hidden={tabValue !== 3}>
                            <Stack spacing={3}>
                                <LinearProgress variant="determinate" value={60} />
                                <LinearProgress
                                    variant="indeterminate"
                                    color="secondary"
                                    sx={{
                                        '& .MuiLinearProgress-bar': {
                                            animationDuration: `${2 / animationSpeed}s`
                                        }
                                    }}
                                />
                                <Stack direction="row" spacing={2}>
                                    <CircularProgress size={40} />
                                    <CircularProgress size={40} color="secondary" />
                                    <CircularProgress size={40} variant="determinate" value={75} />
                                </Stack>
                                <Collapse in={showAlert}>
                                    <Alert
                                        severity="success"
                                        action={
                                            <IconButton
                                                color="inherit"
                                                size="small"
                                                onClick={() => setShowAlert(false)}
                                            >
                                                ×
                                            </IconButton>
                                        }
                                        sx={{
                                            animation: isAnimated ? `${fadeInSparkle} 1s ease-out` : 'none'
                                        }}
                                    >
                                        Success! Your magical spell has been cast!
                                    </Alert>
                                </Collapse>
                                <Alert severity="error" icon={<ErrorIcon />}>
                                    Error: The magic portal is temporarily closed
                                </Alert>
                                <Alert severity="warning" icon={<WarningIcon />}>
                                    Warning: High magical energy detected
                                </Alert>
                                <Alert severity="info" icon={<InfoIcon />}>
                                    Info: New spells available in the grimoire
                                </Alert>
                                <Stack direction="row" spacing={2}>
                                    <Skeleton variant="text" width={200} animation={isAnimated ? "wave" : false} />
                                    <Skeleton variant="circular" width={40} height={40} animation={isAnimated ? "pulse" : false} />
                                    <Skeleton variant="rectangular" width={210} height={60} animation={isAnimated ? "wave" : false} />
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Surfaces Tab */}
                        <Box hidden={tabValue !== 4}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Fade in={true} timeout={1000}>
                                        <Card
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-10px)',
                                                    boxShadow: theme.shadows[10],
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h5" gutterBottom>
                                                    Magical Card
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    This card contains mystical powers and ancient wisdom.
                                                    Hover to see the magical effects!
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary">Learn</Button>
                                                <Button size="small" color="secondary">Cast</Button>
                                            </CardActions>
                                        </Card>
                                    </Fade>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 3,
                                            animation: isAnimated ? `${glowAnimation} 3s infinite` : 'none'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            Elevated Paper
                                        </Typography>
                                        <Typography variant="body2">
                                            This paper component has magical depth and shadow effects.
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <StarIcon />
                                            </Avatar>
                                            <Badge badgeContent={4} color="secondary">
                                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                    <BoltIcon />
                                                </Avatar>
                                            </Badge>
                                        </Stack>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Accordion
                                        expanded={accordionExpanded === 'panel1'}
                                        onChange={() => setAccordionExpanded(accordionExpanded === 'panel1' ? '' : 'panel1')}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Magical Accordion</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Hidden magical content revealed with smooth animation!
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        expanded={accordionExpanded === 'panel2'}
                                        onChange={() => setAccordionExpanded(accordionExpanded === 'panel2' ? '' : 'panel2')}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Mystical Secrets</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Ancient wisdom and powerful spells contained within!
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Navigation Tab */}
                        <Box hidden={tabValue !== 5}>
                            <List>
                                <Slide direction="right" in={true} timeout={500}>
                                    <ListItem button>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <AutoAwesomeIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary="Magical Item"
                                            secondary="Cast powerful spells"
                                        />
                                    </ListItem>
                                </Slide>
                                <Slide direction="right" in={true} timeout={700}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <BoltIcon color="secondary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Lightning Strike"
                                            secondary="Unleash electric power"
                                        />
                                    </ListItem>
                                </Slide>
                                <Slide direction="right" in={true} timeout={900}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <StarIcon color="warning" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Mystic Portal"
                                            secondary="Travel between dimensions"
                                        />
                                    </ListItem>
                                </Slide>
                            </List>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Stepper Navigation
                                </Typography>
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    <Step>
                                        <StepLabel>Select Magic Type</StepLabel>
                                        <StepContent>
                                            <Typography>Choose your magical discipline</Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => setActiveStep(1)}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Continue
                                                </Button>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>Cast Spell</StepLabel>
                                        <StepContent>
                                            <Typography>Invoke your magical powers</Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => setActiveStep(2)}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Continue
                                                </Button>
                                                <Button
                                                    onClick={() => setActiveStep(0)}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Back
                                                </Button>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>Complete Ritual</StepLabel>
                                        <StepContent>
                                            <Typography>Finalize your magical transformation</Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => setActiveStep(0)}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Reset
                                                </Button>
                                                <Button
                                                    onClick={() => setActiveStep(1)}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Back
                                                </Button>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            </Box>
                        </Box>

                        {/* Advanced Tab - NEW */}
                        <Box hidden={tabValue !== 6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Speed Dial
                                    </Typography>
                                    <Box sx={{ height: 320, position: 'relative' }}>
                                        <SpeedDial
                                            ariaLabel="Speed Dial"
                                            sx={{ position: 'absolute', bottom: 16, right: 16 }}
                                            icon={<SpeedDialIcon />}
                                            onClose={() => setSpeedDialOpen(false)}
                                            onOpen={() => setSpeedDialOpen(true)}
                                            open={speedDialOpen}
                                        >
                                            {speedDialActions.map((action) => (
                                                <SpeedDialAction
                                                    key={action.name}
                                                    icon={action.icon}
                                                    tooltipTitle={action.name}
                                                    onClick={() => setSpeedDialOpen(false)}
                                                />
                                            ))}
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Backdrop
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setBackdropOpen(true)}
                                        startIcon={<LensBlurIcon />}
                                    >
                                        Open Backdrop
                                    </Button>
                                    <Backdrop
                                        sx={{
                                            color: '#fff',
                                            zIndex: (theme) => theme.zIndex.drawer + 1,
                                            backdropFilter: 'blur(10px)',
                                        }}
                                        open={backdropOpen}
                                        onClick={() => setBackdropOpen(false)}
                                    >
                                        <Stack alignItems="center" spacing={2}>
                                            <CircularProgress color="inherit" />
                                            <Typography>Click to close magical backdrop</Typography>
                                        </Stack>
                                    </Backdrop>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Keep existing Typography Showcase and Current Theme Display sections... */}
                {/* Typography Showcase */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
                            📝 Typography Showcase
                        </Typography>

                        <Stack spacing={3}>
                            <Box>
                                <Typography
                                    variant="h1"
                                    gutterBottom
                                    className="magical-heading"
                                    sx={{
                                        animation: isAnimated ? `${fadeInSparkle} 2s ease-out` : 'none'
                                    }}
                                >
                                    H1 Magical Heading
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Font: {fontInfo.h1}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h2" gutterBottom className="glowing">
                                    H2 Glowing Heading
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Font: {fontInfo.h2}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h3" gutterBottom>
                                    H3 Mystical Heading
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Font: {fontInfo.h3}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body1" paragraph>
                                    Body 1: In the realm of code and magic, where algorithms dance with
                                    ancient spells, the Cranky Magician weaves digital enchantments.
                                    Each line of code is a incantation, every function a magical ritual.
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Font: {fontInfo.body1}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" paragraph>
                                    Body 2: The mystical powers of modern web development combine with
                                    the ancient arts of user experience design to create truly magical
                                    digital experiences.
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Font: {fontInfo.body2}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Current Theme Display */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
                            🎨 Current Configuration
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Theme Colors
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 60,
                                                height: 60,
                                                bgcolor: 'primary.main',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.contrastText',
                                                fontWeight: 'bold',
                                                animation: isAnimated ? `${pulseAnimation} 2s infinite` : 'none'
                                            }}>
                                                P
                                            </Box>
                                            <Box>
                                                <Typography variant="body2">Primary</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {theme.palette.primary.main}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 60,
                                                height: 60,
                                                bgcolor: 'secondary.main',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'secondary.contrastText',
                                                fontWeight: 'bold',
                                                animation: isAnimated ? `${bounceAnimation} 2s infinite` : 'none'
                                            }}>
                                                S
                                            </Box>
                                            <Box>
                                                <Typography variant="body2">Secondary</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {theme.palette.secondary.main}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Active Settings
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Chip
                                            label={`Theme: ${currentThemeName}`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Style: ${currentComponentOverride}`}
                                            color="secondary"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Typography: ${currentTypography}`}
                                            color="default"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Animation: ${currentAnimation}${animationSpeed !== 1 ? ` (${animationSpeed}x)` : ''}`}
                                            color={isAnimated ? "success" : "default"}
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Theme Mode
                                    </Typography>
                                    <Typography variant="body1">
                                        {theme.palette.mode === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Background: {theme.palette.background.default}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Paper: {theme.palette.background.paper}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<SaveIcon />}
                                            onClick={exportConfiguration}
                                        >
                                            Save Configuration
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Export Dialog */}
            <Dialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Export Configuration
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Copy or download your current theme configuration:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        value={configJson}
                        variant="outlined"
                        InputProps={{
                            readOnly: true,
                            sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExportDialogOpen(false)}>
                        Close
                    </Button>
                    <Button
                        onClick={handleCopyConfig}
                        startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                        color={copied ? "success" : "primary"}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                        onClick={handleDownloadConfig}
                        variant="contained"
                        startIcon={<DownloadIcon />}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Import Dialog */}
            <Dialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Import Configuration
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Paste your configuration JSON below:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        variant="outlined"
                        placeholder="Paste your configuration JSON here..."
                        InputProps={{
                            sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setImportDialogOpen(false);
                        setImportData('');
                    }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={importConfiguration}
                        variant="contained"
                        disabled={!importData.trim()}
                        startIcon={<UploadIcon />}
                    >
                        Import
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={4000}
                onClose={() => setSnackbarMessage('')}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default Example;