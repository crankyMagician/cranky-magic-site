import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Button,
    Paper,
    useTheme
} from '@mui/material';
import {
    SearchOff as SearchOffIcon,
    Campaign as CampaignIcon,
    Add as AddIcon,
    Inbox as InboxIcon,
    Error as ErrorIcon
} from '@mui/icons-material';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

/**
 * NoResultsFound component
 * Displays a message when no results are found, with optional action button
 */
const NoResultsFound = ({
                            title,
                            description,
                            icon = 'search',
                            actionText,
                            onAction,
                            height = 300,
                            iconSize = 64
                        }) => {
    const theme = useTheme();
    const { isDark, getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();

    // Get the appropriate icon
    const getIcon = () => {
        switch (icon) {
            case 'search':
                return <SearchOffIcon sx={{ fontSize: iconSize, opacity: 0.7, color: 'text.secondary' }} />;
            case 'campaign':
                return <CampaignIcon sx={{ fontSize: iconSize, opacity: 0.7, color: 'text.secondary' }} />;
            case 'inbox':
                return <InboxIcon sx={{ fontSize: iconSize, opacity: 0.7, color: 'text.secondary' }} />;
            case 'error':
                return <ErrorIcon sx={{ fontSize: iconSize, opacity: 0.7, color: 'error.main' }} />;
            default:
                return icon; // Custom icon passed as node
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                height,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                ...getGlassMorphismStyle(0.7),
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2
            }}
        >
            <Box sx={{ mb: 2 }}>
                {getIcon()}
            </Box>

            <Typography variant="h6" component="h3" align="center" gutterBottom>
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 3, maxWidth: 450 }}
                >
                    {description}
                </Typography>
            )}

            {actionText && onAction && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onAction}
                    sx={{
                        mt: 2,
                        borderRadius: 1,
                        ...getGlowEffect(theme => theme.palette.primary.main, 'low')
                    }}
                >
                    {actionText}
                </Button>
            )}
        </Paper>
    );
};

NoResultsFound.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.oneOfType([
        PropTypes.oneOf(['search', 'campaign', 'inbox', 'error']),
        PropTypes.node
    ]),
    actionText: PropTypes.string,
    onAction: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iconSize: PropTypes.number
};

export default React.memo(NoResultsFound);