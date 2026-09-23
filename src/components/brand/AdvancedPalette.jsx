import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Chip,
    Tooltip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { updateBrandField, clearPaletteOverride, clearPaletteSection } from '../../reducers/themeSlice';
import { findColorTokens, replaceToken, isSingleColor } from '../../themes/cssColors';
import ColorPicker from './ColorPicker';
import {
    PALETTE_SECTIONS,
    ACTION_COLOR_KEYS,
    ACTION_OPACITY_KEYS,
    CUSTOM_LABELS,
} from '../../themes/paletteKeys';

/** What the theme is actually rendering for a key, whichever way it got there. */
const effectiveValue = (palette, section, key) => {
    if (section === 'divider') return palette?.divider;
    if (section === 'custom' && key === 'glowText') return palette?.custom?.glowText?.textShadow;
    return palette?.[section]?.[key];
};

/**
 * One value, in one of three shapes.
 *
 * Numbers (the action opacities) stay a number field. A value that is nothing but a
 * colour gets a single picker. Anything else is a gradient or a shadow stack, and gets
 * one picker per colour inside it, so the angle, the stop percentages and the blur radii
 * are never touched by picking a colour. The raw string stays editable underneath for the
 * parts a colour picker cannot express.
 */
const ValueField = ({ label, hint, value, overridden, onChange, onReset, testId, numeric, quickPicks }) => {
    const raw = typeof value === 'string' ? value : '';
    const tokens = numeric ? [] : findColorTokens(raw);
    const single = !numeric && isSingleColor(raw);

    const setToken = (token, next) => onChange(replaceToken(raw, token, next));

    const resetButton = (
        <Tooltip title={overridden ? 'Reset to the derived value' : 'Currently derived'}>
            <span>
                <IconButton
                    size="small"
                    disabled={!overridden}
                    onClick={onReset}
                    data-testid={`${testId}-reset`}
                >
                    <RestartAltIcon fontSize="small" />
                </IconButton>
            </span>
        </Tooltip>
    );

    if (numeric) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    label={label}
                    helperText={hint}
                    type="number"
                    value={value ?? ''}
                    onChange={(e) => onChange(Number(e.target.value))}
                    inputProps={{ 'data-testid': testId, step: 0.01, min: 0, max: 1 }}
                    sx={{ '& input': { fontFamily: 'monospace', fontSize: 12 } }}
                />
                {resetButton}
            </Box>
        );
    }

    if (single) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ColorPicker
                    value={raw}
                    onChange={onChange}
                    allowAlpha
                    quickPicks={quickPicks}
                    testId={`${testId}-picker`}
                    label={label}
                />
                <TextField
                    fullWidth
                    size="small"
                    label={label}
                    helperText={hint}
                    value={raw}
                    onChange={(e) => onChange(e.target.value)}
                    inputProps={{ 'data-testid': testId, spellCheck: false }}
                    sx={{ '& input': { fontFamily: 'monospace', fontSize: 12 } }}
                />
                {resetButton}
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Tooltip title={raw}>
                    <Box
                        data-testid={`${testId}-preview`}
                        sx={{
                            width: 34,
                            height: 30,
                            flexShrink: 0,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            background: raw || 'transparent',
                            boxShadow: /px/.test(raw) ? raw : 'none',
                        }}
                    />
                </Tooltip>
                <Typography variant="caption" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {label}
                </Typography>
                {resetButton}
            </Box>

            <Box
                sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 0.75 }}
                data-testid={`${testId}-tokens`}
            >
                {tokens.map((token, i) => (
                    <ColorPicker
                        key={`${token.start}-${token.value}`}
                        value={token.kind === 'keyword' ? 'rgba(0, 0, 0, 0)' : token.value}
                        onChange={(next) => setToken(token, next)}
                        allowAlpha
                        quickPicks={quickPicks}
                        testId={`${testId}-token-${i}`}
                        label={`${label}, colour ${i + 1}${token.kind === 'keyword' ? ' (transparent)' : ''}`}
                    />
                ))}
                {tokens.length === 0 && (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        no colours in this value
                    </Typography>
                )}
            </Box>

            <TextField
                fullWidth
                size="small"
                helperText={hint}
                value={raw}
                onChange={(e) => onChange(e.target.value)}
                inputProps={{ 'data-testid': testId, spellCheck: false }}
                sx={{ '& input': { fontFamily: 'monospace', fontSize: 12 } }}
            />
        </Box>
    );
};

