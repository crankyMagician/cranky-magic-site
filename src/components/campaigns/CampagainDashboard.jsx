import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    Typography,
    Button,
    Tabs,
    Tab,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert,
    useMediaQuery,
    Fab,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useGetCampaignsByBusinessQuery } from '../../api/campaignApi';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useMatrixText } from '../../hooks/useMatrixText';
import CampaignList from './CampaignList';
import CampaignFormModal from './CampaignFormModal';
import CampaignMetrics from './CampaignMetrics';
import NoResultsFound from '../common/NoResultsFound';

/**
 * Campaign Dashboard component
 * Main container for campaign management functionality
 */
const CampaignDashboard = ({ businessId }) => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const { isDark, getGlassMorphismStyle, getGlowEffect, themePrefs, getAnimationDuration } = useSpatialTheme();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

    // Tab state - set to 'all' to show all campaigns by default
    const [activeTab, setActiveTab] = useState('all');

    // Modal state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // RTK Query hook for fetching campaigns
    const {
        data: campaignsData,
        isLoading,
        isError,
        refetch
    } = useGetCampaignsByBusinessQuery(businessId, {
        // Add a refetch interval if needed
        // pollingInterval: 30000, // Poll every 30 seconds

        // Add skip condition if needed
        // skip: !businessId,

        // Better error handling
        refetchOnError: true,

        // Force refresh on component remount
        refetchOnMountOrArgChange: true,
    });

    // Matrix effect for dashboard title
    const titleText = translate('CampaignDashboard');
    const { text: animatedTitle } = useMatrixText(titleText, {
        speed: 20,
        autoStart: true,
        iterations: 1
    });

    // Filter campaigns based on active tab
    const filteredCampaigns = useMemo(() => {
        // Handle different possible API response structures
        // Try to find campaigns in the response structure
        let campaigns = [];

        if (campaignsData?.data?.campaigns) {
            // Standard nested structure from API
            campaigns = campaignsData.data.campaigns;
        } else if (campaignsData?.campaigns) {
            // Direct campaigns array
            campaigns = campaignsData.campaigns;
        } else if (Array.isArray(campaignsData)) {
            // Raw array of campaigns
            campaigns = campaignsData;
        }

        // If no campaigns found in any format, return empty array
        if (!campaigns || !Array.isArray(campaigns)) {
            console.log('No valid campaigns array found in:', campaignsData);
            return [];
        }

        console.log(`Found ${campaigns.length} campaigns. Filtering by status: ${activeTab}`);

        // Filter by the active tab
        switch (activeTab) {
            case 'active':
                return campaigns.filter(campaign => campaign.status === 'active');
            case 'draft':
                return campaigns.filter(campaign => campaign.status === 'draft');
            case 'completed':
                return campaigns.filter(campaign => campaign.status === 'completed');
            case 'all':
            default:
                return campaigns;
        }
    }, [campaignsData, activeTab]);

    // Handler for tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);

        // Track tab change for analytics
        analytics.trackEvent('campaign_tab_change', {
            tab: newValue,
            business_id: businessId
        });
    };

    // Handler for opening create modal
    const handleOpenCreateModal = useCallback(() => {
        setSelectedCampaign(null);
        setCreateModalOpen(true);

        // Track modal open for analytics
        analytics.trackEvent('campaign_create_modal_open', {
            business_id: businessId
        });
    }, [analytics, businessId]);

    // Handler for opening edit modal
    const handleEditCampaign = useCallback((campaign) => {
        setSelectedCampaign(campaign);
        setCreateModalOpen(true);

        // Track edit action for analytics
        analytics.trackEvent('campaign_edit_start', {
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            business_id: businessId
        });
    }, [analytics, businessId]);

    // Handler for closing modal
    const handleCloseModal = useCallback(() => {
        setCreateModalOpen(false);
        setSelectedCampaign(null);
    }, []);

    // Handler for successful campaign creation/update
    const handleCampaignSaved = useCallback(() => {
        handleCloseModal();
        refetch();

        // Track success for analytics
        analytics.trackEvent('campaign_saved', {
            is_new: !selectedCampaign,
            business_id: businessId
        });
    }, [analytics, businessId, refetch, selectedCampaign]);

    // Manual refresh handler
    const handleRefresh = useCallback(() => {
        refetch();

        // Track refresh for analytics
        analytics.trackEvent('campaign_list_refresh', {
            business_id: businessId
        });
    }, [analytics, businessId, refetch]);

    // Render loading state
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    // Add debug logs to help troubleshoot data structure issues
    console.log('Raw API response:', campaignsData);
    console.log('Campaigns path:', campaignsData?.data?.campaigns);
    console.log('Current tab:', activeTab);
    console.log('Filtered campaigns:', filteredCampaigns);

    // Render error state
    if (isError) {
        return (
            <Alert
                severity="error"
                sx={{ mb: 3 }}
                action={
                    <Button color="inherit" size="small" onClick={refetch}>
                        {translate('Retry')}
                    </Button>
                }
            >
                {translate('ErrorLoadingCampaigns')}
            </Alert>
        );
    }

    return (
        <Box>
            {/* Header section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        ...(themePrefs.useGlowEffects && {
                            textShadow: theme => `0 0 10px ${theme.palette.primary.main}40`
                        })
                    }}
                >
                    {themePrefs.animationLevel !== 'none' ? animatedTitle : titleText}
                </Typography>

                {!isMobile && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateModal}
                        sx={{
                            ...getGlowEffect(theme => theme.palette.primary.main, 'low'),
                            transition: getAnimationDuration(300),
                            '&:hover': {
                                transform: themePrefs.animationLevel !== 'none' ? 'translateY(-2px)' : 'none',
                            }
                        }}
                    >
                        {translate('CreateCampaign')}
                    </Button>
                )}
            </Box>

            {/* Metrics Cards Row */}
            <Box sx={{ mb: 4 }}>
                <CampaignMetrics
                    businessId={businessId}
                    campaignsData={campaignsData?.data}
                />
            </Box>

            {/* Tab navigation */}
            <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons={isMobile ? "auto" : false}
                    allowScrollButtonsMobile
                    sx={{
                        '& .MuiTab-root': {
                            fontWeight: 500,
                            minWidth: { xs: 'auto', md: 150 }
                        }
                    }}
                >
                    <Tab label={translate('ActiveCampaigns')} value="active" />
                    <Tab label={translate('DraftCampaigns')} value="draft" />
                    <Tab label={translate('CompletedCampaigns')} value="completed" />
                    <Tab label={translate('AllCampaigns')} value="all" />
                </Tabs>
            </Box>

            {/* Campaign list or empty state */}
            <Box sx={{ position: 'relative', minHeight: 200 }}>
                {filteredCampaigns.length > 0 ? (
                    <CampaignList
                        campaigns={filteredCampaigns}
                        onEditCampaign={handleEditCampaign}
                        onRefresh={refetch}
                        businessId={businessId}
                    />
                ) : (
                    <NoResultsFound
                        title={translate('NoCampaignsFound')}
                        description={translate('NoCampaignsDescription')}
                        actionText={translate('CreateFirstCampaign')}
                        onAction={handleOpenCreateModal}
                        icon="campaign"
                    />
                )}

                {/* Floating action button for mobile */}
                {isMobile && (
                    <Fab
                        color="primary"
                        aria-label={translate('CreateCampaign')}
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            ...getGlowEffect(theme => theme.palette.primary.main, 'medium')
                        }}
                        onClick={handleOpenCreateModal}
                    >
                        <AddIcon />
                    </Fab>
                )}

                {/* Refresh button */}
                <Fab
                    size="small"
                    color="secondary"
                    aria-label={translate('RefreshCampaigns')}
                    sx={{
                        position: 'absolute',
                        top: { xs: -60, sm: -60 },
                        right: { xs: 0, sm: 20 }
                    }}
                    onClick={handleRefresh}
                >
                    <RefreshIcon />
                </Fab>
            </Box>

            {/* Campaign form modal */}
            <CampaignFormModal
                open={createModalOpen}
                onClose={handleCloseModal}
                onSave={handleCampaignSaved}
                campaign={selectedCampaign}
                businessId={businessId}
            />
        </Box>
    );
};

CampaignDashboard.propTypes = {
    businessId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired};

export default React.memo(CampaignDashboard);