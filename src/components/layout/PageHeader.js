import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import Breadcrumbs from '../navigation/Breadcrumbs';
import { useRouteContext } from '../../routes';
import useCustomTranslation from '../../hooks/useCustomTranslation';

/**
 * Page header component with title, description and breadcrumbs
 * Uses route context to get page metadata automatically
 */
const PageHeader = ({
                        title,
                        description,
                        icon,
                        showBreadcrumbs = true,
                        sx = {}
                    }) => {
    const theme = useTheme();
    const { currentRoute } = useRouteContext();
    const { translate } = useCustomTranslation();

    // Use provided values or fallback to route metadata
    const pageTitle = title || (currentRoute?.meta?.title ? translate(currentRoute.meta.title) : '');
    const pageDescription = description || (currentRoute?.meta?.description ? translate(currentRoute.meta.description) : '');
    const pageIcon = icon || currentRoute?.meta?.icon;

    return (
        <Box sx={{ mb: 4, ...sx }}>
            {showBreadcrumbs && <Breadcrumbs />}
            {/*
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    bgcolor: 'background.default',
                    borderRadius: theme.shape.borderRadius,
                    borderBottom: `3px solid ${theme.palette.primary.main}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: pageDescription ? 2 : 0 }}>
                    {pageIcon && (
                        <Box
                            sx={{
                                mr: 2,
                                color: theme.palette.primary.main,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {pageIcon}
                        </Box>
                    )}

                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            fontFamily: theme.typography.h4.fontFamily,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {pageTitle}
                    </Typography>
                </Box>

                {pageDescription && (
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                            maxWidth: '800px',
                            pl: pageIcon ? 5 : 0
                        }}
                    >
                        {pageDescription}
                    </Typography>
                )}
            </Paper>*/}
        </Box>
    );
};

export default PageHeader;