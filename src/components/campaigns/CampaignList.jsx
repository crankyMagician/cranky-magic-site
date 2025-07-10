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
    Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon,
    FileCopy as CloneIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    BarChart as StatsIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon'; // Updated: using luxon instead of date-fns
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useDeleteCampaignMutation, useUpdateCampaignStatusMutation } from '../../api/campaignApi';
import ConfirmDialog from '../common/ConfirmDialog';
import CampaignStatusChip from './CampaignStatusChip';

/**
 * CampaignList component
 * Displays campaigns in a table or grid format depending on screen size
 */
const CampaignList = ({ campaigns, onEditCampaign, onRefresh, businessId }) => {
    const { translate } = useCustomTranslation();
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

    // RTK Query mutations
    const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();
    const [updateCampaignStatus, { isLoading: isUpdatingStatus }] = useUpdateCampaignStatusMutation();

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);

        analytics.trackEvent('campaign_list_page_change', {
            page: newPage,
            business_id: businessId
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

        analytics.trackEvent('campaign_list_rows_per_page_change', {
            rows_per_page: parseInt(event.target.value, 10),
            business_id: businessId
        });
    };

    // Action menu handlers
    const handleOpenActionMenu = (event, campaign) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedCampaign(campaign);

        analytics.trackEvent('campaign_action_menu_open', {
            campaign_id: campaign.id,
            business_id: businessId
        });
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
    };

    // Edit campaign handler
    const handleEdit = useCallback(() => {
        handleCloseActionMenu();
        if (selectedCampaign) {
            onEditCampaign(selectedCampaign);
        }
    }, [onEditCampaign, selectedCampaign]);

    // Delete campaign handlers
    const handleDeleteClick = useCallback(() => {
        handleCloseActionMenu();
        setConfirmAction('delete');
        setConfirmDialogOpen(true);

        analytics.trackEvent('campaign_delete_confirm_open', {
            campaign_id: selectedCampaign?.id,
            business_id: businessId
        });
    }, [analytics, businessId, selectedCampaign]);

    const handleDeleteConfirm = useCallback(async () => {
        if (selectedCampaign) {
            try {
                await deleteCampaign(selectedCampaign.id).unwrap();
                setConfirmDialogOpen(false);
                onRefresh();

                analytics.trackEvent('campaign_deleted', {
                    campaign_id: selectedCampaign.id,
                    campaign_name: selectedCampaign.name,
                    business_id: businessId
                });
            } catch (error) {
                console.error('Failed to delete campaign:', error);

                analytics.trackEvent('campaign_delete_error', {
                    campaign_id: selectedCampaign.id,
                    error: error.message,
                    business_id: businessId
                });
            }
        }
    }, [deleteCampaign, selectedCampaign, onRefresh, analytics, businessId]);

    // Status update handlers
    const handleStatusChange = useCallback((newStatus) => {
        handleCloseActionMenu();
        setConfirmAction(newStatus);
        setConfirmDialogOpen(true);

        analytics.trackEvent('campaign_status_change_confirm_open', {
            campaign_id: selectedCampaign?.id,
            current_status: selectedCampaign?.status,
            new_status: newStatus,
            business_id: businessId
        });
    }, [analytics, businessId, selectedCampaign]);

    const handleStatusConfirm = useCallback(async () => {
        if (selectedCampaign && confirmAction && confirmAction !== 'delete') {
            try {
                await updateCampaignStatus({
                    campaignId: selectedCampaign.id,
                    status: confirmAction
                }).unwrap();

                setConfirmDialogOpen(false);
                onRefresh();

                analytics.trackEvent('campaign_status_updated', {
                    campaign_id: selectedCampaign.id,
                    campaign_name: selectedCampaign.name,
                    previous_status: selectedCampaign.status,
                    new_status: confirmAction,
                    business_id: businessId
                });
            } catch (error) {
                console.error('Failed to update campaign status:', error);

                analytics.trackEvent('campaign_status_update_error', {
                    campaign_id: selectedCampaign.id,
                    error: error.message,
                    business_id: businessId
                });
            }
        }
    }, [updateCampaignStatus, selectedCampaign, confirmAction, onRefresh, analytics, businessId]);

    // Clone campaign handler
    const handleClone = useCallback(() => {
        handleCloseActionMenu();
        // Clone functionality would be implemented here
        // For now, we'll just track the event

        analytics.trackEvent('campaign_clone_clicked', {
            campaign_id: selectedCampaign?.id,
            business_id: businessId
        });
    }, [analytics, businessId, selectedCampaign]);

    // View campaign stats handler
    const handleViewStats = useCallback(() => {
        handleCloseActionMenu();
        // Stats view functionality would be implemented here
        // For now, we'll just track the event

        analytics.trackEvent('campaign_stats_clicked', {
            campaign_id: selectedCampaign?.id,
            business_id: businessId
        });
    }, [analytics, businessId, selectedCampaign]);

    // Dialog close handler
    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    // Get confirmation dialog content based on action
    const getConfirmDialogContent = useMemo(() => {
        if (!confirmAction || !selectedCampaign) return {};

        switch (confirmAction) {
            case 'delete':
                return {
                    title: translate('DeleteCampaignTitle'),
                    content: translate('DeleteCampaignConfirmation', { name: selectedCampaign.name }),
                    confirmText: translate('Delete'),
                    cancelText: translate('Cancel'),
                    confirmColor: 'error'
                };
            case 'active':
                return {
                    title: translate('ActivateCampaignTitle'),
                    content: translate('ActivateCampaignConfirmation', { name: selectedCampaign.name }),
                    confirmText: translate('Activate'),
                    cancelText: translate('Cancel'),
                    confirmColor: 'success'
                };
            case 'draft':
                return {
                    title: translate('DraftCampaignTitle'),
                    content: translate('DraftCampaignConfirmation', { name: selectedCampaign.name }),
                    confirmText: translate('MoveToDraft'),
                    cancelText: translate('Cancel'),
                    confirmColor: 'primary'
                };
            case 'completed':
                return {
                    title: translate('CompleteCampaignTitle'),
                    content: translate('CompleteCampaignConfirmation', { name: selectedCampaign.name }),
                    confirmText: translate('MarkAsComplete'),
                    cancelText: translate('Cancel'),
                    confirmColor: 'info'
                };
            default:
                return {
                    title: translate('ConfirmAction'),
                    content: translate('AreYouSure'),
                    confirmText: translate('Confirm'),
                    cancelText: translate('Cancel')
                };
        }
    }, [confirmAction, selectedCampaign, translate]);

    // Handle confirm dialog action
    const handleConfirmAction = useCallback(() => {
        if (confirmAction === 'delete') {
            handleDeleteConfirm();
        } else {
            handleStatusConfirm();
        }
    }, [confirmAction, handleDeleteConfirm, handleStatusConfirm]);

    // Calculate pagination
    const paginatedCampaigns = useMemo(() => {
        return campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [campaigns, page, rowsPerPage]);

    // Format date helper updated to use luxon
    const formatDate = (dateString) => {
        try {
            // Attempt to parse the date string as ISO
            const dt = DateTime.fromISO(dateString);
            if (!dt.isValid) {
                return 'Invalid date';
            }
            return dt.toFormat('MMM d, yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Render grid view for mobile
    if (isMobile) {
        return (
            <Box>
                <Grid container spacing={2}>
                    {paginatedCampaigns.map((campaign) => (
                        <Grid item xs={12} key={campaign.id}>
                            <Card
                                sx={{
                                    p: 2,
                                    ...getGlassMorphismStyle(0.8),
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6" component="h3" noWrap sx={{ maxWidth: '70%' }}>
                                        {campaign.name}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleOpenActionMenu(e, campaign)}
                                        aria-label={translate('CampaignActions')}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <CampaignStatusChip status={campaign.status} />
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(campaign.createdAt)}
                                    </Typography>
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

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {translate('Budget')}: ${campaign.budget || 0}
                                    </Typography>

                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => {
                                            setSelectedCampaign(campaign);
                                            handleEdit();
                                        }}
                                        aria-label={translate('EditCampaign')}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={campaigns.length}
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

                    <MenuItem onClick={handleViewStats}>
                        <ListItemIcon><StatsIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{translate('ViewStats')}</ListItemText>
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
                        {paginatedCampaigns.map((campaign) => (
                            <TableRow key={campaign.id} hover>
                                <TableCell>
                                    <Typography variant="body1" fontWeight={500}>
                                        {campaign.name}
                                    </Typography>
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
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Tooltip title={translate('Edit')}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => {
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
                                                color="info"
                                                onClick={() => {
                                                    setSelectedCampaign(campaign);
                                                    handleViewStats();
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
                count={campaigns.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={translate('RowsPerPage')}
            />

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
            >
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
    campaigns: PropTypes.array.isRequired,
    onEditCampaign: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    businessId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

export default React.memo(CampaignList);
