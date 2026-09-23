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
import { isHex } from '../../themes/colorMath';
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
 * One value. A colour input appears only when the value is a plain hex, because most of
 * these are rgba strings, gradients or shadow stacks that no colour picker can hold.
 * The preview box paints the raw value, so a gradient shows as a gradient.
 */
const ValueField = ({ label, hint, value, overridden, onChange, onReset, testId, numeric }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {!numeric && (
            <Tooltip title={String(value ?? '')}>
                <Box
                    data-testid={`${testId}-preview`}
                    sx={{
                        width: 34,
                        height: 30,
                        flexShrink: 0,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: value || 'transparent',
                    }}
                />
            </Tooltip>
        )}
        {!numeric && isHex(value) && (
            <Box
                component="input"
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`${testId}-picker`}
                sx={{
                    width: 34, height: 30, p: 0, flexShrink: 0, cursor: 'pointer',
                    border: '1px solid', borderColor: 'divider', borderRadius: 1, background: 'none',
                }}
            />
        )}
        <TextField
            fullWidth
            size="small"
            label={label}
            helperText={hint}
            type={numeric ? 'number' : 'text'}
            value={value ?? ''}
            onChange={(e) => onChange(numeric ? Number(e.target.value) : e.target.value)}
            inputProps={{
                'data-testid': testId,
                spellCheck: false,
                ...(numeric ? { step: 0.01, min: 0, max: 1 } : {}),
            }}
            sx={{ '& input': { fontFamily: 'monospace', fontSize: 12 } }}
        />
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
    </Box>
);

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
