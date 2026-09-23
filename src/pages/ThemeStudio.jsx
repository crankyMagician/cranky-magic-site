import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
    Card,
    CardContent,
    CardActions,
    LinearProgress,
    Slider,
    useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import {
    setTheme,
    setComponentOverride,
    setTypography,
} from '../reducers/themeSlice';
import ThemeService from '../services/ThemeService';
import { getAllThemes } from '../themes/themeRegistry';
import { getAvailableComponentOverrideIds } from '../themes/muicomponents';
import { getAvailableTypographyIds } from '../themes/typography';
import { buildThemeExport } from '../themes/exportTheme';
import { downloadJson } from '../utilities/downloadFile';
import BrandEditor from '../components/brand/BrandEditor';
import PalettePanel from '../components/brand/PalettePanel';
import AdvancedPalette from '../components/brand/AdvancedPalette';
import SavedPalettes from '../components/brand/SavedPalettes';
import ComponentSettings from '../components/brand/ComponentSettings';
import AnimationShowcase from '../components/animation/AnimationShowcase';

const ThemeStudio = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const themeId = useSelector(state => state.theme.mode);
    const componentOverride = useSelector(state => state.theme.componentOverride);
    const typography = useSelector(state => state.theme.typography);
    const animation = useSelector(state => state.theme.animation);
    const animationSpeed = useSelector(state => state.theme.animationSpeed);
    const reducedMotion = useSelector(state => state.theme.reducedMotion);
    const customBrand = useSelector(state => state.theme.customBrand);
    const componentSettings = useSelector(state => state.theme.componentSettings);

    const themes = useMemo(() => getAllThemes(), []);
    const componentOverrides = useMemo(() => getAvailableComponentOverrideIds(), []);
    const typographies = useMemo(() => getAvailableTypographyIds(), []);

    // Re-mounting the preview restarts its CSS animations, which is what makes a change of
    // pack or speed visible straight away instead of on the next loop.
    const [replayKey, setReplayKey] = useState(0);
    useEffect(() => {
        setReplayKey((k) => k + 1);
    }, [animation, animationSpeed, reducedMotion, componentOverride, themeId]);

    const entrance = theme.animation?.entrance;
    const enterSx = useCallback(
        (index) => theme.animation?.sx(entrance, { duration: 0.7, delay: index * 0.09 }) || {},
        [theme.animation, entrance],
    );

    const pickTheme = useCallback((id) => {
        dispatch(setTheme(id));
        ThemeService.setTheme(id);
    }, [dispatch]);

    const pickComponentOverride = useCallback((id) => {
        dispatch(setComponentOverride(id));
        ThemeService.setComponentOverride(id);
    }, [dispatch]);

    const pickTypography = useCallback((id) => {
        dispatch(setTypography(id));
        ThemeService.setTypography(id);
    }, [dispatch]);

    const handleExport = useCallback(() => {
        const payload = buildThemeExport({
            themeId,
            componentOverride,
            typography,
            animation,
            animationSpeed,
            reducedMotion,
            customBrand,
            componentSettings,
        });
        const stamp = new Date().toISOString().split('T')[0];
        downloadJson(`brand-${stamp}.json`, payload);
    }, [themeId, componentOverride, typography, animation, animationSpeed, reducedMotion,
        customBrand, componentSettings]);

    return (
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', py: 5 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    Theme Studio
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 720 }}>
                    Pick a palette and a feel, watch every component below repaint, then export the whole
                    configuration as JSON.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                    sx={{ mb: 5 }}
                >
                    Export as JSON
                </Button>

                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Palette
                </Typography>
                <Grid container spacing={2} sx={{ mb: 5 }} data-testid="preset-grid">
                    {themes.map((t) => {
                        const active = t.id === themeId;
                        return (
                            <Grid item xs={6} sm={4} md={3} key={t.id}>
                                <Paper
                                    onClick={() => pickTheme(t.id)}
                                    elevation={active ? 8 : 1}
                                    sx={{
                                        p: 1.5,
                                        cursor: 'pointer',
                                        outline: active ? `2px solid ${theme.palette.primary.main}` : 'none',
                                        transition: 'transform 120ms ease, box-shadow 120ms ease',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', height: 34, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                                        <Box sx={{ flex: 2, bgcolor: t.palette?.primary?.main }} />
                                        <Box sx={{ flex: 1, bgcolor: t.palette?.secondary?.main }} />
                                        <Box sx={{ flex: 1, bgcolor: t.palette?.background?.default }} />
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                                        {t.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {t.id}
                                    </Typography>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

                <Divider sx={{ mb: 4 }} />

                <BrandEditor />

                <Divider sx={{ mb: 4 }} />

                <SavedPalettes />

                <Divider sx={{ mb: 4 }} />

                <AdvancedPalette />

                <Divider sx={{ mb: 4 }} />

                <PalettePanel />

                <Divider sx={{ mb: 4 }} />

                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Feel
                </Typography>
                <Grid container spacing={2} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="co-label">Component style</InputLabel>
                            <Select
                                labelId="co-label"
                                label="Component style"
                                value={componentOverride}
                                onChange={(e) => pickComponentOverride(e.target.value)}
                            >
                                {componentOverrides.map(id => <MenuItem key={id} value={id}>{id}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="ty-label">Typography</InputLabel>
                            <Select
                                labelId="ty-label"
                                label="Typography"
                                value={typography}
                                onChange={(e) => pickTypography(e.target.value)}
                            >
                                {typographies.map(id => <MenuItem key={id} value={id}>{id}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <ComponentSettings />

                <Divider sx={{ mb: 4 }} />

                <AnimationShowcase />

                <Divider sx={{ mb: 4 }} />

                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Live preview
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }} key={replayKey} data-testid="live-preview">
                    <Grid item xs={12} md={6}>
                        <Card sx={enterSx(0)} data-testid="preview-card-0">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Buttons and chips</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                    <Button variant="contained">Contained</Button>
                                    <Button variant="outlined">Outlined</Button>
                                    <Button variant="text">Text</Button>
                                    <Button variant="contained" color="secondary">Secondary</Button>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label="primary" color="primary" />
                                    <Chip label="secondary" color="secondary" />
                                    <Chip label="success" color="success" />
                                    <Chip label="warning" color="warning" />
                                    <Chip label="error" color="error" />
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Action</Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={enterSx(1)} data-testid="preview-card-1">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Inputs</Typography>
                                <TextField fullWidth size="small" label="Text field" defaultValue="Sample value" sx={{ mb: 2 }} />
                                <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
                                <Box sx={{ px: 1, mt: 1 }}>
                                    <Slider defaultValue={60} />
                                </Box>
                                <LinearProgress variant="determinate" value={60} sx={{ mt: 1 }} />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={enterSx(2)} data-testid="preview-card-2">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Type scale</Typography>
                                <Typography variant="h4">Heading four</Typography>
                                <Typography variant="h6">Heading six</Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Body text renders in the selected typography pack, so switching packs changes
                                    the font stack across the page.
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Caption text
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={enterSx(3)} data-testid="preview-card-3">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Feedback</Typography>
                                <Alert severity="success" sx={{ mb: 1 }}>Success message</Alert>
                                <Alert severity="info" sx={{ mb: 1 }}>Info message</Alert>
                                <Alert severity="warning" sx={{ mb: 1 }}>Warning message</Alert>
                                <Alert severity="error">Error message</Alert>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                        Current configuration
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip size="small" label={`theme: ${themeId}`} />
                        <Chip size="small" label={`components: ${componentOverride}`} />
                        <Chip size="small" label={`typography: ${typography}`} />
                        <Chip size="small" label={`animation: ${animation}`} />
                        <Chip size="small" label={`speed: ${animationSpeed}`} />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ThemeStudio;
