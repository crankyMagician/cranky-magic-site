// src/hooks/useSpatialTheme.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ThemeService from '../services/ThemeService';

/**
 * Custom hook to access Spatial Theme settings and utilities
 * Provides convenient access to theme mode, preferences, and utility functions
 */
export const useSpatialTheme = () => {
    const themeMode = useSelector(state => state.theme.mode);
    const [themePrefs, setThemePrefs] = useState(ThemeService.getThemePreferences());
    const isDark = themeMode === 'dark';
    const isSpatialTheme = themeMode === 'light' || themeMode === 'dark';

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
            ? `rgba(30, 30, 30, ${opacity})`
            : `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        border: isDark
            ? '1px solid rgba(214, 90, 49, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
    });

    // Utility function for glow effects
    const getGlowEffect = (color = '#D65A31', intensity = 'medium') => {
        if (!themePrefs.useGlowEffects) {
            return {}; // No glow if disabled
        }

        const intensityMap = {
            low: isDark ? '0 0 5px' : '0 0 3px',
            medium: isDark ? '0 0 10px' : '0 0 7px',
            high: isDark ? '0 0 15px' : '0 0 12px',
        };

        const shadowIntensity = intensityMap[intensity] || intensityMap.medium;
        const opacity = isDark ? 0.7 : 0.5;

        return {
            boxShadow: `${shadowIntensity} ${color}${Math.floor(opacity * 255).toString(16)}`,
        };
    };

    // Utility function for tech data display
    const getDataDisplayStyle = () => ({
        fontFamily: 'Orbitron, sans-serif',
        letterSpacing: '0.05em',
        border: `1px solid ${isDark ? 'rgba(214, 90, 49, 0.4)' : 'rgba(214, 90, 49, 0.3)'}`,
        borderRadius: '4px',
        padding: '8px 12px',
        backgroundColor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        ...(themePrefs.useGlowEffects && {
            boxShadow: isDark
                ? '0 0 8px rgba(214, 90, 49, 0.3)'
                : '0 0 5px rgba(214, 90, 49, 0.2)',
        }),
    });

    // Utility for creating a Matrix style digital terminal
    const getTerminalStyle = () => ({
        fontFamily: 'Rajdhani, monospace',
        backgroundColor: isDark ? '#0f0f0f' : '#f0f0f0',
        color: '#D65A31',
        padding: '16px',
        borderRadius: '4px',
        border: `1px solid ${isDark ? 'rgba(214, 90, 49, 0.4)' : 'rgba(214, 90, 49, 0.3)'}`,
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
                ? `repeating-linear-gradient(0deg, transparent, transparent 2px, ${isDark ? 'rgba(214, 90, 49, 0.1)' : 'rgba(214, 90, 49, 0.05)'} 2px, ${isDark ? 'rgba(214, 90, 49, 0.1)' : 'rgba(214, 90, 49, 0.05)'} 4px)`
                : 'none',
            pointerEvents: 'none',
        },
    });

    // Utility for futuristic card styling
    const getFuturisticCardStyle = () => ({
        background: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        border: isDark ? '1px solid rgba(214, 90, 49, 0.2)' : '1px solid rgba(255, 255, 255, 0.7)',
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
            background: `linear-gradient(135deg, transparent 40%, ${isDark ? 'rgba(214, 90, 49, 0.4)' : 'rgba(214, 90, 49, 0.3)'} 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            pointerEvents: 'none',
        },
        '&:hover': themePrefs.useGlowEffects ? {
            transform: 'translateY(-3px)',
            boxShadow: isDark
                ? `0 8px 16px rgba(0, 0, 0, 0.4), 0 0 10px rgba(214, 90, 49, 0.2)`
                : `0 8px 16px rgba(0, 0, 0, 0.15), 0 0 10px rgba(214, 90, 49, 0.1)`,
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
        isSpatialTheme,
        updatePreference,
        getGlassMorphismStyle,
        getGlowEffect,
        getDataDisplayStyle,
        getTerminalStyle,
        getFuturisticCardStyle,
        getAnimationDuration,
    };
};

