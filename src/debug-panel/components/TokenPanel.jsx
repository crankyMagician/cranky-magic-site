// debug-panel/components/TokenPanel.jsx
import React from 'react';
import { Box, Button, Typography, Badge } from '@mui/material';
import MatrixText from './MatrixText';

const TokenPanel = ({ tokenInfo, theme, panelColors, handleClearToken }) => {
    return (
        <Box sx={{ p: 2, overflow: 'auto', maxHeight: 510, fontFamily: 'monospace', color: panelColors.text }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Badge color={tokenInfo.hasToken ? "success" : "error"} variant="dot" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                    <MatrixText>{tokenInfo.hasToken ? '[TOKEN:ACTIVE]' : '[TOKEN:NONE]'}</MatrixText>
                </Typography>
            </Box>
            {tokenInfo.hasToken && tokenInfo.tokenData && (
                <>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ USER_DATA:
                    </Typography>
                    <Box sx={{ pl: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                            ID: {tokenInfo.tokenData.id}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                            EMAIL: {tokenInfo.tokenData.email}
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ USER_ROLES:
                    </Typography>
                    <Box sx={{ pl: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                        {tokenInfo.tokenData.roles?.length > 0 ? (
                            tokenInfo.tokenData.roles.map((role, index) => (
                                <Typography key={index} variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                                    {`[${index}] => ${role}`}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                                [EMPTY_ARRAY]
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ BUSINESS_DATA:
                    </Typography>
                    <Box sx={{ pl: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                        {tokenInfo.tokenData.businesses?.length > 0 ? (
                            tokenInfo.tokenData.businesses.map((business, index) => (
                                <Typography key={index} variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                                    {`[${index}] => { id: ${business.id}, name: "${business.name}", role: "${business.role}" }`}
                                    {tokenInfo.tokenData.activeBusiness?.id === business.id && ' [ACTIVE]'}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                                [EMPTY_ARRAY]
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ TOKEN_EXPIRY:
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', pl: 1, color: panelColors.text, fontFamily: 'monospace', borderLeft: `1px solid ${theme.palette.divider}` }}>
                        {tokenInfo.tokenExpiry ? new Date(tokenInfo.tokenExpiry).toLocaleString() : 'UNKNOWN'}
                    </Typography>
                </>
            )}
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: theme.palette.text.secondary, fontFamily: 'monospace', fontSize: '10px' }}>
                // Last check: {tokenInfo.lastCheck ? new Date(tokenInfo.lastCheck).toLocaleString() : 'NEVER'}
            </Typography>
            <Button
                variant="outlined"
                size="small"
                color="error"
                fullWidth
                onClick={handleClearToken}
                disabled={!tokenInfo.hasToken}
                sx={{
                    mt: 2,
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    '&:hover': {
                        backgroundColor: `${theme.palette.error.main}20`,
                        borderColor: theme.palette.error.main
                    }
                }}
            >
                CLEAR_TOKEN()
            </Button>
        </Box>
    );
};

export default TokenPanel;
