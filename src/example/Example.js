import * as React from 'react';
import { Typography, Button, Box, Grid, Paper, Divider } from '@mui/material';
import ThemeToggle from "../components/demoComponents/ThemeToggle";
import ComponentOverrideToggle from "../components/demoComponents/ComponentOverrideToggle";
import TypographyToggle from "../components/demoComponents/TypographyToggle";
import LanguageSwitcher from "../components/demoComponents/LanguageSwitcher";
import PreferenceSelector from "../components/demoComponents/PreferenceSelector";
import useCustomTranslation from "../hooks/useCustomTranslation";
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { getThemeById } from '../themes/themeRegistry';
import { getComponentOverrideById } from '../themes/muicomponents';
import { getTypographyById } from '../themes/typography';

const Example = () => {
    const { translate } = useCustomTranslation();
    const theme = useTheme();
    const currentThemeName = useSelector(state => state.theme.mode);
    const currentComponentOverride = useSelector(state => state.theme.componentOverride);
    const currentTypography = useSelector(state => state.theme.typography);

    // Get theme, component override, and typography info from registries
    const themeInfo = getThemeById(currentThemeName);
    const componentOverrideInfo = getComponentOverrideById(currentComponentOverride);
    const typographyInfo = getTypographyById(currentTypography);

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

                {/* Theme Settings */}
                <Grid item xs={12} md={4} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Color Theme')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {translate('Choose your color palette')}
                        </Typography>
                        <ThemeToggle />
                    </Paper>
                </Grid>

                {/* Component Style Settings */}
                <Grid item xs={12} md={4} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Component Style')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {translate('Select component styling approach')}
                        </Typography>
                        <ComponentOverrideToggle />
                    </Paper>
                </Grid>

                {/* Typography Settings */}
                <Grid item xs={12} md={4} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Typography Style')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {translate('Choose your font combination')}
                        </Typography>
                        <TypographyToggle />
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
                <Grid item xs={12} md={6} sx={{ mb: { xs: 4, md: 0 } }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
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

                {/* Current Configuration Information */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {translate('Current Configuration')}
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Theme Info */}
                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Color Theme')}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {themeInfo?.name || currentThemeName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {themeInfo?.description || 'No description available'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                        {themeInfo?.tags?.map((tag) => (
                                            <Button
                                                key={tag}
                                                variant="outlined"
                                                size="small"
                                                sx={{ textTransform: 'lowercase' }}
                                            >
                                                #{tag}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Component Override Info */}
                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Component Style')}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {componentOverrideInfo?.name || currentComponentOverride}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {componentOverrideInfo?.description || 'No description available'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                        {componentOverrideInfo?.tags?.map((tag) => (
                                            <Button
                                                key={tag}
                                                variant="outlined"
                                                size="small"
                                                sx={{ textTransform: 'lowercase' }}
                                            >
                                                #{tag}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Typography Info */}
                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        {translate('Typography Style')}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {typographyInfo?.name || currentTypography}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {typographyInfo?.description || 'No description available'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                        {typographyInfo?.tags?.map((tag) => (
                                            <Button
                                                key={tag}
                                                variant="outlined"
                                                size="small"
                                                sx={{ textTransform: 'lowercase' }}
                                            >
                                                #{tag}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Color Palette */}
                        <Typography variant="h5" gutterBottom>
                            {translate('Color Palette')}
                        </Typography>
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
                            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                                {translate('PrimaryButton')}
                            </Button>
                            <Button variant="contained" color="secondary" sx={{ mr: 2 }}>
                                {translate('SecondaryButton')}
                            </Button>
                            <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
                                {translate('OutlinedButton')}
                            </Button>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Button Font: {fontInfo.button}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Example;