// src/components/effects/SpatialEffects.js
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import ThemeService from '../../services/ThemeService';

// Matrix-style Digital Rain effect
export const DigitalRain = () => {
    const canvasRef = useRef(null);
    const themeMode = useSelector(state => state.theme.mode);
    const isDark = themeMode === 'dark';
    const themePrefs = ThemeService.getThemePreferences();

    // Don't render if not using spatial theme or effects are disabled
    if ((themeMode !== 'light' && themeMode !== 'dark') || !themePrefs.useScanlines) {
        return null;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const primaryColor = isDark ? '#D65A31' : '#D65A31';

        // Set canvas size to match window
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Matrix characters (using relevant technical characters)
        const characters = '01010100100101110ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]><;:/?.,"\'';

        // Create drops
        const columnCount = Math.floor(canvas.width / 20); // Character width
        const drops = [];

        for (let i = 0; i < columnCount; i++) {
            drops[i] = Math.floor(Math.random() * -canvas.height);
        }

        // Drawing function
        const draw = () => {
            // Partially clear canvas for trail effect
            ctx.fillStyle = isDark
                ? 'rgba(18, 18, 18, 0.05)'
                : 'rgba(245, 245, 245, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text style
            ctx.fillStyle = primaryColor;
            ctx.font = '15px Rajdhani, monospace';

            // Draw each character in each column
            for (let i = 0; i < drops.length; i++) {
                // Random character
                const character = characters[Math.floor(Math.random() * characters.length)];

                // Draw character
                const x = i * 20;
                const y = drops[i] * 20;

                // Create gradient effect with primary color
                const alpha = isDark ? 0.7 : 0.5;
                ctx.fillStyle = `rgba(214, 90, 49, ${alpha})`;

                if (y > 0 && y < canvas.height) {
                    ctx.fillText(character, x, y);
                }

                // Move drop down or reset if at bottom
                drops[i]++;

                // Reset drop with random delay
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = Math.floor(Math.random() * -10);
                }
            }
        };

        // Control animation speed based on preferences
        const frameDelay = themePrefs.reducedMotion ? 200 : 50;

        // Animation loop
        const interval = setInterval(draw, frameDelay);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isDark, themePrefs.reducedMotion, themePrefs.useScanlines]);

    return (
        <Box
            component="canvas"
            ref={canvasRef}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: isDark ? 0.3 : 0.15,
            }}
        />
    );
};

// Matrix-style scanlines effect
export const Scanlines = () => {
    const themeMode = useSelector(state => state.theme.mode);
    const isDark = themeMode === 'dark';
    const themePrefs = ThemeService.getThemePreferences();

    // Don't render if not using spatial theme or effects are disabled
    if ((themeMode !== 'light' && themeMode !== 'dark') || !themePrefs.useScanlines) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                pointerEvents: 'none',
                opacity: isDark ? 0.15 : 0.08,
                background: `repeating-linear-gradient(
          0deg,
          rgba(214, 90, 49, 0.05) 0px,
          rgba(214, 90, 49, 0.05) 1px,
          transparent 1px,
          transparent 2px
        )`,
                animation: 'scanline-motion 8s linear infinite',
                '@keyframes scanline-motion': {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '0 100px' }
                }
            }}
        />
    );
};

// Matrix-style circuit grid background
export const CircuitGrid = () => {
    const themeMode = useSelector(state => state.theme.mode);
    const isDark = themeMode === 'dark';
    const themePrefs = ThemeService.getThemePreferences();

    // Don't render if not using spatial theme or effects are disabled
    if ((themeMode !== 'light' && themeMode !== 'dark') || !themePrefs.useScanlines) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -2,
                pointerEvents: 'none',
                opacity: isDark ? 0.06 : 0.03,
                background: `
          linear-gradient(90deg, rgba(214, 90, 49, 0.1) 1px, transparent 1px),
          linear-gradient(0deg, rgba(214, 90, 49, 0.1) 1px, transparent 1px)
        `,
                backgroundSize: '20px 20px',
            }}
        />
    );
};

// Combine all effects into one component
export const MatrixEffects = () => {
    const themeMode = useSelector(state => state.theme.mode);

    // Only render for spatial themes (light or dark)
    if (themeMode !== 'light' && themeMode !== 'dark') {
        return null;
    }

    return (
        <>
            <DigitalRain />
            <Scanlines />
            <CircuitGrid />
        </>
    );
};

export default MatrixEffects;