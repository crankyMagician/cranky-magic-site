import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useRouteContext } from '../../routes';
import useCustomTranslation from '../../hooks/useCustomTranslation';

/**
 * Breadcrumbs component that uses the route context to display navigation breadcrumbs
 */
const Breadcrumbs = ({ sx = {} }) => {
    const { breadcrumbs } = useRouteContext();
    const { translate } = useCustomTranslation();

    // If there's only home, don't show breadcrumbs
    if (breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <Box sx={{ mb: 3, mt: 1, ...sx }}>
            <MUIBreadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    // Different styling for first (home) and last (current) items
                    if (index === 0) {
                        return (
                            <Link
                                key={crumb.path}
                                component={RouterLink}
                                to={crumb.path}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.primary',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                                aria-current={isLast ? 'page' : undefined}
                            >
                                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                                <Typography variant="body2">{translate(crumb.label)}</Typography>
                            </Link>
                        );
                    }

                    if (isLast) {
                        return (
                            <Typography
                                key={crumb.path}
                                color="text.primary"
                                variant="body2"
                                aria-current="page"
                            >
                                {translate(crumb.label)}
                            </Typography>
                        );
                    }

                    return (
                        <Link
                            key={crumb.path}
                            component={RouterLink}
                            to={crumb.path}
                            sx={{
                                color: 'text.primary',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            <Typography variant="body2">{translate(crumb.label)}</Typography>
                        </Link>
                    );
                })}
            </MUIBreadcrumbs>
        </Box>
    );
};

export default Breadcrumbs;