import * as React from 'react';
import {
    Typography, Button, Box, Grid, Paper, Alert, Snackbar, Card, CardContent,
    CardActions, Chip, Tooltip, IconButton, Stepper, Step, StepLabel, Fab
} from '@mui/material';
import {
    Download, Upload, ContentCopy, CheckCircle, Palette, TextFields, Style,
    Brightness4, Brightness7, Help, RestartAlt, Preview, Save
} from '@mui/icons-material';
import ThemeToggle from "../components/demoComponents/ThemeToggle";
import ComponentOverrideToggle from "../components/demoComponents/ComponentOverrideToggle";
import TypographyToggle from "../components/demoComponents/TypographyToggle";
import LanguageSwitcher from "../components/demoComponents/LanguageSwitcher";
import PreferenceSelector from "../components/demoComponents/PreferenceSelector";
import useCustomTranslation from "../hooks/useCustomTranslation";
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { getThemeById } from '../themes/themeRegistry';
import { getComponentOverrideById } from '../themes/muicomponents';
import { getTypographyById } from '../themes/typography';
import { setTheme, setComponentOverride, setTypography } from '../reducers/themeSlice';
import ThemeService from '../services/ThemeService';
import PreferenceService from '../services/PreferenceService';

const Example = () => {
    const { translate } = useCustomTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentThemeName = useSelector(state => state.theme.mode);
    const currentComponentOverride = useSelector(state => state.theme.componentOverride);
    const currentTypography = useSelector(state => state.theme.typography);

    // State for notifications and UI
    const [notification, setNotification] = React.useState({ open: false, message: '', severity: 'success' });
    const [copiedConfig, setCopiedConfig] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [showPreview, setShowPreview] = React.useState(false);

    // Get theme info
    const themeInfo = getThemeById(currentThemeName);
    const componentOverrideInfo = getComponentOverrideById(currentComponentOverride);
    const typographyInfo = getTypographyById(currentTypography);

    const steps = ['Pick Colors', 'Choose Style', 'Select Fonts', 'Save Theme'];

    // Simple descriptions for each option type
    const getSimpleDescription = (type, info) => {
        const descriptions = {
            theme: {
                light: '☀️ Bright and clean',
                dark: '🌙 Dark and cool',
                munchie: '🌈 Colorful and fun',
                professional: '💼 Clean and business-like',
                techStartup: '🚀 Modern and techy',
                corporate: '🏢 Professional corporate look',
                alt: '🎨 Alternative style',
                sunset: '🌅 Warm sunset colors',
                mint: '🌿 Fresh mint green',
                retroNeon: '🕹️ Retro gaming vibes',
                highContrast: '🔍 High contrast for clarity'
            },
            style: {
                cranky: '✨ Futuristic with glowing effects',
                clean: '🧹 Simple and minimal',
                material: '📱 Google Material Design',
                classic: '📰 Traditional and conservative'
            },
            typography: {
                spatial: '🚀 Space-age fonts',
                professional: '💼 Business fonts',
                techStartup: '⚡ Tech company style',
                sunset: '🌅 Warm and friendly fonts',
                retro: '🕹️ Retro gaming fonts',
                accessible: '🔍 Easy-to-read fonts'
            }
        };

        const key = info?.id || 'unknown';
        return descriptions[type]?.[key] || info?.description || 'Custom style';
    };

    // Generate configuration object
    const generateConfigurationObject = () => {
        const preferences = PreferenceService.getPreference();
        const themePreferences = ThemeService.getThemePreferences();

        return {
            version: "1.0",
            exportDate: new Date().toISOString(),
            name: `${themeInfo?.name || currentThemeName} + ${componentOverrideInfo?.name || currentComponentOverride} + ${typographyInfo?.name || currentTypography}`,
            description: `Theme: ${getSimpleDescription('theme', themeInfo)}, Style: ${getSimpleDescription('style', componentOverrideInfo)}, Fonts: ${getSimpleDescription('typography', typographyInfo)}`,
            configuration: {
                theme: currentThemeName,
                componentOverride: currentComponentOverride,
                typography: currentTypography,
                language: localStorage.getItem('appLanguage') || 'en',
                preferences: preferences,
                themePreferences: themePreferences
            },
            metadata: {
                themeInfo: {
                    name: themeInfo?.name,
                    description: themeInfo?.description,
                    category: themeInfo?.category,
                    tags: themeInfo?.tags
                },
                componentOverrideInfo: {
                    name: componentOverrideInfo?.name,
                    description: componentOverrideInfo?.description,
                    tags: componentOverrideInfo?.tags
                },
                typographyInfo: {
                    name: typographyInfo?.name,
                    description: typographyInfo?.description,
                    tags: typographyInfo?.tags
                }
            }
        };
    };

    // Export configuration
    const handleExportConfiguration = () => {
        try {
            const configObject = generateConfigurationObject();
            const jsonString = JSON.stringify(configObject, null, 2);

            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `my-theme-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showSuccess('🎉 Your theme has been saved to your computer!');
        } catch (error) {
            console.error('Export failed:', error);
            showError('😞 Oops! Could not save your theme.');
        }
    };

    // Copy configuration
    const handleCopyConfiguration = async () => {
        try {
            const configObject = generateConfigurationObject();
            const jsonString = JSON.stringify(configObject, null, 2);

            await navigator.clipboard.writeText(jsonString);
            setCopiedConfig(true);
            setTimeout(() => setCopiedConfig(false), 3000);

            showSuccess('📋 Theme copied! You can paste it anywhere.');
        } catch (error) {
            console.error('Copy failed:', error);
            showError('😞 Could not copy to clipboard.');
        }
    };

    // Import configuration
    const handleImportConfiguration = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const configObject = JSON.parse(e.target.result);
                applyConfiguration(configObject);
            } catch (error) {
                console.error('Import failed:', error);
                showError('😞 This file doesn\'t look like a theme file.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    // Apply configuration
    const applyConfiguration = (configObject) => {
        try {
            const config = configObject.configuration;

            if (!config) {
                throw new Error('Invalid file');
            }

            // Apply settings
            if (config.theme && ThemeService.validateTheme(config.theme)) {
                dispatch(setTheme(config.theme));
            }

            if (config.componentOverride) {
                dispatch(setComponentOverride(config.componentOverride));
            }

            if (config.typography) {
                dispatch(setTypography(config.typography));
            }

            if (config.preferences) {
                PreferenceService.setPreference(config.preferences);
            }

            if (config.themePreferences) {
                ThemeService.setThemePreferences(config.themePreferences);
            }

            if (config.language) {
                localStorage.setItem('appLanguage', config.language);
            }

            showSuccess('🎉 Theme loaded successfully!');
        } catch (error) {
            console.error('Apply failed:', error);
            showError('😞 Could not load this theme file.');
        }
    };

    // Helper functions for notifications
    const showSuccess = (message) => {
        setNotification({ open: true, message, severity: 'success' });
    };

    const showError = (message) => {
        setNotification({ open: true, message, severity: 'error' });
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Sample text for preview
    const sampleText = "The quick brown fox jumps over the lazy dog";

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    🎨 Theme Builder
                </Typography>
                <Typography variant="h5" color="text.secondary">
                    Make your app look exactly how you want it
                </Typography>
            </Box>

            {/* Quick Save/Load Section */}
            <Card sx={{ mb: 4, background: 'linear-gradient(45deg, ' + theme.palette.primary.main + '20, ' + theme.palette.secondary.main + '20)' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        💾 Save & Share Your Theme
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
                        Love what you've created? Save it to your computer or copy it to share with friends!
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Save />}
                            onClick={handleExportConfiguration}
                            sx={{ minWidth: 200, py: 1.5 }}
                        >
                            💾 Save My Theme
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={copiedConfig ? <CheckCircle /> : <ContentCopy />}
                            onClick={handleCopyConfiguration}
                            color={copiedConfig ? "success" : "primary"}
                            sx={{ minWidth: 200, py: 1.5 }}
                        >
                            {copiedConfig ? '✅ Copied!' : '📋 Copy Theme'}
                        </Button>

                        <Button
                            variant="outlined"
                            component="label"
                            size="large"
                            startIcon={<Upload />}
                            color="secondary"
                            sx={{ minWidth: 200, py: 1.5 }}
                        >
                            📂 Load Theme File
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportConfiguration}
                                style={{ display: 'none' }}
                            />
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Current Theme Preview */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Preview /> Your Current Theme
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                                <Palette sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                                <Typography variant="h6">{themeInfo?.name || 'Custom'}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getSimpleDescription('theme', themeInfo)}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                                <Style sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                                <Typography variant="h6">{componentOverrideInfo?.name || 'Custom'}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getSimpleDescription('style', componentOverrideInfo)}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                                <TextFields sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                                <Typography variant="h6">{typographyInfo?.name || 'Custom'}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getSimpleDescription('typography', typographyInfo)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Theme Configuration Sections */}
            <Grid container spacing={4}>
                {/* Colors */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Palette sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                                <Box>
                                    <Typography variant="h5">Step 1: Pick Colors</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Choose light, dark, or colorful
                                    </Typography>
                                </Box>
                            </Box>
                            <ThemeToggle />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Style */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Style sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                                <Box>
                                    <Typography variant="h5">Step 2: Pick Style</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Futuristic, clean, or classic
                                    </Typography>
                                </Box>
                            </Box>
                            <ComponentOverrideToggle />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Fonts */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <TextFields sx={{ fontSize: 40, color: theme.palette.info.main }} />
                                <Box>
                                    <Typography variant="h5">Step 3: Pick Fonts</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Choose your text style
                                    </Typography>
                                </Box>
                            </Box>
                            <TypographyToggle />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Language & Preferences */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                🌍 Language & Settings
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <LanguageSwitcher />
                            </Box>
                            <PreferenceSelector />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Preview Section */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                👀 See How It Looks
                            </Typography>

                            {/* Sample content to show current theme */}
                            <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                                <Typography variant="h4" gutterBottom>
                                    Sample Heading
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {sampleText}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <Button variant="contained" size="small">Primary</Button>
                                    <Button variant="outlined" size="small">Secondary</Button>
                                </Box>
                            </Box>

                            <Alert severity="info">
                                <Typography variant="body2">
                                    This shows how your theme looks. Try changing the settings above!
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Help Section */}
            <Card sx={{ mt: 4, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Help /> Need Help?
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>🎨 Colors</Typography>
                            <Typography variant="body2">
                                Light themes are bright and easy on the eyes during the day.
                                Dark themes are easier to use at night or in dark rooms.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>✨ Styles</Typography>
                            <Typography variant="body2">
                                Futuristic adds cool glowing effects. Clean is simple and minimal.
                                Classic looks traditional and professional.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>📝 Fonts</Typography>
                            <Typography variant="body2">
                                Different fonts give your app a different personality.
                                Try them all to see which you like best!
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Floating Action Button for Quick Save */}
            <Fab
                color="primary"
                aria-label="save theme"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                onClick={handleExportConfiguration}
            >
                <Save />
            </Fab>

            {/* Notification */}
            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{ width: '100%', fontSize: '1.1rem' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Example;