const AdvancedPalette = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customBrand = useSelector((state) => state.theme.customBrand);
    const brandMode = useSelector((state) => state.theme.brandMode);

    const overrides = useMemo(
        () => customBrand?.palette?.[brandMode] || {},
        [customBrand, brandMode],
    );

    const isOverridden = useCallback((section, key) => (
        section === 'divider'
            ? overrides.divider !== undefined
            : overrides[section]?.[key] !== undefined
    ), [overrides]);

    const setValue = useCallback((section, key, value) => {
        const path = section === 'divider'
            ? ['palette', brandMode, 'divider']
            : ['palette', brandMode, section, key];
        dispatch(updateBrandField({ path, value }));
    }, [dispatch, brandMode]);

    const reset = useCallback((section, key) => {
        dispatch(clearPaletteOverride({ mode: brandMode, section, key }));
    }, [dispatch, brandMode]);

    // The palette's own colours, offered inside every picker so a gradient stop can reuse
    // a brand colour without hunting for its hex.
    const quickPicks = useMemo(() => {
        const p = theme.palette;
        return [
            p?.primary?.main, p?.secondary?.main, p?.tertiary?.main,
            p?.error?.main, p?.warning?.main, p?.info?.main, p?.success?.main,
            p?.background?.default, p?.background?.paper,
            p?.text?.primary, p?.text?.secondary,
        ].filter(Boolean);
    }, [theme.palette]);

    if (!customBrand) return null;

    const countOverrides = (section) => (section === 'divider'
        ? (overrides.divider !== undefined ? 1 : 0)
        : Object.keys(overrides[section] || {}).length);

    const renderField = (section, key, label, hint, numeric) => (
        <ValueField
            key={key}
            label={label}
            hint={hint}
            numeric={numeric}
            value={effectiveValue(theme.palette, section, key)}
            overridden={isOverridden(section, key)}
            onChange={(v) => setValue(section, key, v)}
            onReset={() => reset(section, key)}
            testId={`adv-${section}-${key}`}
            quickPicks={quickPicks}
        />
    );

    return (
        <Box sx={{ mb: 5 }} data-testid="advanced-palette">
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Theme palette
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, maxWidth: 760 }}>
                Keys the theme system uses that ringle's brand.json has no slot for. Each one is
                worked out from your colours until you set it, and the reset arrow puts it back.
                Overrides are exported under a separate <code>palette</code> key, so the ringle
                half of the file stays exactly as ringle writes it.
            </Typography>

            {PALETTE_SECTIONS.map((section) => {
                const overridden = countOverrides(section.id);
                return (
                    <Accordion key={section.id} data-testid={`adv-section-${section.id}`}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>{section.name}</Typography>
                            {overridden > 0 && (
                                <Chip
                                    size="small"
                                    color="primary"
                                    label={`${overridden} set by hand`}
                                    sx={{ mr: 2, height: 22 }}
                                    data-testid={`adv-badge-${section.id}`}
                                />
                            )}
                        </AccordionSummary>
                        <AccordionDetails>
                            {section.kind === 'single' && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        {renderField('divider', 'divider', 'divider')}
                                    </Grid>
                                </Grid>
                            )}

                            {section.kind === 'group' && (
                                <Grid container spacing={2}>
                                    {section.keys.map((key) => (
                                        <Grid item xs={12} sm={6} md={4} key={key}>
                                            {renderField(section.id, key, key)}
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {section.kind === 'action' && (
                                <>
                                    <Grid container spacing={2}>
                                        {ACTION_COLOR_KEYS.map((key) => (
                                            <Grid item xs={12} sm={6} md={4} key={key}>
                                                {renderField('action', key, key)}
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, mb: 1, display: 'block' }}>
                                        Opacities, used by components that tint rather than replace a colour.
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {ACTION_OPACITY_KEYS.map((key) => (
                                            <Grid item xs={12} sm={6} md={4} key={key}>
                                                {renderField('action', key, key, undefined, true)}
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}

                            {section.kind === 'css' && (
                                <Grid container spacing={2}>
                                    {section.keys.map((key) => (
                                        <Grid item xs={12} md={6} key={key}>
                                            {renderField('custom', key, key, CUSTOM_LABELS[key])}
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {overridden > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        size="small"
                                        color="inherit"
                                        startIcon={<RestartAltIcon />}
                                        onClick={() => dispatch(clearPaletteSection({ mode: brandMode, section: section.id }))}
                                        data-testid={`adv-reset-section-${section.id}`}
                                    >
                                        Reset this section
                                    </Button>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
};

export default AdvancedPalette;
