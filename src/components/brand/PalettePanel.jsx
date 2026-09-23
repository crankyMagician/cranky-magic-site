import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

import { COLOR_GROUPS, STATUS_GROUPS } from '../../themes/siteBrandInfo';
import {
    TERTIARY_KEYS,
    GREY_KEYS,
    ACTION_COLOR_KEYS,
    CUSTOM_KEYS,
} from '../../themes/paletteKeys';

// Every swatch reads from the built MUI theme rather than from the editor's state. A
// field that never reaches the palette therefore shows its old value here, which is
// exactly how the status text and icon keys were caught doing nothing.

const keysFor = (group) =>
    STATUS_GROUPS.includes(group)
        ? ['main', 'light', 'dark', 'contrastText', 'text', 'icon']
        : ['main', 'light', 'dark', 'contrastText'];

// `background` rather than `backgroundColor`, so a gradient renders as a gradient. The
// value is also printed, which is what makes a shadow stack (not paintable as a
// background) still verifiable: the text comes from the built theme either way.
const Swatch = ({ label, value, testId, wide }) => (
    <Box sx={{ minWidth: wide ? 210 : 92, maxWidth: wide ? 210 : 'none' }}>
        <Box
            data-testid={testId}
            sx={{
                height: 40,
                borderRadius: 1,
                background: value || 'transparent',
                boxShadow: wide && /px/.test(String(value)) ? value : 'none',
                border: '1px solid',
                borderColor: 'divider',
            }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10, display: 'block' }}>
            {label}
        </Typography>
        <Typography
            variant="caption"
            data-testid={`${testId}-value`}
            sx={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: 'text.disabled',
                display: 'block',
                wordBreak: 'break-all',
            }}
        >
            {value || '—'}
        </Typography>
    </Box>
);

const Row = ({ title, children }) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75 }}>
            {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{children}</Box>
    </Box>
);

const PalettePanel = () => {
    const theme = useTheme();
    const p = theme.palette;

    return (
        <Box sx={{ mb: 5 }} data-testid="palette-panel">
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Live palette
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
                {COLOR_GROUPS.map((group) => (
                    <Row key={group} title={group}>
                        {keysFor(group).map((key) => (
                            <Swatch
                                key={key}
                                label={key}
                                value={p?.[group]?.[key]}
                                testId={`palette-swatch-${group}-${key}`}
                            />
                        ))}
                    </Row>
                ))}

                <Row title="background">
                    {['default', 'paper'].map((key) => (
                        <Swatch
                            key={key}
                            label={key}
                            value={p?.background?.[key]}
                            testId={`palette-swatch-background-${key}`}
                        />
                    ))}
                </Row>

                <Row title="text">
                    {['primary', 'secondary', 'disabled'].map((key) => (
                        <Swatch
                            key={key}
                            label={key}
                            value={p?.text?.[key]}
                            testId={`palette-swatch-text-${key}`}
                        />
                    ))}
                </Row>

                <Row title="tertiary">
                    {TERTIARY_KEYS.map((key) => (
                        <Swatch
                            key={key}
                            label={key}
                            value={p?.tertiary?.[key]}
                            testId={`palette-swatch-tertiary-${key}`}
                        />
                    ))}
                </Row>

                <Row title="divider">
                    <Swatch label="divider" value={p?.divider} testId="palette-swatch-divider-divider" />
                </Row>

                <Row title="grey">
                    {GREY_KEYS.map((key) => (
                        <Swatch
                            key={key}
                            label={key}
                            value={p?.grey?.[key]}
                            testId={`palette-swatch-grey-${key}`}
                        />
                    ))}
                </Row>

                <Row title="action">
                    {ACTION_COLOR_KEYS.map((key) => (
                        <Swatch
                            key={key}
                            label={key}
                            value={p?.action?.[key]}
                            testId={`palette-swatch-action-${key}`}
                        />
                    ))}
                </Row>

                <Row title="effects">
                    {CUSTOM_KEYS.map((key) => (
                        <Swatch
                            key={key}
                            label={key}
                            value={key === 'glowText' ? p?.custom?.glowText?.textShadow : p?.custom?.[key]}
                            testId={`palette-swatch-custom-${key}`}
                            wide
                        />
                    ))}
                </Row>
            </Paper>
        </Box>
    );
};

export default PalettePanel;
