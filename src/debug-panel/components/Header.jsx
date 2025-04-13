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
                cursor: 'grab',
                userSelect: 'none',  // Prevent text selection
                touchAction: 'none', // Prevent default touch actions
                '&:active': {
                    cursor: 'grabbing'
                }
            }}
            // These additional props ensure the element captures mouse events properly
            onMouseDown={(e) => {
                // Only handle mousedown if it's not on a button or icon
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button') &&
                    e.target.tagName !== 'svg' && !e.target.closest('svg')) {
                    e.currentTarget.style.cursor = 'grabbing';
                }
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.cursor = 'grab';
            }}
        >
            <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    textShadow: `0 0 5px ${theme.palette.primary.main}`,
                }}
            >
                <MatrixText theme={theme}>{`< DEBUG:ANALYTICS // ${matrixTick % 2 === 0 ? '_' : ''} >`}</MatrixText>
            </Typography>
            <Box>
                <IconButton
                    size="small"
                    onClick={toggleExpand}
                    sx={{
                        color: theme.palette.primary.main,
                        // Ensure icon buttons don't interfere with dragging
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                >
                    {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
                <IconButton
                    size="small"
                    onClick={toggleOpacity}
                    sx={{
                        color: theme.palette.primary.main,
                        // Ensure icon buttons don't interfere with dragging
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
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