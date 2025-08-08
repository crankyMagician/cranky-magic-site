import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stepper,
    Step,
    StepLabel,
    Typography,
    IconButton,
    Divider,
    CircularProgress,
    Alert,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Close as CloseIcon,
    ArrowBack as BackIcon,
    ArrowForward as NextIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useCreateCampaignMutation, useUpdateCampaignMutation } from '../../api/apiSlice';

// Step components
import CampaignBasicInfoStep from './wizard-steps/CampaignBasicInfoStep';
import CampaignScheduleStep from './wizard-steps/CampaignScheduleStep';
import CampaignMediaStep from './wizard-steps/CampaignMediaStep';
import CampaignReviewStep from './wizard-steps/CampaignReviewStep';

/**
 * CampaignWizard - A multi-step wizard for creating or editing campaigns
 * Fixed to work with actual API implementation and match CampaignFormModal data structure
 */
const CampaignWizard = ({ open, onClose, onSave, campaign, businessId }) => {
    const { translate } = useCustomTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const analytics = useAnalytics();
    const theme = useTheme();
    const { getGlassMorphismStyle, getGlowEffect, getAnimationDuration } = useSpatialTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Determine if we're in edit mode
    const isEditMode = Boolean(campaign);

    // RTK Query hooks
    const [createCampaign, { isLoading: isCreating, error: createError }] = useCreateCampaignMutation();
    const [updateCampaign, { isLoading: isUpdating, error: updateError }] = useUpdateCampaignMutation();

    // Active step state
    const [activeStep, setActiveStep] = useState(0);

    // Form data state - matching CampaignFormModal structure
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        externalId: '',
        status: 'draft',
        budget: '',
        targetAudience: '',
        isScheduled: false,
        startDate: null,
        endDate: null,
        media: []
    });

    // Form validation state
    const [errors, setErrors] = useState({});

    // Loading state for the overall operation
    const isLoading = isCreating || isUpdating;

    // Get error from the API
    const apiError = createError || updateError;

    // Reset form when campaign changes or modal opens
    useEffect(() => {
        if (open) {
            if (campaign) {
                // Format dates for the form
                const parsedStartDate = campaign.startDate ? new Date(campaign.startDate) : null;
                const parsedEndDate = campaign.endDate ? new Date(campaign.endDate) : null;

                setFormData({
                    name: campaign.name || '',
                    description: campaign.description || '',
                    externalId: campaign.externalId || '',
                    status: campaign.status || 'draft',
                    budget: campaign.budget?.toString() || '',
                    targetAudience: campaign.targetAudience || '',
                    isScheduled: !!(parsedStartDate && parsedEndDate),
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    media: campaign.media || []
                });
            } else {
                // Reset form for new campaign
                setFormData({
                    name: '',
                    description: '',
                    externalId: '',
                    status: 'draft',
                    budget: '',
                    targetAudience: '',
                    isScheduled: false,
                    startDate: null,
                    endDate: null,
                    media: []
                });
            }

            // Reset active step to beginning
            setActiveStep(0);
            // Reset errors
            setErrors({});
        }
    }, [open, campaign]);

    // Step definitions
    const steps = [
        { label: translate('BasicInfo'), component: CampaignBasicInfoStep },
        { label: translate('Schedule'), component: CampaignScheduleStep },
        { label: translate('Media'), component: CampaignMediaStep },
        { label: translate('Review'), component: CampaignReviewStep }
    ];

    // Update form data - updated to handle both single field and object updates
    const handleFormChange = useCallback((fieldNameOrObject, value) => {
        if (typeof fieldNameOrObject === 'object' && fieldNameOrObject !== null) {
            // Handle object update (from step components)
            setFormData(fieldNameOrObject);
            // Clear errors for updated fields
            const updatedFields = Object.keys(fieldNameOrObject);
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                updatedFields.forEach(field => {
                    delete newErrors[field];
                });
                return newErrors;
            });
        } else {
            // Handle single field update
            setFormData(prevData => ({
                ...prevData,
                [fieldNameOrObject]: value
            }));

            // Clear error for this field if any
            if (errors[fieldNameOrObject]) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [fieldNameOrObject]: undefined
                }));
            }
        }
    }, [errors]);

    // Validate the current step
    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        // Validations specific to each step
        if (step === 0) {
            // Basic info validation
            if (!formData.name?.trim()) {
                newErrors.name = translate('NameRequired');
                isValid = false;
            } else if (formData.name.length > 100) {
                newErrors.name = translate('NameTooLong');
                isValid = false;
            }

            // Description validation (optional but has max length)
            if (formData.description && formData.description.length > 500) {
                newErrors.description = translate('DescriptionTooLong');
                isValid = false;
            }

            // External ID validation (optional but has pattern)
            if (formData.externalId && !/^[A-Za-z0-9-_]*$/.test(formData.externalId)) {
                newErrors.externalId = translate('InvalidExternalIdFormat');
                isValid = false;
            }

            // Budget validation (if provided)
            if (formData.budget && !/^(\d+(\.\d{1,2})?)?$/.test(formData.budget)) {
                newErrors.budget = translate('InvalidBudgetFormat');
                isValid = false;
            } else if (formData.budget && parseFloat(formData.budget) > 999999999) {
                newErrors.budget = translate('BudgetTooHigh');
                isValid = false;
            }

            // Status validation
            const validStatuses = ['draft', 'active', 'paused', 'completed'];
            if (!validStatuses.includes(formData.status)) {
                newErrors.status = translate('InvalidStatus');
                isValid = false;
            }
        } else if (step === 1) {
            // Schedule validation (only if scheduling is enabled)
            if (formData.isScheduled) {
                if (!formData.startDate) {
                    newErrors.startDate = translate('StartDateRequired');
                    isValid = false;
                }

                if (!formData.endDate) {
                    newErrors.endDate = translate('EndDateRequired');
                    isValid = false;
                } else if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
                    newErrors.endDate = translate('EndDateAfterStartDate');
                    isValid = false;
                }

                // Check if dates are not in the past (only for new campaigns)
                if (!isEditMode) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (formData.startDate && new Date(formData.startDate) < today) {
                        newErrors.startDate = translate('StartDateCannotBePast');
                        isValid = false;
                    }
                }
            }
        }
        // Step 2 (Media) has no required fields
        // Step 3 (Review) just shows a summary, no validation needed

        setErrors(newErrors);
        return isValid;
    };

    // Handle next step
    const handleNext = () => {
        if (validateStep(activeStep)) {
            const nextStep = activeStep + 1;
            setActiveStep(nextStep);

            // Track step progression for analytics
            analytics.trackEvent('campaign_wizard_step', {
                step: nextStep,
                step_name: steps[nextStep].label,
                business_id: businessId,
                is_edit: isEditMode,
                campaign_id: campaign?.id
            });
        }
    };

    // Handle back step
    const handleBack = () => {
        const prevStep = activeStep - 1;
        setActiveStep(prevStep);

        // Track step navigation for analytics
        analytics.trackEvent('campaign_wizard_back', {
            from_step: activeStep,
            to_step: prevStep,
            business_id: businessId,
            is_edit: isEditMode
        });
    };

    // Handle form submission - matching CampaignFormModal's submission logic
    const handleSubmit = async () => {
        try {
            // Final validation of all steps
            let isValid = true;
            for (let i = 0; i < steps.length - 1; i++) {
                if (!validateStep(i)) {
                    isValid = false;
                    setActiveStep(i);
                    break;
                }
            }

            if (!isValid) return;

            // Track form submission
            analytics.trackEvent('campaign_form_submit', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id,
                has_media: formData.media.length > 0,
                is_scheduled: formData.isScheduled
            });

            // Prepare payload - matching CampaignFormModal structure
            const payload = {
                businessId: String(businessId), // Ensure businessId is string
                name: formData.name.trim(),
                description: formData.description?.trim() || '',
                externalId: formData.externalId?.trim() || '',
                status: formData.status,
                // Only include dates if scheduling is enabled
                startDate: formData.isScheduled && formData.startDate ? formData.startDate.toISOString() : null,
                endDate: formData.isScheduled && formData.endDate ? formData.endDate.toISOString() : null,
                // Convert budget to number
                budget: formData.budget ? parseFloat(formData.budget) : 0,
                targetAudience: formData.targetAudience?.trim() || '',
                // Include media attachments - format them properly
                media: formData.media.map((m, index) => ({
                    mediaAssetId: m.id,
                    mediaType: m.type,
                    metadata: m.metadata || '',
                    sortOrder: m.sortOrder || index
                }))
            };

            let result;

            // Create or update campaign
            if (isEditMode) {
                result = await updateCampaign({
                    campaignId: campaign.id,
                    ...payload
                }).unwrap();

                enqueueSnackbar(translate('CampaignUpdatedSuccessfully'), { variant: 'success' });
            } else {
                result = await createCampaign(payload).unwrap();

                enqueueSnackbar(translate('CampaignCreatedSuccessfully'), { variant: 'success' });
            }

            // Track success
            analytics.trackEvent('campaign_save_success', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: result?.id || campaign?.id,
                has_media: formData.media.length > 0,
                is_scheduled: formData.isScheduled
            });

            // Call the onSave callback with the result
            if (onSave) {
                onSave(result);
            }

            // Close the dialog
            onClose();
        } catch (error) {
            console.error('Failed to save campaign:', error);

            // Show error message
            const errorMessage = error?.message || error?.data?.message || translate('ErrorSavingCampaign');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('campaign_save_error', {
                is_edit: isEditMode,
                business_id: businessId,
                campaign_id: campaign?.id,
                error: errorMessage
            });
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (isLoading) {
            enqueueSnackbar(translate('PleaseWaitOperationInProgress'), { variant: 'warning' });
            return;
        }

        // Track form cancellation with info about which step they were on
        analytics.trackEvent('campaign_wizard_cancel', {
            step: activeStep,
            step_name: steps[activeStep].label,
            is_edit: isEditMode,
            has_changes: JSON.stringify(formData) !== JSON.stringify(campaign || {}),
            business_id: businessId
        });

        onClose();
    };

    // Current step component
    const CurrentStepComponent = steps[activeStep].component;

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            fullWidth
            maxWidth="md"
            fullScreen={isMobile}
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
                    disabled={isLoading}
                    aria-label={translate('Close')}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* Stepper */}
            <Box sx={{ px: 3, py: 2 }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel={!isMobile}
                    orientation={isMobile ? 'vertical' : 'horizontal'}
                    sx={{ mb: isMobile ? 2 : 0 }}
                >
                    {steps.map((step, index) => (
                        <Step key={step.label} completed={index < activeStep}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {/* API error message */}
            {apiError && (
                <Box sx={{ px: 3, pt: 0, pb: 2 }}>
                    <Alert severity="error" onClose={() => {}}>
                        {apiError?.message || apiError?.data?.message || translate('ErrorSavingCampaign')}
                    </Alert>
                </Box>
            )}

            <DialogContent sx={{ pb: 1 }}>
                {/* Current step component */}
                <CurrentStepComponent
                    formData={formData}
                    onChange={handleFormChange}
                    errors={errors}
                    isEditMode={isEditMode}
                    businessId={businessId}
                />
            </DialogContent>

            <Divider sx={{ mt: 2 }} />

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Box>
                    {activeStep > 0 && (
                        <Button
                            onClick={handleBack}
                            startIcon={<BackIcon />}
                            sx={{ mr: 1 }}
                            disabled={isLoading}
                        >
                            {translate('Back')}
                        </Button>
                    )}

                    <Button
                        onClick={handleCancel}
                        color="inherit"
                        disabled={isLoading}
                    >
                        {translate('Cancel')}
                    </Button>
                </Box>

                <Box>
                    {activeStep < steps.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            variant="contained"
                            color="primary"
                            endIcon={<NextIcon />}
                            sx={{
                                ...getGlowEffect(theme => theme.palette.primary.main, 'low'),
                                transition: getAnimationDuration(300),
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            {translate('Next')}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                            sx={{
                                minWidth: 120,
                                ...getGlowEffect(theme => theme.palette.primary.main, 'low'),
                                transition: getAnimationDuration(300),
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            {isEditMode
                                ? (isLoading ? translate('Updating') : translate('Update'))
                                : (isLoading ? translate('Creating') : translate('Create'))
                            }
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

CampaignWizard.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    businessId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default React.memo(CampaignWizard);