// src/hooks/useMatrixText.js
import { useState, useEffect, useCallback } from 'react';
import { useSpatialTheme } from './useSpatialTheme';

/**
 * Hook for creating Matrix-style scrambling text effect
 * @param {string} finalText - The final text to display after scrambling
 * @param {object} options - Configuration options
 * @returns {string} The current state of the scrambled text
 */
export const useMatrixText = (finalText, options = {}) => {
    const {
        speed = 30,
        scrambleChars = '01010100100101110ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]><;:/?.,"\'',
        onComplete = null,
        autoStart = true,
        iterations = 2,
    } = options;

    const { themePrefs, isSpatialTheme } = useSpatialTheme();
    const [displayText, setDisplayText] = useState('');
    const [isActive, setIsActive] = useState(autoStart);
    const [isFinalizing, setIsFinalizing] = useState(false);

    // Adjust speed based on animation preference
    const getAdjustedSpeed = useCallback(() => {
        if (themePrefs.reducedMotion) return speed * 3;

        const speedMap = {
            none: speed * 5, // Very fast to effectively disable animation
            low: speed * 2,
            medium: speed,
            high: speed * 0.7,
        };

        return speedMap[themePrefs.animationLevel] || speed;
    }, [speed, themePrefs.animationLevel, themePrefs.reducedMotion]);

    // Start the scramble effect
    const startScramble = useCallback(() => {
        setIsActive(true);
    }, []);

    // Stop the scramble effect
    const stopScramble = useCallback(() => {
        setIsActive(false);
    }, []);

    // Reset the effect
    const resetScramble = useCallback(() => {
        setDisplayText('');
        setIsActive(false);
        setIsFinalizing(false);
    }, []);

    // The scrambling effect
    useEffect(() => {
        // Return immediately if not using spatial theme or animation disabled
        if (!isSpatialTheme || themePrefs.animationLevel === 'none' || !isActive) {
            if (!isActive && !displayText) {
                setDisplayText(finalText);
            }
            return;
        }

        let timeoutId;
        let iterationCount = 0;
        let finalizingCounter = 0;
        const adjustedSpeed = getAdjustedSpeed();

        const scramble = () => {
            if (!isActive) return;

            // During finalization phase, gradually reveal the correct text
            if (isFinalizing) {
                const currentTextLength = displayText.length;
                const finalTextLength = finalText.length;

                if (finalizingCounter >= finalTextLength) {
                    setDisplayText(finalText);
                    setIsActive(false);
                    if (onComplete) onComplete();
                    return;
                }

                let newText = '';
                for (let i = 0; i < finalTextLength; i++) {
                    if (i <= finalizingCounter) {
                        newText += finalText[i];
                    } else {
                        newText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    }
                }

                setDisplayText(newText);
                finalizingCounter += 1;
                timeoutId = setTimeout(scramble, adjustedSpeed);
                return;
            }

            // Regular scrambling phase
            let scrambledText = '';
            for (let i = 0; i < finalText.length; i++) {
                scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }

            setDisplayText(scrambledText);
            iterationCount++;

            // Switch to finalizing after desired iterations
            if (iterationCount >= iterations) {
                setIsFinalizing(true);
            }

            timeoutId = setTimeout(scramble, adjustedSpeed);
        };

        timeoutId = setTimeout(scramble, adjustedSpeed);

        return () => clearTimeout(timeoutId);
    }, [
        finalText,
        isActive,
        isFinalizing,
        scrambleChars,
        getAdjustedSpeed,
        iterations,
        onComplete,
        displayText,
        themePrefs.animationLevel,
        isSpatialTheme
    ]);

    return {
        text: displayText || (isActive ? '' : finalText),
        startScramble,
        stopScramble,
        resetScramble,
        isActive,
    };
};

export default useSpatialTheme;
