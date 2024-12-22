import * as React from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import ThemeToggle from "../components/demoComponents/ThemeToggle";
import NewsletterSignup from "../components/demoComponents/NewsletterSignup";
import LanguageSwitcher from "../components/demoComponents/LanguageSwitcher";
import useCustomTranslation from "../hooks/useCustomTranslation";

const Example = () => {
    const { translate } = useCustomTranslation();
    return (
        <Box sx={{ p: 4, bgcolor: 'background.paper', flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h1">{translate('WelcomeTitle')}</Typography>
                    <Typography variant="h2">{translate('SubtitleExploringColorsTypography')}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {translate('ToggleThemeDescription')}
                    </Typography>
                    <ThemeToggle />
                    {/* Language Switcher component */}
                    <LanguageSwitcher />
                    <h1>{translate('HelloWorld')}</h1>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Typography variant="body1">{translate('PrimaryColorLabel')}</Typography>
                    <Box sx={{ bgcolor: 'primary.main', p: 1, color: 'white' }}>#556cd6</Box>
                    <Box sx={{ bgcolor: 'primary.light', p: 1, color: 'primary.dark' }}>#8AA8FC</Box>
                    <Box sx={{ bgcolor: 'primary.dark', p: 1, color: 'white' }}>#314DAF</Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Typography variant="body1">{translate('SecondaryColorLabel')}</Typography>
                    <Box sx={{ bgcolor: 'secondary.main', p: 1, color: 'white' }}>#19857b</Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Typography variant="body1">{translate('TertiaryColorLabel')}</Typography>
                    <Box sx={{ bgcolor: 'tertiary.main', p: 1, color: 'white' }}>#F9A825</Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        {translate('BodyTextSample')}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary">
                        {translate('PrimaryButton')}
                    </Button>
                    <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
                        {translate('SecondaryButton')}
                    </Button>
                    <Button variant="text" color="tertiary" sx={{ ml: 2 }}>
                        {translate('TertiaryButtonText')}
                    </Button>
                </Grid>
                {/* Adding the NewsletterSignup component */}
                <Grid item xs={12}>
                    <NewsletterSignup />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Example;
