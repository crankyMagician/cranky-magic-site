import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
    useTheme
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';

// Default logo image for overlays
import portalLinePurple from '../../assets/hero/geometric_hero.png';

/**
 * FeatureCard - Reusable feature showcase card component
 *
 * A versatile card for displaying features with image, title, description, and CTA.
 * Supports optional overlay images for background effects and logo position overlays.
 *
 * @param {string} title - Card title (can be translation key)
 * @param {string} description - Card body text (can be translation key)
 * @param {string} ctaText - CTA button label (can be translation key)
 * @param {string} image - Main image source
 * @param {string} overlayImage - Optional background overlay image
 * @param {string} logoPosition - Logo overlay position: 'left' | 'right' | 'full' | 'none'
 * @param {string} logoImage - Custom logo image for overlay
 * @param {function} onCtaClick - CTA click handler
 */
const FeatureCard = ({
    title,
    description,
    ctaText,
    image,
    overlayImage,
    logoPosition,
    logoImage,
    onCtaClick,
}) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { getFuturisticCardStyle } = useAppTheme();

    return (
        <Card
            sx={{
                ...getFuturisticCardStyle(),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            {/* Image container with gradient */}
            <Box
                sx={{
                    position: 'relative',
                    height: 260,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    borderBottom: `1px solid ${theme.palette.primary.main}55`,
                    overflow: 'hidden',
                }}
            >
                <Box
                    component="img"
                    src={image}
                    alt={translate(title)}
                    sx={{
                        maxWidth: '90%',
                        maxHeight: '82%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
                        position: 'relative',
                        zIndex: 2,
                    }}
                />
            </Box>

            {/* Content */}
            <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    {translate(title)}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.6,
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    {translate(description)}
                </Typography>
            </CardContent>

            {/* Full-height logo overlay spanning entire card */}
            {logoPosition && logoPosition !== 'none' && (
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
                        opacity: 0.12,
                        pointerEvents: 'none',
                        zIndex: 1,
                        filter: 'brightness(0) invert(1)',
                    }}
                />
            )}

            {/* CTA */}
            <CardActions sx={{ px: 3, pb: 3, pt: 0, position: 'relative', zIndex: 2 }}>
                <Button
                    variant="contained"
                    color="info"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={onCtaClick}
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
                    {translate(ctaText)}
                </Button>
            </CardActions>
        </Card>
    );
};

FeatureCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ctaText: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    overlayImage: PropTypes.string,
    logoPosition: PropTypes.oneOf(['left', 'right', 'full', 'none']),
    logoImage: PropTypes.string,
    onCtaClick: PropTypes.func,
};

FeatureCard.defaultProps = {
    overlayImage: null,
    logoPosition: 'none',
    logoImage: null,
    onCtaClick: () => {},
};

export default FeatureCard;
