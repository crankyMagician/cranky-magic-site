import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';

/**
 * NewsCard - News/article card component
 *
 * A card for displaying news articles, blog posts, or announcements.
 * Features category badge, date, image, and read more action.
 *
 * @param {string} title - Article title (can be translation key)
 * @param {string} category - Category badge text
 * @param {string} date - Publication date
 * @param {string} image - Article image URL
 * @param {string} excerpt - Optional article excerpt (can be translation key)
 * @param {function} onReadMore - Read more click handler
 */
const NewsCard = ({
    title,
    category,
    date,
    image,
    excerpt,
    onReadMore,
}) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { getFuturisticCardStyle } = useAppTheme();

    const defaultExcerpt = 'Read more about this topic and explore insights from our community experts.';

    return (
        <Card
            sx={{
                ...getFuturisticCardStyle(),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            {/* Image */}
            <Box
                component="img"
                src={image}
                alt={translate(title)}
                sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderBottom: `1px solid ${theme.palette.primary.main}44`,
                }}
            />

            {/* Content */}
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Category and Date */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                        sx={{
                            bgcolor: theme.palette.warning.main,
                            color: '#0f0f0f',
                            px: 1.2,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            fontFamily: theme.typography.h6.fontFamily,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {category}
                    </Box>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                        }}
                    >
                        {date}
                    </Typography>
                </Stack>

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        color: 'common.white',
                        mb: 1.5,
                        lineHeight: 1.4,
                    }}
                >
                    {translate(title)}
                </Typography>

                {/* Excerpt */}
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255,255,255,0.8)',
                    }}
                >
                    {translate(excerpt || defaultExcerpt)}
                </Typography>
            </CardContent>

            {/* Action */}
            <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Button
                    variant="contained"
                    color="info"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={onReadMore}
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
                    {translate('Read Article')}
                </Button>
            </CardActions>
        </Card>
    );
};

NewsCard.propTypes = {
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    onReadMore: PropTypes.func,
};

NewsCard.defaultProps = {
    excerpt: null,
    onReadMore: () => {},
};

export default NewsCard;
