import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

// Import backdrop variants - Mapped to available geometric assets
import heroBackdropDefault from '../../assets/hero/geometric_hero.png';
import heroBackdropPurple from '../../assets/hero/geometric_hero_1.png';
import heroBackdropBlue from '../../assets/hero/geometric_hero_2.png';

// Fallback for others to keep the code working without missing files
const heroBackdropSecondary = heroBackdropDefault;
const heroBackdropTertiary = heroBackdropPurple;
const heroBackdropWhite = heroBackdropDefault;
const heroBackdropPrimaryLight = heroBackdropDefault;
const heroBackdropPrimaryDark = heroBackdropDefault;
const heroBackdropSecondaryLight = heroBackdropDefault;
const heroBackdropSecondaryDark = heroBackdropDefault;
const heroBackdropInfoLight = heroBackdropBlue;
const heroBackdropInfoDark = heroBackdropBlue;
const heroBackdropSuccess = heroBackdropDefault;
const heroBackdropSuccessDark = heroBackdropDefault;
const heroBackdropWarning = heroBackdropDefault;
const heroBackdropWarningDark = heroBackdropDefault;
const heroBackdropError = heroBackdropDefault;
const heroBackdropPaper = heroBackdropDefault;
const heroBackdropBgDefault = heroBackdropDefault;
const heroBackdropGlassOverlay = heroBackdropDefault;
const heroBackdropTextPrimary = heroBackdropDefault;
const heroBackdropTextSecondary = heroBackdropDefault;
const heroBackdropDisabledText = heroBackdropDefault;

/**
 * Backdrop variant mapping
 */
const backdropMap = {
    default: heroBackdropDefault,
    purple: heroBackdropPurple,
    blue: heroBackdropBlue,
    secondary: heroBackdropSecondary,
    tertiary: heroBackdropTertiary,
    white: heroBackdropWhite,
    'primary-light': heroBackdropPrimaryLight,
    'primary-dark': heroBackdropPrimaryDark,
    'secondary-light': heroBackdropSecondaryLight,
    'secondary-dark': heroBackdropSecondaryDark,
    'info-light': heroBackdropInfoLight,
    'info-dark': heroBackdropInfoDark,
    success: heroBackdropSuccess,
    'success-dark': heroBackdropSuccessDark,
    warning: heroBackdropWarning,
    'warning-dark': heroBackdropWarningDark,
    error: heroBackdropError,
    paper: heroBackdropPaper,
    'bg-default': heroBackdropBgDefault,
    'glass-overlay': heroBackdropGlassOverlay,
    'text-primary': heroBackdropTextPrimary,
    'text-secondary': heroBackdropTextSecondary,
    'disabled-text': heroBackdropDisabledText,
};

/**
 * BackdropPattern - Reusable geometric triangle pattern background
 *
 * Provides consistent backdrop implementation across the application
 * with configurable variants and opacity levels.
 *
 * @param {string} variant - The backdrop color variant (default, purple, blue, success, etc.)
 * @param {number} opacity - Opacity level for the backdrop (0.05-0.15 recommended)
 * @param {object} sx - Additional MUI sx props to merge
 */
const BackdropPattern = ({ variant = 'default', opacity = 0.1, sx = {} }) => {
    const backdropSrc = backdropMap[variant] || backdropMap.default;

    return (
        <Box
            component="img"
            src={backdropSrc}
            alt=""
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity,
                pointerEvents: 'none',
                zIndex: 0,
                ...sx,
            }}
        />
    );
};

BackdropPattern.propTypes = {
    variant: PropTypes.oneOf([
        'default',
        'purple',
        'blue',
        'secondary',
        'tertiary',
        'white',
        'primary-light',
        'primary-dark',
        'secondary-light',
        'secondary-dark',
        'info-light',
        'info-dark',
        'success',
        'success-dark',
        'warning',
        'warning-dark',
        'error',
        'paper',
        'bg-default',
        'glass-overlay',
        'text-primary',
        'text-secondary',
        'disabled-text',
    ]),
    opacity: PropTypes.number,
    sx: PropTypes.object,
};

BackdropPattern.defaultProps = {
    variant: 'default',
    opacity: 0.1,
    sx: {},
};

// Export the backdrop map for direct access if needed
export { backdropMap };

export default BackdropPattern;