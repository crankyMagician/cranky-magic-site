import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Tooltip,
    Box,
    useTheme,
    Zoom,
    keyframes
} from '@mui/material';
import {
    DarkMode,
    LightMode,
    AutoAwesome
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from "../../analytics/hooks/useAnalytics";
import {setPreference} from "../../reducers/preferenceSlice";
import {INTERACTION_EVENTS} from "../../analytics/constants/events";

// Keyframe animations
const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const pulse = keyframes`
    0% { 
        box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.7);
        transform: scale(1);
    }
    70% { 
        box-shadow: 0 0 0 10px rgba(138, 43, 226, 0);
        transform: scale(1.05);
    }
    100% { 
        box-shadow: 0 0 0 0 rgba(138, 43, 226, 0);
        transform: scale(1);
    }
`;

const sparkle = keyframes`
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const ThemeToggle = React.memo(({
                                    position = 'fixed',
                                    top = 20,
                                    right = 20,
                                    showMagic = true
                                }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();
    const { trackEvent } = useAnalytics();
    const preferences = useSelector(state => state.preferences);
    const [isAnimating, setIsAnimating] = useState(false);
    const [sparkles, setSparkles] = useState([]);

    // Get current theme mode
    const isDarkMode = theme.palette.mode === 'dark';

    // Generate sparkles on theme change
    useEffect(() => {
        if (isAnimating && showMagic) {
            const sparkleCount = 6;
            const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
                id: Date.now() + i,
                angle: (360 / sparkleCount) * i,
                delay: i * 0.1
            }));
            setSparkles(newSparkles);

            // Clear sparkles after animation
            const timeout = setTimeout(() => {
                setSparkles([]);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [isAnimating, showMagic]);

    const handleThemeToggle = () => {
        const newMode = isDarkMode ? 'light' : 'dark';

        // Start animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);

        // Update theme preference
        dispatch(setPreference({ theme: newMode }));

        // Track analytics
        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'theme_toggle',
            element_id: 'theme_toggle_button',
            from_theme: theme.palette.mode,
            to_theme: newMode,
            section: 'portfolio_landing'
        });
    };

    return (
        <Box
            sx={{
                position,
                top,
                right,
                zIndex: 1300 // Above most content but below modals
            }}
        >
            <Tooltip
                title={isDarkMode ? translate('Switch to Light Mode') : translate('Switch to Dark Mode')}
                placement="left"
                TransitionComponent={Zoom}
            >
                <IconButton
                    onClick={handleThemeToggle}
                    size="large"
                    sx={{
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.04)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${theme.palette.divider}`,
                        color: theme.palette.mode === 'dark'
                            ? theme.palette.warning.main
                            : theme.palette.primary.main,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: isAnimating ? `${pulse} 0.6s ease-out` : 'none',
                        position: 'relative',
                        overflow: 'visible',
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.2)'
                                : 'rgba(0, 0, 0, 0.08)',
                            transform: 'scale(1.1)',
                            borderColor: theme.palette.mode === 'dark'
                                ? theme.palette.warning.main
                                : theme.palette.primary.main,
                            '& .theme-icon': {
                                animation: `${rotate} 2s linear infinite`
                            }
                        },
                        '&:active': {
                            transform: 'scale(0.95)'
                        }
                    }}
                >
                    <Box
                        className="theme-icon"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isAnimating ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    >
                        {isDarkMode ? (
                            <DarkMode
                                sx={{
                                    fontSize: 28,
                                    filter: 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.5))'
                                }}
                            />
                        ) : (
                            <LightMode
                                sx={{
                                    fontSize: 28,
                                    filter: 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.5))'
                                }}
                            />
                        )}
                    </Box>

                    {/* Sparkle effects */}
                    {showMagic && sparkles.map((sparkle) => (
                        <AutoAwesome
                            key={sparkle.id}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: 16,
                                height: 16,
                                color: theme.palette.warning.main,
                                transform: `translate(-50%, -50%) rotate(${sparkle.angle}deg) translateY(-30px)`,
                                animation: `${sparkle} 1s ease-out ${sparkle.delay}s`,
                                pointerEvents: 'none'
                            }}
                        />
                    ))}
                </IconButton>
            </Tooltip>

            {/* Magic glow effect */}
            {showMagic && isAnimating && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: theme.palette.mode === 'dark'
                            ? `radial-gradient(circle, ${theme.palette.warning.main}44 0%, transparent 70%)`
                            : `radial-gradient(circle, ${theme.palette.primary.main}44 0%, transparent 70%)`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        animation: `${pulse} 0.6s ease-out`
                    }}
                />
            )}
        </Box>
    );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;