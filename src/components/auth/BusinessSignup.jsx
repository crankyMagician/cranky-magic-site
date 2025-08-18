import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Container,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    Divider
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    useBusinessSignupMutation,
    useConfirmSignupMutation,
    useResendConfirmationMutation,
    useLoginMutation
} from "../../api/apiSlice";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import ConfirmationModal from '../common/ConfirmationModal';
import validatePassword from '../../utilities/PasswordValidator';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import useFormTracking from '../../analytics/hooks/useFormTracking';

// Helper function to generate a slug from business name
const generateSlug = (businessName) => {
    return businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const BusinessSignup = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const { getAnimationDuration } = useSpatialTheme();

    // API mutations from RTK Query - only using what's available in the API
    const [businessSignup, { isLoading: isSigningUp }] = useBusinessSignupMutation();
    const [confirmSignup, { isLoading: isConfirmingEmail }] = useConfirmSignupMutation();
    const [resendConfirmation, { isLoading: isResendingEmail }] = useResendConfirmationMutation();
    const [login] = useLoginMutation();

    // Form state
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // UI state
    const [errors, setErrors] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');

    // Add transitions for animation support
    const transitions = {
        transition: `all ${getAnimationDuration(300)}`
    };

    // Form tracking for analytics
    const formTracking = useFormTracking({
        formId: 'business-signup-form',
        formName: 'business_signup',
        fields: [
            { name: 'businessName', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'password', type: 'password' },
            { name: 'confirmPassword', type: 'password' },
            { name: 'phoneNumber', type: 'phone' },
            { name: 'address', type: 'text' },
            { name: 'city', type: 'text' },
            { name: 'state', type: 'text' },
            { name: 'zipCode', type: 'text' },
            { name: 'country', type: 'text' }
        ],
        autoStart: true
    });

    // Validation patterns
    const patterns = {
        businessName: /^[a-zA-Z0-9\s\-.,&'()]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneNumber: /^\+?[\d\s-()]{10,}$/,
        zipCode: /^[a-zA-Z0-9\s-]{3,10}$/,
        text: /^[a-zA-Z0-9\s\-.,#]+$/
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'businessName':
                if (!value) return translate('BusinessSignupErrorBusinessNameRequired');
                if (!patterns.businessName.test(value)) return translate('BusinessSignupErrorInvalidBusinessName');
                if (value.length < 2) return translate('BusinessSignupErrorBusinessNameTooShort');
                break;
            case 'email':
                if (!value) return translate('BusinessSignupErrorEmailRequired');
                if (!patterns.email.test(value)) return translate('BusinessSignupErrorInvalidEmail');
                break;
            case 'password':
                if (!value) return translate('BusinessSignupErrorPasswordRequired');
                // Use our password validator
                const passwordValidation = validatePassword(value);
                if (!passwordValidation.success) return passwordValidation.message;
                break;
            case 'confirmPassword':
                if (!value) return translate('BusinessSignupErrorConfirmPasswordRequired');
                if (value !== formData.password) return translate('BusinessSignupErrorPasswordsDontMatch');
                break;
            case 'phoneNumber':
                if (!value) return translate('BusinessSignupErrorPhoneRequired');
                if (!patterns.phoneNumber.test(value)) return translate('BusinessSignupErrorInvalidPhone');
                break;
            case 'zipCode':
                if (value && !patterns.zipCode.test(value)) return translate('BusinessSignupErrorInvalidZipCode');
                break;
            default:
                if (value && !patterns.text.test(value)) return translate('BusinessSignupErrorInvalidText');
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        // Track form field interaction using formTracking
        if (formTracking && formTracking.handleFieldChange) {
            formTracking.handleFieldChange(name, name.includes('password') ? 'password' : 'text', value);
        }
    };

    const handleFieldFocus = (name) => {
        const fieldType = name.includes('password') ? 'password' :
            name === 'email' ? 'email' :
                name === 'phoneNumber' ? 'phone' : 'text';
        if (formTracking && formTracking.handleFieldFocus) {
            formTracking.handleFieldFocus(name, fieldType);
        }
    };

    const handleFieldBlur = (name, value) => {
        const fieldType = name.includes('password') ? 'password' :
            name === 'email' ? 'email' :
                name === 'phoneNumber' ? 'phone' : 'text';
        if (formTracking && formTracking.handleFieldBlur) {
            formTracking.handleFieldBlur(name, fieldType, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Track form submission attempt
        if (formTracking && formTracking.handleSubmitAttempt) {
            formTracking.handleSubmitAttempt(true);
        }
        analytics.trackEvent('business_signup_submit_attempt');

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Track validation failure
            if (formTracking && formTracking.handleValidationErrors) {
                formTracking.handleValidationErrors(newErrors);
            }
            analytics.trackEvent('business_signup_validation_error', {
                fieldErrors: Object.keys(newErrors)
            });
            return;
        }

        try {
            const businessSlug = generateSlug(formData.businessName);
            const signupPayload = {
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                businessName: formData.businessName,
                businessSlug,
                businessDescription: `${formData.businessName} - ${formData.city}, ${formData.state}`,
                // Include address info
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country
            };

            // Track successful form submission
            if (formTracking && formTracking.handleSubmitSuccess) {
                formTracking.handleSubmitSuccess();
            }
            analytics.trackEvent('business_signup_submitted', {
                businessName: formData.businessName,
                hasPhoneNumber: !!formData.phoneNumber,
                hasAddress: !!formData.address
            });

            const response = await businessSignup(signupPayload).unwrap();

            if (response.requiresConfirmation) {
                // Track confirmation requirement
                analytics.trackEvent('business_signup_confirmation_required');
                setShowConfirmationModal(true);
            } else if (response.token) {
                // If we got a token, we're already logged in
                analytics.trackEvent('business_signup_success', {
                    autoLogin: true
                });
                navigate('/dashboard');
            }
        } catch (error) {
            // Track signup failure
            if (formTracking && formTracking.handleSubmitFailure) {
                formTracking.handleSubmitFailure(error);
            }
            analytics.trackEvent('business_signup_failure', {
                reason: error.data?.error || 'Unknown error',
                status: error.status
            });

            setErrors(prev => ({
                ...prev,
                submit: error.data?.error || translate('BusinessSignupErrorGeneral')
            }));
        }
    };

    const handleConfirmationSubmit = async () => {
        try {
            // Track email confirmation attempt
            analytics.trackEvent('business_email_confirmation_attempt');

            // Include password in confirmation request as required by API
            const response = await confirmSignup({
                email: formData.email,
                confirmationCode,
                password: formData.password // Adding password to the request
            }).unwrap();

            // Track successful email confirmation
            analytics.trackEvent('business_email_confirmation_success');

            // Proceed to login
            completeSignupAndLogin();
        } catch (error) {
            // Track confirmation failure
            analytics.trackEvent('business_email_confirmation_failure', {
                reason: error.data?.error || 'Unknown error',
                status: error.status
            });

            setErrors(prev => ({
                ...prev,
                confirmation: error.data?.error || translate('BusinessSignupErrorConfirmation')
            }));
        }
    };

    const completeSignupAndLogin = async () => {
        setShowConfirmationModal(false);

        // After confirmation, attempt to log in
        try {
            // Track auto-login attempt
            analytics.trackEvent('business_signup_auto_login_attempt');

            const loginResponse = await login({
                email: formData.email,
                password: formData.password
            }).unwrap();

            if (loginResponse.token) {
                // Track successful login after signup
                analytics.trackEvent('business_signup_complete_with_login');

                navigate('/dashboard');
            }
        } catch (loginError) {
            // Track login failure after signup
            analytics.trackEvent('business_signup_login_failure', {
                reason: loginError.data?.error || 'Unknown error',
                status: loginError.status
            });

            setErrors(prev => ({
                ...prev,
                submit: loginError.data?.error || translate('LoginErrorGeneral')
            }));
        }
    };

    const handleResendCode = async () => {
        try {
            // Track code resend attempt
            analytics.trackEvent('business_email_code_resend');

            await resendConfirmation({ email: formData.email }).unwrap();

            // Show success message
            setErrors(prev => ({
                ...prev,
                confirmation: translate('BusinessSignupConfirmationCodeResent')
            }));
        } catch (error) {
            // Track resend failure
            analytics.trackEvent('business_email_code_resend_failure', {
                reason: error.data?.error || 'Unknown error'
            });

            setErrors(prev => ({
                ...prev,
                confirmation: error.data?.error || translate('BusinessSignupErrorResendCode')
            }));
        }
    };

    // Render the business signup form
    return (
        <Container maxWidth="md">
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, sm: 4 },
                    mt: 4,
                    mb: 4,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                    ...transitions
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        {translate('BusinessSignupTitle')}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ textAlign: 'center' }}
                    >
                        {translate('BusinessSignupSubtitle') || 'Create your business account to get started with our services'}
                    </Typography>
                </Box>

                {errors.submit && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        onClose={() => setErrors(prev => ({ ...prev, submit: null }))}
                        role="alert"
                    >
                        {errors.submit}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} noValidate aria-label={translate('BusinessSignupTitle')}>
                    <Typography
                        variant="body2"
                        paragraph
                        sx={{ mb: 3 }}
                    >
                        {translate('BusinessSignupInstructions') || 'Please fill out the form below to create your business account. Fields marked with * are required.'}
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Account Credentials Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {translate('AccountCredentials') || 'Account Credentials'}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupEmail')}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('email')}
                                onBlur={() => handleFieldBlur('email', formData.email)}
                                error={!!errors.email}
                                helperText={errors.email}
                                variant="outlined"
                                required
                                inputProps={{
                                    'aria-label': translate('BusinessSignupEmail')
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupPhoneNumber')}
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('phoneNumber')}
                                onBlur={() => handleFieldBlur('phoneNumber', formData.phoneNumber)}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                                variant="outlined"
                                required
                                inputProps={{
                                    'aria-label': translate('BusinessSignupPhoneNumber')
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupPassword')}
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('password')}
                                onBlur={() => handleFieldBlur('password', formData.password)}
                                error={!!errors.password}
                                helperText={errors.password || translate('BusinessSignupPasswordRequirements')}
                                variant="outlined"
                                required
                                inputProps={{
                                    'aria-label': translate('BusinessSignupPassword')
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                aria-label={showPassword ? 'hide password' : 'show password'}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupConfirmPassword')}
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('confirmPassword')}
                                onBlur={() => handleFieldBlur('confirmPassword', formData.confirmPassword)}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                variant="outlined"
                                required
                                inputProps={{
                                    'aria-label': translate('BusinessSignupConfirmPassword')
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                                aria-label={showConfirmPassword ? 'hide password' : 'show password'}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Business Information Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                                {translate('BusinessDetails') || 'Business Information'}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupBusinessName')}
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('businessName')}
                                onBlur={() => handleFieldBlur('businessName', formData.businessName)}
                                error={!!errors.businessName}
                                helperText={errors.businessName}
                                variant="outlined"
                                required
                                inputProps={{
                                    'aria-label': translate('BusinessSignupBusinessName')
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupAddress')}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('address')}
                                onBlur={() => handleFieldBlur('address', formData.address)}
                                error={!!errors.address}
                                helperText={errors.address}
                                variant="outlined"
                                inputProps={{
                                    'aria-label': translate('BusinessSignupAddress')
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupCity')}
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('city')}
                                onBlur={() => handleFieldBlur('city', formData.city)}
                                error={!!errors.city}
                                helperText={errors.city}
                                variant="outlined"
                                inputProps={{
                                    'aria-label': translate('BusinessSignupCity')
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupState')}
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('state')}
                                onBlur={() => handleFieldBlur('state', formData.state)}
                                error={!!errors.state}
                                helperText={errors.state}
                                variant="outlined"
                                inputProps={{
                                    'aria-label': translate('BusinessSignupState')
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupZipCode')}
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('zipCode')}
                                onBlur={() => handleFieldBlur('zipCode', formData.zipCode)}
                                error={!!errors.zipCode}
                                helperText={errors.zipCode}
                                variant="outlined"
                                inputProps={{
                                    'aria-label': translate('BusinessSignupZipCode')
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupCountry')}
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('country')}
                                onBlur={() => handleFieldBlur('country', formData.country)}
                                error={!!errors.country}
                                helperText={errors.country}
                                variant="outlined"
                                inputProps={{
                                    'aria-label': translate('BusinessSignupCountry')
                                }}
                            />
                        </Grid>

                        {/* Submit Button Section */}
                        <Grid item xs={12}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 3,
                                mb: 2
                            }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={isSigningUp}
                                    sx={{
                                        minWidth: 200,
                                        py: 1.5,
                                        px: 4,
                                        fontSize: 16,
                                        borderRadius: 1
                                    }}
                                    aria-label={translate('BusinessSignupSubmitButton')}
                                >
                                    {isSigningUp ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        translate('BusinessSignupSubmitButton')
                                    )}
                                </Button>
                            </Box>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                align="center"
                                sx={{ mt: 2 }}
                            >
                                {translate('BusinessSignupTermsAgreement') ||
                                    'By creating an account, you agree to our Terms of Service and Privacy Policy.'}
                            </Typography>
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button
                                    variant="text"
                                    color="primary"
                                    onClick={() => navigate('/login')}
                                >
                                    {translate('AlreadyHaveAccount') || 'Already have an account? Sign in'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Confirmation Modal - Only for email confirmation */}
            <ConfirmationModal
                open={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={handleConfirmationSubmit}
                onResendCode={handleResendCode}
                title={translate('BusinessSignupConfirmEmailTitle')}
                description={translate('BusinessSignupConfirmEmailInstructions', { email: formData.email })}
                confirmationCode={confirmationCode}
                setConfirmationCode={(value) => {
                    setConfirmationCode(value);
                    if (formTracking && formTracking.handleFieldChange) {
                        formTracking.handleFieldChange('emailConfirmationCode', 'text', value);
                    }
                }}
                isLoading={isConfirmingEmail}
                error={errors.confirmation}
                isResending={isResendingEmail}
                confirmButtonText={translate('ConfirmSignup')}
                confirmationCodeLabel={translate('ConfirmationCode')}
            />
        </Container>
    );
};

export default React.memo(BusinessSignup);