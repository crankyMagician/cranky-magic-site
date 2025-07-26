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
// Note: react-dropzone import removed for better compatibility
import useCustomTranslation from '../../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../../hooks/useSpatialTheme';
import useAnalytics from '../../../analytics/hooks/useAnalytics';
import { 
    useGetBusinessMediaQuery,
    useGetMediaTypesQuery,
    useAttachCampaignMediaMutation 
} from '../../../api/mediaApi';
import {
    useUploadImageToVuforiaMutation,
    useBatchUploadToVuforiaMutation,
    vuforiaUploadUtils
} from '../../../api/vuforiaApi';

/**
 * Campaign Media Step - Enhanced with Vuforia AR upload support
 * Allows users to attach existing media or upload new images to Vuforia for AR experiences
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

    // API hooks
    const { data: businessMedia, isLoading: isLoadingMedia, refetch: refetchMedia } = useGetBusinessMediaQuery({
        businessId,
        mediaTypeId: mediaTypeFilter,
        page: 1,
        pageSize: 50
    });
    const { data: mediaTypes } = useGetMediaTypesQuery();
    const [attachMedia, { isLoading: isAttaching }] = useAttachCampaignMediaMutation();
    const [uploadToVuforia, { isLoading: isUploading }] = useUploadImageToVuforiaMutation();
    const [batchUploadToVuforia, { isLoading: isBatchUploading }] = useBatchUploadToVuforiaMutation();

    // Memoized filtered media
    const filteredMedia = useMemo(() => {
        if (!businessMedia?.data) return [];
        
        return businessMedia.data.filter(media => 
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
            const validation = vuforiaUploadUtils.validateUploadFile(file);
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
        return vuforiaUploadUtils.validateVideoMetadata(videoMetadata);
    }, [videoMetadata]);

    // Upload single file to Vuforia
    const uploadSingleFile = async (fileItem) => {
        try {
            setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
            setUploadErrors(prev => ({ ...prev, [fileItem.id]: null }));

            const result = await uploadToVuforia({
                file: fileItem.file,
                userId: 'current_user', // This should come from auth context
                videoMetadata: videoMetadata.videoUrl ? videoMetadata : null
            }).unwrap();

            const formattedResult = vuforiaUploadUtils.formatUploadResponse(result);

            if (formattedResult.success) {
                // Add to campaign media
                const mediaItem = {
                    id: formattedResult.imageId,
                    name: fileItem.file.name,
                    type: 'ar_image',
                    metadata: JSON.stringify(videoMetadata),
                    url: formattedResult.blobUrl,
                    thumbnailUrl: formattedResult.blobUrl,
                    source: 'vuforia',
                    vuforiaData: {
                        imageId: formattedResult.imageId,
                        isDuplicate: formattedResult.isDuplicate,
                        duplicateId: formattedResult.duplicateId,
                        similarity: formattedResult.similarity,
                        processingTime: formattedResult.processingTime
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
                    image_id: formattedResult.imageId,
                    is_duplicate: formattedResult.isDuplicate,
                    processing_time: formattedResult.processingTime,
                    business_id: businessId
                });
            } else {
                throw new Error(formattedResult.message || 'Upload failed');
            }
        } catch (error) {
            setUploadErrors(prev => ({ 
                ...prev, 
                [fileItem.id]: error.message || 'Upload failed' 
            }));
            
            setVuforiaFiles(prev => prev.map(f => 
                f.id === fileItem.id 
                    ? { ...f, status: 'error' }
                    : f
            ));

            analytics.trackEvent('vuforia_upload_error', {
                filename: fileItem.file.name,
                error: error.message,
                business_id: businessId
            });
        }
    };

    // Upload all pending files
    const handleUploadAllFiles = async () => {
        const pendingFiles = vuforiaFiles.filter(f => f.status === 'pending');
        
        if (pendingFiles.length === 0) return;

        // Check if we should use batch upload (more than 1 file)
        if (pendingFiles.length > 1) {
            try {
                const files = pendingFiles.map(f => f.file);
                const result = await batchUploadToVuforia({
                    files,
                    userId: 'current_user',
                    videoMetadata: videoMetadata.videoUrl ? videoMetadata : null
                }).unwrap();

                const formattedResult = vuforiaUploadUtils.formatUploadResponse(result);

                if (formattedResult.success && result.results) {
                    // Process batch results
                    const newMediaItems = [];
                    
                    result.results.forEach((uploadResult, index) => {
                        const fileItem = pendingFiles[index];
                        
                        if (uploadResult.success) {
                            const mediaItem = {
                                id: uploadResult.image_id,
                                name: fileItem.file.name,
                                type: 'ar_image',
                                metadata: JSON.stringify(videoMetadata),
                                url: uploadResult.blob_url,
                                thumbnailUrl: uploadResult.blob_url,
                                source: 'vuforia',
                                vuforiaData: {
                                    imageId: uploadResult.image_id,
                                    isDuplicate: uploadResult.is_duplicate,
                                    duplicateId: uploadResult.duplicate_id,
                                    similarity: uploadResult.similarity,
                                    processingTime: uploadResult.processing_time
                                }
                            };
                            newMediaItems.push(mediaItem);
                            
                            // Update file status
                            setVuforiaFiles(prev => prev.map(f => 
                                f.id === fileItem.id 
                                    ? { ...f, status: 'completed', progress: 100 }
                                    : f
                            ));
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

                    // Add successful uploads to campaign media
                    if (newMediaItems.length > 0) {
                        const updatedMedia = [...(formData.media || []), ...newMediaItems];
                        onChange({ ...formData, media: updatedMedia });
                    }

                    analytics.trackEvent('vuforia_batch_upload_complete', {
                        total_files: pendingFiles.length,
                        successful_uploads: newMediaItems.length,
                        failed_uploads: pendingFiles.length - newMediaItems.length,
                        business_id: businessId
                    });
                }
            } catch (error) {
                // Mark all pending files as error
                pendingFiles.forEach(fileItem => {
                    setUploadErrors(prev => ({ 
                        ...prev, 
                        [fileItem.id]: error.message || 'Batch upload failed' 
                    }));
                    
                    setVuforiaFiles(prev => prev.map(f => 
                        f.id === fileItem.id 
                            ? { ...f, status: 'error' }
                            : f
                    ));
                });

                analytics.trackEvent('vuforia_batch_upload_error', {
                    total_files: pendingFiles.length,
                    error: error.message,
                    business_id: businessId
                });
            }
        } else {
            // Single file upload
            await uploadSingleFile(pendingFiles[0]);
        }
    };

    // Remove file from Vuforia upload queue
    const handleRemoveVuforiaFile = (fileId) => {
        setVuforiaFiles(prev => prev.filter(f => f.id !== fileId));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });
        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fileId];
            return newErrors;
        });
    };

    // Clear all uploaded files
    const handleClearVuforiaFiles = () => {
        setVuforiaFiles([]);
        setUploadProgress({});
        setUploadErrors({});
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {translate('CampaignMedia')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {translate('CampaignMediaDescription')}
                </Typography>
            </Box>

            {/* Media Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    aria-label="campaign media tabs"
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: 48,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                        }
                    }}
                >
                    <Tab 
                        icon={<ImageIcon />} 
                        label={translate('ExistingMedia')}
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<ArIcon />} 
                        label={translate('VuforiaUpload')}
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            {/* Tab Content */}
            {selectedTab === 0 && (
                <Box>
                    {/* Existing Media Tab */}
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpenMediaModal}
                        sx={{ mb: 3 }}
                    >
                        {translate('AttachExistingMedia')}
                    </Button>
                </Box>
            )}

            {selectedTab === 1 && (
                <Box>
                    {/* Vuforia Upload Tab */}
                    
                    {/* Video Metadata Configuration */}
                    <Accordion sx={{ mb: 3 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VideoIcon color="primary" />
                                <Typography variant="h6">
                                    {translate('ARVideoConfiguration')}
                                </Typography>
                                {!videoMetadataValidation.isValid && (
                                    <WarningIcon color="warning" fontSize="small" />
                                )}
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={translate('VideoURL')}
                                        value={videoMetadata.videoUrl}
                                        onChange={(e) => handleVideoMetadataChange('videoUrl', e.target.value)}
                                        placeholder="https://example.com/video.mp4"
                                        helperText={translate('VideoURLHelp')}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
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
                                
                                <Grid item xs={12} sm={6} md={3}>
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
                                
                                <Grid item xs={12} sm={6} md={3}>
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
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>{translate('VideoPosition')}</InputLabel>
                                        <Select
                                            value={videoMetadata.videoPosition}
                                            label={translate('VideoPosition')}
                                            onChange={(e) => handleVideoMetadataChange('videoPosition', e.target.value)}
                                        >
                                            <MenuItem value="overlay">{translate('Overlay')}</MenuItem>
                                            <MenuItem value="background">{translate('Background')}</MenuItem>
                                            <MenuItem value="inline">{translate('Inline')}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label={translate('VideoScale')}
                                        value={videoMetadata.videoScale}
                                        onChange={(e) => handleVideoMetadataChange('videoScale', parseFloat(e.target.value) || 1.0)}
                                        inputProps={{ min: 0.1, max: 5.0, step: 0.1 }}
                                        helperText={translate('VideoScaleHelp')}
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
                            borderColor: 'grey.300',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            mb: 3,
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*"
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
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setUploadErrors(prev => ({ ...prev, validation: null }))}>
                            <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                                {uploadErrors.validation}
                            </Typography>
                        </Alert>
                    )}

                    {/* File List */}
                    {vuforiaFiles.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    {translate('FilesToUpload')} ({vuforiaFiles.length})
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={isUploading || isBatchUploading ? <CircularProgress size={16} /> : <UploadIcon />}
                                        onClick={handleUploadAllFiles}
                                        disabled={isUploading || isBatchUploading || vuforiaFiles.every(f => f.status !== 'pending')}
                                    >
                                        {translate('UploadAll')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={handleClearVuforiaFiles}
                                    >
                                        {translate('ClearAll')}
                                    </Button>
                                </Box>
                            </Box>

                            <List>
                                {vuforiaFiles.map((fileItem) => (
                                    <ListItem
                                        key={fileItem.id}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            mb: 1,
                                            bgcolor: 'background.paper'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                {fileItem.status === 'completed' && <CheckIcon color="success" />}
                                                {fileItem.status === 'error' && <WarningIcon color="error" />}
                                                {fileItem.status === 'pending' && <ImageIcon />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={fileItem.file.name}
                                            secondary={
                                                <Box>
                                                    <Typography variant="caption">
                                                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </Typography>
                                                    {uploadErrors[fileItem.id] && (
                                                        <Typography variant="caption" color="error" display="block">
                                                            {uploadErrors[fileItem.id]}
                                                        </Typography>
                                                    )}
                                                    {uploadProgress[fileItem.id] !== undefined && (
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={uploadProgress[fileItem.id]} 
                                                            sx={{ mt: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                        />
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleRemoveVuforiaFile(fileItem.id)}
                                            disabled={fileItem.status === 'uploading'}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
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
                                        {media.vuforiaData?.isDuplicate && (
                                            <Chip
                                                label={translate('Duplicate')}
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                                sx={{ mt: 1 }}
                                            />
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ pt: 0 }}>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemoveMedia(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        {media.source === 'vuforia' && media.vuforiaData && (
                                            <Tooltip title={`Processing time: ${media.vuforiaData.processingTime}s`}>
                                                <IconButton size="small">
                                                    <InfoIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Existing Media Selection Modal */}
            <Dialog
                open={isMediaModalOpen}
                onClose={handleCloseMediaModal}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{translate('SelectMedia')}</Typography>
                        <IconButton onClick={handleCloseMediaModal}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {/* Search and Filter */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            placeholder={translate('SearchMedia')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel>{translate('MediaType')}</InputLabel>
                            <Select
                                value={mediaTypeFilter}
                                label={translate('MediaType')}
                                onChange={(e) => setMediaTypeFilter(e.target.value)}
                            >
                                <MenuItem value="">{translate('All')}</MenuItem>
                                {mediaTypes?.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Media List */}
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