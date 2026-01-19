// src/hooks/useAppTheme.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import ThemeService from '../services/ThemeService';

/**
 * Custom hook to access App Theme settings and utilities
 * Provides convenient access to theme mode, preferences, and utility functions
 */
export const useAppTheme = () => {
    const themeMode = useSelector(state => state.theme.mode);
    const [themePrefs, setThemePrefs] = useState(ThemeService.getThemePreferences());
    const isDark = themeMode === 'dark';
    const theme = useTheme();

    // Stay in sync with localStorage preferences
    useEffect(() => {
        const updatePrefs = () => {
            setThemePrefs(ThemeService.getThemePreferences());
        };

        // Create a custom event listener for theme preference changes
        window.addEventListener('theme-preferences-changed', updatePrefs);

        return () => {
            window.removeEventListener('theme-preferences-changed', updatePrefs);
        };
    }, []);

    // Update a specific theme preference
    const updatePreference = (key, value) => {
        const newPrefs = { ...themePrefs, [key]: value };
        ThemeService.setThemePreferences(newPrefs);
        setThemePrefs(newPrefs);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('theme-preferences-changed'));
    };

    // Utility function for glassmorphism effect styles
    const getGlassMorphismStyle = (opacity = 0.7) => ({
        background: isDark
            ? `rgba(10, 8, 12, ${opacity})`
            : `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        border: isDark
            ? '1px solid rgba(109, 64, 169, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
    });

    // Utility function for glow effects (uses textShadow for text elements)
    const getGlowEffect = (color = '#6D40A9', intensity = 'medium') => {
        if (!themePrefs.useGlowEffects) {
            return {}; // No glow if disabled
        }

        const intensityMap = {
            low: isDark ? '0 0 8px' : '0 0 5px',
            medium: isDark ? '0 0 15px' : '0 0 10px',
            high: isDark ? '0 0 25px' : '0 0 18px',
        };

        const shadowIntensity = intensityMap[intensity] || intensityMap.medium;
        const opacity = isDark ? 0.6 : 0.4;
        const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0');

        return {
            textShadow: `${shadowIntensity} ${color}${opacityHex}`,
        };
    };

    // Utility function for tech data display
    const getDataDisplayStyle = () => ({
        fontFamily: theme.typography.h6.fontFamily,
        letterSpacing: '0.05em',
        border: `1px solid ${isDark ? 'rgba(109, 64, 169, 0.4)' : 'rgba(109, 64, 169, 0.3)'}`,
        borderRadius: '4px',
        padding: '8px 12px',
        backgroundColor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        ...(themePrefs.useGlowEffects && {
            boxShadow: isDark
                ? '0 0 8px rgba(109, 64, 169, 0.3)'
                : '0 0 5px rgba(109, 64, 169, 0.2)',
        }),
    });

    // Utility for creating a Matrix style digital terminal
    const getTerminalStyle = () => ({
        fontFamily: theme.typography.code?.fontFamily || 'monospace',
        backgroundColor: isDark ? '#0f0f0f' : '#f0f0f0',
        color: '#6D40A9',
        padding: '16px',
        borderRadius: '4px',
        border: `1px solid ${isDark ? 'rgba(109, 64, 169, 0.4)' : 'rgba(109, 64, 169, 0.3)'}`,
        boxShadow: `inset 0 0 10px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'}`,
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: themePrefs.useScanlines
                ? `repeating-linear-gradient(0deg, transparent, transparent 2px, ${isDark ? 'rgba(109, 64, 169, 0.1)' : 'rgba(109, 64, 169, 0.05)'} 2px, ${isDark ? 'rgba(109, 64, 169, 0.1)' : 'rgba(109, 64, 169, 0.05)'} 4px)`
                : 'none',
            pointerEvents: 'none',
        },
    });

    // Utility for futuristic card styling
    const getFuturisticCardStyle = () => ({
        background: isDark ? 'rgba(10, 8, 12, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        border: isDark ? '1px solid rgba(109, 64, 169, 0.2)' : '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '8px',
            padding: '1px',
            background: `linear-gradient(135deg, transparent 40%, ${isDark ? 'rgba(109, 64, 169, 0.4)' : 'rgba(109, 64, 169, 0.3)'} 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            pointerEvents: 'none',
        },
        '&:hover': themePrefs.useGlowEffects ? {
            transform: 'translateY(-3px)',
            boxShadow: isDark
                ? `0 8px 16px rgba(0, 0, 0, 0.4), 0 0 10px rgba(109, 64, 169, 0.2)`
                : `0 8px 16px rgba(0, 0, 0, 0.15), 0 0 10px rgba(109, 64, 169, 0.1)`,
        } : {},
    });

    // Utility function to get appropriate animation duration based on preferences
    const getAnimationDuration = (baseDuration = 300) => {
        if (themePrefs.reducedMotion) {
            return `${baseDuration * 2}ms`;
        }

        const factorMap = {
            none: 0, // No animation
            low: 1.5,
            medium: 1.0,
            high: 0.7,
        };

        const factor = factorMap[themePrefs.animationLevel] || 1.0;
        return themePrefs.animationLevel === 'none' ? '0ms' : `${baseDuration * factor}ms`;
    };

    // Return all the utilities and states
    return {
        themeMode,
        themePrefs,
        isDark,
        updatePreference,
        getGlassMorphismStyle,
        getGlowEffect,
        getDataDisplayStyle,
        getTerminalStyle,
        getFuturisticCardStyle,
        getAnimationDuration,
    };
};

