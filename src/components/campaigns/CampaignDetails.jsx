import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Button,
    IconButton,
    Chip,
    Divider,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Skeleton,
    Alert,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    ListItemSecondaryAction,
    Tooltip,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Breadcrumbs,
    Link,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as BackIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    Schedule as ScheduleIcon,
    AttachMoney as BudgetIcon,
    People as AudienceIcon,
    Image as ImageIcon,
    VideoLibrary as VideoIcon,
    Description as DocumentIcon,
    ViewInAr as ArIcon,
    MoreVert as MoreVertIcon,
    NavigateNext as NavigateNextIcon,
    Campaign as CampaignIcon,
    CalendarToday as CalendarIcon,
    Download as DownloadIcon,
    Share as ShareIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

// Import application hooks and utilities
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useAuth } from '../../hooks/useAuth';

// Import API hooks
import {
    useGetCampaignByIdQuery,
    useUpdateCampaignStatusMutation,
    useDeleteCampaignMutation,
    useDeleteCampaignMediaMutation,
    useGetCampaignVuforiaStatsQuery
} from '../../api/campaignApi';

// Import components
import CampaignStatusChip from '../../components/campaigns/CampaignStatusChip';
import CampaignWizard from '../../components/campaigns/CampaignWizard';
import ConfirmDialog from '../../components/common/ConfirmDialog';

/**
 * CampaignDetails Component
 * Displays comprehensive campaign information with media, stats, and actions
 */
