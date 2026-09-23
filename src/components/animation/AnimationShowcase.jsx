import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Slider,
    Switch,
    FormControlLabel,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
    useTheme,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

import { setAnimation, setAnimationSpeed, toggleReducedMotion } from '../../reducers/themeSlice';
import { getAllAnimations } from '../../themes/animations';

const SPEED_MARKS = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' },
];

const AnimationShowcase = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const pack = useSelector(state => state.theme.animation);
    const speed = useSelector(state => state.theme.animationSpeed);
    const reducedMotion = useSelector(state => state.theme.reducedMotion);

    const packs = useMemo(() => getAllAnimations(), []);
    const [replayKey, setReplayKey] = useState(0);

    const animation = theme.animation;
    const names = animation?.names || [];

    // Restart every tile when the pack or the speed changes, so a change is something you
    // see rather than something you have to wait for the next loop to notice.
    useEffect(() => {
        setReplayKey((k) => k + 1);
    }, [pack, speed, reducedMotion]);

    const replay = useCallback(() => setReplayKey((k) => k + 1), []);

    return (
        <Box sx={{ mb: 5 }} data-testid="animation-showcase">
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Animation
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={pack}
                        onChange={(e, value) => value && dispatch(setAnimation(value))}
                        data-testid="animation-pack-group"
                    >
                        {packs.map((p) => (
                            <ToggleButton key={p.id} value={p.id} data-testid={`animation-pack-${p.id}`}>
                                {p.name}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <Box sx={{ flexGrow: 1 }} />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={reducedMotion}
                                onChange={() => dispatch(toggleReducedMotion())}
                                inputProps={{ 'data-testid': 'reduced-motion-switch' }}
                            />
                        }
                        label="Reduced motion"
                    />

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ReplayIcon />}
                        onClick={replay}
                        data-testid="animation-replay"
                    >
                        Replay
                    </Button>
                </Box>

                <Box sx={{ px: 1, maxWidth: 460 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Speed
                    </Typography>
                    <Slider
                        value={speed}
                        min={0.5}
                        max={3}
                        step={0.1}
                        marks={SPEED_MARKS}
                        valueLabelDisplay="auto"
                        onChange={(e, value) => dispatch(setAnimationSpeed(value))}
                        data-testid="animation-speed-slider"
                    />
                </Box>
            </Paper>

            {reducedMotion && (
                <Alert severity="info" sx={{ mb: 2 }} data-testid="reduced-motion-notice">
                    Reduced motion is on, so every animation is held still and page transitions are
                    instant. Turn it off to see the pack play.
                </Alert>
            )}

            {!names.length && !reducedMotion && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    This pack has no animations.
                </Alert>
            )}

            <Grid container spacing={1.5}>
                {names.map((name) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={`${name}-${replayKey}`}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1.5,
                                textAlign: 'center',
                                overflow: 'hidden',
                                minHeight: 104,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                            }}
                        >
                            <Box
                                data-testid={`anim-tile-${name}`}
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 1,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    ...(animation?.sx(name, { duration: 1.8, iterations: 'infinite' }) || {}),
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontFamily: 'monospace',
                                    fontSize: 11,
                                    wordBreak: 'break-all',
                                    lineHeight: 1.2,
                                }}
                            >
                                {name}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AnimationShowcase;
