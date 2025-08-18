import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    IconButton,
    LinearProgress,
    Alert,
    Chip,
    Divider,
    CircularProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    InsertDriveFile as FileIcon,
    Image as ImageIcon,
    VideoLibrary as VideoIcon,
    Description as DocumentIcon,
    AudioFile as AudioIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';

// Import application hooks and utilities
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useAuth } from '../../hooks/useAuth';

// Import API hooks
import {
    useUploadMediaMutation,
    useGetMediaTypesQuery,
    mediaUtils
} from '../../api/mediaApi';

/**
 * MediaUploadDialog Component
 * Handles single and multiple file uploads with progress tracking
 */
const MediaUploadDialog = ({
                               open,
                               onClose,
                               businessId,
                               onUploadComplete,
                               multiple = true,
                               acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'],
                               maxFileSize = 10 * 1024 * 1024, // 10MB default
                               defaultMediaTypeId = null
                           }) => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { getGlassMorphismStyle, getGlowEffect, isDark } = useSpatialTheme();
    const { user } = useAuth();

    // State management
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [failedFiles, setFailedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Form control
    const {
        control,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            mediaTypeId: defaultMediaTypeId || '',
            isPublic: false,
            autoUpload: false
        }
    });

    const watchMediaTypeId = watch('mediaTypeId');
    const watchAutoUpload = watch('autoUpload');

    // API hooks - Updated to handle ServiceResponse
    const {
        data: mediaTypesData,
        isLoading: isLoadingTypes
    } = useGetMediaTypesQuery();

    const [uploadMedia, { isLoading: isUploadingMutation }] = useUploadMediaMutation();

    // Extract media types from ServiceResponse format
    const mediaTypes = useMemo(() => {
        if (Array.isArray(mediaTypesData)) {
            return mediaTypesData;
        }
        return mediaTypesData?.types || [];
    }, [mediaTypesData]);

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setFiles([]);
            setUploadProgress({});
            setUploadedFiles([]);
            setFailedFiles([]);
            setIsUploading(false);
        }
    }, [open]);

    // File input handling
    const handleFileSelect = useCallback((event) => {
        const selectedFiles = Array.from(event.target.files || []);

        // Validate and prepare files
        const validatedFiles = selectedFiles.map(file => {
            const validation = mediaUtils.validateMediaFile(file, {
                maxSize: maxFileSize,
                allowedTypes: acceptedFileTypes,
                allowedExtensions: [] // Use type checking only
            });

            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                isValid: validation.isValid,
                errors: validation.errors,
                status: validation.isValid ? 'pending' : 'error'
            };
        });

        setFiles(prev => [...prev, ...validatedFiles]);

        // Reset file input
        event.target.value = '';

        analytics.trackEvent('media_files_selected', {
            file_count: selectedFiles.length,
            valid_count: validatedFiles.filter(f => f.isValid).length,
            business_id: businessId
        });

        // Auto upload if enabled
        if (watchAutoUpload && validatedFiles.some(f => f.isValid)) {
            handleUploadAll();
        }
    }, [acceptedFileTypes, maxFileSize, businessId, analytics, watchAutoUpload]);

    // Remove file from list
    const handleRemoveFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));

        // Clean up progress
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });

        analytics.trackEvent('media_file_removed', {
            file_id: fileId,
            business_id: businessId
        });
    };

    // Upload single file
    const uploadSingleFile = async (fileItem) => {
        if (!fileItem.isValid || !watchMediaTypeId) return;

        try {
            // Update status
            setFiles(prev => prev.map(f =>
                f.id === fileItem.id ? { ...f, status: 'uploading' } : f
            ));

            // Create form data
            const mediaData = {
                file: fileItem.file,
                title: fileItem.name,
                mediaTypeId: watchMediaTypeId,
                isPublic: watch('isPublic'),
                description: '',
                metadata: JSON.stringify({
                    originalName: fileItem.name,
                    uploadedBy: user?.email || 'unknown',
                    uploadDate: new Date().toISOString()
                })
            };

            const formData = mediaUtils.createMediaFormData(mediaData);

            // Simulate progress (since we can't track real upload progress with fetch)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => ({
                    ...prev,
                    [fileItem.id]: Math.min((prev[fileItem.id] || 0) + 10, 90)
                }));
            }, 200);

            // Upload file
            const result = await uploadMedia({
                businessId,
                formData
            }).unwrap();

            clearInterval(progressInterval);

            // Update progress to 100%
            setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }));

            // Update file status
            setFiles(prev => prev.map(f =>
                f.id === fileItem.id ? { ...f, status: 'completed', result } : f
            ));

            setUploadedFiles(prev => [...prev, { ...fileItem, result }]);

            analytics.trackEvent('media_upload_success', {
                file_id: fileItem.id,
                media_id: result.id,
                business_id: businessId
            });

            return { success: true, result };
        } catch (error) {
            console.error('Error uploading file:', error);

            // Update file status
            setFiles(prev => prev.map(f =>
                f.id === fileItem.id ? { ...f, status: 'error', error: error?.message || error?.data?.message } : f
            ));

            setFailedFiles(prev => [...prev, { ...fileItem, error }]);

            // Clear progress
            setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[fileItem.id];
                return newProgress;
            });

            analytics.trackEvent('media_upload_error', {
                file_id: fileItem.id,
                error: error?.message || error?.data?.message,
                business_id: businessId
            });

            return { success: false, error };
        }
    };

    // Upload all pending files
    const handleUploadAll = async () => {
        const pendingFiles = files.filter(f => f.status === 'pending' && f.isValid);

        if (pendingFiles.length === 0) {
            enqueueSnackbar(translate('NoFilesToUpload'), { variant: 'warning' });
            return;
        }

        if (!watchMediaTypeId) {
            enqueueSnackbar(translate('PleaseSelectMediaType'), { variant: 'warning' });
            return;
        }

        setIsUploading(true);
        setUploadedFiles([]);
        setFailedFiles([]);

        // Upload files sequentially to avoid overwhelming the server
        for (const file of pendingFiles) {
            await uploadSingleFile(file);
        }

        setIsUploading(false);

        // Show summary
        const successCount = uploadedFiles.length;
        const failCount = failedFiles.length;

        if (successCount > 0 && failCount === 0) {
            enqueueSnackbar(translate('AllFilesUploadedSuccessfully', { count: successCount }), { variant: 'success' });
        } else if (successCount > 0 && failCount > 0) {
            enqueueSnackbar(translate('SomeFilesFailedToUpload', { success: successCount, failed: failCount }), { variant: 'warning' });
        } else if (failCount > 0) {
            enqueueSnackbar(translate('AllFilesFailedToUpload', { count: failCount }), { variant: 'error' });
        }

        // Call completion callback if all successful
        if (failCount === 0 && onUploadComplete) {
            onUploadComplete(uploadedFiles.map(f => f.result));
        }
    };

    // Get file icon based on type
    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return <ImageIcon />;
        if (fileType.startsWith('video/')) return <VideoIcon />;
        if (fileType.startsWith('audio/')) return <AudioIcon />;
        if (fileType.includes('pdf')) return <DocumentIcon />;
        return <FileIcon />;
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckIcon color="success" />;
            case 'error':
                return <ErrorIcon color="error" />;
            case 'uploading':
                return <CircularProgress size={20} />;
            default:
                return null;
        }
    };

    // Calculate overall progress
    const overallProgress = useMemo(() => {
        const validFiles = files.filter(f => f.isValid);
        if (validFiles.length === 0) return 0;

        const totalProgress = validFiles.reduce((sum, file) => {
            if (file.status === 'completed') return sum + 100;
            return sum + (uploadProgress[file.id] || 0);
        }, 0);

        return totalProgress / validFiles.length;
    }, [files, uploadProgress]);

    // Handle close
    const handleClose = () => {
        if (isUploading) {
            enqueueSnackbar(translate('UploadInProgress'), { variant: 'warning' });
            return;
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        {translate('UploadMedia')}
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Upload Settings */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 200 }} required>
                                <InputLabel>{translate('MediaType')}</InputLabel>
                                <Controller
                                    name="mediaTypeId"
                                    control={control}
                                    rules={{ required: translate('MediaTypeRequired') }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label={translate('MediaType')}
                                            disabled={isLoadingTypes || isUploading}
                                        >
                                            <MenuItem value="">
                                                <em>{translate('SelectMediaType')}</em>
                                            </MenuItem>
                                            {mediaTypes.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>

                            <Controller
                                name="isPublic"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                {...field}
                                                checked={field.value}
                                                disabled={isUploading}
                                            />
                                        }
                                        label={translate('PublicAccess')}
                                    />
                                )}
                            />

                            <Controller
                                name="autoUpload"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                {...field}
                                                checked={field.value}
                                                disabled={isUploading}
                                            />
                                        }
                                        label={translate('AutoUpload')}
                                    />
                                )}
                            />
                        </Box>
                    </Grid>

                    {/* File Upload Area */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                border: '2px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                p: 3,
                                textAlign: 'center',
                                bgcolor: 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'action.hover'
                                }
                            }}
                            onClick={() => !isUploading && document.getElementById('file-input').click()}
                        >
                            <input
                                type="file"
                                id="file-input"
                                multiple={multiple}
                                accept={acceptedFileTypes.join(',')}
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                disabled={isUploading}
                            />
                            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                {translate('ClickOrDragToUpload')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {translate('MaxFileSize', { size: mediaUtils.formatFileSize(maxFileSize) })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {translate('AcceptedFormats', { formats: acceptedFileTypes.join(', ') })}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* File List */}
                    {files.length > 0 && (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    {translate('Files')} ({files.length})
                                </Typography>
                                {files.filter(f => f.isValid).length > 0 && (
                                    <Chip
                                        label={`${files.filter(f => f.status === 'completed').length}/${files.filter(f => f.isValid).length} ${translate('Uploaded')}`}
                                        color={files.filter(f => f.status === 'completed').length === files.filter(f => f.isValid).length ? 'success' : 'default'}
                                        size="small"
                                    />
                                )}
                            </Box>

                            <List>
                                {files.map((file, index) => (
                                    <React.Fragment key={file.id}>
                                        {index > 0 && <Divider />}
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {getFileIcon(file.type)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                                            {file.name}
                                                        </Typography>
                                                        {getStatusIcon(file.status)}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {mediaUtils.formatFileSize(file.size)}
                                                        </Typography>
                                                        {!file.isValid && (
                                                            <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                                                                {file.errors.join(', ')}
                                                            </Alert>
                                                        )}
                                                        {file.error && (
                                                            <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                                                                {file.error}
                                                            </Alert>
                                                        )}
                                                        {file.status === 'uploading' && (
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={uploadProgress[file.id] || 0}
                                                                sx={{ mt: 1 }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleRemoveFile(file.id)}
                                                    disabled={file.status === 'uploading' || file.status === 'completed'}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </React.Fragment>
                                ))}
                            </List>
                        </Grid>
                    )}

                    {/* Overall Progress */}
                    {isUploading && (
                        <Grid item xs={12}>
                            <Box>
                                <Typography variant="body2" gutterBottom>
                                    {translate('OverallProgress')}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={overallProgress}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={isUploading}>
                    {translate('Cancel')}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUploadAll}
                    disabled={
                        isUploading ||
                        !watchMediaTypeId ||
                        files.filter(f => f.status === 'pending' && f.isValid).length === 0
                    }
                    startIcon={isUploading ? <CircularProgress size={20} /> : <UploadIcon />}
                >
                    {isUploading
                        ? translate('Uploading')
                        : translate('UploadAll', { count: files.filter(f => f.status === 'pending' && f.isValid).length })
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

MediaUploadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    businessId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onUploadComplete: PropTypes.func,
    multiple: PropTypes.bool,
    acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
    maxFileSize: PropTypes.number,
    defaultMediaTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default React.memo(MediaUploadDialog);