const CampaignDetails = () => {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const { translate } = useCustomTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const analytics = useAnalytics();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { getGlassMorphismStyle, getGlowEffect, isDark } = useSpatialTheme();
    const { user, activeBusiness } = useAuth();

    // State management
    const [activeTab, setActiveTab] = useState(0);
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaActionMenuAnchor, setMediaActionMenuAnchor] = useState(null);

    // Get business ID
    const businessId = activeBusiness?.id;

    // API queries - Updated to handle ServiceResponse
    const {
        data: campaignData,
        isLoading: isLoadingCampaign,
        error: campaignError,
        refetch: refetchCampaign
    } = useGetCampaignByIdQuery({
        businessId,
        campaignId
    }, {
        skip: !businessId || !campaignId
    });

    const {
        data: vuforiaStatsData,
        isLoading: isLoadingVuforiaStats
    } = useGetCampaignVuforiaStatsQuery({
        businessId,
        campaignId
    }, {
        skip: !businessId || !campaignId || !campaignData?.media?.some(m => m.source === 'vuforia')
    });

    // Mutations
    const [updateCampaignStatus, { isLoading: isUpdatingStatus }] = useUpdateCampaignStatusMutation();
    const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();
    const [deleteCampaignMedia, { isLoading: isDeletingMedia }] = useDeleteCampaignMediaMutation();

    // Extract campaign from response (handles ServiceResponse unwrapping)
    const campaign = useMemo(() => {
        return campaignData || null;
    }, [campaignData]);

    // Extract Vuforia stats
    const vuforiaStats = useMemo(() => {
        return vuforiaStatsData || null;
    }, [vuforiaStatsData]);

    // Track page view
    useEffect(() => {
        if (campaign) {
            analytics.trackEvent('campaign_details_view', {
                campaign_id: campaignId,
                campaign_name: campaign.name,
                campaign_status: campaign.status,
                business_id: businessId
            });
        }
    }, [campaign, campaignId, businessId, analytics]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);

        analytics.trackEvent('campaign_details_tab_change', {
            tab_index: newValue,
            tab_name: ['overview', 'media', 'analytics'][newValue],
            campaign_id: campaignId,
            business_id: businessId
        });
    };

    // Handle action menu
    const handleOpenActionMenu = (event) => {
        setActionMenuAnchor(event.currentTarget);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
    };

    // Handle status update
    const handleStatusChange = (status) => {
        setNewStatus(status);
        setStatusDialogOpen(true);
        handleCloseActionMenu();
    };

    const handleConfirmStatusChange = async () => {
        try {
            await updateCampaignStatus({
                businessId,
                campaignId,
                status: newStatus
            }).unwrap();

            setStatusDialogOpen(false);
            refetchCampaign();

            enqueueSnackbar(translate('CampaignStatusUpdatedSuccessfully'), { variant: 'success' });

            analytics.trackEvent('campaign_status_updated', {
                campaign_id: campaignId,
                old_status: campaign.status,
                new_status: newStatus,
                business_id: businessId
            });
        } catch (error) {
            console.error('Error updating campaign status:', error);

            const errorMessage = error?.message || error?.data?.message || translate('ErrorUpdatingCampaignStatus');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            analytics.trackEvent('error', {
                action: 'update_campaign_status',
                error: errorMessage,
                campaign_id: campaignId,
                business_id: businessId
            });
        }
    };

    // Handle delete
    const handleDelete = () => {
        setDeleteDialogOpen(true);
        handleCloseActionMenu();
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCampaign({
                businessId,
                campaignId
            }).unwrap();

            enqueueSnackbar(translate('CampaignDeletedSuccessfully'), { variant: 'success' });

            analytics.trackEvent('campaign_deleted', {
                campaign_id: campaignId,
                campaign_name: campaign.name,
                business_id: businessId
            });

            // Navigate back to campaigns list
            navigate('/campaigns');
        } catch (error) {
            console.error('Error deleting campaign:', error);

            const errorMessage = error?.message || error?.data?.message || translate('ErrorDeletingCampaign');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            analytics.trackEvent('error', {
                action: 'delete_campaign',
                error: errorMessage,
                campaign_id: campaignId,
                business_id: businessId
            });
        }
    };

    // Handle edit
    const handleEdit = () => {
        setEditDialogOpen(true);
        handleCloseActionMenu();

        analytics.trackEvent('campaign_edit_initiated', {
            campaign_id: campaignId,
            business_id: businessId
        });
    };

    // Handle media actions
    const handleMediaActionMenu = (event, media) => {
        event.stopPropagation();
        setSelectedMedia(media);
        setMediaActionMenuAnchor(event.currentTarget);
    };

    const handleCloseMediaActionMenu = () => {
        setMediaActionMenuAnchor(null);
    };

    const handleDeleteMedia = async () => {
        if (!selectedMedia) return;

        try {
            await deleteCampaignMedia({
                businessId,
                campaignId,
                mediaId: selectedMedia.id
            }).unwrap();

            handleCloseMediaActionMenu();
            refetchCampaign();

            enqueueSnackbar(translate('MediaRemovedSuccessfully'), { variant: 'success' });

            analytics.trackEvent('campaign_media_deleted', {
                campaign_id: campaignId,
                media_id: selectedMedia.id,
                business_id: businessId
            });
        } catch (error) {
            console.error('Error deleting media:', error);

            const errorMessage = error?.message || error?.data?.message || translate('ErrorDeletingMedia');
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return DateTime.fromISO(dateString).toLocaleString(DateTime.DATE_FULL);
    };

    // Format date range
    const formatDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return translate('NotScheduled');

        const start = DateTime.fromISO(startDate);
        const end = DateTime.fromISO(endDate);

        return `${start.toLocaleString(DateTime.DATE_MED)} - ${end.toLocaleString(DateTime.DATE_MED)}`;
    };

    // Get media icon
    const getMediaIcon = (mediaType) => {
        const iconMap = {
            'image': <ImageIcon />,
            'video': <VideoIcon />,
            'document': <DocumentIcon />,
            'ar_image': <ArIcon />,
            'default': <DocumentIcon />
        };

        const typeName = mediaType?.toLowerCase() || '';

        for (const [key, icon] of Object.entries(iconMap)) {
            if (typeName.includes(key)) {
                return icon;
            }
        }

        return iconMap.default;
    };

    // Loading state
    if (isLoadingCampaign) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width="100%" height={30} />
                </Box>
                <Paper sx={{ p: 3 }}>
                    <Skeleton variant="rectangular" height={400} />
                </Paper>
            </Container>
        );
    }

    // Error state
    if (campaignError || !campaign) {
        const errorMessage = campaignError?.message || campaignError?.data?.message || translate('CampaignNotFound');

        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={() => navigate('/campaigns')}>
                            {translate('BackToCampaigns')}
                        </Button>
                    }
                >
                    {errorMessage}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 3 }}
            >
                <Link
                    component={RouterLink}
                    to="/dashboard"
                    underline="hover"
                    color="inherit"
                >
                    {translate('Dashboard')}
                </Link>
                <Link
                    component={RouterLink}
                    to="/campaigns"
                    underline="hover"
                    color="inherit"
                >
                    {translate('Campaigns')}
                </Link>
                <Typography color="text.primary">{campaign.name}</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/campaigns')} sx={{ mr: 1 }}>
                        <BackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {campaign.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <CampaignStatusChip status={campaign.status} />
                            {campaign.externalId && (
                                <Chip label={`ID: ${campaign.externalId}`} size="small" variant="outlined" />
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                    >
                        {translate('Edit')}
                    </Button>
                    <IconButton onClick={handleOpenActionMenu}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3, ...getGlassMorphismStyle() }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label={translate('Overview')} icon={<CampaignIcon />} iconPosition="start" />
                    <Tab label={translate('Media')} icon={<ImageIcon />} iconPosition="start" />
                    <Tab label={translate('Analytics')} icon={<AnalyticsIcon />} iconPosition="start" />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {activeTab === 0 && (
                <Grid container spacing={3}>
                    {/* Campaign Info */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, ...getGlassMorphismStyle() }}>
                            <Typography variant="h6" gutterBottom>
                                {translate('CampaignInformation')}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {campaign.description && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        {translate('Description')}
                                    </Typography>
                                    <Typography variant="body1">
                                        {campaign.description}
                                    </Typography>
                                </Box>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <BudgetIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {translate('Budget')}
                                            </Typography>
                                            <Typography variant="body1">
                                                ${campaign.budget || 0}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <AudienceIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {translate('TargetAudience')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {campaign.targetAudience || translate('NotSpecified')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <CalendarIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {translate('CreatedOn')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(campaign.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <ScheduleIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {translate('Schedule')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDateRange(campaign.startDate, campaign.endDate)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Quick Stats */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, ...getGlassMorphismStyle() }}>
                            <Typography variant="h6" gutterBottom>
                                {translate('QuickStats')}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={campaign.media?.length || 0}
                                        secondary={translate('TotalMedia')}
                                    />
                                </ListItem>

                                {vuforiaStats && (
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                <ArIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={vuforiaStats.totalTargets || 0}
                                            secondary={translate('ARTargets')}
                                        />
                                    </ListItem>
                                )}

                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: campaign.status === 'active' ? 'success.main' : 'warning.main' }}>
                                            {campaign.status === 'active' ? <StartIcon /> : <StopIcon />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={translate(campaign.status)}
                                        secondary={translate('Status')}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Paper sx={{ p: 3, ...getGlassMorphismStyle() }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">
                            {translate('CampaignMedia')} ({campaign.media?.length || 0})
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<ImageIcon />}
                            onClick={() => {
                                // Open media attachment dialog
                                analytics.trackEvent('add_media_clicked', {
                                    campaign_id: campaignId,
                                    business_id: businessId
                                });
                            }}
                        >
                            {translate('AddMedia')}
                        </Button>
                    </Box>

                    {campaign.media && campaign.media.length > 0 ? (
                        <Grid container spacing={2}>
                            {campaign.media.map((media) => (
                                <Grid item xs={12} sm={6} md={4} key={media.id}>
                                    <Card>
                                        {media.thumbnailUrl || media.url ? (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={media.thumbnailUrl || media.url}
                                                alt={media.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 200,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: 'grey.200'
                                                }}
                                            >
                                                {getMediaIcon(media.type)}
                                            </Box>
                                        )}
                                        <CardContent>
                                            <Typography variant="subtitle2" noWrap>
                                                {media.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                                                <Chip
                                                    label={media.type}
                                                    size="small"
                                                    icon={getMediaIcon(media.type)}
                                                />
                                                {media.source === 'vuforia' && (
                                                    <Chip
                                                        label="AR"
                                                        size="small"
                                                        color="secondary"
                                                        icon={<ArIcon />}
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMediaActionMenu(e, media)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <ImageIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {translate('NoMediaAttached')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {translate('AddMediaToGetStarted')}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            )}

            {activeTab === 2 && (
                <Paper sx={{ p: 3, ...getGlassMorphismStyle() }}>
                    <Typography variant="h6" gutterBottom>
                        {translate('CampaignAnalytics')}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <AnalyticsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {translate('AnalyticsComingSoon')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {translate('DetailedAnalyticsWillBeAvailableSoon')}
                        </Typography>
                    </Box>
                </Paper>
            )}

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
            >
                {campaign.status !== 'active' && (
                    <MenuItem onClick={() => handleStatusChange('active')}>
                        <ListItemIcon><StartIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{translate('Activate')}</ListItemText>
                    </MenuItem>
                )}
                {campaign.status !== 'paused' && (
                    <MenuItem onClick={() => handleStatusChange('paused')}>
                        <ListItemIcon><StopIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{translate('Pause')}</ListItemText>
                    </MenuItem>
                )}
                {campaign.status !== 'completed' && (
                    <MenuItem onClick={() => handleStatusChange('completed')}>
                        <ListItemIcon><CheckIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{translate('MarkComplete')}</ListItemText>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>{translate('Delete')}</ListItemText>
                </MenuItem>
            </Menu>

            {/* Media Action Menu */}
            <Menu
                anchorEl={mediaActionMenuAnchor}
                open={Boolean(mediaActionMenuAnchor)}
                onClose={handleCloseMediaActionMenu}
            >
                <MenuItem onClick={() => {
                    // Handle download
                    handleCloseMediaActionMenu();
                }}>
                    <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{translate('Download')}</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteMedia}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>{translate('Remove')}</ListItemText>
                </MenuItem>
            </Menu>

            {/* Edit Dialog */}
            <CampaignWizard
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSave={() => {
                    setEditDialogOpen(false);
                    refetchCampaign();
                }}
                campaign={campaign}
                businessId={businessId}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title={translate('ConfirmDelete')}
                content={translate('AreYouSureDeleteCampaign', { name: campaign.name })}
                confirmText={translate('Delete')}
                cancelText={translate('Cancel')}
                confirmColor="error"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
                loading={isDeleting}
            />

            {/* Status Change Confirmation Dialog */}
            <ConfirmDialog
                open={statusDialogOpen}
                title={translate('ConfirmStatusChange')}
                content={translate('AreYouSureChangeCampaignStatus', {
                    name: campaign.name,
                    status: translate(newStatus)
                })}
                confirmText={translate('ChangeStatus')}
                cancelText={translate('Cancel')}
                onConfirm={handleConfirmStatusChange}
                onCancel={() => setStatusDialogOpen(false)}
                loading={isUpdatingStatus}
            />
        </Container>
    );
};

export default React.memo(CampaignDetails);