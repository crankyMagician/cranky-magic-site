import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Image as ImageIcon,
    Movie as VideoIcon,
    InsertDriveFile as FileIcon,
    DragIndicator as DragIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useCustomTranslation from '../../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../../hooks/useSpatialTheme';
import useAnalytics from '../../../analytics/hooks/useAnalytics';
import { useGetBusinessMediaQuery, useGetMediaTypesQuery } from '../../../api/mediaApi';
import { useAttachCampaignMediaMutation, useDeleteCampaignMediaMutation } from '../../../api/campaignApi';

/**
 * CampaignMediaStep - Third step in the campaign wizard for media attachments
 */
const CampaignMediaStep = ({ formData, onChange, businessId, isEditMode }) => {
    const { translate } = useCustomTranslation();
    const { isDark, getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();
    const analytics = useAnalytics();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State for media selector modal
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [selectedMediaType, setSelectedMediaType] = useState('');
    const [selectedMediaAsset, setSelectedMediaAsset] = useState(null);
    const [mediaMetadata, setMediaMetadata] = useState('');
    const [mediaTypeFilter, setMediaTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    // RTK Query hooks
    const { data: mediaTypes, isLoading: isLoadingMediaTypes } = useGetMediaTypesQuery();
    const { data: businessMedia, isLoading: isLoadingMedia } = useGetBusinessMediaQuery(
        {
            businessId,
            mediaTypeId: mediaTypeFilter || undefined,
            page,
            pageSize: PAGE_SIZE
        },
        { skip: !businessId || !mediaModalOpen }
    );
    const [attachMedia, { isLoading: isAttaching }] = useAttachCampaignMediaMutation();
    const [deleteMedia, { isLoading: isDeleting }] = useDeleteCampaignMediaMutation();

    // Handle opening media selector modal
    const handleOpenMediaModal = () => {
        setMediaModalOpen(true);
        setSelectedMediaAsset(null);
        setSelectedMediaType('');
        setMediaMetadata('');

        analytics.trackEvent('campaign_media_modal_open', {
            business_id: businessId,
            is_edit: isEditMode
        });
    };

    // Handle closing media selector modal
    const handleCloseMediaModal = () => {
        setMediaModalOpen(false);
    };

    // Handle media type filter change
    const handleMediaTypeFilterChange = (event) => {
        setMediaTypeFilter(event.target.value);
        setPage(1);
    };

    // Handle media selection
    const handleSelectMedia = (mediaAsset) => {
        setSelectedMediaAsset(mediaAsset);

        analytics.trackEvent('campaign_media_selected', {
            media_id: mediaAsset.id,
            media_type: mediaAsset.mediaTypeName,
            business_id: businessId
        });
    };

    // Handle media type change
    const handleMediaTypeChange = (event) => {
        setSelectedMediaType(event.target.value);
    };

    // Handle metadata change
    const handleMetadataChange = (event) => {
        setMediaMetadata(event.target.value);
    };

    // Handle adding media to campaign
    const handleAddMedia = async () => {
        if (!selectedMediaAsset) return;

        const newMedia = {
            mediaAssetId: selectedMediaAsset.id,
            title: selectedMediaAsset.title,
            description: selectedMediaAsset.description,
            fileUrl: selectedMediaAsset.fileUrl,
            mimeType: selectedMediaAsset.mimeType,
            mediaTypeName: selectedMediaAsset.mediaTypeName,
            sortOrder: formData.media.length,
            campaignMediaType: selectedMediaType,
            metadata: mediaMetadata
        };

        // Update local state
        const updatedMedia = [...formData.media, newMedia];
        onChange('media', updatedMedia);

        // Close modal
        handleCloseMediaModal();

        analytics.trackEvent('campaign_media_added', {
            media_id: selectedMediaAsset.id,
            media_type: selectedMediaAsset.mediaTypeName,
            campaign_media_type: selectedMediaType,
            business_id: businessId,
            is_edit: isEditMode
        });
    };

    // Handle removing media from campaign
    const handleRemoveMedia = (index) => {
        const updatedMedia = [...formData.media];
        const removedMedia = updatedMedia.splice(index, 1)[0];

        // Update sort order for remaining media
        updatedMedia.forEach((media, idx) => {
            media.sortOrder = idx;
        });

        onChange('media', updatedMedia);

        analytics.trackEvent('campaign_media_removed', {
            media_id: removedMedia.mediaAssetId,
            media_type: removedMedia.mediaTypeName,
            business_id: businessId,
            is_edit: isEditMode
        });
    };

    // Handle drag and drop reordering
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(formData.media);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update sort order
        const updatedItems = items.map((item, index) => ({
            ...item,
            sortOrder: index
        }));

        onChange('media', updatedItems);

        analytics.trackEvent('campaign_media_reordered', {
            business_id: businessId,
            is_edit: isEditMode
        });
    };

    // Get media icon based on type
    const getMediaIcon = (mimeType) => {
        if (mimeType?.startsWith('image/')) {
            return <ImageIcon />;
        } else if (mimeType?.startsWith('video/')) {
            return <VideoIcon />;
        } else {
            return <FileIcon />;
        }
    };

    return (
        <Box>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                {translate('CampaignMedia')}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {translate('MediaStepDescription')}
            </Typography>

            {/* Media list */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    minHeight: 300
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {translate('AttachedMedia')} ({formData.media.length})
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleOpenMediaModal}
                        sx={{
                            borderRadius: 1,
                            ...getGlowEffect(theme => theme.palette.primary.main, 'low'),
                        }}
                    >
                        {translate('AddMedia')}
                    </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {formData.media.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 6
                        }}
                    >
                        <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography color="text.secondary">
                            {translate('NoMediaAttached')}
                        </Typography>
                        <Button
                            startIcon={<AddIcon />}
                            color="primary"
                            onClick={handleOpenMediaModal}
                            sx={{ mt: 2 }}
                        >
                            {translate('AttachMedia')}
                        </Button>
                    </Box>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="media-list">
                            {(provided) => (
                                <Box
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <Grid container spacing={2}>
                                        {formData.media.map((media, index) => (
                                            <Draggable key={`${media.mediaAssetId}-${index}`} draggableId={`media-${media.mediaAssetId}-${index}`} index={index}>
                                                {(provided) => (
                                                    <Grid item xs={12} sm={6} md={4} ref={provided.innerRef} {...provided.draggableProps}>
                                                        <Card
                                                            sx={{
                                                                ...getGlassMorphismStyle(0.9),
                                                                position: 'relative',
                                                                transition: 'transform 0.2s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'translateY(-4px)',
                                                                }
                                                            }}
                                                        >
                                                            <Box
                                                                {...provided.dragHandleProps}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 8,
                                                                    left: 8,
                                                                    zIndex: 1,
                                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                                    borderRadius: '50%',
                                                                    width: 32,
                                                                    height: 32,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                <DragIcon sx={{ color: 'white' }} />
                                                            </Box>
                                                            <Box sx={{ position: 'relative' }}>
                                                                {media.mimeType?.startsWith('image/') ? (
                                                                    <CardMedia
                                                                        component="img"
                                                                        height="140"
                                                                        image={media.fileUrl}
                                                                        alt={media.title}
                                                                    />
                                                                ) : (
                                                                    <Box
                                                                        sx={{
                                                                            height: 140,
                                                                            bgcolor: 'action.hover',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    >
                                                                        {getMediaIcon(media.mimeType)}
                                                                    </Box>
                                                                )}
                                                                <Chip
                                                                    label={media.campaignMediaType || media.mediaTypeName}
                                                                    size="small"
                                                                    color="primary"
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        bottom: 8,
                                                                        right: 8,
                                                                        bgcolor: 'rgba(0,0,0,0.7)'
                                                                    }}
                                                                />
                                                            </Box>
                                                            <CardContent sx={{ pb: 1 }}>
                                                                <Typography variant="subtitle1" noWrap title={media.title}>
                                                                    {media.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    height: 40
                                                                }}>
                                                                    {media.description || translate('NoDescription')}
                                                                </Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleRemoveMedia(index)}
                                                                    aria-label={translate('RemoveMedia')}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Grid>
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </Paper>

            {/* Media Tips */}
            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    p: 2,
                    bgcolor: theme => isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(240, 240, 245, 0.7)',
                    borderRadius: 1,
                    border: '1px dashed',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <ImageIcon color="info" sx={{ mt: 0.5 }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                            {translate('MediaTips')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {translate('CampaignMediaTips')}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Media Selector Modal */}
            <Dialog
                open={mediaModalOpen}
                onClose={handleCloseMediaModal}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        ...getGlassMorphismStyle(0.95)
                    }
                }}
            >
                <DialogTitle>
                    {translate('SelectMedia')}
                </DialogTitle>

                <DialogContent>
                    {/* Media type filter */}
                    <Box sx={{ mb: 3, mt: 1 }}>
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel id="media-type-filter-label">{translate('FilterByType')}</InputLabel>
                            <Select
                                labelId="media-type-filter-label"
                                label={translate('FilterByType')}
                                value={mediaTypeFilter}
                                onChange={handleMediaTypeFilterChange}
                            >
                                <MenuItem value="">{translate('AllTypes')}</MenuItem>
                                {mediaTypes?.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Media grid */}
                    {isLoadingMedia ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : businessMedia?.mediaAssets?.length > 0 ? (
                        <Grid container spacing={2}>
                            {businessMedia.mediaAssets.map((media) => (
                                <Grid item xs={12} sm={6} md={4} key={media.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: media.id === selectedMediaAsset?.id ? '2px solid' : '1px solid',
                                            borderColor: media.id === selectedMediaAsset?.id ? 'primary.main' : 'divider',
                                            transition: 'all 0.2s',
                                            transform: media.id === selectedMediaAsset?.id ? 'scale(1.02)' : 'scale(1)',
                                            '&:hover': {
                                                borderColor: 'primary.main'
                                            }
                                        }}
                                        onClick={() => handleSelectMedia(media)}
                                    >
                                        {media.mimeType?.startsWith('image/') ? (
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image={media.fileUrl}
                                                alt={media.title}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 120,
                                                    bgcolor: 'action.hover',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {getMediaIcon(media.mimeType)}
                                            </Box>
                                        )}
                                        <CardContent sx={{ py: 1 }}>
                                            <Typography variant="subtitle2" noWrap>
                                                {media.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                                {media.mediaTypeName}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                {translate('NoMediaFound')}
                            </Typography>
                            <Button
                                variant="text"
                                startIcon={<AddIcon />}
                                sx={{ mt: 2 }}
                                onClick={() => {
                                    handleCloseMediaModal();
                                    // Here you would typically redirect to media upload page
                                    // navigate('/media/upload');
                                }}
                            >
                                {translate('UploadNewMedia')}
                            </Button>
                        </Box>
                    )}

                    {/* Media details section once selected */}
                    {selectedMediaAsset && (
                        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h6" gutterBottom>
                                {translate('MediaDetails')}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="media-type-label">{translate('MediaUsageType')}</InputLabel>
                                        <Select
                                            labelId="media-type-label"
                                            label={translate('MediaUsageType')}
                                            value={selectedMediaType}
                                            onChange={handleMediaTypeChange}
                                        >
                                            <MenuItem value="banner">{translate('Banner')}</MenuItem>
                                            <MenuItem value="thumbnail">{translate('Thumbnail')}</MenuItem>
                                            <MenuItem value="gallery">{translate('Gallery')}</MenuItem>
                                            <MenuItem value="video">{translate('Video')}</MenuItem>
                                            <MenuItem value="document">{translate('Document')}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label={translate('Metadata')}
                                        placeholder={translate('MetadataPlaceholder')}
                                        fullWidth
                                        value={mediaMetadata}
                                        onChange={handleMetadataChange}
                                        helperText={translate('MetadataHelp')}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseMediaModal} color="inherit">
                        {translate('Cancel')}
                    </Button>
                    <Button
                        onClick={handleAddMedia}
                        variant="contained"
                        color="primary"
                        disabled={!selectedMediaAsset || !selectedMediaType || isAttaching}
                        startIcon={isAttaching ? <CircularProgress size={20} /> : null}
                    >
                        {translate('AttachToCapaign')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

CampaignMediaStep.propTypes = {
    formData: PropTypes.shape({
        media: PropTypes.array
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    businessId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEditMode: PropTypes.bool
};

export default React.memo(CampaignMediaStep);