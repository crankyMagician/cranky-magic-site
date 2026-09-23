import React, { useState, useCallback } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import {
    setCustomBrand,
    updateBrandField,
    setBrandMode,
    resetCustomBrand,
} from '../../reducers/themeSlice';
import { createBrandFromTheme, isHex } from '../../themes/customPalette';
import { parseBrandJson } from '../../themes/importBrand';
import { COLOR_GROUPS, STATUS_GROUPS } from '../../themes/siteBrandInfo';

const COMPANY_FIELDS = ['name', 'tagline', 'website', 'portal'];
const LOGO_TEXT_FIELDS = ['app', 'appDark', 'appAccent', 'appAccentDark', 'email', 'emailDark', 'emailAccent'];
const LOGO_NUM_FIELDS = ['emailWidth', 'emailHeight'];
const FONT_FIELDS = ['heading', 'body', 'emailStack'];

const subKeysFor = (group) =>
    STATUS_GROUPS.includes(group)
        ? ['main', 'light', 'dark', 'contrastText', 'text', 'icon']
        : ['main', 'light', 'dark', 'contrastText'];

const Swatch = ({ value, onChange, testId }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
            component="input"
            type="color"
            value={isHex(value) ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            data-testid={testId}
            sx={{
                width: 40,
                height: 32,
                p: 0,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                background: 'none',
            }}
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

const ColorGroupRow = ({ group, values, onChange }) => {
    const [open, setOpen] = useState(false);
    const keys = subKeysFor(group);

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
                />
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

    const [importText, setImportText] = useState('');
    const [importError, setImportError] = useState(null);
    const [importOk, setImportOk] = useState(false);

    const startFromCurrent = useCallback(() => {
        dispatch(setCustomBrand(createBrandFromTheme(themeId)));
    }, [dispatch, themeId]);

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

    const colors = customBrand?.colors?.[brandMode] || {};

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
                                {FONT_FIELDS.map((key) => (
                                    <Grid item xs={12} sm={key === 'emailStack' ? 12 : 6} key={key}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={key}
                                            value={customBrand.fonts?.[key] || ''}
                                            onChange={(e) => setField(['fonts', key], e.target.value)}
                                            inputProps={{ 'data-testid': `font-${key}` }}
                                        />
                                    </Grid>
                                ))}
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
