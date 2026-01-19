import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';

/**
 * Geometric decoration elements for section backgrounds
 * Provides various shapes that can be positioned in sections
 */

// Floating glow orb
export const GlowOrb = ({
    position = { top: '10%', right: '5%' },
    size = { xs: 200, md: 400 },
    color,
    blur = 40,
    opacity = 0.15,
    animate = true,
}) => {
    const theme = useTheme();
    const orbColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width: size,
                height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(orbColor, opacity)} 0%, transparent 70%)`,
                filter: `blur(${blur}px)`,
                pointerEvents: 'none',
                ...(animate && {
                    animation: 'pulse 8s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                        '50%': { opacity: 0.8, transform: 'scale(1.1)' },
                    },
                }),
            }}
        />
    );
};

// Hexagon shape
export const Hexagon = ({
    position = { top: '15%', left: '8%' },
    size = { xs: 60, md: 120 },
    color,
    opacity = 0.08,
    rotate = 0,
}) => {
    const theme = useTheme();
    const hexColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width: size,
                height: typeof size === 'object' ? { xs: size.xs * 1.15, md: size.md * 1.15 } : size * 1.15,
                opacity,
                pointerEvents: 'none',
                transform: `rotate(${rotate}deg)`,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: hexColor,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                },
            }}
        />
    );
};

// Circle ring (hollow circle)
export const CircleRing = ({
    position = { top: '40%', right: '15%' },
    size = { xs: 80, md: 160 },
    color,
    borderWidth = 2,
    opacity = 0.1,
}) => {
    const theme = useTheme();
    const ringColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width: size,
                height: size,
                borderRadius: '50%',
                border: `${borderWidth}px solid ${alpha(ringColor, opacity)}`,
                pointerEvents: 'none',
            }}
        />
    );
};

// Dot grid pattern
export const DotGrid = ({
    position = { bottom: '25%', right: '20%' },
    size = 100,
    dotSize = 2,
    spacing = 20,
    color,
    opacity = 0.15,
}) => {
    const theme = useTheme();
    const dotColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width: size,
                height: size,
                opacity,
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
                backgroundSize: `${spacing}px ${spacing}px`,
            }}
        />
    );
};

// Triangle shape
export const Triangle = ({
    position = { bottom: '10%', left: '5%' },
    size = { xs: 40, md: 80 },
    color,
    opacity = 0.06,
    rotate = 0,
}) => {
    const theme = useTheme();
    const triColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width: 0,
                height: 0,
                opacity,
                pointerEvents: 'none',
                transform: `rotate(${rotate}deg)`,
                borderLeft: typeof size === 'object'
                    ? { xs: `${size.xs/2}px solid transparent`, md: `${size.md/2}px solid transparent` }
                    : `${size/2}px solid transparent`,
                borderRight: typeof size === 'object'
                    ? { xs: `${size.xs/2}px solid transparent`, md: `${size.md/2}px solid transparent` }
                    : `${size/2}px solid transparent`,
                borderBottom: typeof size === 'object'
                    ? { xs: `${size.xs}px solid ${triColor}`, md: `${size.md}px solid ${triColor}` }
                    : `${size}px solid ${triColor}`,
            }}
        />
    );
};

// Floating line
export const FloatingLine = ({
    position = { top: '30%', left: '3%' },
    width = { xs: 60, md: 120 },
    height = 2,
    color,
    opacity = 0.1,
    rotate = -45,
}) => {
    const theme = useTheme();
    const lineColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width,
                height,
                backgroundColor: alpha(lineColor, opacity),
                transform: `rotate(${rotate}deg)`,
                pointerEvents: 'none',
            }}
        />
    );
};

// Cross/Plus shape
export const CrossShape = ({
    position = { top: '20%', right: '10%' },
    size = { xs: 20, md: 40 },
    thickness = 3,
    color,
    opacity = 0.1,
    rotate = 0,
}) => {
    const theme = useTheme();
    const crossColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width: size,
                height: size,
                opacity,
                pointerEvents: 'none',
                transform: `rotate(${rotate}deg)`,
                '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    backgroundColor: crossColor,
                },
                '&::before': {
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: `${thickness}px`,
                    transform: 'translateX(-50%)',
                },
                '&::after': {
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: `${thickness}px`,
                    transform: 'translateY(-50%)',
                },
            }}
        />
    );
};

// Diamond shape
export const Diamond = ({
    position = { bottom: '15%', right: '8%' },
    size = { xs: 30, md: 60 },
    color,
    opacity = 0.08,
}) => {
    const theme = useTheme();
    const diamondColor = color || theme.palette.primary.main;

    return (
        <Box
            sx={{
                position: 'absolute',
                ...position,
                width: size,
                height: size,
                opacity,
                pointerEvents: 'none',
                transform: 'rotate(45deg)',
                backgroundColor: diamondColor,
            }}
        />
    );
};

// Pre-configured decoration sets for different sections
export const SectionDecorations = {
    // Skills section decorations
    skills: ({ theme }) => (
        <>
            <GlowOrb
                position={{ top: '5%', left: '5%' }}
                size={{ xs: 150, md: 300 }}
                color={theme.palette.tertiary?.main || '#22D3EE'}
                opacity={0.1}
            />
            <Hexagon
                position={{ bottom: '10%', right: '8%' }}
                size={{ xs: 50, md: 100 }}
                rotate={15}
            />
            <CircleRing
                position={{ top: '60%', left: '3%' }}
                size={{ xs: 60, md: 120 }}
            />
            <DotGrid
                position={{ top: '20%', right: '5%' }}
                size={80}
                opacity={0.1}
            />
        </>
    ),

    // Projects section decorations
    projects: ({ theme }) => (
        <>
            <GlowOrb
                position={{ bottom: '10%', right: '5%' }}
                size={{ xs: 200, md: 350 }}
                opacity={0.12}
            />
            <Triangle
                position={{ top: '15%', left: '5%' }}
                size={{ xs: 50, md: 100 }}
                rotate={180}
                opacity={0.05}
            />
            <CrossShape
                position={{ top: '30%', right: '10%' }}
                size={{ xs: 25, md: 50 }}
                rotate={15}
            />
            <FloatingLine
                position={{ bottom: '30%', left: '8%' }}
                width={{ xs: 80, md: 150 }}
                rotate={-30}
            />
        </>
    ),

    // Framework section decorations
    frameworks: ({ theme }) => (
        <>
            <Hexagon
                position={{ top: '10%', right: '5%' }}
                size={{ xs: 70, md: 140 }}
                opacity={0.06}
            />
            <GlowOrb
                position={{ bottom: '20%', left: '0%' }}
                size={{ xs: 180, md: 320 }}
                color={theme.palette.primary.light}
                opacity={0.08}
            />
            <Diamond
                position={{ top: '40%', left: '8%' }}
                size={{ xs: 25, md: 50 }}
                opacity={0.06}
            />
            <CircleRing
                position={{ bottom: '15%', right: '12%' }}
                size={{ xs: 50, md: 100 }}
                borderWidth={3}
            />
        </>
    ),

    // Timeline section decorations
    timeline: ({ theme }) => (
        <>
            <FloatingLine
                position={{ top: '10%', right: '5%' }}
                width={{ xs: 100, md: 200 }}
                rotate={45}
                opacity={0.08}
            />
            <GlowOrb
                position={{ top: '30%', left: '2%' }}
                size={{ xs: 150, md: 280 }}
                color={theme.palette.tertiary?.main}
                opacity={0.1}
            />
            <CrossShape
                position={{ bottom: '20%', right: '8%' }}
                size={{ xs: 30, md: 60 }}
            />
            <DotGrid
                position={{ bottom: '40%', left: '5%' }}
                size={60}
                opacity={0.12}
            />
        </>
    ),

    // Blog section decorations
    blog: ({ theme }) => (
        <>
            <Hexagon
                position={{ top: '5%', left: '3%' }}
                size={{ xs: 45, md: 90 }}
                rotate={30}
                opacity={0.05}
            />
            <GlowOrb
                position={{ bottom: '5%', right: '3%' }}
                size={{ xs: 200, md: 380 }}
                opacity={0.1}
            />
            <Triangle
                position={{ top: '50%', right: '5%' }}
                size={{ xs: 35, md: 70 }}
                opacity={0.04}
            />
            <CircleRing
                position={{ bottom: '30%', left: '10%' }}
                size={{ xs: 40, md: 80 }}
            />
        </>
    ),

    // Contact section decorations
    contact: ({ theme }) => (
        <>
            <GlowOrb
                position={{ top: '10%', right: '5%' }}
                size={{ xs: 250, md: 450 }}
                opacity={0.15}
            />
            <GlowOrb
                position={{ bottom: '10%', left: '5%' }}
                size={{ xs: 180, md: 350 }}
                color={theme.palette.tertiary?.main}
                opacity={0.1}
            />
            <Hexagon
                position={{ top: '30%', left: '8%' }}
                size={{ xs: 60, md: 120 }}
                rotate={-15}
                opacity={0.05}
            />
            <Diamond
                position={{ bottom: '25%', right: '10%' }}
                size={{ xs: 35, md: 70 }}
                opacity={0.06}
            />
        </>
    ),
};

export default SectionDecorations;
