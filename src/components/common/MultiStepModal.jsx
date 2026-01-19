import React, { useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    LinearProgress,
    useMediaQuery
} from '@mui/material';
import { Close as CloseIcon, ChevronLeft as BackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useAppTheme } from '../../hooks/useAppTheme';

/**
 * MultiStepModal - A reusable multi-step modal component
 * Integrates with analytics, theme, and translation systems
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {Array} props.steps - Array of step objects: { label, component, validation? }
 * @param {function} props.onNext - Function to call when next/complete is clicked
 * @param {function} props.onBack - Function to call when back is clicked
 * @param {function} props.onSkip - Function to call when skip is clicked
 * @param {number} props.activeStep - Current active step index
 * @param {boolean} props.loading - Whether the modal is in loading state
 * @param {string} props.error - Error message to display
 * @param {Object} props.stepErrors - Step-specific errors object
 * @param {Object} props.analytics - Analytics configuration: { eventPrefix, formId, formName }
 * @param {number} props.maxWidth - Maximum width of modal (sm, md, lg, xl)
 * @param {boolean} props.showProgress - Whether to show progress indicator
 * @param {boolean} props.allowBack - Whether to allow going back to previous steps
 * @param {boolean} props.allowSkip - Whether to allow skipping optional steps
 */
const MultiStepModal = ({
    open,
    onClose,
    title,
    steps = [],
    onNext,
    onBack,
    onSkip,
    activeStep = 0,
    loading = false,
    error = null,
    stepErrors = {},
    analytics = {},
    maxWidth = 'md',
    showProgress = true,
    allowBack = true,
    allowSkip = false,
    ...props
}) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const analyticsHook = useAnalytics();
    const { getAnimationDuration, getGlassMorphismStyle, getGlowEffect } = useAppTheme();

    // Responsive breakpoints
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // Analytics configuration
    const analyticsConfig = useMemo(() => ({
        eventPrefix: 'multi_step_modal',
        formId: 'multi-step-form',
        formName: 'multi_step_process',
        ...analytics
    }), [analytics]);

    // Animation configuration
    const transitions = {
        transition: `all ${getAnimationDuration(300)}`
    };

    // Track step changes for analytics
    useEffect(() => {
        if (open) {
            analyticsHook.trackEvent(`${analyticsConfig.eventPrefix}_step_viewed`, {
                formId: analyticsConfig.formId,
                stepIndex: activeStep,
                stepLabel: steps[activeStep]?.label || `Step ${activeStep + 1}`
            });
        }
    }, [activeStep, open, analyticsConfig, analyticsHook, steps]);

    const handleNext = () => {
        analyticsHook.trackEvent(`${analyticsConfig.eventPrefix}_step_attempt`, {
            formId: analyticsConfig.formId,
            stepIndex: activeStep,
            stepLabel: steps[activeStep]?.label || `Step ${activeStep + 1}`
        });
        
        if (onNext) {
            onNext();
        }
    };

    const handleBack = () => {
        analyticsHook.trackEvent(`${analyticsConfig.eventPrefix}_step_back`, {
            formId: analyticsConfig.formId,
            fromStep: activeStep,
            toStep: activeStep - 1
        });
        
        if (onBack) {
            onBack();
        }
    };

    const handleSkip = () => {
        analyticsHook.trackEvent(`${analyticsConfig.eventPrefix}_step_skipped`, {
            formId: analyticsConfig.formId,
            stepIndex: activeStep,
            stepLabel: steps[activeStep]?.label || `Step ${activeStep + 1}`
        });
        
        if (onSkip) {
            onSkip();
        }
    };

    const handleClose = () => {
        analyticsHook.trackEvent(`${analyticsConfig.eventPrefix}_cancelled`, {
            formId: analyticsConfig.formId,
            stepIndex: activeStep
        });
        
        if (onClose) {
            onClose();
        }
    };

    const currentStep = steps[activeStep];
    const isLastStep = activeStep === steps.length - 1;
    const canGoBack = allowBack && activeStep > 0;
    const canSkip = allowSkip && currentStep?.optional;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    ...getGlassMorphismStyle(0.95),
                    backgroundColor: 'rgba(20, 16, 25, 0.98)',
                    border: isMobile ? 'none' : '1px solid rgba(109, 64, 169, 0.3)',
                    borderRadius: isMobile ? 0 : 2,
                    boxShadow: isMobile ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.4)',
                    ...transitions
                }
            }}
            {...props}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 2,
                borderBottom: '1px solid rgba(109, 64, 169, 0.2)'
            }}>
                <Typography
                    variant="h5"
                    component="span"
                    sx={{
                        fontWeight: 600,
                        color: 'common.white',
                        ...getGlowEffect(theme.palette.primary.main, 'low')
                    }}
                >
                    {title}
                </Typography>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    aria-label={translate('Close') || 'Close'}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{
                pb: 1,
                color: 'common.white',
                pt: isMobile ? 2 : 3,
                px: isMobile ? 2 : 3
            }}>
                {/* Progress indicator */}
                {showProgress && (
                    <Box sx={{ mb: 3 }}>
                        <LinearProgress
                            variant="determinate"
                            value={(activeStep / (steps.length - 1)) * 100}
                            sx={{
                                mb: 2,
                                height: isMobile ? 8 : 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(109, 64, 169, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.palette.info.main,
                                    borderRadius: 3
                                }
                            }}
                        />

                        {/* Mobile: Simplified step indicator */}
                        {isMobile || isTablet ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                                py: 1
                            }}>
                                {/* Step dots */}
                                <Box sx={{
                                    display: 'flex',
                                    gap: 0.75,
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    maxWidth: '100%',
                                    px: 2
                                }}>
                                    {steps.map((step, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: index === activeStep ? 24 : 10,
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: index < activeStep
                                                    ? theme.palette.success.main
                                                    : index === activeStep
                                                        ? theme.palette.info.main
                                                        : 'rgba(109, 64, 169, 0.4)',
                                                transition: 'all 0.3s ease',
                                                ...(index === activeStep && {
                                                    boxShadow: `0 0 8px ${theme.palette.info.main}80`
                                                })
                                            }}
                                        />
                                    ))}
                                </Box>

                                {/* Current step label */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: 'common.white',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        mt: 1
                                    }}
                                >
                                    {currentStep?.label || `${translate('Step')} ${activeStep + 1}`}
                                </Typography>
                            </Box>
                        ) : (
                            /* Desktop: Full horizontal stepper */
                            <Stepper
                                activeStep={activeStep}
                                alternativeLabel
                                sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                        color: theme.palette.success.main
                                    },
                                    '& .MuiStepLabel-root .Mui-active': {
                                        color: theme.palette.info.main,
                                        ...getGlowEffect(theme.palette.info.main, 'low')
                                    },
                                    '& .MuiStepLabel-label': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.75rem'
                                    },
                                    '& .MuiStepLabel-label.Mui-active': {
                                        color: 'common.white'
                                    },
                                    '& .MuiStepLabel-label.Mui-completed': {
                                        color: 'rgba(255, 255, 255, 0.9)'
                                    },
                                    '& .MuiStepIcon-root': {
                                        color: 'rgba(109, 64, 169, 0.5)'
                                    }
                                }}
                            >
                                {steps.map((step, index) => (
                                    <Step key={index}>
                                        <StepLabel>
                                            {step.label || `${translate('Step')} ${index + 1}`}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )}
                    </Box>
                )}

                {/* Error display */}
                {(error || stepErrors[activeStep]) && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {(() => {
                            const errorToDisplay = error || stepErrors[activeStep];
                            // Handle case where error might be an object with message/code
                            if (typeof errorToDisplay === 'object' && errorToDisplay !== null) {
                                return errorToDisplay.message || errorToDisplay.error || JSON.stringify(errorToDisplay);
                            }
                            return errorToDisplay;
                        })()}
                    </Alert>
                )}

                {/* Current step content */}
                {currentStep && (
                    <Box sx={{ minHeight: 200, ...transitions }}>
                        {currentStep.component}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{
                px: isMobile ? 2 : 3,
                pb: isMobile ? 2 : 3,
                pt: 2,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? 2 : 0,
                borderTop: '1px solid rgba(109, 64, 169, 0.2)'
            }}>
                {/* Mobile layout: Primary action on top, secondary below */}
                {isMobile ? (
                    <>
                        {/* Primary action button - full width on mobile */}
                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleNext}
                            disabled={loading}
                            fullWidth
                            sx={{
                                py: 1.5,
                                fontWeight: 800,
                                fontSize: '1rem',
                                color: '#0f0f0f',
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(69,147,255,0.4)',
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                isLastStep ?
                                    (translate('Complete') || 'Complete') :
                                    (translate('Next') || 'Next')
                            )}
                        </Button>

                        {/* Secondary actions row */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <Box>
                                {canGoBack && (
                                    <Button
                                        onClick={handleBack}
                                        disabled={loading}
                                        startIcon={<BackIcon />}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            '&:hover': {
                                                color: 'common.white',
                                                backgroundColor: 'rgba(109, 64, 169, 0.2)'
                                            }
                                        }}
                                    >
                                        {translate('Back') || 'Back'}
                                    </Button>
                                )}
                                {canSkip && (
                                    <Button
                                        onClick={handleSkip}
                                        disabled={loading}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            '&:hover': {
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                backgroundColor: 'rgba(109, 64, 169, 0.15)'
                                            }
                                        }}
                                    >
                                        {translate('Skip') || 'Skip'}
                                    </Button>
                                )}
                            </Box>

                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {activeStep + 1} / {steps.length}
                            </Typography>
                        </Box>
                    </>
                ) : (
                    /* Desktop layout */
                    <>
                        <Box>
                            {canGoBack && (
                                <Button
                                    onClick={handleBack}
                                    disabled={loading}
                                    sx={{
                                        mr: 1,
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': {
                                            color: 'common.white',
                                            backgroundColor: 'rgba(109, 64, 169, 0.2)'
                                        }
                                    }}
                                >
                                    {translate('Back') || 'Back'}
                                </Button>
                            )}
                            {canSkip && (
                                <Button
                                    onClick={handleSkip}
                                    disabled={loading}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        '&:hover': {
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            backgroundColor: 'rgba(109, 64, 169, 0.15)'
                                        }
                                    }}
                                >
                                    {translate('Skip') || 'Skip'}
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {activeStep + 1} {translate('of')} {steps.length}
                            </Typography>

                            <Button
                                variant="contained"
                                color="info"
                                onClick={handleNext}
                                disabled={loading}
                                sx={{
                                    minWidth: 120,
                                    px: 3.5,
                                    py: 1.25,
                                    fontWeight: 800,
                                    color: '#0f0f0f',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(69,147,255,0.4)',
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    isLastStep ?
                                        (translate('Complete') || 'Complete') :
                                        (translate('Next') || 'Next')
                                )}
                            </Button>
                        </Box>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default MultiStepModal;
