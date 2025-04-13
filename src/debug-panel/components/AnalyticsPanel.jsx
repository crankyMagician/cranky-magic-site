// debug-panel/components/AnalyticsPanel.jsx
import React from 'react';
import { Box, Typography, Tabs, Tab, IconButton, Chip, List, ListItem, Button, FormControlLabel, Switch } from '@mui/material';
import { BarChart as BarChartIcon, Memory as MemoryIcon, ShowChart as ShowChartIcon, BugReport as BugReportIcon, Refresh as RefreshIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { getEventTypeColor } from '../utils/eventTypes';

const AnalyticsPanel = ({
                            analytics,
                            analyticsSubTab,
                            setAnalyticsSubTab,
                            analyticsEvents,
                            eventCount,
                            isCapturing,
                            setIsCapturing,
                            handleClearEvents,
                            analyticsConfig,
                            handleConfigChange,
                            performanceMetrics,
                            setPerformanceMetrics,
                            theme
                        }) => {
    return (
        <Box sx={{ p: 2, fontFamily: 'monospace', color: theme.palette.text.primary, bgcolor: theme.palette.background.paper }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={analyticsSubTab}
                    onChange={(e, newValue) => {
                        setAnalyticsSubTab(newValue);
                        // Optionally track the subtab change event here.
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: '36px',
                        '& .MuiTab-root': {
                            minHeight: '36px',
                            p: 1,
                            minWidth: '80px',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace'
                        }
                    }}
                >
                    <Tab icon={<BarChartIcon fontSize="small" />} iconPosition="start" label="Events" value="events" sx={{ color: theme.palette.text.secondary, '&.Mui-selected': { color: theme.palette.primary.main } }} />
                    <Tab icon={<MemoryIcon fontSize="small" />} iconPosition="start" label="Config" value="config" sx={{ color: theme.palette.text.secondary, '&.Mui-selected': { color: theme.palette.primary.main } }} />
                    <Tab icon={<ShowChartIcon fontSize="small" />} iconPosition="start" label="Performance" value="performance" sx={{ color: theme.palette.text.secondary, '&.Mui-selected': { color: theme.palette.primary.main } }} />
                    <Tab icon={<BugReportIcon fontSize="small" />} iconPosition="start" label="Errors" value="errors" sx={{ color: theme.palette.text.secondary, '&.Mui-selected': { color: theme.palette.primary.main } }} />
                </Tabs>
            </Box>
            {analyticsSubTab === 'events' && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                            $ EVENTS_LOG [{analyticsEvents.length}]
                        </Typography>
                        <Box>
                            <IconButton
                                size="small"
                                onClick={() => setIsCapturing(!isCapturing)}
                                sx={{ mr: 1, color: isCapturing ? theme.palette.success.main : theme.palette.error.main }}
                            >
                                {isCapturing ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                            </IconButton>
                            <IconButton size="small" onClick={handleClearEvents} sx={{ color: theme.palette.primary.main }}>
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    {analyticsEvents.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                No events captured yet
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: theme.palette.text.secondary }}>
                                {isCapturing ? 'Waiting for events...' : 'Event capturing is paused'}
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ maxHeight: 380, overflow: 'auto', p: 0, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, '& .MuiListItem-root': { borderBottom: `1px solid ${theme.palette.divider}`, py: 1 } }}>
                            {analyticsEvents.map(event => (
                                <ListItem key={event.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 1, '&:hover': { bgcolor: `${theme.palette.primary.main}10` } }}>
                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: theme.palette.primary.main }}>
                                            {event.name}
                                        </Typography>
                                        <Chip label={event.type} size="small" sx={{ height: 20, fontSize: '0.6rem', backgroundColor: getEventTypeColor(event.type), fontFamily: 'monospace' }} />
                                    </Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace', wordBreak: 'break-all', width: '100%' }}>
                                        {new Date(event.timestamp).toLocaleTimeString()}
                                    </Typography>
                                    <Box sx={{ fontSize: '0.7rem', mt: 0.5, p: 1, bgcolor: `${theme.palette.background.paper}80`, borderRadius: 1, width: '100%', fontFamily: 'monospace', maxHeight: '100px', overflow: 'auto' }}>
                                        {Object.entries(event.properties)
                                            .filter(([key]) => key !== 'timestamp')
                                            .map(([key, value]) => (
                                                <Box key={key} sx={{ display: 'flex', mb: 0.5 }}>
                                                    <Typography variant="caption" sx={{ color: theme.palette.info.main, minWidth: '80px', fontFamily: 'monospace' }}>
                                                        {key}:
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.primary, ml: 1, fontFamily: 'monospace' }}>
                                                        {typeof value === 'object'
                                                            ? JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '')
                                                            : value?.toString().substring(0, 100) + (value?.toString().length > 100 ? '...' : '')
                                                        }
                                                    </Typography>
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </>
            )}
            {analyticsSubTab === 'config' && (
                <>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ ANALYTICS_CONFIG
                    </Typography>
                    <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 1.5 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analyticsConfig.consentEnabled}
                                    onChange={(e) => handleConfigChange('consentEnabled', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    User Consent
                                </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analyticsConfig.trackPageViews}
                                    onChange={(e) => handleConfigChange('trackPageViews', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    Page Views
                                </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analyticsConfig.trackClicks}
                                    onChange={(e) => handleConfigChange('trackClicks', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    Click Tracking
                                </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analyticsConfig.trackForms}
                                    onChange={(e) => handleConfigChange('trackForms', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    Form Tracking
                                </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analyticsConfig.trackAPI}
                                    onChange={(e) => handleConfigChange('trackAPI', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    API Call Tracking
                                </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analyticsConfig.trackErrors}
                                    onChange={(e) => handleConfigChange('trackErrors', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    Error Tracking
                                </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={analyticsConfig.performanceMonitoring}
                                    onChange={(e) => handleConfigChange('performanceMonitoring', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    Performance Monitoring
                                </Typography>
                            }
                            sx={{ mb: 2, width: '100%' }}
                        />

                        <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                Sample Rate: {analyticsConfig.sampleRate * 100}%
                            </Typography>
                            <Box sx={{ width: '100%', mt: 0.5, bgcolor: `${theme.palette.primary.main}20`, borderRadius: 0.5, height: 8, position: 'relative' }}>
                                <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${analyticsConfig.sampleRate * 100}%`, bgcolor: theme.palette.primary.main, borderRadius: 0.5 }} />
                            </Box>
                        </Box>

                        <Button variant="contained" fullWidth size="small" onClick={() => {
                            analytics.trackEvent('debug_apply_config', { config: analyticsConfig });
                            analytics.setConsent(analyticsConfig.consentEnabled);
                        }} sx={{ mt: 1, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontFamily: 'monospace', '&:hover': { bgcolor: theme.palette.primary.dark } }}>
                            APPLY_CONFIG()
                        </Button>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                        // Note: Some settings require app reload to fully apply
                    </Typography>
                </>
            )}
            {analyticsSubTab === 'performance' && (
                <>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ PERFORMANCE_METRICS
                    </Typography>
                    <Box sx={{ mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 1.5 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                            Web Vitals:
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                            {['FCP', 'LCP', 'CLS', 'FID', 'TTFB'].map(metric => (
                                <Box key={metric} sx={{ p: 1.5, bgcolor: `${theme.palette.primary.main}10`, borderRadius: 1, textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                        {metric}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {performanceMetrics[metric] || '—'}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 1.5 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                            Resource Loading:
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                            {['js', 'css', 'img', 'api'].map(resource => (
                                <Box key={resource} sx={{ p: 1, bgcolor: `${theme.palette.primary.main}10`, borderRadius: 1, textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                        {resource.toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                                        {performanceMetrics[`${resource}Count`] || '0'} items
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                        {performanceMetrics[`${resource}Time`] || '0'}ms
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Button variant="outlined" fullWidth size="small" onClick={() => {
                        analytics.trackEvent('debug_refresh_performance', { timestamp: Date.now() });
                        setPerformanceMetrics({
                            FCP: '450ms',
                            LCP: '1.2s',
                            CLS: '0.05',
                            FID: '28ms',
                            TTFB: '210ms',
                            jsCount: Math.floor(Math.random() * 20) + 5,
                            jsTime: Math.floor(Math.random() * 500) + 100,
                            cssCount: Math.floor(Math.random() * 5) + 2,
                            cssTime: Math.floor(Math.random() * 200) + 50,
                            imgCount: Math.floor(Math.random() * 15) + 3,
                            imgTime: Math.floor(Math.random() * 800) + 200,
                            apiCount: Math.floor(Math.random() * 10) + 1,
                            apiTime: Math.floor(Math.random() * 300) + 100
                        });
                    }} sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main, fontFamily: 'monospace', '&:hover': { bgcolor: `${theme.palette.primary.main}10`, borderColor: theme.palette.primary.main } }}>
                        REFRESH_METRICS()
                    </Button>
                </>
            )}
            {analyticsSubTab === 'errors' && (
                <>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ ERROR_TRACKING
                    </Typography>
                    <Box sx={{ mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 1.5 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                            Tracked Errors:
                        </Typography>
                        {analyticsEvents.filter(e => e.type === 'error').length === 0 ? (
                            <Box sx={{ p: 3, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    No errors tracked yet
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ maxHeight: 240, overflow: 'auto', p: 0, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, '& .MuiListItem-root': { borderBottom: `1px solid ${theme.palette.divider}`, py: 1 } }}>
                                {analyticsEvents.filter(e => e.type === 'error').map(event => (
                                    <ListItem key={event.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 1, '&:hover': { bgcolor: `${theme.palette.error.main}10` } }}>
                                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: theme.palette.error.main }}>
                                                {event.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: theme.palette.error.main, fontFamily: 'monospace' }}>
                                            {event.properties.error_message || event.properties.message || 'Unknown error'}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                    <Button variant="outlined" fullWidth size="small" onClick={() => {
                        try {
                            throw new Error('Test error from debug panel');
                        } catch (error) {
                            analytics.trackError(error, { context: 'debug_panel', location: 'error_testing', timestamp: Date.now() });
                        }
                    }} sx={{ color: theme.palette.error.main, borderColor: theme.palette.error.main, fontFamily: 'monospace', '&:hover': { bgcolor: `${theme.palette.error.main}10`, borderColor: theme.palette.error.main } }}>
                        GENERATE_TEST_ERROR()
                    </Button>
                </>
            )}
        </Box>
    );
};

export default AnalyticsPanel;