import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    CircularProgress,
    Alert,
    Pagination,
    InputAdornment,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Skeleton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Edit as EditIcon,
    Fullscreen as FullscreenIcon,
    Image as ImageIcon,
    VideoLibrary as VideoIcon,
    Description as DocumentIcon,
    AudioFile as AudioIcon,
    ViewInAr as ArIcon,
    CloudUpload as UploadIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

// Import application hooks and utilities
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useAuth } from '../../hooks/useAuth';

// Import API hooks
import {
    useGetBusinessMediaQuery,
    useGetMediaTypesQuery,
    useDeleteMediaMutation,
    useDownloadMediaQuery,
    mediaUtils
} from '../../api/mediaApi';

/**
 * MediaGallery Component
 * Displays and manages business media assets with filtering, pagination, and actions
 */
const MediaGallery = ({
                          businessId,
                          selectable = false,
                          onSelect,
                          selectedMedia,
                          allowMultiple = false,
                          showActions = true,
                          columns = { xs: 12, sm: 6, md: 4, lg: 3 }
                      }) => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { getGlassMorphismStyle, getGlowEffect, isDark } = useSpatialTheme();
    const { user, activeBusiness } = useAuth();

    // State management
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [mediaTypeFilter, setMediaTypeFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState(new Set(selectedMedia || []));
    const [previewDialog, setPreviewDialog] = useState({ open: false, media: null });
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, media: null });

    // API queries - Updated to handle ServiceResponse
    const {
        data: mediaResponse,
        isLoading: isLoadingMedia,
        isFetching: isFetchingMedia,
        refetch: refetchMedia
    } = useGetBusinessMediaQuery({
        businessId,
        mediaTypeId: mediaTypeFilter,
        page,
        pageSize
    }, {
        skip: !businessId
    });

    const {
        data: mediaTypesData,
        isLoading: isLoadingTypes
    } = useGetMediaTypesQuery();

    // Extract data from ServiceResponse format
    const mediaItems = useMemo(() => {
        return mediaResponse?.items || [];
    }, [mediaResponse]);

    const totalCount = useMemo(() => {
        return mediaResponse?.totalCount || 0;
    }, [mediaResponse]);

    const totalPages = useMemo(() => {
        return mediaResponse?.totalPages || Math.ceil(totalCount / pageSize) || 1;
    }, [mediaResponse, totalCount, pageSize]);

    const mediaTypes = useMemo(() => {
        // Handle array or wrapped response
        if (Array.isArray(mediaTypesData)) {
            return mediaTypesData;
        }
        return mediaTypesData?.types || [];
    }, [mediaTypesData]);

    // Mutations
    const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();

    // Filter media based on search term
    const filteredMedia = useMemo(() => {
        if (!searchTerm) return mediaItems;

        const searchLower = searchTerm.toLowerCase();
        return mediaItems.filter(media =>
            media.name?.toLowerCase().includes(searchLower) ||
            media.description?.toLowerCase().includes(searchLower) ||
            media.title?.toLowerCase().includes(searchLower)
        );
    }, [mediaItems, searchTerm]);

    // Handle selection
    const handleMediaSelect = (media) => {
        if (!selectable) return;

        const newSelected = new Set(selectedItems);

        if (allowMultiple) {
            if (newSelected.has(media.id)) {
                newSelected.delete(media.id);
            } else {
                newSelected.add(media.id);
            }
        } else {
            // Single selection
            newSelected.clear();
            newSelected.add(media.id);
        }

        setSelectedItems(newSelected);

        if (onSelect) {
            onSelect(Array.from(newSelected));
        }

        analytics.trackEvent('media_selected', {
            media_id: media.id,
            business_id: businessId,
            selection_mode: allowMultiple ? 'multiple' : 'single'
        });
    };

    // Handle page change
    const handlePageChange = (event, newPage) => {
        setPage(newPage);

        analytics.trackEvent('media_gallery_pagination', {
            page: newPage,
            page_size: pageSize,
            business_id: businessId
        });
    };

    // Handle search
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset to first page on search
    };

    // Handle media type filter
    const handleMediaTypeChange = (event) => {
        setMediaTypeFilter(event.target.value);
        setPage(1); // Reset to first page on filter change

        analytics.trackEvent('media_gallery_filter', {
            filter_type: 'media_type',
            filter_value: event.target.value,
            business_id: businessId
        });
    };

    // Handle delete
    const handleDeleteMedia = async () => {
        if (!deleteConfirmDialog.media) return;

        try {
            await deleteMedia({
                businessId,
                mediaId: deleteConfirmDialog.media.id
            }).unwrap();

            setDeleteConfirmDialog({ open: false, media: null });
            refetchMedia();

            enqueueSnackbar(translate('MediaDeletedSuccessfully'), { variant: 'success' });

            analytics.trackEvent('media_deleted', {
                media_id: deleteConfirmDialog.media.id,
                business_id: businessId
            });
        } catch (error) {
            console.error('Error deleting media:', error);

            const errorMessage = error?.message || error?.data?.message || translate('ErrorDeletingMedia');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            analytics.trackEvent('error', {
                action: 'delete_media',
                error: errorMessage,
                business_id: businessId
            });
        }
    };

    // Handle download
    const handleDownloadMedia = async (media) => {
        try {
            // This would trigger the download query
            // Implementation depends on how you want to handle downloads
            analytics.trackEvent('media_download', {
                media_id: media.id,
                business_id: businessId
            });

            // Create a temporary link to download
            const response = await fetch(`/api/business/${businessId}/media/${media.id}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = media.name || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            enqueueSnackbar(translate('DownloadStarted'), { variant: 'info' });
        } catch (error) {
            console.error('Error downloading media:', error);
            enqueueSnackbar(translate('ErrorDownloadingMedia'), { variant: 'error' });
        }
    };

    // Get media type icon
    const getMediaIcon = (mediaType) => {
        const iconMap = {
            'image': <ImageIcon />,
            'video': <VideoIcon />,
            'document': <DocumentIcon />,
            'audio': <AudioIcon />,
            'ar_image': <ArIcon />,
            'default': <DocumentIcon />
        };

        const typeName = mediaType?.name?.toLowerCase() || '';

        for (const [key, icon] of Object.entries(iconMap)) {
            if (typeName.includes(key)) {
                return icon;
            }
        }

        return iconMap.default;
    };

    // Render loading skeleton
    const renderLoadingSkeleton = () => (
        <Grid container spacing={2}>
            {[...Array(pageSize)].map((_, index) => (
                <Grid item key={index} {...columns}>
                    <Card>
                        <Skeleton variant="rectangular" height={140} />
                        <CardContent>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="60%" />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    // Check if no business
    if (!businessId) {
        return (
            <Alert severity="info">
                {translate('NoBusinessSelected')}
            </Alert>
        );
    }

    return (
        <Box>
            {/* Header with filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder={translate('SearchMedia')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                    sx={{ flex: 1, minWidth: 200 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>{translate('MediaType')}</InputLabel>
                    <Select
                        value={mediaTypeFilter}
                        onChange={handleMediaTypeChange}
                        label={translate('MediaType')}
                        startAdornment={
                            <InputAdornment position="start">
                                <FilterIcon />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="">
                            <em>{translate('All')}</em>
                        </MenuItem>
                        {mediaTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Tooltip title={translate('RefreshMedia')}>
                    <IconButton
                        onClick={() => refetchMedia()}
                        disabled={isFetchingMedia}
                    >
                        {isFetchingMedia ? <CircularProgress size={20} /> : <RefreshIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Media Grid */}
            {isLoadingMedia ? (
                renderLoadingSkeleton()
            ) : filteredMedia.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {translate('NoMediaFound')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchTerm || mediaTypeFilter
                            ? translate('TryAdjustingFilters')
                            : translate('UploadMediaToGetStarted')
                        }
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => {
                            // Navigate to upload or open upload dialog
                            analytics.trackEvent('media_upload_clicked', {
                                source: 'empty_gallery',
                                business_id: businessId
                            });
                        }}
                    >
                        {translate('UploadMedia')}
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredMedia.map((media) => (
                        <Grid item key={media.id} {...columns}>
                            <Card
                                sx={{
                                    cursor: selectable ? 'pointer' : 'default',
                                    border: selectedItems.has(media.id) ? 2 : 0,
                                    borderColor: 'primary.main',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[4]
                                    }
                                }}
                                onClick={() => selectable && handleMediaSelect(media)}
                            >
                                {media.thumbnailUrl || media.url ? (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={media.thumbnailUrl || media.url}
                                        alt={media.name}
                                        sx={{
                                            objectFit: 'cover',
                                            bgcolor: 'grey.100'
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            height: 140,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'grey.100'
                                        }}
                                    >
                                        {getMediaIcon(media.mediaType)}
                                    </Box>
                                )}

                                <CardContent sx={{ pb: 1 }}>
                                    <Typography variant="subtitle2" noWrap gutterBottom>
                                        {media.name || media.title}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                        {media.mediaType && (
                                            <Chip
                                                label={media.mediaType.name}
                                                size="small"
                                                icon={getMediaIcon(media.mediaType)}
                                            />
                                        )}
                                        {media.fileSize && (
                                            <Typography variant="caption" color="text.secondary">
                                                {mediaUtils.formatFileSize(media.fileSize)}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>

                                {showActions && (
                                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                                        <Tooltip title={translate('Preview')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewDialog({ open: true, media });
                                                }}
                                            >
                                                <FullscreenIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={translate('Download')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownloadMedia(media);
                                                }}
                                            >
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={translate('Delete')}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirmDialog({ open: true, media });
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton={!isMobile}
                        showLastButton={!isMobile}
                    />
                </Box>
            )}

            {/* Preview Dialog */}
            <Dialog
                open={previewDialog.open}
                onClose={() => setPreviewDialog({ open: false, media: null })}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    {previewDialog.media?.name || translate('MediaPreview')}
                </DialogTitle>
                <DialogContent>
                    {previewDialog.media && (
                        <Box sx={{ textAlign: 'center' }}>
                            {previewDialog.media.mediaType?.name?.toLowerCase().includes('image') ? (
                                <img
                                    src={previewDialog.media.url}
                                    alt={previewDialog.media.name}
                                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                                />
                            ) : previewDialog.media.mediaType?.name?.toLowerCase().includes('video') ? (
                                <video
                                    src={previewDialog.media.url}
                                    controls
                                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                                />
                            ) : (
                                <Box sx={{ py: 8 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        {translate('PreviewNotAvailable')}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        onClick={() => handleDownloadMedia(previewDialog.media)}
                                        sx={{ mt: 2 }}
                                    >
                                        {translate('DownloadToView')}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewDialog({ open: false, media: null })}>
                        {translate('Close')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={() => setDeleteConfirmDialog({ open: false, media: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {translate('ConfirmDelete')}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {translate('AreYouSureDeleteMedia', {
                            name: deleteConfirmDialog.media?.name || ''
                        })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmDialog({ open: false, media: null })}>
                        {translate('Cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteMedia}
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
                    >
                        {translate('Delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

MediaGallery.propTypes = {
    businessId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    selectedMedia: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    allowMultiple: PropTypes.bool,
    showActions: PropTypes.bool,
    columns: PropTypes.shape({
        xs: PropTypes.number,
        sm: PropTypes.number,
        md: PropTypes.number,
        lg: PropTypes.number
    })
};

export default React.memo(MediaGallery);