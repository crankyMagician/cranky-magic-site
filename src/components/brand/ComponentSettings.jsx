import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Slider,
    TextField,
    Button,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { updateComponentSetting, resetComponentSettings } from '../../reducers/themeSlice';
import { TEXT_TRANSFORMS, ELEVATION_STYLES } from '../../themes/generatedOverrides';
import { EASINGS } from '../../themes/animations/animationTheme';

const Knob = ({ label, value, onChange, min, max, step = 1, suffix = 'px', testId }) => (
    <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {label}: {value}{suffix}
        </Typography>
        <Slider
            size="small"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e, v) => onChange(v)}
            data-testid={testId}
        />
    </Box>
);

const ComponentSettings = () => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.theme.componentSettings);

    const set = useCallback((path, value) => {
        dispatch(updateComponentSetting({ path, value }));
    }, [dispatch]);

    return (
        <Box sx={{ mb: 5 }} data-testid="component-settings">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Components
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    size="small"
                    color="inherit"
                    startIcon={<RestartAltIcon />}
                    onClick={() => dispatch(resetComponentSettings())}
                    data-testid="component-settings-reset"
                >
                    Reset
                </Button>
            </Box>

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                            Buttons and inputs
                        </Typography>

                        <Knob
                            label="Corner radius"
                            value={settings.shape.borderRadius}
                            onChange={(v) => set(['shape', 'borderRadius'], v)}
                            min={0}
                            max={24}
                            testId="setting-border-radius"
                        />

                        <Box sx={{ mt: 1.5, mb: 1.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                Label case
                            </Typography>
                            <ToggleButtonGroup
                                size="small"
                                exclusive
                                value={settings.button.textTransform}
                                onChange={(e, v) => v && set(['button', 'textTransform'], v)}
                            >
                                {TEXT_TRANSFORMS.map((t) => (
                                    <ToggleButton key={t} value={t} data-testid={`setting-text-transform-${t}`}>
                                        {t}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>

                        <Knob
                            label="Label weight"
                            value={settings.button.fontWeight}
                            onChange={(v) => set(['button', 'fontWeight'], v)}
                            min={300}
                            max={900}
                            step={100}
                            suffix=""
                            testId="setting-font-weight"
                        />

                        <Knob
                            label="Horizontal padding"
                            value={settings.button.paddingX}
                            onChange={(v) => set(['button', 'paddingX'], v)}
                            min={4}
                            max={40}
                            testId="setting-padding-x"
                        />

                        <Knob
                            label="Vertical padding"
                            value={settings.button.paddingY}
                            onChange={(v) => set(['button', 'paddingY'], v)}
                            min={2}
                            max={24}
                            testId="setting-padding-y"
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Letter spacing"
                            value={settings.button.letterSpacing}
                            onChange={(e) => set(['button', 'letterSpacing'], e.target.value)}
                            inputProps={{ 'data-testid': 'setting-letter-spacing', spellCheck: false }}
                            sx={{ mt: 1.5 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                            Surfaces and motion
                        </Typography>

                        <Knob
                            label="Card radius"
                            value={settings.surface.cardRadius}
                            onChange={(v) => set(['surface', 'cardRadius'], v)}
                            min={0}
                            max={32}
                            testId="setting-card-radius"
                        />

                        <Box sx={{ mt: 1.5, mb: 1.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                Elevation
                            </Typography>
                            <ToggleButtonGroup
                                size="small"
                                exclusive
                                value={settings.surface.elevation}
                                onChange={(e, v) => v && set(['surface', 'elevation'], v)}
                            >
                                {ELEVATION_STYLES.map((t) => (
                                    <ToggleButton key={t} value={t} data-testid={`setting-elevation-${t}`}>
                                        {t}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>

                        <Knob
                            label="Surface border"
                            value={settings.surface.borderWidth}
                            onChange={(v) => set(['surface', 'borderWidth'], v)}
                            min={0}
                            max={4}
                            testId="setting-border-width"
                        />

                        <Divider sx={{ my: 2 }} />

                        <Knob
                            label="Transition duration"
                            value={settings.transitions.duration}
                            onChange={(v) => set(['transitions', 'duration'], v)}
                            min={0}
                            max={800}
                            step={25}
                            suffix="ms"
                            testId="setting-transition-duration"
                        />

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Easing"
                            value={settings.transitions.easing}
                            onChange={(e) => set(['transitions', 'easing'], e.target.value)}
                            sx={{ mt: 1.5 }}
                            SelectProps={{ inputProps: { 'data-testid': 'setting-easing' } }}
                        >
                            {Object.entries(EASINGS).map(([name, curve]) => (
                                <MenuItem key={name} value={curve}>{name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ComponentSettings;
