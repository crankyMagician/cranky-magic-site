import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    IconButton,
    Typography,
    Switch,
    FormControlLabel,
    Divider,
    CircularProgress,
    InputAdornment,
    Tooltip,
    Alert,
    Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Close as CloseIcon,
    Info as InfoIcon,
    Add as AddIcon
} from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useCreateCampaignMutation, useUpdateCampaignMutation } from '../../api/campaignApi';
import { useGetMediaTypesQuery } from '../../api/mediaApi';

/**
 * Campaign Form Modal
 * Form for creating and editing campaigns
 */
const CampaignFormModal = ({ open, onClose, onSave, campaign, businessId }) => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const { isDark, getGlassMorphismStyle, getGlowEffect, getAnimationDuration } = useSpatialTheme();

    // Determine if we're in edit mode
    const isEditMode = !!campaign;

    // RTK Query hooks
    const [createCampaign, { isLoading: isCreating, error: createError }] = useCreateCampaignMutation();
    const [updateCampaign, { isLoading: isUpdating, error: updateError }] = useUpdateCampaignMutation();
    const { data: mediaTypes, isLoading: isLoadingMediaTypes } = useGetMediaTypesQuery();

    // Form state
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            status: 'draft',
            budget: '',
            startDate: null,
            endDate: null,
            targetAudience: '',
            isScheduled: false
        }
    });

    // Watch values for conditional rendering
    const isScheduled = watch('isScheduled');

    // Reset form when campaign changes or modal opens
    useEffect(() => {
        if (open) {
            if (campaign) {
                // Format dates for the form
                const parsedStartDate = campaign.startDate ? new Date(campaign.startDate) : null;
                const parsedEndDate = campaign.endDate ? new Date(campaign.endDate) : null;

                reset({
                    name: campaign.name || '',
                    description: campaign.description || '',
                    status: campaign.status || 'draft',
                    budget: campaign.budget || '',
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    targetAudience: campaign.targetAudience || '',
                    isScheduled: !!(parsedStartDate && parsedEndDate)
                });
            } else {
                // Reset form for new campaign
                reset({
                    name: '',
                    description: '',
                    status: 'draft',
                    budget: '',
                    startDate: null,
                    endDate: null,
                    targetAudience: '',
                    isScheduled: false
                });
            }
        }
    }, [open, campaign, reset]);

    // Handle scheduled toggle
    const handleScheduledToggle = (event) => {
        const isChecked = event.target.checked;
        setValue('isScheduled', isChecked);

        if (!isChecked) {
            setValue('startDate', null);
            setValue('endDate', null);
        }

        analytics.trackEvent('campaign_schedule_toggle', {
            is_scheduled: isChecked,
            campaign_id: campaign?.id,
            business_id: businessId
        });
    };

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Track form submission
            analytics.trackEvent('campaign_form_submit', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id
            });

            // Prepare payload
            const payload = {
                ...data,
                businessId,
                // Only include dates if scheduling is enabled
                startDate: data.isScheduled ? data.startDate : null,
                endDate: data.isScheduled ? data.endDate : null,
                // Convert budget to number
                budget: data.budget ? parseFloat(data.budget) : 0
            };

            // Create or update campaign
            if (isEditMode) {
                await updateCampaign({
                    campaignId: campaign.id,
                    ...payload
                }).unwrap();
            } else {
                await createCampaign(payload).unwrap();
            }

            // Track success
            analytics.trackEvent('campaign_save_success', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id
            });

            // Call the onSave callback
            onSave();
        } catch (error) {
            console.error('Failed to save campaign:', error);

            // Track error
            analytics.trackEvent('campaign_save_error', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id,
                error: error.message
            });
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (isDirty) {
            // Track unsaved changes
            analytics.trackEvent('campaign_form_cancel_with_changes', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id
            });
        }
        onClose();
    };

    // Get error from the API
    const apiError = createError || updateError;

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    ...getGlassMorphismStyle(0.95),
                    overflow: 'visible'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {isEditMode ? translate('EditCampaign') : translate('CreateCampaign')}
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleCancel}
                    aria-label={translate('Close')}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* API error message */}
            {apiError && (
                <Box sx={{ px: 3, pt: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError.data?.message || translate('ErrorSavingCampaign')}
                    </Alert>
                </Box>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* Campaign Name */}
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: translate('NameRequired'),
                                    maxLength: {
                                        value: 100,
                                        message: translate('NameTooLong')
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={translate('CampaignName')}
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        variant="outlined"
                                        placeholder={translate('CampaignNamePlaceholder')}
                                        InputProps={{
                                            sx: { borderRadius: 1 }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Campaign Description */}
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={translate('Description')}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        placeholder={translate('CampaignDescriptionPlaceholder')}
                                        InputProps={{
                                            sx: { borderRadius: 1 }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Status and Budget */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: translate('StatusRequired') }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.status}>
                                        <InputLabel id="status-label">{translate('Status')}</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="status-label"
                                            label={translate('Status')}
                                            variant="outlined"
                                            sx={{ borderRadius: 1 }}
                                        >
                                            <MenuItem value="draft">{translate('Draft')}</MenuItem>
                                            <MenuItem value="active">{translate('Active')}</MenuItem>
                                            <MenuItem value="completed">{translate('Completed')}</MenuItem>
                                        </Select>
                                        {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="budget"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^(\d+(\.\d{1,2})?)?$/,
                                        message: translate('InvalidBudgetFormat')
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={translate('Budget')}
                                        fullWidth
                                        error={!!errors.budget}
                                        helperText={errors.budget?.message}
                                        variant="outlined"
                                        placeholder="0.00"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            sx: { borderRadius: 1 }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Target Audience */}
                        <Grid item xs={12}>
                            <Controller
                                name="targetAudience"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={translate('TargetAudience')}
                                        fullWidth
                                        variant="outlined"
                                        placeholder={translate('TargetAudiencePlaceholder')}
                                        InputProps={{
                                            sx: { borderRadius: 1 }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Schedule Toggle */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper'
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isScheduled}
                                            onChange={handleScheduledToggle}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ mr: 1 }}>{translate('ScheduleCampaign')}</Typography>
                                            <Tooltip title={translate('ScheduleCampaignTooltip')}>
                                                <InfoIcon fontSize="small" color="action" />
                                            </Tooltip>
                                        </Box>
                                    }
                                    sx={{ mb: 1 }}
                                />

                                {isScheduled && (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name="startDate"
                                                    control={control}
                                                    rules={{
                                                        required: isScheduled ? translate('StartDateRequired') : false
                                                    }}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            label={translate('StartDate')}
                                                            value={field.value}
                                                            onChange={(date) => field.onChange(date)}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    variant: 'outlined',
                                                                    error: !!errors.startDate,
                                                                    helperText: errors.startDate?.message,
                                                                    InputProps: {
                                                                        sx: { borderRadius: 1 }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name="endDate"
                                                    control={control}
                                                    rules={{
                                                        required: isScheduled ? translate('EndDateRequired') : false,
                                                        validate: value => {
                                                            const startDate = watch('startDate');
                                                            if (startDate && value && new Date(value) <= new Date(startDate)) {
                                                                return translate('EndDateAfterStartDate');
                                                            }
                                                            return true;
                                                        }
                                                    }}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            label={translate('EndDate')}
                                                            value={field.value}
                                                            onChange={(date) => field.onChange(date)}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    variant: 'outlined',
                                                                    error: !!errors.endDate,
                                                                    helperText: errors.endDate?.message,
                                                                    InputProps: {
                                                                        sx: { borderRadius: 1 }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </LocalizationProvider>
                                )}
                            </Paper>
                        </Grid>

                        {/* Media Attachments Section - Placeholder for future implementation */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    bgcolor: theme => isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(240, 240, 245, 0.5)'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        {translate('MediaAttachments')}
                                    </Typography>
                                    <Button
                                        startIcon={<AddIcon />}
                                        color="primary"
                                        size="small"
                                        disabled
                                        sx={{
                                            borderRadius: 1,
                                            ...getGlowEffect(theme => theme.palette.primary.main, 'low'),
                                        }}
                                    >
                                        {translate('AddMedia')}
                                    </Button>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    {translate('MediaAttachmentsComingSoon')}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button
                        onClick={handleCancel}
                        color="inherit"
                        disabled={isCreating || isUpdating}
                        sx={{ borderRadius: 1 }}
                    >
                        {translate('Cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isCreating || isUpdating}
                        startIcon={isCreating || isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                            borderRadius: 1,
                            minWidth: 100,
                            ...getGlowEffect(theme => theme.palette.primary.main, 'low'),
                            transition: getAnimationDuration(300),
                            '&:hover': {
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        {isEditMode ? translate('Update') : translate('Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

CampaignFormModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    businessId: PropTypes.string.isRequired
};

export default React.memo(CampaignFormModal);