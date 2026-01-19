import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Typography,
    useTheme
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';

// Default logo image for overlays
import portalLinePurple from '../../assets/hero/geometric_hero.png';

/**
 * PracticeCard - Service/practice card with chrome background
 *
 * A card component for displaying best practices, services, or tips.
 * Supports custom background images for visual branding and logo overlays.
 *
 * @param {string} title - Card title (can be translation key)
 * @param {string} description - Card body text (can be translation key)
 * @param {string} ctaText - CTA button label (can be translation key)
 * @param {string} backgroundImage - Optional background image URL
 * @param {string} logoImage - Custom logo image for overlay
 * @param {boolean} showLogo - Whether to show the logo overlay (default: true)
 * @param {function} onClick - Optional card click handler
 * @param {function} onCtaClick - CTA button click handler
 */
const PracticeCard = ({
    title,
    description,
    ctaText,
    backgroundImage,
    logoImage,
    showLogo,
    onClick,
    onCtaClick,
}) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { getFuturisticCardStyle } = useAppTheme();

    return (
        <Box
            onClick={onClick}
            sx={{
                ...getFuturisticCardStyle(),
                height: '100%',
                minHeight: 280,
                borderRadius: 2,
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // Override background color if image is present
                ...(backgroundImage && { backgroundColor: 'transparent' }),
                color: 'common.white',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'transform 0.2s',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            {/* Logo overlay */}
            {showLogo && (
                <Box
                    component="img"
                    src={logoImage || portalLinePurple}
                    alt=""
                    aria-hidden="true"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        height: '100%',
                        width: 'auto',
                        opacity: 0.08,
                        pointerEvents: 'none',
                        zIndex: 1,
                        filter: 'brightness(0) invert(1)',
                    }}
                />
            )}

            {/* Content */}
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 800,
                    fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: theme.palette.info.light,
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {translate(title)}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: 'Roboto, sans-serif',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    flexGrow: 1,
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {translate(description)}
            </Typography>

            {/* CTA Button */}
            <Box sx={{ mt: 'auto', position: 'relative', zIndex: 2 }}>
                <Button
                    variant="contained"
                    color="info"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onCtaClick && onCtaClick();
                    }}
                    sx={{
                        px: 3.5,
                        py: 1.25,
                        fontWeight: 800,
                        color: '#0f0f0f',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(69,147,255,0.4)',
                        }
                    }}
                >
                    {translate(ctaText || 'Learn More')}
                </Button>
            </Box>
        </Box>
    );
};

PracticeCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ctaText: PropTypes.string,
    backgroundImage: PropTypes.string,
    logoImage: PropTypes.string,
    showLogo: PropTypes.bool,
    onClick: PropTypes.func,
    onCtaClick: PropTypes.func,
};

PracticeCard.defaultProps = {
    ctaText: 'Learn More',
    backgroundImage: null,
    logoImage: null,
    showLogo: true,
    onClick: null,
    onCtaClick: () => {},
};

export default PracticeCard;
