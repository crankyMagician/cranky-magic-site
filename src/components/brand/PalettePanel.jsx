import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

import { COLOR_GROUPS, STATUS_GROUPS } from '../../themes/siteBrandInfo';

// Every swatch reads from the built MUI theme rather than from the editor's state. A
// field that never reaches the palette therefore shows its old value here, which is
// exactly how the status text and icon keys were caught doing nothing.

const keysFor = (group) =>
    STATUS_GROUPS.includes(group)
        ? ['main', 'light', 'dark', 'contrastText', 'text', 'icon']
        : ['main', 'light', 'dark', 'contrastText'];

const Swatch = ({ label, value, testId }) => (
    <Box sx={{ minWidth: 92 }}>
        <Box
            data-testid={testId}
            sx={{
                height: 40,
                borderRadius: 1,
                backgroundColor: value || 'transparent',
                border: '1px solid',
                borderColor: 'divider',
            }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10, display: 'block' }}>
            {label}
        </Typography>
        <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', fontSize: 10, color: 'text.disabled', display: 'block' }}
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
            </Paper>
        </Box>
    );
};

export default PalettePanel;
