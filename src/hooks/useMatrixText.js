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
