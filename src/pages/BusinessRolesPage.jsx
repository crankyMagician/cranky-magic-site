import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, useTheme } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import useCustomTranslation from "../hooks/useCustomTranslation";
import {useRouteContext} from "../routes";
import {useSpatialTheme} from "../hooks/useSpatialTheme";
import {withAuthGuard} from "../routes/routeGuards";
import BusinessRolesManagement from "../components/business/BusinessRolesManagement";


/**
 * Business Roles Management Page
 * This is the parent page component that includes the breadcrumbs and page structure
 */
const BusinessRolesPage = () => {
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
                <Typography color="text.primary">{translate('BusinessRoles')}</Typography>
            </Breadcrumbs>

            {/* Page Content */}
            <Box
                sx={{
                    minHeight: 'calc(100vh - 200px)',
                    bgcolor: 'background.default'
                }}
            >
                <BusinessRolesManagement />
            </Box>
        </Container>
    );
};

// Wrap the component with auth guard to protect it
export default withAuthGuard(BusinessRolesPage);