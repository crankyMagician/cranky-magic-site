import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
    Collapse,
    Divider,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Autocomplete,
    Chip,
    MenuItem,
    Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CasinoIcon from '@mui/icons-material/Casino';

import {
    setCustomBrand,
    updateBrandField,
    setBrandMode,
    resetCustomBrand,
    setAnimation,
    setAnimationSpeed,
    setComponentSettings,
    setComponentOverride,
    setTypography,
} from '../../reducers/themeSlice';
import { createBrandFromTheme, isHex } from '../../themes/customPalette';
import { parseBrandJson } from '../../themes/importBrand';
import { COLOR_GROUPS, STATUS_GROUPS } from '../../themes/siteBrandInfo';
import { contrastRatio } from '../../themes/colorMath';
import { BUNDLED_FONTS, isBundledFont, fontsFromTypography } from '../../themes/brandFonts';
import { getTypographyStylesById } from '../../themes/typography';
import { SCHEMES, randomSeed, randomScheme, generateBrandColors } from '../../themes/paletteGenerator';
import ColorPicker from './ColorPicker';

const COMPANY_FIELDS = ['name', 'tagline', 'website', 'portal'];
const LOGO_TEXT_FIELDS = ['app', 'appDark', 'appAccent', 'appAccentDark', 'email', 'emailDark', 'emailAccent'];
const LOGO_NUM_FIELDS = ['emailWidth', 'emailHeight'];

const subKeysFor = (group) =>
    STATUS_GROUPS.includes(group)
        ? ['main', 'light', 'dark', 'contrastText', 'text', 'icon']
        : ['main', 'light', 'dark', 'contrastText'];

// Alpha is off everywhere in this editor: these fields feed ringle's colour block, whose
// schema is hex, and isHex silently drops anything else. The text field beside the picker
// is the "type it yourself" route and keeps its original testid.
const Swatch = ({ value, onChange, testId, label, quickPicks = [] }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ColorPicker
            value={isHex(value) ? value : undefined}
            onChange={onChange}
            allowAlpha={false}
            quickPicks={quickPicks}
            testId={testId}
            label={label}
            size={40}
        />
        <TextField
            size="small"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            inputProps={{ 'data-testid': `${testId}-hex`, spellCheck: false }}
            error={!!value && !isHex(value)}
            sx={{ width: 110, '& input': { fontFamily: 'monospace', fontSize: 13 } }}
        />
    </Box>
);

/**
 * Live WCAG readout. ringle's own test suite asserts AA (4.5) for every main against its
 * contrastText and for every status text against the page background, so the editor shows
 * the same number rather than letting someone discover it in CI.
 */
const ContrastBadge = ({ foreground, background, label, testId }) => {
    if (!isHex(foreground) || !isHex(background)) return null;
    const ratio = contrastRatio(foreground, background);
    const passes = ratio >= 4.5;
    return (
        <Tooltip title={`${label}: ${ratio.toFixed(2)}:1 (WCAG AA needs 4.5)`}>
            <Chip
                size="small"
                label={`${ratio.toFixed(1)}:1`}
                color={passes ? 'success' : 'warning'}
                variant={passes ? 'outlined' : 'filled'}
                data-testid={testId}
                sx={{ height: 20, fontSize: 11 }}
            />
        </Tooltip>
    );
};

const ColorGroupRow = ({ group, values, onChange, background, quickPicks }) => {
    const [open, setOpen] = useState(false);
    const keys = subKeysFor(group);
    const isStatus = STATUS_GROUPS.includes(group);

    return (
        <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 110 }}>
                    {group}
                </Typography>
                <Swatch
                    value={values?.main}
                    onChange={(v) => onChange(group, 'main', v)}
                    testId={`color-${group}-main`}
                    label={`${group} main`}
                    quickPicks={quickPicks}
                />
                <ContrastBadge
                    foreground={values?.contrastText}
                    background={values?.main}
                    label={`${group} contrastText on main`}
                    testId={`contrast-${group}-main`}
                />
                {isStatus && (
                    <ContrastBadge
                        foreground={values?.text}
                        background={background}
                        label={`${group} text on page background`}
                        testId={`contrast-${group}-text`}
                    />
                )}
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                    size="small"
                    onClick={() => setOpen(!open)}
                    data-testid={`expand-${group}`}
                    aria-label={`expand ${group}`}
                    sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </Box>

            <Collapse in={open} unmountOnExit>
                <Divider sx={{ my: 1.5 }} />
                <Grid container spacing={1.5}>
                    {keys.filter(k => k !== 'main').map((key) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="caption" sx={{ minWidth: 92, color: 'text.secondary' }}>
                                    {key}
                                </Typography>
                                <Swatch
                                    value={values?.[key]}
                                    onChange={(v) => onChange(group, key, v)}
                                    testId={`color-${group}-${key}`}
                                    label={`${group} ${key}`}
                                    quickPicks={quickPicks}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Collapse>
        </Paper>
    );
};

