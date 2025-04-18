import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, useTheme } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Import application hooks and utilities
import useCustomTranslation from '../hooks/useCustomTranslation';
import { useSpatialTheme } from '../hooks/useSpatialTheme';
import { withAuthGuard } from '../routes/routeGuards';
import BusinessUsersManagement from "../components/business/BusinessUsersManagement";
import {useRouteContext} from "../routes";



/**
 * Business Users Management Page
 * This is the parent page component that includes the breadcrumbs and page structure
 */
const BusinessUsersPage = () => {
    const { translate } = useCustomTranslation();
    const { breadcrumbs } = useRouteContext();
    const theme = useTheme();
    const { isDark, getGlassMorphismStyle } = useSpatialTheme();

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 3 }}
            >
                <Link
                    component={RouterLink}
                    to="/"
                    underline="hover"
                    color="inherit"
                >
                    {translate('Home')}
                </Link>
                <Link
                    component={RouterLink}
                    to="/dashboard"
                    underline="hover"
                    color="inherit"
                >
                    {translate('Dashboard')}
                </Link>
                <Typography color="text.primary">{translate('BusinessUsers')}</Typography>
            </Breadcrumbs>

            {/* Page Content */}
            <Box
                sx={{
                    minHeight: 'calc(100vh - 200px)',
                    bgcolor: 'background.default'
                }}
            >
                <BusinessUsersManagement />
            </Box>
        </Container>
    );
};

// Wrap the component with auth guard to protect it
export default withAuthGuard(BusinessUsersPage);