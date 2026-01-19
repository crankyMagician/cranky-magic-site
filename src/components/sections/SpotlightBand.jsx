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
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';
import BackdropPattern from '../common/BackdropPattern';

// Default asset - octopus mascot in portal triangle
import portalTriangleMonster from '../../assets/logo/logo.svg';

/**
 * SpotlightBand - Spotlight/feature band section
 * 
 * A colored banner section with:
 * - Left: Title, description, and CTA
 * - Right: Feature image
 * 
 * @param {string} title - Section heading
 * @param {string} description - Spotlight description text
 * @param {string} ctaText - CTA button text
 * @param {function} onCtaClick - CTA click handler
 * @param {string} bannerImage - Right-side banner image
 * @param {string} backgroundColor - Background color (defaults to purple)
 */
const SpotlightBand = ({
    title,
    description,
    ctaText,
    onCtaClick,
    bannerImage,
    backgroundColor,
}) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { getGlowEffect } = useAppTheme();

    // Default values
    const defaultTitle = 'Featured Work';
    const defaultDescription = 'Highlighting exceptional projects and achievements. From enterprise solutions to innovative startups, these case studies demonstrate the impact of thoughtful architecture and modern development practices. Each project represents a collaborative effort to solve real-world challenges with scalable, maintainable solutions.';
    const defaultCtaText = 'Learn More';

    return (
        <Box
            sx={{
                position: 'relative',
                bgcolor: backgroundColor || '#7a3ba7',
                color: 'common.white',
                overflow: 'hidden',
            }}
        >
            {/* Subtle geometric pattern backdrop */}
            <BackdropPattern variant="purple" opacity={0.1} />

            <Container
                maxWidth={false}
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
                    alignItems: 'center',
                    gap: 6,
                    py: { xs: 8, md: 10 },
                    px: { xs: 3, md: 6 },
                }}
            >
                {/* Content */}
                <Stack spacing={3}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            ...getGlowEffect('rgba(255,255,255,0.5)', 'low')
                        }}
                    >
                        {translate(title || defaultTitle)}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255,255,255,0.95)',
                            lineHeight: 1.7,
                            fontSize: '1.1rem',
                        }}
                    >
                        {translate(description || defaultDescription)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="info"
                        size="large"
                        onClick={onCtaClick}
                        sx={{
                            width: 'fit-content',
                            fontWeight: 800,
                            color: '#0f0f0f',
                            boxShadow: 'none',
                            ...getGlowEffect(theme.palette.info.main, 'low')
                        }}
                    >
                        {translate(ctaText || defaultCtaText)}
                    </Button>
                </Stack>
                {/* Banner Image - Octopus Mascot */}
                <Box
                    component="img"
                    src={bannerImage || portalTriangleMonster}
                    alt={translate(title || defaultTitle)}
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        justifySelf: 'center',
                        filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.35))',
                    }}
                />
            </Container>
        </Box>
    );
};

SpotlightBand.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    ctaText: PropTypes.string,
    onCtaClick: PropTypes.func,
    bannerImage: PropTypes.string,
    backgroundColor: PropTypes.string,
};

SpotlightBand.defaultProps = {
    title: null,
    description: null,
    ctaText: null,
    onCtaClick: () => {},
    bannerImage: null,
    backgroundColor: null,
};

export default SpotlightBand;
