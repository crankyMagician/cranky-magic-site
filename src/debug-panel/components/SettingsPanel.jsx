// debug-panel/components/SettingsPanel.jsx
import React from 'react';
import { Box, Typography, Button, Divider, Paper } from '@mui/material';

const SettingsPanel = ({
                           resetPosition,
                           toggleOpacity,
                           handleResetPassword,
                           opacity,
                           sessionId,
                           themeMode,
                           eventCount,
                           theme,
                           // New props for added components
                           themeToggle,
                           languageSelector
                       }) => {
    return (
        <Box sx={{ p: 2, fontFamily: 'monospace', color: theme.palette.text.primary, overflowY: 'auto', maxHeight: '500px' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                $ PANEL_CONFIG
            </Typography>
            <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    mb: 1,
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: `${theme.palette.primary.main}20`
                    },
                    fontFamily: 'monospace'
                }}
                onClick={resetPosition}
            >
                RESET_POSITION()
            </Button>
            <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    mb: 1,
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: `${theme.palette.primary.main}20`
                    },
                    fontFamily: 'monospace'
                }}
                onClick={toggleOpacity}
            >
                {opacity === 0.9 ? 'SET_OPACITY(0.3)' : 'SET_OPACITY(0.9)'}
            </Button>
            <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: `${theme.palette.primary.main}20`
                    },
                    fontFamily: 'monospace'
                }}
                onClick={handleResetPassword}
            >
                RESET_PASSWORD()
            </Button>

            {/* Theme Toggle Section */}
            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                $ THEME_CONFIG
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    mb: 2,
                    bgcolor: `${theme.palette.background.paper}80`,
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                {themeToggle}
            </Paper>

            {/* Language Selector Section */}
            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                $ LANGUAGE_CONFIG
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    mb: 2,
                    bgcolor: `${theme.palette.background.paper}80`,
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                    Current Language:
                </Typography>
                {languageSelector}
            </Paper>

            {/* Debug Info Section */}
            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                $ DEBUG_INFO
            </Typography>
            <Box sx={{ pl: 1, mb: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                    // Session ID: {sessionId}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                    // Theme: {themeMode}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                    // Analytics Events: {eventCount}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                    // Panel version: 2.1.0 (Analytics Edition)
                </Typography>
            </Box>
        </Box>
    );
};

export default SettingsPanel;