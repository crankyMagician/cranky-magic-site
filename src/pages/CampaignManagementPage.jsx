import React, { useEffect } from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import useAnalytics from '../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../hooks/useSpatialTheme';
import { AuthGuard } from '../routes';

import ErrorBoundary from '../components/common/ErrorBoundary';
import useCustomTranslation from '../hooks/useCustomTranslation';
import CampaignDashboard from "../components/campaigns/CampagainDashboard";

/**
 * Campaign Management Page
 * Main container for campaign management functionality
 */
const CampaignManagementPage = () => {
    const { user, activeBusiness } = useAuth();
    const analytics = useAnalytics();
    const { translate } = useCustomTranslation();
    const { isDark } = useSpatialTheme();
    const theme = useTheme();

    useEffect(() => {
        // Track additional data about the page view
        // Note: Primary page view tracking handled by RouteContext
        analytics.trackEvent('campaign_management_view', {
            has_active_business: !!activeBusiness,
            business_id: activeBusiness?.id,
            user_id: user?.id
        });
    }, [analytics, activeBusiness, user]);

    // Redirect to business selection if no active business
    if (!activeBusiness) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {translate('NeedActiveBusiness')}
                </Typography>
                <Typography variant="body1">
                    {translate('SelectBusinessToContinue')}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                bgcolor: 'background.default',
                pt: 2,
                pb: 4
            }}
        >
            <Container maxWidth="xl">
                <ErrorBoundary fallback={<Typography color="error">{translate('ErrorLoadingCampaigns')}</Typography>}>
                    <CampaignDashboard businessId={activeBusiness.id} />
                </ErrorBoundary>
            </Container>
        </Box>
    );
};

// Wrap with AuthGuard to enforce authentication
const ProtectedCampaignManagementPage = () => (
    <AuthGuard>
        <CampaignManagementPage />
    </AuthGuard>
);

export default ProtectedCampaignManagementPage;