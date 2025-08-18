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
                    isScheduled: !!campaign.startDate
                });
            } else {
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

    // Track form open
    useEffect(() => {
        if (open) {
            analytics.trackEvent('campaign_form_open', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id
            });
        }
    }, [open, isEditMode, businessId, campaign?.id, analytics]);

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Track submission attempt
            analytics.trackEvent('campaign_save_attempt', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id
            });

            // Prepare payload - ensure businessId is converted to the expected type
            const payload = {
                ...data,
                businessId: String(businessId), // Convert to string if API expects string
                // Only include dates if scheduled
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
                <IconButton onClick={handleCancel} size="small" sx={{ color: 'text.secondary' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 2 }}>
                    {/* Show API error if any */}
                    {apiError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {apiError.data?.message || translate('ErrorSavingCampaign')}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {/* Campaign Name */}
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: translate('CampaignNameRequired') }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={translate('CampaignName')}
                                        fullWidth
                                        required
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
                                        <InputLabel>{translate('Status')}</InputLabel>
                                        <Select
                                            {...field}
                                            label={translate('Status')}
                                            sx={{ borderRadius: 1 }}
                                        >
                                            <MenuItem value="draft">{translate('Draft')}</MenuItem>
                                            <MenuItem value="active">{translate('Active')}</MenuItem>
                                            <MenuItem value="paused">{translate('Paused')}</MenuItem>
                                            <MenuItem value="completed">{translate('Completed')}</MenuItem>
                                        </Select>
                                        {errors.status && (
                                            <FormHelperText>{errors.status.message}</FormHelperText>
                                        )}
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
                                        value: /^[0-9]*\.?[0-9]*$/,
                                        message: translate('InvalidBudget')
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
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            sx: { borderRadius: 1 }
                                        }}
                                        placeholder="0.00"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Schedule toggle */}
                        <Grid item xs={12}>
                            <Controller
                                name="isScheduled"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                {...field}
                                                checked={field.value}
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Box display="flex" alignItems="center">
                                                {translate('ScheduleCampaign')}
                                                <Tooltip title={translate('ScheduleInfo')}>
                                                    <IconButton size="small" sx={{ ml: 0.5 }}>
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                    />
                                )}
                            />
                        </Grid>

                        {/* Date pickers - shown only when scheduled */}
                        {isScheduled && (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        rules={{
                                            required: isScheduled ? translate('StartDateRequired') : false
                                        }}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                label={translate('StartDate')}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!errors.startDate}
                                                        helperText={errors.startDate?.message}
                                                        variant="outlined"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            sx: { borderRadius: 1 }
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                if (isScheduled && value && watch('startDate')) {
                                                    return value > watch('startDate') || translate('EndDateMustBeAfterStart');
                                                }
                                                return true;
                                            }
                                        }}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                label={translate('EndDate')}
                                                minDate={watch('startDate')}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!errors.endDate}
                                                        helperText={errors.endDate?.message}
                                                        variant="outlined"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            sx: { borderRadius: 1 }
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                            </LocalizationProvider>
                        )}

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
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        placeholder={translate('TargetAudiencePlaceholder')}
                                        helperText={translate('TargetAudienceHelp')}
                                        InputProps={{
                                            sx: { borderRadius: 1 }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleCancel}
                        color="inherit"
                        sx={{ mr: 1 }}
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
    businessId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

export default React.memo(CampaignFormModal);