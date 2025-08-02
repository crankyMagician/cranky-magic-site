import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    useTheme,
    useMediaQuery,
    Grid,
    Paper,
    Avatar,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon,
    FileCopy as CloneIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    BarChart as StatsIcon,
    Campaign as CampaignIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import {
    useGetCampaignsByBusinessQuery,
    useDeleteCampaignMutation,
    useUpdateCampaignStatusMutation
} from '../../api/campaignApi';
import ConfirmDialog from '../common/ConfirmDialog';
import CampaignStatusChip from './CampaignStatusChip';

/**
 * CampaignList component
 * Displays campaigns in a table or grid format depending on screen size
 * Updated to handle ServiceResponse format and pagination
 */
const CampaignList = ({
                          businessId,
                          onEditCampaign,
                          statusFilter = 'all',
                          searchTerm = ''
                      }) => {
    const { translate } = useCustomTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const analytics = useAnalytics();
    const theme = useTheme();
    const { isDark, getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    // RTK Query - Updated to handle pagination
    const {
        data: campaignsResponse,
        isLoading,
        isFetching,
        refetch
    } = useGetCampaignsByBusinessQuery({
        businessId,
        page: page + 1, // API uses 1-based indexing
        pageSize: rowsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
    }, {
        skip: !businessId
    });

    // RTK Query mutations
    const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();
    const [updateCampaignStatus, { isLoading: isUpdatingStatus }] = useUpdateCampaignStatusMutation();

    // Extract campaigns and pagination data from ServiceResponse
    const campaigns = useMemo(() => {
        return campaignsResponse?.items || [];
    }, [campaignsResponse]);

    const totalCount = useMemo(() => {
        return campaignsResponse?.totalCount || 0;
    }, [campaignsResponse]);

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);

        analytics.trackEvent('campaign_list_page_change', {
            page: newPage,
            page_size: rowsPerPage,
            business_id: businessId
        });
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);

        analytics.trackEvent('campaign_list_rows_change', {
            rows_per_page: newRowsPerPage,
            business_id: businessId
        });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return DateTime.fromISO(dateString).toLocaleString(DateTime.DATE_SHORT);
    };

    // Handle action menu
    const handleOpenActionMenu = (event, campaign) => {
        event.stopPropagation();
        setActionMenuAnchor(event.currentTarget);
        setSelectedCampaign(campaign);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
    };

    // Handle actions
    const handleEdit = useCallback(() => {
        if (selectedCampaign && onEditCampaign) {
            onEditCampaign(selectedCampaign);
            handleCloseActionMenu();

            analytics.trackEvent('campaign_edit_initiated', {
                campaign_id: selectedCampaign.id,
                business_id: businessId
            });
        }
    }, [selectedCampaign, onEditCampaign, businessId, analytics]);

    const handleView = useCallback(() => {
        if (selectedCampaign) {
            // Navigate to campaign details page
            // window.location.href = `/campaigns/${selectedCampaign.id}`;
            handleCloseActionMenu();

            analytics.trackEvent('campaign_view_initiated', {
                campaign_id: selectedCampaign.id,
                business_id: businessId
            });
        }
    }, [selectedCampaign, businessId, analytics]);

    const handleStatusChange = useCallback((newStatus) => {
        setConfirmAction({ type: 'status_change', newStatus });
        setConfirmDialogOpen(true);
        handleCloseActionMenu();
    }, []);

    const handleDeleteClick = useCallback(() => {
        setConfirmAction({ type: 'delete' });
        setConfirmDialogOpen(true);
        handleCloseActionMenu();
    }, []);

    const handleClone = useCallback(() => {
        // Implement clone functionality
        handleCloseActionMenu();

        analytics.trackEvent('campaign_clone_initiated', {
            campaign_id: selectedCampaign?.id,
            business_id: businessId
        });
    }, [selectedCampaign, businessId, analytics]);

    // Handle confirm dialog
    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
        setConfirmAction(null);
    };

    const handleConfirmAction = async () => {
        if (!selectedCampaign || !confirmAction) return;

        try {
            if (confirmAction.type === 'delete') {
                await deleteCampaign({
                    businessId,
                    campaignId: selectedCampaign.id
                }).unwrap();

                enqueueSnackbar(translate('CampaignDeletedSuccessfully'), { variant: 'success' });

                analytics.trackEvent('campaign_deleted', {
                    campaign_id: selectedCampaign.id,
                    business_id: businessId
                });

                refetch();
            } else if (confirmAction.type === 'status_change') {
                await updateCampaignStatus({
                    businessId,
                    campaignId: selectedCampaign.id,
                    status: confirmAction.newStatus
                }).unwrap();

                enqueueSnackbar(translate('CampaignStatusUpdatedSuccessfully'), { variant: 'success' });

                analytics.trackEvent('campaign_status_updated', {
                    campaign_id: selectedCampaign.id,
                    old_status: selectedCampaign.status,
                    new_status: confirmAction.newStatus,
                    business_id: businessId
                });

                refetch();
            }

            handleConfirmDialogClose();
        } catch (error) {
            console.error('Error performing action:', error);

            // Updated error handling for ServiceResponse
            const errorMessage = error?.message || error?.data?.message || translate('ErrorPerformingAction');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            analytics.trackEvent('error', {
                action: confirmAction.type,
                error: errorMessage,
                campaign_id: selectedCampaign.id,
                business_id: businessId
            });
        }
    };

    // Get confirmation dialog content
    const getConfirmDialogContent = useMemo(() => {
        if (!confirmAction || !selectedCampaign) {
            return {
                title: '',
                content: '',
                confirmText: translate('Confirm'),
                cancelText: translate('Cancel'),
                confirmColor: 'primary'
            };
        }

        if (confirmAction.type === 'delete') {
            return {
                title: translate('ConfirmDelete'),
                content: translate('AreYouSureDeleteCampaign', { name: selectedCampaign.name }),
                confirmText: translate('Delete'),
                cancelText: translate('Cancel'),
                confirmColor: 'error'
            };
        }

        if (confirmAction.type === 'status_change') {
            return {
                title: translate('ConfirmStatusChange'),
                content: translate('AreYouSureChangeCampaignStatus', {
                    name: selectedCampaign.name,
                    status: translate(confirmAction.newStatus)
                }),
                confirmText: translate('ChangeStatus'),
                cancelText: translate('Cancel'),
                confirmColor: 'primary'
            };
        }

        return {
            title: '',
            content: '',
            confirmText: translate('Confirm'),
            cancelText: translate('Cancel'),
            confirmColor: 'primary'
        };
    }, [confirmAction, selectedCampaign, translate]);

    // Loading state
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Empty state
    if (!campaigns.length) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <CampaignIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {translate('NoCampaignsFound')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {searchTerm || statusFilter !== 'all'
                        ? translate('TryAdjustingFilters')
                        : translate('CreateYourFirstCampaign')
                    }
                </Typography>
            </Box>
        );
    }

    // Render mobile view
    if (isMobile) {
        return (
            <Box>
                <Grid container spacing={2}>
                    {campaigns.map((campaign) => (
                        <Grid item xs={12} key={campaign.id}>
                            <Card
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[4]
                                    }
                                }}
                                onClick={() => handleView()}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                    <Typography variant="h6" component="h3">
                                        {campaign.name}
                                    </Typography>
                                    <CampaignStatusChip status={campaign.status} size="small" />
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {campaign.description || translate('NoCampaignDescription')}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {translate('Budget')}: ${campaign.budget || 0}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {translate('Created')}: {formatDate(campaign.createdAt)}
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleOpenActionMenu(e, campaign)}
                                        aria-label={translate('CampaignActions')}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage={translate('RowsPerPage')}
                />

                {/* Action Menu */}
                <Menu
                    anchorEl={actionMenuAnchor}
                    open={Boolean(actionMenuAnchor)}
                    onClose={handleCloseActionMenu}
                >
                    <MenuItem onClick={handleView}>
                        <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{translate('View')}</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{translate('Edit')}</ListItemText>
                    </MenuItem>

                    {selectedCampaign?.status !== 'active' && (
                        <MenuItem onClick={() => handleStatusChange('active')}>
                            <ListItemIcon><StartIcon fontSize="small" color="success" /></ListItemIcon>
                            <ListItemText>{translate('Activate')}</ListItemText>
                        </MenuItem>
                    )}

                    {selectedCampaign?.status !== 'draft' && (
                        <MenuItem onClick={() => handleStatusChange('draft')}>
                            <ListItemIcon><StopIcon fontSize="small" color="warning" /></ListItemIcon>
                            <ListItemText>{translate('MoveToDraft')}</ListItemText>
                        </MenuItem>
                    )}

                    {selectedCampaign?.status !== 'completed' && (
                        <MenuItem onClick={() => handleStatusChange('completed')}>
                            <ListItemIcon><StopIcon fontSize="small" color="info" /></ListItemIcon>
                            <ListItemText>{translate('MarkAsComplete')}</ListItemText>
                        </MenuItem>
                    )}

                    <MenuItem onClick={handleClone}>
                        <ListItemIcon><CloneIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{translate('Clone')}</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleDeleteClick}>
                        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>{translate('Delete')}</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Confirmation Dialog */}
                <ConfirmDialog
                    open={confirmDialogOpen}
                    title={getConfirmDialogContent.title}
                    content={getConfirmDialogContent.content}
                    confirmText={getConfirmDialogContent.confirmText}
                    cancelText={getConfirmDialogContent.cancelText}
                    confirmColor={getConfirmDialogContent.confirmColor}
                    onConfirm={handleConfirmAction}
                    onCancel={handleConfirmDialogClose}
                    loading={isDeleting || isUpdatingStatus}
                />
            </Box>
        );
    }

    // Render table view for desktop
    return (
        <Box>
            <TableContainer component={Paper} sx={getGlassMorphismStyle(0.9)}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{translate('Name')}</TableCell>
                            <TableCell>{translate('Status')}</TableCell>
                            <TableCell>{translate('Budget')}</TableCell>
                            <TableCell>{translate('CreatedDate')}</TableCell>
                            <TableCell>{translate('StartDate')}</TableCell>
                            <TableCell>{translate('EndDate')}</TableCell>
                            <TableCell align="right">{translate('Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map((campaign) => (
                            <TableRow
                                key={campaign.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleView()}
                            >
                                <TableCell>
                                    <Typography variant="body1" fontWeight={500}>
                                        {campaign.name}
                                    </Typography>
                                    {campaign.description && (
                                        <Typography variant="caption" color="text.secondary">
                                            {campaign.description}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <CampaignStatusChip status={campaign.status} />
                                </TableCell>
                                <TableCell>
                                    ${campaign.budget || 0}
                                </TableCell>
                                <TableCell>
                                    {formatDate(campaign.createdAt)}
                                </TableCell>
                                <TableCell>
                                    {campaign.startDate ? formatDate(campaign.startDate) : '-'}
                                </TableCell>
                                <TableCell>
                                    {campaign.endDate ? formatDate(campaign.endDate) : '-'}
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Tooltip title={translate('ViewCampaign')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCampaign(campaign);
                                                    handleView();
                                                }}
                                                aria-label={translate('ViewCampaign')}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={translate('EditCampaign')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCampaign(campaign);
                                                    handleEdit();
                                                }}
                                                aria-label={translate('EditCampaign')}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={translate('ViewStats')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Navigate to campaign stats
                                                    analytics.trackEvent('campaign_stats_view', {
                                                        campaign_id: campaign.id,
                                                        business_id: businessId
                                                    });
                                                }}
                                                aria-label={translate('ViewCampaignStats')}
                                            >
                                                <StatsIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={translate('More')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleOpenActionMenu(e, campaign)}
                                                aria-label={translate('CampaignActions')}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={translate('RowsPerPage')}
            />

            {/* Refresh indicator */}
            {isFetching && (
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CircularProgress size={20} />
                </Box>
            )}

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
            >
                <MenuItem onClick={handleView}>
                    <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{translate('View')}</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleEdit}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{translate('Edit')}</ListItemText>
                </MenuItem>

                {selectedCampaign?.status !== 'active' && (
                    <MenuItem onClick={() => handleStatusChange('active')}>
                        <ListItemIcon><StartIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText>{translate('Activate')}</ListItemText>
                    </MenuItem>
                )}

                {selectedCampaign?.status !== 'draft' && (
                    <MenuItem onClick={() => handleStatusChange('draft')}>
                        <ListItemIcon><StopIcon fontSize="small" color="warning" /></ListItemIcon>
                        <ListItemText>{translate('MoveToDraft')}</ListItemText>
                    </MenuItem>
                )}

                {selectedCampaign?.status !== 'completed' && (
                    <MenuItem onClick={() => handleStatusChange('completed')}>
                        <ListItemIcon><StopIcon fontSize="small" color="info" /></ListItemIcon>
                        <ListItemText>{translate('MarkAsComplete')}</ListItemText>
                    </MenuItem>
                )}

                <MenuItem onClick={handleClone}>
                    <ListItemIcon><CloneIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{translate('Clone')}</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>{translate('Delete')}</ListItemText>
                </MenuItem>
            </Menu>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                title={getConfirmDialogContent.title}
                content={getConfirmDialogContent.content}
                confirmText={getConfirmDialogContent.confirmText}
                cancelText={getConfirmDialogContent.cancelText}
                confirmColor={getConfirmDialogContent.confirmColor}
                onConfirm={handleConfirmAction}
                onCancel={handleConfirmDialogClose}
                loading={isDeleting || isUpdatingStatus}
            />
        </Box>
    );
};

CampaignList.propTypes = {
    businessId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    onEditCampaign: PropTypes.func.isRequired,
    statusFilter: PropTypes.string,
    searchTerm: PropTypes.string
};

export default React.memo(CampaignList);