const BrandEditor = () => {
    const dispatch = useDispatch();
    const customBrand = useSelector(state => state.theme.customBrand);
    const brandMode = useSelector(state => state.theme.brandMode);
    const themeId = useSelector(state => state.theme.mode);

    const typographyId = useSelector(state => state.theme.typography);

    const [importText, setImportText] = useState('');
    const [importError, setImportError] = useState(null);
    const [importOk, setImportOk] = useState(false);
    const [seed, setSeed] = useState('#297B66');
    const [scheme, setScheme] = useState('complementary');

    // Fork with the fonts the selected typography pack actually uses. Passing nothing here
    // used to make every fork claim Inter regardless of what was on screen.
    const startFromCurrent = useCallback(() => {
        const fonts = fontsFromTypography(getTypographyStylesById(typographyId));
        dispatch(setCustomBrand(createBrandFromTheme(themeId, fonts)));
    }, [dispatch, themeId, typographyId]);

    const applyGenerated = useCallback((nextSeed, nextScheme) => {
        const fonts = customBrand?.fonts || fontsFromTypography(getTypographyStylesById(typographyId));
        const base = customBrand || createBrandFromTheme(themeId, fonts);
        dispatch(setCustomBrand({
            ...base,
            fonts,
            colors: generateBrandColors(nextSeed, nextScheme),
        }));
    }, [dispatch, customBrand, themeId, typographyId]);

    const randomize = useCallback(() => {
        const nextSeed = randomSeed();
        const nextScheme = randomScheme();
        setSeed(nextSeed);
        setScheme(nextScheme);
        applyGenerated(nextSeed, nextScheme);
    }, [applyGenerated]);

    const setField = useCallback((path, value) => {
        dispatch(updateBrandField({ path, value }));
    }, [dispatch]);

    const onColorChange = useCallback((group, key, value) => {
        dispatch(updateBrandField({ path: ['colors', brandMode, group, key], value }));
    }, [dispatch, brandMode]);

    const applyImport = useCallback((text) => {
        const result = parseBrandJson(text);
        if (!result.ok) {
            setImportError(result.error);
            setImportOk(false);
            return;
        }
        setImportError(null);
        setImportOk(true);
        dispatch(setCustomBrand(result.brand));

        // A bare ringle brand.json carries neither of these, so both are optional.
        if (result.animation) {
            if (result.animation.pack) dispatch(setAnimation(result.animation.pack));
            if (Number.isFinite(Number(result.animation.speed))) {
                dispatch(setAnimationSpeed(Number(result.animation.speed)));
            }
        }
        if (result.components) {
            dispatch(setComponentSettings(result.components.settings));
            if (result.components.override) dispatch(setComponentOverride(result.components.override));
            if (result.components.typography) dispatch(setTypography(result.components.typography));
        }
    }, [dispatch]);

    const onFile = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => applyImport(String(reader.result || ''));
        reader.onerror = () => setImportError('Could not read that file.');
        reader.readAsText(file);
        e.target.value = '';
    }, [applyImport]);

    const colors = useMemo(
        () => customBrand?.colors?.[brandMode] || {},
        [customBrand, brandMode],
    );

    // Colours already chosen in this palette, offered inside every picker so a hue can be
    // reused without copying a hex by hand.
    const quickPicks = useMemo(() => ([
        ...COLOR_GROUPS.map((g) => colors[g]?.main),
        colors.background?.default,
        colors.background?.paper,
        colors.text?.primary,
        colors.text?.secondary,
    ].filter(Boolean)), [colors]);

    return (
        <Box sx={{ mb: 5 }} data-testid="brand-editor">
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Design your own
            </Typography>

            {!customBrand && (
                <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Fork the theme you have selected into an editable brand, then change any colour,
                        logo, font or company field and export the result as a brand.json.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={startFromCurrent} data-testid="brand-activate">
                            Start from "{themeId}"
                        </Button>
                        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                            Import brand.json
                            <input hidden type="file" accept="application/json,.json" onChange={onFile} />
                        </Button>
                    </Box>
                </Paper>
            )}

            {customBrand && (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <ToggleButtonGroup
                            size="small"
                            exclusive
                            value={brandMode}
                            onChange={(e, v) => v && dispatch(setBrandMode(v))}
                        >
                            <ToggleButton value="light" data-testid="brand-mode-light">Light</ToggleButton>
                            <ToggleButton value="dark" data-testid="brand-mode-dark">Dark</ToggleButton>
                        </ToggleButtonGroup>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Editing the {brandMode} palette. Light and dark are stored separately.
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            size="small"
                            color="inherit"
                            startIcon={<RestartAltIcon />}
                            onClick={() => dispatch(resetCustomBrand())}
                            data-testid="brand-reset"
                        >
                            Discard
                        </Button>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                            Generate a palette
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Swatch value={seed} onChange={setSeed} testId="generator-seed" label="seed colour" quickPicks={quickPicks} />
                            <TextField
                                select
                                size="small"
                                label="Harmony"
                                value={scheme}
                                onChange={(e) => setScheme(e.target.value)}
                                sx={{ minWidth: 200 }}
                                SelectProps={{ inputProps: { 'data-testid': 'generator-scheme' } }}
                            >
                                {SCHEMES.map((s) => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                onClick={() => applyGenerated(seed, scheme)}
                                data-testid="generator-apply"
                            >
                                Build from seed
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<CasinoIcon />}
                                onClick={randomize}
                                data-testid="generator-random"
                            >
                                Surprise me
                            </Button>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5 }}>
                            Generating replaces both the light and the dark palette. Status colours keep
                            their recognisable hues and are contrast-checked against the page background.
                        </Typography>
                    </Paper>

                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600 }}>Colors</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {COLOR_GROUPS.map((group) => (
                                <ColorGroupRow
                                    key={group}
                                    group={group}
                                    values={colors[group]}
                                    onChange={onColorChange}
                                    background={colors.background?.default}
                                    quickPicks={quickPicks}
                                />
                            ))}

                            <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>background</Typography>
                                <Grid container spacing={1.5}>
                                    {['default', 'paper'].map((key) => (
                                        <Grid item xs={12} sm={6} key={key}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography variant="caption" sx={{ minWidth: 92, color: 'text.secondary' }}>
                                                    {key}
                                                </Typography>
                                                <Swatch
                                                    value={colors.background?.[key]}
                                                    onChange={(v) => onColorChange('background', key, v)}
                                                    testId={`color-background-${key}`}
                                                    label={`background ${key}`}
                                                    quickPicks={quickPicks}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 1.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>text</Typography>
                                <Grid container spacing={1.5}>
                                    {['primary', 'secondary', 'disabled'].map((key) => (
                                        <Grid item xs={12} sm={4} key={key}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography variant="caption" sx={{ minWidth: 70, color: 'text.secondary' }}>
                                                    {key}
                                                </Typography>
                                                <Swatch
                                                    value={colors.text?.[key]}
                                                    onChange={(v) => onColorChange('text', key, v)}
                                                    testId={`color-text-${key}`}
                                                    label={`text ${key}`}
                                                    quickPicks={quickPicks}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600 }}>Company</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {COMPANY_FIELDS.map((key) => (
                                    <Grid item xs={12} sm={6} key={key}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={key}
                                            value={customBrand.company?.[key] || ''}
                                            onChange={(e) => setField(['company', key], e.target.value)}
                                            inputProps={{ 'data-testid': `company-${key}` }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600 }}>Logo</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {LOGO_TEXT_FIELDS.map((key) => (
                                    <Grid item xs={12} sm={6} key={key}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={key}
                                            value={customBrand.logo?.[key] || ''}
                                            onChange={(e) => setField(['logo', key], e.target.value)}
                                            inputProps={{ 'data-testid': `logo-${key}` }}
                                        />
                                    </Grid>
                                ))}
                                {LOGO_NUM_FIELDS.map((key) => (
                                    <Grid item xs={6} sm={3} key={key}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label={key}
                                            value={customBrand.logo?.[key] ?? ''}
                                            onChange={(e) => setField(['logo', key], parseInt(e.target.value, 10) || 0)}
                                            inputProps={{ 'data-testid': `logo-${key}` }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600 }}>Fonts</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {['heading', 'body'].map((key) => {
                                    const value = customBrand.fonts?.[key] || '';
                                    const unbundled = value && !isBundledFont(value);
                                    return (
                                        <Grid item xs={12} sm={6} key={key}>
                                            <Autocomplete
                                                freeSolo
                                                options={BUNDLED_FONTS}
                                                value={value}
                                                onChange={(e, v) => setField(['fonts', key], v || '')}
                                                onInputChange={(e, v) => setField(['fonts', key], v || '')}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        label={key}
                                                        helperText={unbundled
                                                            ? 'Not bundled, fetched from Google Fonts'
                                                            : ' '}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            'data-testid': `font-${key}`,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    );
                                })}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="emailStack"
                                        helperText="Used by email templates only. Does not affect this page."
                                        value={customBrand.fonts?.emailStack || ''}
                                        onChange={(e) => setField(['fonts', 'emailStack'], e.target.value)}
                                        inputProps={{ 'data-testid': 'font-emailStack' }}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600 }}>Import</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                                    Choose file
                                    <input hidden type="file" accept="application/json,.json" onChange={onFile} />
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => applyImport(importText)}
                                    data-testid="brand-import-apply"
                                >
                                    Apply pasted JSON
                                </Button>
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={12}
                                placeholder='Paste a brand.json here, then press "Apply pasted JSON".'
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                inputProps={{ 'data-testid': 'brand-import-text', spellCheck: false }}
                                sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 12 } }}
                            />
                            {importError && (
                                <Alert severity="error" sx={{ mt: 2 }} data-testid="brand-import-error">
                                    {importError}
                                </Alert>
                            )}
                            {importOk && !importError && (
                                <Alert severity="success" sx={{ mt: 2 }} data-testid="brand-import-ok">
                                    Brand imported.
                                </Alert>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </>
            )}
        </Box>
    );
};

export default BrandEditor;
