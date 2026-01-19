import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';

// Default background
import heroBackdrop from '../../assets/hero/geometric_hero.png';

/**
 * CTABand - Gradient call-to-action banner
 * 
 * A full-width banner section with gradient background,
 * headline, description, and action buttons.
 * 
 * @param {string} headline - Main headline text
 * @param {string} description - Supporting description text
 * @param {string} primaryCtaText - Primary CTA button text
 * @param {string} secondaryCtaText - Secondary CTA button text
 * @param {function} onPrimaryCtaClick - Primary CTA click handler
 * @param {function} onSecondaryCtaClick - Secondary CTA click handler
 * @param {string} backgroundImage - Optional background pattern image
 */
const CTABand = ({
    headline,
    description,
    primaryCtaText,
    secondaryCtaText,
    onPrimaryCtaClick,
    onSecondaryCtaClick,
    backgroundImage,
}) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { getGlowEffect } = useAppTheme();

    // Default values
    const defaultHeadline = 'Start innovating now';
    const defaultDescription = 'No complex setups. No 3D modeling nightmares. Just stunning AR experiences for your audience.';
    const defaultPrimaryCta = 'Innovate';
    const defaultSecondaryCta = 'View Plans';

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                background: theme.palette.primary.main,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)',
                    pointerEvents: 'none',
                },
            }}
        >
            {/* Background pattern - only render if backgroundImage is provided */}
            {backgroundImage && (
                <Box
                    component="img"
                    src={backgroundImage}
                    alt=""
                    aria-hidden
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.15,
                        mixBlendMode: 'screen',
                    }}
                />
            )}

            <Container
                maxWidth={false}
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    py: { xs: 8, md: 10 },
                    px: { xs: 3, md: 6 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 3,
                }}
            >
                {/* Content */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: 'common.white',
                            mb: 1.5,
                            ...getGlowEffect(theme.palette.secondary.light, 'medium')
                        }}
                    >
                        {translate(headline || defaultHeadline)}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 400,
                        }}
                    >
                        {translate(description || defaultDescription)}
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<ArrowForward />}
                        size="large"
                        onClick={onPrimaryCtaClick}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            color: theme.palette.secondary.contrastText,
                            backgroundColor: theme.palette.secondary.main,
                            boxShadow: 'none',
                            ...getGlowEffect(theme.palette.secondary.main, 'low'),
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.dark,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                ...getGlowEffect(theme.palette.secondary.main, 'medium'),
                            },
                        }}
                    >
                        {translate(primaryCtaText || defaultPrimaryCta)}
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={onSecondaryCtaClick}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderWidth: 2,
                            borderColor: 'rgba(255,255,255,0.6)',
                            color: 'common.white',
                            '&:hover': {
                                borderWidth: 2,
                                borderColor: 'common.white',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                            },
                        }}
                    >
                        {translate(secondaryCtaText || defaultSecondaryCta)}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};
CTABand.propTypes = {
    headline: PropTypes.string,
    description: PropTypes.string,
    primaryCtaText: PropTypes.string,
    secondaryCtaText: PropTypes.string,
    onPrimaryCtaClick: PropTypes.func,
    onSecondaryCtaClick: PropTypes.func,
    backgroundImage: PropTypes.string,
};

CTABand.defaultProps = {
    headline: null,
    description: null,
    primaryCtaText: null,
    secondaryCtaText: null,
    onPrimaryCtaClick: () => {},
    onSecondaryCtaClick: () => {},
    backgroundImage: null,
};

export default CTABand;
