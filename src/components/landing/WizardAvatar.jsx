import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import {
    ANIMATION_DELAY,
    ANIMATION_DURATION,
    ANIMATION_EASING,
    prefersReducedMotion,
} from '../../animations/portfolioAnimations';
import { useAnimationControl } from '../../hooks/useAnimationControl';

const WizardAvatar = React.memo(({
                                     size = 400,
                                     animated = true,
                                     showParticles = true,
                                     showGlow = true,
                                     interactive = true,
                                     className = '',
                                 }) => {
    const theme = useTheme();
    const currentTheme = useSelector(state => state.theme.mode);
    const isDarkMode = currentTheme === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const shouldReduceMotion = prefersReducedMotion();

    const [isHovered, setIsHovered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseXRef = useRef(0);
    const mouseYRef = useRef(0);

    // Animation controls
    const controls = useAnimationControl({
        animationType: 'scaleIn',
        duration: ANIMATION_DURATION.SLOW,
        delay: ANIMATION_DELAY.MEDIUM,
        easing: ANIMATION_EASING.ELASTIC,
        triggerOnScroll: false,
    });

    // Colors based on theme
    const colors = useMemo(() => ({
        primary: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
        secondary: isDarkMode ? theme.palette.secondary.light : theme.palette.secondary.main,
        accent: isDarkMode ? theme.palette.info.light : theme.palette.info.main,
        glow: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light,
        background: isDarkMode ? '#1a1a2e' : '#f0f0f0',
        hat: isDarkMode ? '#4a148c' : '#7b1fa2',
        beard: isDarkMode ? '#e0e0e0' : '#bdbdbd',
        skin: isDarkMode ? '#ffcc80' : '#ffb74d',
        robe: isDarkMode ? '#1565c0' : '#1976d2',
    }), [isDarkMode, theme]);

    // Calculate responsive size
    const responsiveSize = useMemo(() => {
        if (isMobile) return Math.min(size * 0.8, 320);
        return size;
    }, [size, isMobile]);

    // Handle mouse movement for interactive tilt
    const handleMouseMove = useCallback((event) => {
        if (!interactive || shouldReduceMotion || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseXRef.current = event.clientX - centerX;
        mouseYRef.current = event.clientY - centerY;

        // Apply tilt effect to the container
        if (containerRef.current) {
            const rotateX = (mouseYRef.current / (rect.height / 2)) * -10;
            const rotateY = (mouseXRef.current / (rect.width / 2)) * 10;

            containerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    }, [interactive, shouldReduceMotion]);

    // Reset tilt on mouse leave
    const handleMouseLeave = useCallback(() => {
        if (!interactive || shouldReduceMotion) return;

        mouseXRef.current = 0;
        mouseYRef.current = 0;

        // Reset transform
        if (containerRef.current) {
            containerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
    }, [interactive, shouldReduceMotion]);

    // Initial animation on mount
    useEffect(() => {
        if (!animated || shouldReduceMotion) {
            setIsLoaded(true);
            return;
        }

        controls.startAnimation();
        setIsLoaded(true);
    }, [animated, shouldReduceMotion, controls]);

    // Hover animation
    useEffect(() => {
        if (!animated || shouldReduceMotion || !isLoaded) return;

        if (isHovered) {
            controls.startAnimation();
        } else {
            controls.resetAnimation();
        }
    }, [isHovered, animated, shouldReduceMotion, isLoaded, controls]);

    // Particle system
    const particles = useMemo(() => {
        if (!showParticles || shouldReduceMotion) return [];

        return Array.from({ length: 12 }, (_, i) => ({
            id: i,
            size: Math.random() * 6 + 2,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            initialX: (Math.random() - 0.5) * responsiveSize,
            initialY: (Math.random() - 0.5) * responsiveSize,
            color: Math.random() > 0.5 ? colors.primary : colors.secondary,
        }));
    }, [showParticles, shouldReduceMotion, responsiveSize, colors]);

    // SVG Path definitions for wizard elements
    const wizardPaths = {
        hat: "M50 20 L30 50 L70 50 Z M30 50 Q25 55 20 50 L25 45 L30 50 M70 50 Q75 55 80 50 L75 45 L70 50",
        face: "M50 75 Q35 75 35 60 Q35 45 50 45 Q65 45 65 60 Q65 75 50 75",
        beard: "M35 65 Q35 80 40 85 Q45 90 50 90 Q55 90 60 85 Q65 80 65 65",
        robe: "M35 75 Q30 85 25 95 Q20 100 20 105 L80 105 Q80 100 75 95 Q70 85 65 75",
        staff: "M75 40 L85 90 M82 45 Q85 43 88 45 M82 50 Q85 48 88 50",
        star: "M50 5 L52 10 L57 10 L53 13 L55 18 L50 15 L45 18 L47 13 L43 10 L48 10 Z",
    };

    return (
        <Box
            ref={containerRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            sx={{
                width: responsiveSize,
                height: responsiveSize,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: interactive ? 'pointer' : 'default',
                userSelect: 'none',
                transition: 'transform 0.3s ease',
                ...controls.animationStyles,
            }}
        >
            {/* Glow effect */}
            {showGlow && !shouldReduceMotion && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '120%',
                        height: '120%',
                        transform: 'translate(-50%, -50%)',
                        background: `radial-gradient(circle, ${colors.glow}40 0%, transparent 70%)`,
                        filter: 'blur(20px)',
                        pointerEvents: 'none',
                        zIndex: 0,
                        animation: 'pulse 3s ease-in-out infinite',
                    }}
                />
            )}

            {/* Particles */}
            {showParticles && particles.map((particle) => (
                <Box
                    key={particle.id}
                    ref={(el) => (particlesRef.current[particle.id] = el)}
                    sx={{
                        position: 'absolute',
                        width: particle.size,
                        height: particle.size,
                        borderRadius: '50%',
                        backgroundColor: particle.color,
                        pointerEvents: 'none',
                        zIndex: 1,
                        animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                        opacity: 0,
                        transform: `translate(${particle.initialX}px, ${particle.initialY}px)`,
                    }}
                />
            ))}

            {/* Main wizard SVG */}
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transformStyle: 'preserve-3d',
                    perspective: 1000,
                    zIndex: 2,
                }}
            >
                <svg
                    width={responsiveSize}
                    height={responsiveSize}
                    viewBox="0 0 100 110"
                    style={{ filter: `drop-shadow(0 4px 8px ${colors.primary}30)` }}
                >
                    {/* Wizard Hat */}
                    <path
                        d={wizardPaths.hat}
                        fill={colors.hat}
                        stroke={colors.primary}
                        strokeWidth="0.5"
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 0.5s ease-in-out',
                        }}
                    />

                    {/* Star on hat */}
                    <path
                        d={wizardPaths.star}
                        fill={colors.accent}
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transform: `scale(${isLoaded ? 1 : 0})`,
                            transformOrigin: '50px 10px',
                            transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
                        }}
                    />

                    {/* Face */}
                    <path
                        d={wizardPaths.face}
                        fill={colors.skin}
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transform: `scale(${isLoaded ? 1 : 0})`,
                            transformOrigin: '50px 60px',
                            transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
                        }}
                    />

                    {/* Eyes */}
                    <circle
                        cx="42"
                        cy="58"
                        r="2"
                        fill={colors.background}
                        style={{
                            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                            transition: 'transform 0.3s ease',
                        }}
                    />
                    <circle
                        cx="58"
                        cy="58"
                        r="2"
                        fill={colors.background}
                        style={{
                            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                            transition: 'transform 0.3s ease 0.1s',
                        }}
                    />

                    {/* Beard */}
                    <path
                        d={wizardPaths.beard}
                        fill={colors.beard}
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transform: `translateY(${isLoaded ? 0 : -10}px)`,
                            transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
                        }}
                    />

                    {/* Robe */}
                    <path
                        d={wizardPaths.robe}
                        fill={colors.robe}
                        stroke={colors.primary}
                        strokeWidth="0.5"
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 0.5s ease-in-out',
                        }}
                    />

                    {/* Magic Staff */}
                    <path
                        d={wizardPaths.staff}
                        stroke={colors.accent}
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 0.5s ease-in-out',
                        }}
                    />

                    {/* Magic sparkles on staff */}
                    {isHovered && !shouldReduceMotion && (
                        <circle
                            cx="85"
                            cy="45"
                            r="1.5"
                            fill={colors.accent}
                            style={{
                                animation: 'pulse 1s ease-in-out infinite',
                            }}
                        />
                    )}
                </svg>
            </Box>
        </Box>
    );
});

WizardAvatar.displayName = 'WizardAvatar';

export default WizardAvatar;