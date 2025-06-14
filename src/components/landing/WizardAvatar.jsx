import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Avatar,
    keyframes,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { AutoAwesome, Stars } from '@mui/icons-material';

// Keyframe animations
const float = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(-5deg); }
    66% { transform: translateY(5px) rotate(5deg); }
`;

const glow = keyframes`
    0%, 100% { 
        box-shadow: 0 0 20px rgba(138, 43, 226, 0.6),
                    0 0 40px rgba(138, 43, 226, 0.4),
                    0 0 60px rgba(138, 43, 226, 0.2);
    }
    50% { 
        box-shadow: 0 0 30px rgba(138, 43, 226, 0.8),
                    0 0 60px rgba(138, 43, 226, 0.6),
                    0 0 90px rgba(138, 43, 226, 0.4);
    }
`;

const sparkle = keyframes`
    0% { 
        transform: scale(0) rotate(0deg);
        opacity: 0;
    }
    50% { 
        transform: scale(1) rotate(180deg);
        opacity: 1;
    }
    100% { 
        transform: scale(0) rotate(360deg);
        opacity: 0;
    }
`;

const magicPulse = keyframes`
    0%, 100% { 
        transform: scale(1);
        opacity: 0.8;
    }
    50% { 
        transform: scale(1.5);
        opacity: 0;
    }
`;

const WizardAvatar = React.memo(({
                                     size = 120,
                                     showMagic = true,
                                     onClick,
                                     style,
                                     className,
                                     animated = true
                                 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [sparkles, setSparkles] = useState([]);

    // Wizard avatar emoji or image
    const wizardEmoji = '🧙‍♂️';

    // Generate random sparkles
    useEffect(() => {
        if (!showMagic || !animated) return;

        const generateSparkle = () => {
            const newSparkle = {
                id: Date.now() + Math.random(),
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 20 + 10,
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 2
            };

            setSparkles(prev => [...prev, newSparkle]);

            // Remove sparkle after animation
            setTimeout(() => {
                setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
            }, (newSparkle.duration + newSparkle.delay) * 1000);
        };

        const interval = setInterval(generateSparkle, 800);
        return () => clearInterval(interval);
    }, [showMagic, animated]);

    // Responsive size
    const responsiveSize = useMemo(() => {
        if (isMobile) return size * 0.8;
        return size;
    }, [size, isMobile]);

    return (
        <Box
            sx={{
                position: 'relative',
                width: responsiveSize,
                height: responsiveSize,
                cursor: onClick ? 'pointer' : 'default',
                ...style
            }}
            onClick={onClick}
            className={className}
        >
            {/* Magic pulse effect */}
            {showMagic && animated && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '120%',
                        height: '120%',
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        transform: 'translate(-50%, -50%)',
                        animation: `${magicPulse} 3s ease-in-out infinite`,
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* Main avatar */}
            <Avatar
                sx={{
                    width: responsiveSize,
                    height: responsiveSize,
                    fontSize: responsiveSize * 0.6,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(138, 43, 226, 0.2)'
                        : 'rgba(138, 43, 226, 0.1)',
                    border: `3px solid ${theme.palette.primary.main}`,
                    animation: animated ? `${float} 6s ease-in-out infinite, ${glow} 3s ease-in-out infinite` : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': onClick ? {
                        transform: 'scale(1.1)',
                        boxShadow: `0 0 40px ${theme.palette.primary.main}`
                    } : {}
                }}
            >
                {wizardEmoji}
            </Avatar>

            {/* Sparkles */}
            {showMagic && sparkles.map(sparkle => (
                <Box
                    key={sparkle.id}
                    sx={{
                        position: 'absolute',
                        left: `${sparkle.left}%`,
                        top: `${sparkle.top}%`,
                        width: sparkle.size,
                        height: sparkle.size,
                        pointerEvents: 'none'
                    }}
                >
                    <Stars
                        sx={{
                            width: '100%',
                            height: '100%',
                            color: theme.palette.warning.main,
                            animation: `${sparkle} ${sparkle.duration}s ease-in-out ${sparkle.delay}s`,
                            filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))'
                        }}
                    />
                </Box>
            ))}

            {/* Magic wand icon */}
            {showMagic && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -5,
                        right: -5,
                        width: responsiveSize * 0.3,
                        height: responsiveSize * 0.3,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${theme.palette.primary.main}`,
                        boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
                        animation: animated ? `${float} 4s ease-in-out infinite reverse` : 'none'
                    }}
                >
                    <AutoAwesome
                        sx={{
                            fontSize: responsiveSize * 0.2,
                            color: theme.palette.primary.main
                        }}
                    />
                </Box>
            )}
        </Box>
    );
});

WizardAvatar.displayName = 'WizardAvatar';

export default WizardAvatar;