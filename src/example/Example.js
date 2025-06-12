import * as React from 'react';
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
    CircularProgress
} from '@mui/material';
 import ThemeToggle from "../components/demoComponents/ThemeToggle";
import OverrideStyleToggle from "../components/common/OverrideStyleToggle";
import NewsletterSignup from "../components/demoComponents/NewsletterSignup";
import LanguageSwitcher from "../components/demoComponents/LanguageSwitcher";
import PreferenceSelector from "../components/demoComponents/PreferenceSelector";
import useCustomTranslation from "../hooks/useCustomTranslation";
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const Example = () => {
    const { translate } = useCustomTranslation();
    const theme = useTheme();
    const currentThemeName = useSelector(state => state.theme.mode);
    const currentOverrideStyle = useSelector(state => state.theme.overrideStyle);

    // Extract font family information from the theme
    const fontInfo = {
        h1: theme.typography.h1.fontFamily,
        h2: theme.typography.h2.fontFamily,
        h3: theme.typography.h3.fontFamily,
        h4: theme.typography.h4.fontFamily,
        h5: theme.typography.h5.fontFamily,
        h6: theme.typography.h6.fontFamily,
        body1: theme.typography.body1.fontFamily,
        body2: theme.typography.body2.fontFamily,
        button: theme.typography.button.fontFamily,
    };

    return (
        <Box sx={{ p: 4, bgcolor: 'background.paper', flexGrow: 1 }}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h1" sx={{ mb: 2 }}>
                        {translate('WelcomeTitle')}
                    </Typography>
                    <Typography variant="h2" sx={{ mb: 4 }}>
                        {translate('SubtitleExploringColorsTypography')}
                    </Typography>
                </Grid>

                {/* Theme Settings - Updated with Override Style Toggle */}
                <Grid item xs={12} md={6} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Theme Settings')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {translate('ToggleThemeDescription')}
                        </Typography>
                        <ThemeToggle />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            {translate('Component Style')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Choose between magical or spatial/matrix visual effects
                        </Typography>
                        <OverrideStyleToggle />
                    </Paper>
                </Grid>

                {/* Navigation Preference */}
                <Grid item xs={12} md={6} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Navigation Preference')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {translate('Select your preferred navigation style:')}
                        </Typography>
                        <PreferenceSelector />
                    </Paper>
                </Grid>

                {/* Language Settings */}
                <Grid item xs={12} sx={{ mt: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Language Settings')}
                        </Typography>
                        <LanguageSwitcher />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {translate('Sample Translation')}
                        </Typography>
                        <Typography variant="body1">
                            {translate('HelloWorld')}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Current Theme Display - Updated with Override Style */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="h4">
                                {translate('Current Theme')}: {currentThemeName}
                            </Typography>
                            <Chip
                                label={`Style: ${currentOverrideStyle === 'cranky' ? 'Magical ✨' : 'Matrix 🌐'}`}
                                color="primary"
                                variant="outlined"
                            />
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={4}>
                                <Typography variant="body1">
                                    {translate('PrimaryColorLabel')}
                                </Typography>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        p: 1,
                                        color: 'primary.contrastText',
                                        borderRadius: 1,
                                    }}
                                >
                                    {theme.palette.primary.main}
                                </Box>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.light',
                                        p: 1,
                                        color: 'primary.contrastText',
                                        borderRadius: 1,
                                        mt: 1,
                                    }}
                                >
                                    {theme.palette.primary.light}
                                </Box>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.dark',
                                        p: 1,
                                        color: 'primary.contrastText',
                                        borderRadius: 1,
                                        mt: 1,
                                    }}
                                >
                                    {theme.palette.primary.dark}
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Typography variant="body1">
                                    {translate('SecondaryColorLabel')}
                                </Typography>
                                <Box
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        p: 1,
                                        color: 'secondary.contrastText',
                                        borderRadius: 1,
                                    }}
                                >
                                    {theme.palette.secondary.main}
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Typography variant="body1">
                                    {translate('TertiaryColorLabel')}
                                </Typography>
                                <Box
                                    sx={{
                                        bgcolor: 'tertiary.main',
                                        p: 1,
                                        color: 'white',
                                        borderRadius: 1,
                                    }}
                                >
                                    {theme.palette.tertiary?.main || 'Not defined'}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Component Examples - New Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Component Examples
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Stack spacing={3}>
                            {/* Buttons */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Buttons
                                </Typography>
                                <Stack direction="row" spacing={2} flexWrap="wrap">
                                    <Button variant="contained" color="primary">
                                        Primary
                                    </Button>
                                    <Button variant="contained" color="secondary">
                                        Secondary
                                    </Button>
                                    <Button variant="outlined" color="primary">
                                        Outlined
                                    </Button>
                                    <Button variant="text" color="primary">
                                        Text
                                    </Button>
                                    <Button variant="contained" disabled>
                                        Disabled
                                    </Button>
                                </Stack>
                            </Box>

                            {/* Chips */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Chips
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <Chip label="Default" />
                                    <Chip label="Primary" color="primary" />
                                    <Chip label="Secondary" color="secondary" />
                                    <Chip label="Clickable" onClick={() => {}} />
                                    <Chip label="Deletable" onDelete={() => {}} />
                                </Stack>
                            </Box>

                            {/* Progress */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Progress Indicators
                                </Typography>
                                <Stack spacing={2}>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant="determinate" value={60} />
                                    </Box>
                                    <Stack direction="row" spacing={2}>
                                        <CircularProgress size={40} />
                                        <CircularProgress size={40} color="secondary" />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Typography Examples */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Typography Examples')}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h1" gutterBottom>
                                H1 Heading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.h1}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h2" gutterBottom>
                                H2 Heading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.h2}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h3" gutterBottom>
                                H3 Heading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.h3}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h4" gutterBottom>
                                H4 Heading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.h4}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                H5 Heading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.h5}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                H6 Heading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.h6}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" gutterBottom>
                                Body 1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
                                consectetur, neque doloribus, cupiditate numquam dignissimos
                                laborum fugiat deleniti? Eum quasi quidem quibusdam.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.body1}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" gutterBottom>
                                Body 2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
                                consectetur, neque doloribus, cupiditate numquam dignissimos
                                laborum fugiat deleniti? Eum quasi quidem quibusdam.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Font: {fontInfo.body2}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" component="div">
                                <blockquote>
                                    "Any sufficiently advanced technology is indistinguishable from magic."
                                    - Arthur C. Clarke
                                </blockquote>
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <NewsletterSignup />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Example;