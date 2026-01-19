import React, { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';

/**
 * ResponsiveTableWrapper component
 * Wraps data tables to provide horizontal scrolling on smaller screens
 * with visual indicators for scroll position
 */
const ResponsiveTableWrapper = ({
    children,
    minWidth = 800,
    showScrollHint = true,
    scrollHintText = 'Scroll to see more'
}) => {
    const theme = useTheme();
    const containerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [showHint, setShowHint] = useState(true);

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const checkScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        checkScroll();
        container.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        // Hide hint after first scroll
        const hideHint = () => setShowHint(false);
        container.addEventListener('scroll', hideHint, { once: true });

        return () => {
            container.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    // Check if content needs scrolling
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const needsScroll = container.scrollWidth > container.clientWidth;
        if (!needsScroll) {
            setShowHint(false);
        }
    }, [children]);

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {/* Left scroll shadow */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 40,
                    background: `linear-gradient(to right, ${theme.palette.background.paper}, transparent)`,
                    pointerEvents: 'none',
                    zIndex: 1,
                    opacity: canScrollLeft ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    pl: 0.5
                }}
            >
                {canScrollLeft && (
                    <ChevronLeftIcon
                        sx={{
                            color: 'text.secondary',
                            opacity: 0.7,
                            fontSize: 20
                        }}
                    />
                )}
            </Box>

            {/* Right scroll shadow */}
            <Box
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 40,
                    background: `linear-gradient(to left, ${theme.palette.background.paper}, transparent)`,
                    pointerEvents: 'none',
                    zIndex: 1,
                    opacity: canScrollRight ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    pr: 0.5
                }}
            >
                {canScrollRight && (
                    <ChevronRightIcon
                        sx={{
                            color: 'text.secondary',
                            opacity: 0.7,
                            fontSize: 20
                        }}
                    />
                )}
            </Box>

            {/* Scrollable container */}
            <Box
                ref={containerRef}
                sx={{
                    overflowX: 'auto',
                    overflowY: 'visible',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        height: 8
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.action.hover,
                        borderRadius: 4
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.action.disabled,
                        borderRadius: 4,
                        '&:hover': {
                            backgroundColor: theme.palette.action.active
                        }
                    }
                }}
            >
                <Box sx={{ minWidth }}>
                    {children}
                </Box>
            </Box>

            {/* Scroll hint for mobile/tablet */}
            {showScrollHint && showHint && canScrollRight && isMobile && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        mt: 1,
                        opacity: 0.7
                    }}
                >
                    <ChevronLeftIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                        {scrollHintText}
                    </Typography>
                    <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Box>
            )}
        </Box>
    );
};

ResponsiveTableWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    minWidth: PropTypes.number,
    showScrollHint: PropTypes.bool,
    scrollHintText: PropTypes.string
};

export default React.memo(ResponsiveTableWrapper);
