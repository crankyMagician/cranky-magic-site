import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Container,
    Grid,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    InputAdornment
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person as PersonIcon,
    Business as BusinessIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// Import application hooks and utilities
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useAuth } from '../../hooks/useAuth';
import validatePassword from '../../utilities/PasswordValidator';

// Import API hooks from your existing API file
import {
    useVerifyInvitationQuery,
    useAcceptInvitationMutation
} from '../../api/invitationApi';

// Main component
const InvitationLanding = () => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { getGlassMorphismStyle, getGlowEffect, isDark, themePrefs } = useSpatialTheme();
    const { isAuthenticated } = useAuth();

    // Extract token from URL query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    // State variables
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    // Define steps
    const steps = [
        translate('VerifyInvitation'),
        translate('CreateAccount'),
        translate('Complete')
    ];

    // Query to verify the invitation token - Updated to handle ServiceResponse
    const {
        data: invitationData,
        isLoading: isVerifying,
        isError: isVerifyError,
        error: verifyError,
        refetch: refetchVerification
    } = useVerifyInvitationQuery(token, {
        skip: !token
    });

    // Mutation to accept the invitation
    const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();

    // Form hook for the password form
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        getValues,
        setValue
    } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    // Watch password for validation
    const watchPassword = watch('password');

    // Determine initial active step based on URL
    useEffect(() => {
        if (!token) {
            setActiveStep(0);
        } else if (invitationData?.isValid) {
            setActiveStep(1);
        }
    }, [token, invitationData]);

    // Track page view
    useEffect(() => {
        // Track invitation landing
        analytics.trackEvent('invitation_landing_view', {
            hasToken: !!token
        });
    }, [analytics, token]);

    // Handle accepting invitation
    const handleAcceptInvitation = async (data) => {
        if (!token) return;

        try {
            // Validate password
            const passwordValidation = validatePassword(data.password);
            if (!passwordValidation.success) {
                enqueueSnackbar(passwordValidation.message, { variant: 'error' });
                return;
            }

            // Track form submission
            analytics.trackEvent('invitation_accept_attempt', {
                hasToken: !!token
            });

            // Call API to accept invitation
            const response = await acceptInvitation({
                token,
                password: data.password,
                confirmPassword: data.confirmPassword
            }).unwrap();

            // Track successful invitation acceptance
            analytics.trackEvent('invitation_accepted', {
                businessId: invitationData?.businessId
            });

            // Move to complete step
            setActiveStep(2);

            // Show success message
            enqueueSnackbar(translate('InvitationAcceptedSuccessfully'), { variant: 'success' });
        } catch (error) {
            console.error('Error accepting invitation:', error);

            // Show error message - Updated error handling for ServiceResponse
            const errorMessage = error?.message || error?.data?.message || translate('ErrorAcceptingInvitation');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'accept_invitation',
                error: errorMessage
            });
        }
    };

    // Handle toggling password visibility
    const handleTogglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // Handle going to login
    const handleGoToLogin = () => {
        navigate('/login');

        // Track navigation
        analytics.trackEvent('navigation', {
            from: 'invitation_landing',
            to: 'login'
        });
    };

    // Show loading state while verifying
    if (isVerifying) {
        return (
            <Container maxWidth="md">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '70vh',
                        padding: 4
                    }}
                >
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {translate('VerifyingInvitation')}
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Handle no token or invalid token
    if (!token || (isVerifyError && activeStep === 0)) {
        // Extract error message from ServiceResponse error structure
        const errorMessage = verifyError?.message || verifyError?.data?.message || translate('InvitationTokenInvalidOrExpired');

        return (
            <Container maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        ...getGlassMorphismStyle(0.8),
                        p: { xs: 3, sm: 4 },
                        my: 4,
                        borderRadius: 2,
                        ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {translate('InvalidInvitation')}
                        </Typography>
                    </Box>

                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errorMessage}
                    </Alert>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGoToLogin}
                            sx={{
                                ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                            }}
                        >
                            {translate('GoToLogin')}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper
                elevation={3}
                sx={{
                    ...getGlassMorphismStyle(0.8),
                    p: { xs: 3, sm: 4 },
                    my: 4,
                    borderRadius: 2,
                    ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                }}
            >
                {/* Stepper */}
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Verify Invitation Step (should be already done via query) */}
                {activeStep === 0 && (
                    <Box>
                        <Typography variant="h5" gutterBottom textAlign="center">
                            {translate('VerifyingInvitation')}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <CircularProgress />
                        </Box>
                    </Box>
                )}

                {/* Create Account Step */}
                {activeStep === 1 && invitationData && (
                    <Box>
                        <Typography variant="h5" gutterBottom textAlign="center">
                            {translate('CreateYourAccount')}
                        </Typography>

                        <Box sx={{ my: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        {translate('YouHaveBeenInvitedToJoin', {
                                            businessName: invitationData.businessName,
                                            role: invitationData.businessRoleName
                                        })}
                                    </Alert>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        {translate('InviteeInfo')}:
                                    </Typography>
                                    <Box sx={{ pl: 2, py: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography><strong>{translate('Name')}:</strong> {invitationData.firstName} {invitationData.lastName}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography><strong>{translate('Email')}:</strong> {invitationData.email}</Typography>
                                        </Box>
                                        <Typography><strong>{translate('Role')}:</strong> {invitationData.businessRoleName}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        {translate('BusinessInfo')}:
                                    </Typography>
                                    <Box sx={{ pl: 2, py: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography><strong>{translate('BusinessName')}:</strong> {invitationData.businessName}</Typography>
                                        </Box>
                                        <Typography><strong>{translate('BusinessId')}:</strong> {invitationData.businessId}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <form onSubmit={handleSubmit(handleAcceptInvitation)}>
                            <Typography variant="h6" gutterBottom>
                                {translate('SetYourPassword')}
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: translate('PasswordRequired'),
                                        validate: value => {
                                            const validation = validatePassword(value);
                                            return validation.success || validation.message;
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('Password')}
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleTogglePasswordVisibility}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        required: translate('ConfirmPasswordRequired'),
                                        validate: value => value === watchPassword || translate('PasswordsMustMatch')
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('ConfirmPassword')}
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleTogglePasswordVisibility}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isAccepting}
                                    startIcon={isAccepting ? <CircularProgress size={20} /> : null}
                                    sx={{
                                        ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                                    }}
                                >
                                    {isAccepting ? translate('Creating') : translate('CreateAccount')}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                )}

                {/* Complete Step */}
                {activeStep === 2 && (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            {translate('InvitationAccepted')}
                        </Typography>

                        <Alert severity="success" sx={{ my: 3 }}>
                            {translate('AccountCreatedSuccessfully')}
                        </Alert>

                        <Typography paragraph>
                            {translate('YouCanNowLoginToYourAccount')}
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleGoToLogin}
                                sx={{
                                    ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                                }}
                            >
                                {translate('GoToLogin')}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default InvitationLanding;