import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Divider,
    Alert,
    LinearProgress,
    Tabs,
    Tab,
    FormControlLabel,
    Switch,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    CircularProgress,
    Fab,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    CloudUpload as UploadIcon,
    Image as ImageIcon,
    VideoLibrary as VideoIcon,
    Description as DocumentIcon,
    Star as StarIcon,
    Info as InfoIcon,
    ExpandMore as ExpandMoreIcon,
    ViewInAr as ArIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import useCustomTranslation from '../../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../../hooks/useSpatialTheme';
import useAnalytics from '../../../analytics/hooks/useAnalytics';
import {
    useGetBusinessMediaQuery,
    useGetMediaTypesQuery,
    useAttachCampaignMediaMutation
} from '../../../api/mediaApi';
import {
    useCreateTargetMutation,
    useCreateTargetsBatchMutation,
    vuforiaUtils
} from '../../../api/vuforiaApi';

/**
 * Campaign Media Step - Enhanced with Vuforia AR upload support
 * Allows users to attach existing media or upload new images to Vuforia for AR experiences
 * Updated to work with new Vuforia API that requires Base64 encoding
 */
const CampaignMediaStep = ({ formData, onChange, businessId, isEditMode = false }) => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const theme = useTheme();
    const { isDark, getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State management
    const [selectedTab, setSelectedTab] = useState(0); // 0: Existing Media, 1: Vuforia Upload
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [selectedMediaAsset, setSelectedMediaAsset] = useState(null);
    const [selectedMediaType, setSelectedMediaType] = useState('');
    const [mediaMetadata, setMediaMetadata] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [mediaTypeFilter, setMediaTypeFilter] = useState('');

    // Vuforia-specific state
    const [isVuforiaUploadOpen, setIsVuforiaUploadOpen] = useState(false);
    const [vuforiaFiles, setVuforiaFiles] = useState([]);
    const [videoMetadata, setVideoMetadata] = useState({
        videoUrl: '',
        autoPlay: true,
        loop: false,
        muted: false,
        videoPosition: 'overlay',
        videoScale: 1.0
    });
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadErrors, setUploadErrors] = useState({});

    // API hooks - Updated with new Vuforia mutations
    const { data: businessMediaResponse, isLoading: isLoadingMedia, refetch: refetchMedia } = useGetBusinessMediaQuery({
        businessId,
        mediaTypeId: mediaTypeFilter,
        page: 1,
        pageSize: 50
    });
    const { data: mediaTypesData } = useGetMediaTypesQuery();
    const [attachMedia, { isLoading: isAttaching }] = useAttachCampaignMediaMutation();

    // Updated Vuforia API hooks
    const [createTarget, { isLoading: isUploading }] = useCreateTargetMutation();
    const [createTargetsBatch, { isLoading: isBatchUploading }] = useCreateTargetsBatchMutation();

    // Extract data from ServiceResponse
    const businessMedia = useMemo(() => {
        return businessMediaResponse?.items || [];
    }, [businessMediaResponse]);

    const mediaTypes = useMemo(() => {
        if (Array.isArray(mediaTypesData)) {
            return mediaTypesData;
        }
        return mediaTypesData?.types || [];
    }, [mediaTypesData]);

    // Memoized filtered media
    const filteredMedia = useMemo(() => {
        if (!businessMedia?.length) return [];

        return businessMedia.filter(media =>
            media.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            media.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [businessMedia, searchTerm]);

    // File input handling for Vuforia uploads (without external dependencies)
    const handleFileSelection = useCallback((event) => {
        const files = Array.from(event.target.files || []);

        // Validate files using Vuforia utils
        const validFiles = [];
        const invalidFiles = [];

        files.forEach(file => {
            const validation = vuforiaUtils.validateMediaFile(file, {
                maxSize: 10 * 1024 * 1024, // 10MB
                allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            });

            if (validation.isValid) {
                validFiles.push({
                    file,
                    id: Math.random().toString(36).substr(2, 9),
                    status: 'pending',
                    progress: 0
                });
            } else {
                invalidFiles.push({ file, errors: validation.errors });
            }
        });

        if (invalidFiles.length > 0) {
            const errorMessages = invalidFiles.map(({ file, errors }) =>
                `${file.name}: ${errors.join(', ')}`
            ).join('\n');

            setUploadErrors(prev => ({
                ...prev,
                validation: errorMessages
            }));
        }

        setVuforiaFiles(prev => [...prev, ...validFiles]);

        analytics.trackEvent('vuforia_files_added', {
            valid_files: validFiles.length,
            invalid_files: invalidFiles.length,
            business_id: businessId
        });

        // Reset file input
        event.target.value = '';
    }, [analytics, businessId]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);

        analytics.trackEvent('campaign_media_tab_change', {
            tab: newValue === 0 ? 'existing_media' : 'vuforia_upload',
            business_id: businessId
        });
    };

    // Existing media modal handlers
    const handleOpenMediaModal = () => {
        setIsMediaModalOpen(true);
        refetchMedia();

        analytics.trackEvent('campaign_media_modal_open', {
            business_id: businessId
        });
    };

    const handleCloseMediaModal = () => {
        setIsMediaModalOpen(false);
        setSelectedMediaAsset(null);
        setSelectedMediaType('');
        setMediaMetadata('');
    };

    const handleMediaSelection = (media) => {
        setSelectedMediaAsset(media);
        setSelectedMediaType('');
        setMediaMetadata('');

        analytics.trackEvent('campaign_media_selected', {
            media_id: media.id,
            media_type: media.mediaType?.name,
            business_id: businessId
        });
    };

    // Add existing media to campaign
    const handleAddMedia = async () => {
        if (!selectedMediaAsset || !selectedMediaType) return;

        try {
            const mediaItem = {
                id: selectedMediaAsset.id,
                name: selectedMediaAsset.name,
                type: selectedMediaType,
                metadata: mediaMetadata,
                url: selectedMediaAsset.url,
                thumbnailUrl: selectedMediaAsset.thumbnailUrl,
                source: 'existing'
            };

            const updatedMedia = [...(formData.media || []), mediaItem];
            onChange({ ...formData, media: updatedMedia });

            handleCloseMediaModal();

            analytics.trackEvent('campaign_media_attached', {
                media_id: selectedMediaAsset.id,
                media_type: selectedMediaType,
                business_id: businessId
            });
        } catch (error) {
            console.error('Failed to add media:', error);
        }
    };

    // Remove media from campaign
    const handleRemoveMedia = (index) => {
        const updatedMedia = formData.media.filter((_, i) => i !== index);
        onChange({ ...formData, media: updatedMedia });

        analytics.trackEvent('campaign_media_removed', {
            media_index: index,
            business_id: businessId
        });
    };

    // Video metadata handlers
    const handleVideoMetadataChange = (field, value) => {
        setVideoMetadata(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Validate video metadata
    const videoMetadataValidation = useMemo(() => {
        return vuforiaUtils.validateVideoMetadata(videoMetadata);
    }, [videoMetadata]);

    // Upload single file to Vuforia - Updated for new API
    const uploadSingleFile = async (fileItem) => {
        try {
            setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
            setUploadErrors(prev => ({ ...prev, [fileItem.id]: null }));

            // Update file status
            setVuforiaFiles(prev => prev.map(f =>
                f.id === fileItem.id ? { ...f, status: 'uploading' } : f
            ));

            // Simulate progress since we can't track real progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => ({
                    ...prev,
                    [fileItem.id]: Math.min((prev[fileItem.id] || 0) + 20, 90)
                }));
            }, 300);

            // Prepare target data with Base64 conversion
            const targetData = await vuforiaUtils.prepareTargetData({
                file: fileItem.file,
                name: fileItem.file.name.split('.')[0], // Use filename without extension
                width: 1.0, // Default width
                videoMetadata: videoMetadata.videoUrl ? videoMetadata : null,
                active: true
            });

            // Create target using new API
            const result = await createTarget(targetData).unwrap();

            clearInterval(progressInterval);
            setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }));

            if (result.success && result.targetId) {
                // Add to campaign media with new response structure
                const mediaItem = {
                    id: result.targetId,
                    name: fileItem.file.name,
                    type: 'ar_image',
                    metadata: JSON.stringify(videoMetadata),
                    url: URL.createObjectURL(fileItem.file), // Create local URL for preview
                    thumbnailUrl: URL.createObjectURL(fileItem.file),
                    source: 'vuforia',
                    vuforiaData: {
                        targetId: result.targetId,
                        transactionId: result.transactionId
                    }
                };

                const updatedMedia = [...(formData.media || []), mediaItem];
                onChange({ ...formData, media: updatedMedia });

                // Update file status
                setVuforiaFiles(prev => prev.map(f =>
                    f.id === fileItem.id
                        ? { ...f, status: 'completed', progress: 100 }
                        : f
                ));

                analytics.trackEvent('vuforia_upload_success', {
                    target_id: result.targetId,
                    transaction_id: result.transactionId,
                    business_id: businessId
                });
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Vuforia upload error:', error);

            const errorMessage = error?.message || error?.data?.message || 'Upload failed';

            setUploadErrors(prev => ({
                ...prev,
                [fileItem.id]: errorMessage
            }));

            setVuforiaFiles(prev => prev.map(f =>
                f.id === fileItem.id
                    ? { ...f, status: 'error' }
                    : f
            ));

            analytics.trackEvent('vuforia_upload_error', {
                filename: fileItem.file.name,
                error: errorMessage,
                business_id: businessId
            });
        } finally {
            // Clear progress for this file
            setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[fileItem.id];
                return newProgress;
            });
        }
    };

    // Upload all pending files - Updated for new batch API
    const handleUploadAllFiles = async () => {
        const pendingFiles = vuforiaFiles.filter(f => f.status === 'pending');

        if (pendingFiles.length === 0) return;

        // Check if we should use batch upload (more than 1 file)
        if (pendingFiles.length > 1) {
            try {
                // Show batch upload progress
                pendingFiles.forEach(file => {
                    setVuforiaFiles(prev => prev.map(f =>
                        f.id === file.id ? { ...f, status: 'uploading' } : f
                    ));
                    setUploadProgress(prev => ({ ...prev, [file.id]: 50 }));
                });

                // Prepare batch targets with Base64 conversion
                const targets = await vuforiaUtils.prepareBatchTargets(
                    pendingFiles.map(f => ({
                        file: f.file,
                        name: f.file.name.split('.')[0],
                        width: 1.0,
                        videoMetadata: videoMetadata.videoUrl ? videoMetadata : null,
                        active: true
                    }))
                );

                // Create batch targets using new API
                const result = await createTargetsBatch(targets).unwrap();

                if (result.success && result.results) {
                    // Process batch results
                    const newMediaItems = [];

                    result.results.forEach((uploadResult, index) => {
                        const fileItem = pendingFiles[index];

                        if (uploadResult.success && uploadResult.targetId) {
                            const mediaItem = {
                                id: uploadResult.targetId,
                                name: fileItem.file.name,
                                type: 'ar_image',
                                metadata: JSON.stringify(videoMetadata),
                                url: URL.createObjectURL(fileItem.file),
                                thumbnailUrl: URL.createObjectURL(fileItem.file),
                                source: 'vuforia',
                                vuforiaData: {
                                    targetId: uploadResult.targetId,
                                    transactionId: uploadResult.transactionId
                                }
                            };
                            newMediaItems.push(mediaItem);

                            // Update file status
                            setVuforiaFiles(prev => prev.map(f =>
                                f.id === fileItem.id
                                    ? { ...f, status: 'completed', progress: 100 }
                                    : f
                            ));
                            setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }));
                        } else {
                            setUploadErrors(prev => ({
                                ...prev,
                                [fileItem.id]: uploadResult.message || 'Upload failed'
                            }));

                            setVuforiaFiles(prev => prev.map(f =>
                                f.id === fileItem.id
                                    ? { ...f, status: 'error' }
                                    : f
                            ));
                        }
                    });

                    if (newMediaItems.length > 0) {
                        const updatedMedia = [...(formData.media || []), ...newMediaItems];
                        onChange({ ...formData, media: updatedMedia });
                    }

                    analytics.trackEvent('vuforia_batch_upload_complete', {
                        total_files: pendingFiles.length,
                        successful: newMediaItems.length,
                        failed: pendingFiles.length - newMediaItems.length,
                        business_id: businessId
                    });
                } else {
                    throw new Error(result.message || 'Batch upload failed');
                }
            } catch (error) {
                console.error('Batch upload error:', error);

                const errorMessage = error?.message || error?.data?.message || 'Batch upload failed';

                // Mark all files as error
                pendingFiles.forEach(file => {
                    setUploadErrors(prev => ({
                        ...prev,
                        [file.id]: errorMessage
                    }));

                    setVuforiaFiles(prev => prev.map(f =>
                        f.id === file.id
                            ? { ...f, status: 'error' }
                            : f
                    ));
                });

                analytics.trackEvent('vuforia_batch_upload_error', {
                    error: errorMessage,
                    file_count: pendingFiles.length,
                    business_id: businessId
                });
            } finally {
                // Clear all progress
                setUploadProgress({});
            }
        } else {
            // Single file upload
            await uploadSingleFile(pendingFiles[0]);
        }
    };

    // Remove file from upload queue
    const handleRemoveVuforiaFile = (fileId) => {
        setVuforiaFiles(prev => prev.filter(f => f.id !== fileId));

        // Clean up errors and progress
        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fileId];
            return newErrors;
        });

        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });
    };

    // Clear all files
    const handleClearAllFiles = () => {
        setVuforiaFiles([]);
        setUploadErrors({});
        setUploadProgress({});
    };

    // Get icon for media type
    const getMediaTypeIcon = (type) => {
        switch (type) {
            case 'image':
            case 'banner':
            case 'thumbnail':
                return <ImageIcon />;
            case 'video':
                return <VideoIcon />;
            case 'document':
                return <DocumentIcon />;
            case 'ar_image':
                return <ArIcon />;
            default:
                return <StarIcon />;
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {translate('CampaignMedia')}
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
                {translate('AddMediaToCampaignDescription')}
            </Typography>

            {/* Media Tabs */}
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{ mb: 3 }}
            >
                <Tab
                    label={translate('ExistingMedia')}
                    icon={<ImageIcon />}
                    iconPosition="start"
                />
                <Tab
                    label={translate('UploadARImages')}
                    icon={<ArIcon />}
                    iconPosition="start"
                />
            </Tabs>

            {/* Existing Media Tab */}
            {selectedTab === 0 && (
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpenMediaModal}
                        sx={{ mb: 3 }}
                    >
                        {translate('SelectFromLibrary')}
                    </Button>
                </Box>
            )}

            {/* Vuforia Upload Tab */}
            {selectedTab === 1 && (
                <Box>
                    {/* Video Metadata Configuration */}
                    <Accordion sx={{ mb: 3 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                                {translate('ARVideoConfiguration')} (Optional)
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label={translate('VideoURL')}
                                        value={videoMetadata.videoUrl}
                                        onChange={(e) => handleVideoMetadataChange('videoUrl', e.target.value)}
                                        fullWidth
                                        placeholder="https://example.com/video.mp4"
                                        helperText={translate('VideoURLHelperText')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={videoMetadata.autoPlay}
                                                onChange={(e) => handleVideoMetadataChange('autoPlay', e.target.checked)}
                                            />
                                        }
                                        label={translate('AutoPlay')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={videoMetadata.loop}
                                                onChange={(e) => handleVideoMetadataChange('loop', e.target.checked)}
                                            />
                                        }
                                        label={translate('Loop')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={videoMetadata.muted}
                                                onChange={(e) => handleVideoMetadataChange('muted', e.target.checked)}
                                            />
                                        }
                                        label={translate('Muted')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label={translate('VideoScale')}
                                        type="number"
                                        value={videoMetadata.videoScale}
                                        onChange={(e) => handleVideoMetadataChange('videoScale', parseFloat(e.target.value))}
                                        fullWidth
                                        inputProps={{ min: 0.1, max: 5, step: 0.1 }}
                                    />
                                </Grid>
                            </Grid>

                            {!videoMetadataValidation.isValid && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    {videoMetadataValidation.errors.join(', ')}
                                </Alert>
                            )}
                        </AccordionDetails>
                    </Accordion>

                    {/* File Upload Area */}
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'action.hover'
                            }
                        }}
                        onClick={() => document.getElementById('vuforia-file-input').click()}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleFileSelection}
                            style={{ display: 'none' }}
                            id="vuforia-file-input"
                        />
                        <label htmlFor="vuforia-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                {translate('ClickToSelectFiles')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {translate('SupportedFormats')}: JPEG, PNG, GIF, WebP (max 10MB)
                            </Typography>
                        </label>
                    </Box>

                    {/* Validation Errors */}
                    {uploadErrors.validation && (
                        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setUploadErrors(prev => ({ ...prev, validation: null }))}>
                            <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                                {uploadErrors.validation}
                            </Typography>
                        </Alert>
                    )}

                    {/* File List */}
                    {vuforiaFiles.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    {translate('FilesToUpload')} ({vuforiaFiles.length})
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={isUploading || isBatchUploading ? <CircularProgress size={20} /> : <UploadIcon />}
                                        onClick={handleUploadAllFiles}
                                        disabled={
                                            isUploading ||
                                            isBatchUploading ||
                                            vuforiaFiles.filter(f => f.status === 'pending').length === 0
                                        }
                                    >
                                        {translate('UploadAll')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleClearAllFiles}
                                        disabled={isUploading || isBatchUploading}
                                    >
                                        {translate('ClearAll')}
                                    </Button>
                                </Box>
                            </Box>

                            <List>
                                {vuforiaFiles.map((file) => (
                                    <ListItem key={file.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <ImageIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={file.file.name}
                                            secondary={
                                                <Box>
                                                    <Typography variant="caption" component="span">
                                                        {vuforiaUtils.formatFileSize(file.file.size)}
                                                    </Typography>
                                                    {file.status === 'uploading' && (
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={uploadProgress[file.id] || 0}
                                                            sx={{ mt: 1 }}
                                                        />
                                                    )}
                                                    {uploadErrors[file.id] && (
                                                        <Alert severity="error" sx={{ mt: 1 }} size="small">
                                                            {uploadErrors[file.id]}
                                                        </Alert>
                                                    )}
                                                </Box>
                                            }
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {file.status === 'pending' && (
                                                <Chip
                                                    label={translate('Pending')}
                                                    size="small"
                                                    color="default"
                                                />
                                            )}
                                            {file.status === 'uploading' && (
                                                <CircularProgress size={20} />
                                            )}
                                            {file.status === 'completed' && (
                                                <CheckIcon color="success" />
                                            )}
                                            {file.status === 'error' && (
                                                <CancelIcon color="error" />
                                            )}
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleRemoveVuforiaFile(file.id)}
                                                disabled={file.status === 'uploading'}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            )}

            {/* Attached Media Display */}
            {formData.media && formData.media.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        {translate('AttachedMedia')} ({formData.media.length})
                    </Typography>

                    <Grid container spacing={2}>
                        {formData.media.map((media, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ position: 'relative' }}>
                                    {media.url && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={media.thumbnailUrl || media.url}
                                            alt={media.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    )}
                                    <CardContent sx={{ pb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                                                {media.name}
                                            </Typography>
                                            {media.source === 'vuforia' && (
                                                <Chip
                                                    icon={<ArIcon />}
                                                    label="AR"
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {translate('Type')}: {media.type}
                                        </Typography>
                                        {media.vuforiaData?.targetId && (
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                Target ID: {media.vuforiaData.targetId}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemoveMedia(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Existing Media Selection Dialog */}
            <Dialog
                open={isMediaModalOpen}
                onClose={handleCloseMediaModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {translate('SelectMediaFromLibrary')}
                </DialogTitle>

                <DialogContent>
                    {/* Search and Filter */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <TextField
                            placeholder={translate('SearchMedia')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>{translate('MediaType')}</InputLabel>
                            <Select
                                value={mediaTypeFilter}
                                onChange={(e) => setMediaTypeFilter(e.target.value)}
                                label={translate('MediaType')}
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
                    </Box>

                    {/* Media Grid */}
                    {isLoadingMedia ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredMedia.length > 0 ? (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {filteredMedia.map((media) => (
                                <Grid item xs={12} sm={6} md={4} key={media.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: selectedMediaAsset?.id === media.id ? 2 : 1,
                                            borderColor: selectedMediaAsset?.id === media.id ? 'primary.main' : 'divider'
                                        }}
                                        onClick={() => handleMediaSelection(media)}
                                    >
                                        {media.thumbnailUrl && (
                                            <CardMedia
                                                component="img"
                                                height="100"
                                                image={media.thumbnailUrl}
                                                alt={media.name}
                                            />
                                        )}
                                        <CardContent sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" noWrap>
                                                {media.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {media.mediaType?.name}
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
                                            onChange={(e) => setSelectedMediaType(e.target.value)}
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
                                        onChange={(e) => setMediaMetadata(e.target.value)}
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
                        {translate('AttachToCampaign')}
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