// src/components/demo/SpatialDemoPanel.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CardActions,
    TextField,
    Slider,
    Switch,
    FormControlLabel,
    Chip,
    LinearProgress,
    CircularProgress,
    Divider,
    Tabs,
    Tab,
    Avatar,
    Badge,
    Alert,
    Stack,
} from '@mui/material';
import { useSpatialTheme, } from '../../hooks/useSpatialTheme';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import {useMatrixText} from "../../hooks/useMatrixText";

// Data Display Component for futuristic metrics
const DataDisplay = ({ label, value, icon, pulseColor = false }) => {
    const { getDataDisplayStyle, isDark } = useSpatialTheme();

    // Matrix text scramble effect
    const { text } = useMatrixText(value.toString(), {
        iterations: 1,
        speed: 40,
    });

    return (
        <Box
            sx={{
                ...getDataDisplayStyle(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::after': pulseColor ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    height: '2px',
                    width: '100%',
                    background: `linear-gradient(90deg, transparent, ${isDark ? '#D65A31' : '#D65A31'}, transparent)`,
                    backgroundSize: '200% 100%',
                    animation: 'pulse-data 2s infinite linear',
                } : {},
                '@keyframes pulse-data': {
                    '0%': { backgroundPosition: '-100% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            }}
        >
            {icon && (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    {icon}
                </Box>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography
                variant="body1"
                fontFamily="Orbitron, monospace"
                fontWeight="bold"
                letterSpacing="0.1em"
            >
                {text}
            </Typography>
        </Box>
    );
};

// Terminal component for code/log display
const Terminal = ({ children, title = 'Terminal', height = 200 }) => {
    const { getTerminalStyle, isDark } = useSpatialTheme();

    return (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    backgroundColor: isDark ? 'rgba(10, 10, 10, 0.9)' : 'rgba(240, 240, 240, 0.9)',
                    color: '#D65A31',
                    padding: '6px 12px',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: `1px solid ${isDark ? 'rgba(214, 90, 49, 0.4)' : 'rgba(214, 90, 49, 0.3)'}`,
                    borderBottom: 'none',
                }}
            >
                <Typography
                    variant="caption"
                    fontFamily="Orbitron, sans-serif"
                    sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}
                >
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {['#ffbb00', '#00cc44', '#ff3b30'].map((color, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: '1px solid rgba(0,0,0,0.2)',
                            }}
                        />
                    ))}
                </Box>
            </Box>
            <Box
                sx={{
                    ...getTerminalStyle(),
                    height,
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.875rem',
                    borderRadius: '0 0 4px 4px',
                    position: 'relative',
                }}
            >
                {children}
                <Box
                    component="span"
                    sx={{
                        display: 'inline-block',
                        width: '10px',
                        height: '18px',
                        backgroundColor: '#D65A31',
                        animation: 'blink 1s step-end infinite',
                        '@keyframes blink': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0 },
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

// Futuristic Card component
const FuturisticCard = ({ children, title, subtitle, icon, actionButtons = [] }) => {
    const { getFuturisticCardStyle, isDark } = useSpatialTheme();

    return (
        <Card sx={{ ...getFuturisticCardStyle(), height: '100%' }}>
            <CardContent>
                {(title || icon) && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        pb: 1,
                        borderBottom: `1px solid ${isDark ? 'rgba(214, 90, 49, 0.2)' : 'rgba(214, 90, 49, 0.1)'}`,
                    }}>
                        {icon && (
                            <Box
                                sx={{
                                    mr: 1.5,
                                    color: '#D65A31',
                                }}
                            >
                                {icon}
                            </Box>
                        )}
                        <Box>
                            {title && (
                                <Typography
                                    variant="h6"
                                    component="div"
                                    fontFamily="Rajdhani, sans-serif"
                                    fontWeight="600"
                                    letterSpacing="0.03em"
                                >
                                    {title}
                                </Typography>
                            )}
                            {subtitle && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontFamily="Inter, sans-serif"
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}

                {children}
            </CardContent>

            {actionButtons.length > 0 && (
                <CardActions sx={{
                    borderTop: `1px solid ${isDark ? 'rgba(214, 90, 49, 0.2)' : 'rgba(214, 90, 49, 0.1)'}`,
                    justifyContent: 'flex-end',
                    p: 2,
                }}>
                    {actionButtons.map((btn, idx) => btn)}
                </CardActions>
            )}
        </Card>
    );
};

// Demo panel showing all the spatial theme components
const SpatialDemoPanel = () => {
    const {
        isDark,
        themePrefs,
        updatePreference,
        getGlowEffect
    } = useSpatialTheme();

    const [tabValue, setTabValue] = useState(0);
    const [progress, setProgress] = useState(67);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Sample terminal content
    const terminalContent = `$ system.init()
> Initializing spatial interface...
> Loading module: dataStream.js
> Loading module: quantumCore.js
> Loading module: neuralInterface.js
> All modules loaded successfully
$ quantum.connect()
> Establishing neural connection...
> Synaptic resonance detected
> Connection established
$ data.analyze("stream_alpha")
> Analyzing data stream Alpha
> Processing...
> Analysis complete
> Anomalies detected: 2
> Saving results to quantum buffer`;

    return (
        <Box sx={{ py: 4 }}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                fontFamily="Orbitron, sans-serif"
                fontWeight="700"
                letterSpacing="0.04em"
                sx={{
                    mb: 4,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -10,
                        left: 0,
                        width: '100px',
                        height: '3px',
                        background: `linear-gradient(90deg, #D65A31, transparent)`,
                    },
                }}
            >
                Spatial Interface Demo
            </Typography>

            <Grid container spacing={3}>
                {/* Main control panel */}
                <Grid item xs={12} md={8}>
                    <FuturisticCard
                        title="System Interface"
                        subtitle="Neuromancer Control Station"
                        icon={<DisplaySettingsIcon />}
                        actionButtons={[
                            <Button
                                key="reset"
                                variant="outlined"
                                size="small"
                                startIcon={<CodeIcon />}
                            >
                                Reset
                            </Button>,
                            <Button
                                key="activate"
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<RocketLaunchIcon />}
                            >
                                Activate
                            </Button>
                        ]}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{ mb: 2 }}
                            >
                                <Tab label="Dashboard" icon={<DisplaySettingsIcon />} />
                                <Tab label="Terminal" icon={<CodeIcon />} />
                                <Tab label="Controls" icon={<RocketLaunchIcon />} />
                            </Tabs>

                            {/* Tab content */}
                            <Box hidden={tabValue !== 0}>
                                <Stack spacing={2}>
                                    <Alert severity="info" sx={{ mb: 2 }}>System is running at optimal capacity</Alert>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" gutterBottom>System Load</Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">Current: {progress}%</Typography>
                                            <Typography variant="caption" color="text.secondary">Threshold: 85%</Typography>
                                        </Box>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <DataDisplay
                                                label="CPU Usage"
                                                value={`${Math.floor(progress/1.5)}%`}
                                                pulseColor={true}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DataDisplay
                                                label="Memory"
                                                value={`${Math.floor(progress*16.8/10)} GB`}
                                                pulseColor={true}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DataDisplay
                                                label="Network"
                                                value={`${Math.floor(progress*1.2)} Mbps`}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DataDisplay
                                                label="Uptime"
                                                value={`${Math.floor(progress*1.5)} hrs`}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="outlined" size="small" sx={{ mr: 1 }}>Optimize</Button>
                                        <Button variant="contained" size="small">Save Config</Button>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box hidden={tabValue !== 1}>
                                <Terminal title="System Console" height={260}>
                                    {terminalContent}
                                </Terminal>
                            </Box>

                            <Box hidden={tabValue !== 2}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" gutterBottom>System Load Simulation</Typography>
                                    <Slider
                                        value={progress}
                                        onChange={(e, val) => setProgress(val)}
                                        min={0}
                                        max={100}
                                        valueLabelDisplay="auto"
                                    />
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Command Input"
                                            fullWidth
                                            variant="outlined"
                                            placeholder="Enter system command"
                                            size="small"
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={themePrefs.useGlowEffects}
                                                    onChange={(e) => updatePreference('useGlowEffects', e.target.checked)}
                                                />
                                            }
                                            label="Glow Effects"
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                    <Chip label="Primary Module" color="primary" />
                                    <Chip label="Secondary Systems" color="secondary" />
                                    <Chip label="Neural Network" variant="outlined" />
                                    <Chip label="Quantum Core" variant="outlined" />
                                </Box>

                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                    <CircularProgress size={24} />
                                    <Typography variant="body2">Processing Request</Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </FuturisticCard>
                </Grid>

                {/* Side panel with stats */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <FuturisticCard
                            title="Environment"
                            icon={isDark ? <DarkModeIcon /> : <LightModeIcon />}
                        >
                            <Stack spacing={2}>
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
                                </Alert>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography variant="body2">Theme Mode</Typography>
                                    <Switch
                                        checked={isDark}
                                        onChange={() => {}}
                                        disabled
                                    />
                                </Box>

                                <Divider />

                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2">Animation Level</Typography>
                                        <Chip
                                            label={themePrefs.animationLevel}
                                            size="small"
                                            sx={{
                                                ...getGlowEffect(undefined, 'low'),
                                                fontFamily: 'Rajdhani, sans-serif',
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2">Special Effects</Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Badge badgeContent={themePrefs.useScanlines ? "ON" : "OFF"} color={themePrefs.useScanlines ? "success" : "error"}>
                                                <Chip
                                                    label="Scanlines"
                                                    size="small"
                                                    variant={themePrefs.useScanlines ? "filled" : "outlined"}
                                                />
                                            </Badge>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Stack>
                        </FuturisticCard>

                        <FuturisticCard title="User Status">
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        mr: 2,
                                        border: `2px solid ${isDark ? '#D65A31' : '#D65A31'}`,
                                        ...getGlowEffect(),
                                    }}
                                >
                                    SP
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontFamily="Rajdhani, sans-serif" sx={{ mb: 0 }}>
                                        Commander
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        System Administrator
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 'auto' }}>
                                    <Badge color="success" variant="dot" overlap="circular">
                                        <Chip
                                            label="Online"
                                            size="small"
                                            sx={{
                                                bgcolor: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                                                color: '#4caf50',
                                                border: '1px solid #4caf5066',
                                            }}
                                        />
                                    </Badge>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Session Time</Typography>
                                <Typography variant="body2" fontFamily="Orbitron, sans-serif">04:32:15</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Access Level</Typography>
                                <Typography variant="body2" fontFamily="Orbitron, sans-serif">Alpha</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Last Login</Typography>
                                <Typography variant="body2" fontFamily="Orbitron, sans-serif">1.2 hrs ago</Typography>
                            </Box>
                        </FuturisticCard>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SpatialDemoPanel;