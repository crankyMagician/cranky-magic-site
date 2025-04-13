// debug-panel/components/Header.jsx
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import MatrixText from './MatrixText';

const Header = React.forwardRef(({ expanded, toggleExpand, opacity, toggleOpacity, matrixTick, theme }, ref) => {
    const headerBg = theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)';

    return (
        <Box
            ref={ref}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: headerBg,
                color: theme.palette.getContrastText(headerBg),
                px: 2,
                py: 1,
                borderBottom: `1px solid ${theme.palette.primary.main}`,
                userSelect: 'none',    // Prevent text selection
                touchAction: 'none',   // Prevent default touch actions
                zIndex: 9999,          // Ensure it's above other elements
                position: 'relative',  // For proper stacking context
                cursor: 'grab'         // Default cursor for draggable area
            }}
        >
            <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    textShadow: `0 0 5px ${theme.palette.primary.main}`,
                    pointerEvents: 'none', // Prevent text from interfering with drag
                }}
            >
                <MatrixText theme={theme}>{`< DEBUG:ANALYTICS // ${matrixTick % 2 === 0 ? '_' : ''} >`}</MatrixText>
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        // Stop propagation to prevent drag start
                        e.stopPropagation();
                        toggleExpand();
                    }}
                    sx={{
                        color: theme.palette.primary.main,
                        padding: '4px',
                        zIndex: 10, // Ensure above the draggable area
                    }}
                >
                    {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>

                <IconButton
                    size="small"
                    onClick={(e) => {
                        // Stop propagation to prevent drag start
                        e.stopPropagation();
                        toggleOpacity();
                    }}
                    sx={{
                        color: theme.palette.primary.main,
                        padding: '4px',
                        zIndex: 10, // Ensure above the draggable area
                    }}
                >
                    {opacity === 0.3 ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
            </Box>
        </Box>
    );
});

Header.displayName = "Header";
export default Header;