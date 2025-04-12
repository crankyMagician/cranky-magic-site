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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    useBusinessSignupMutation,
    useConfirmSignupMutation,
    useConfirmPhoneMutation,
    useResendConfirmationMutation,
    useResendPhoneConfirmationMutation,
    useLoginMutation
} from "../../api/apiSlice";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import ConfirmationModal from '../common/ConfirmationModal';
import validatePassword from '../../utilities/PasswordValidator';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

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
    const { getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();

    // API mutations from RTK Query
    const [businessSignup, { isLoading: isSigningUp }] = useBusinessSignupMutation();
    const [confirmSignup, { isLoading: isConfirmingEmail }] = useConfirmSignupMutation();
    const [confirmPhone, { isLoading: isConfirmingPhone }] = useConfirmPhoneMutation();
    const [resendConfirmation, { isLoading: isResendingEmail }] = useResendConfirmationMutation();
    const [resendPhoneConfirmation, { isLoading: isResendingPhone }] = useResendPhoneConfirmationMutation();
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
        country: '',
        preferredMfaMethod: 'email' // Default to email
    });

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // UI state
    const [errors, setErrors] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [signupData, setSignupData] = useState(null);

    // Step state
    const [confirmStep, setConfirmStep] = useState('email'); // 'email' or 'phone'
    const [phoneConfirmed, setPhoneConfirmed] = useState(false);
    const [phoneConfirmationCode, setPhoneConfirmationCode] = useState('');

    // For analytics: track page view
    useEffect(() => {
        analytics.trackPageView({
            pageName: 'BusinessSignup',
            path: location.pathname
        });
    }, [analytics, location.pathname]);

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
            case 'preferredMfaMethod':
                if (!value) return translate('PreferredMfaMethodRequired');
                if (value === 'phone' && !formData.phoneNumber) {
                    return translate('PhoneNumberRequiredForMfa');
                }
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

        // Track form field interaction for analytics
        analytics.trackFormFieldInteraction('business_signup', name, {
            hasError: !!error
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Track form submission attempt
        analytics.trackEvent('business_signup_submit_attempt');

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        // Specific validation: if phone MFA is selected, phone must be provided
        if (formData.preferredMfaMethod === 'phone' && !formData.phoneNumber) {
            newErrors.phoneNumber = translate('PhoneNumberRequiredForMfa');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Track validation failure
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
                preferredMfaMethod: formData.preferredMfaMethod,
                // Add location data for analytics
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country
            };

            // Track successful form submission
            analytics.trackEvent('business_signup_submitted', {
                businessName: formData.businessName,
                mfaMethod: formData.preferredMfaMethod,
                hasPhoneNumber: !!formData.phoneNumber,
                hasAddress: !!formData.address
            });

            const response = await businessSignup(signupPayload).unwrap();

            if (response.requiresConfirmation) {
                // Track confirmation requirement
                analytics.trackEvent('business_signup_confirmation_required');

                setSignupData(signupPayload); // Store signup data for later use
                setShowConfirmationModal(true);
                // Default to email confirmation first, then do phone if needed
                setConfirmStep('email');
            } else if (response.token) {
                // If we got a token, we're already logged in
                analytics.trackEvent('business_signup_success', {
                    autoLogin: true
                });
                navigate('/dashboard');
            }
        } catch (error) {
            // Track signup failure
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
            // First confirm email
            if (confirmStep === 'email') {
                // Track email confirmation attempt
                analytics.trackEvent('business_email_confirmation_attempt');

                const response = await confirmSignup({
                    email: formData.email,
                    confirmationCode,
                }).unwrap();

                // Track successful email confirmation
                analytics.trackEvent('business_email_confirmation_success');

                // If phone is provided and not yet confirmed, move to phone confirmation
                if (formData.phoneNumber && !phoneConfirmed) {
                    setConfirmStep('phone');
                    return;
                }

                // Otherwise proceed to login
                completeSignupAndLogin();
            }
            // Then confirm phone if needed
            else if (confirmStep === 'phone') {
                // Track phone confirmation attempt
                analytics.trackEvent('business_phone_confirmation_attempt');

                const response = await confirmPhone({
                    phoneNumber: formData.phoneNumber,
                    confirmationCode: phoneConfirmationCode,
                }).unwrap();

                // Track successful phone confirmation
                analytics.trackEvent('business_phone_confirmation_success');

                setPhoneConfirmed(true);
                completeSignupAndLogin();
            }
        } catch (error) {
            // Track confirmation failure
            analytics.trackEvent(`business_${confirmStep}_confirmation_failure`, {
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

    const handleResendPhoneCode = async () => {
        try {
            // Track phone code resend attempt
            analytics.trackEvent('business_phone_code_resend');

            await resendPhoneConfirmation({ phoneNumber: formData.phoneNumber }).unwrap();

            // Show success message
            setErrors(prev => ({
                ...prev,
                confirmation: translate('PhoneConfirmationCodeResent')
            }));
        } catch (error) {
            // Track phone resend failure
            analytics.trackEvent('business_phone_code_resend_failure', {
                reason: error.data?.error || 'Unknown error'
            });

            setErrors(prev => ({
                ...prev,
                confirmation: error.data?.error || translate('ResendPhoneCodeError')
            }));
        }
    };

    // Render confirmation modal content based on current step
    const renderConfirmationModalContent = () => {
        if (confirmStep === 'email') {
            return (
                <>
                    <Typography variant="h6" gutterBottom>
                        {translate('BusinessSignupConfirmEmailTitle')}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {translate('BusinessSignupConfirmEmailInstructions', { email: formData.email })}
                    </Typography>
                    <TextField
                        fullWidth
                        label={translate('ConfirmationCode')}
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        margin="normal"
                        error={!!errors.confirmation && !errors.confirmation.includes('sent')}
                        helperText={errors.confirmation}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            onClick={handleResendCode}
                            disabled={isResendingEmail}
                            startIcon={isResendingEmail ? <CircularProgress size={16} /> : null}
                        >
                            {isResendingEmail ?
                                translate('ResendingCode') :
                                translate('ResendCode')
                            }
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirmationSubmit}
                            disabled={!confirmationCode || isConfirmingEmail}
                            endIcon={isConfirmingEmail ? <CircularProgress size={16} color="inherit" /> : null}
                            sx={getGlowEffect(theme.palette.primary.main, 'low')}
                        >
                            {isConfirmingEmail ?
                                <CircularProgress size={24} color="inherit" /> :
                                translate('ConfirmSignup')
                            }
                        </Button>
                    </Box>
                </>
            );
        } else if (confirmStep === 'phone') {
            return (
                <>
                    <Typography variant="h6" gutterBottom>
                        {translate('BusinessSignupConfirmPhoneTitle')}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {translate('BusinessSignupConfirmPhoneInstructions', { phone: formData.phoneNumber })}
                    </Typography>
                    <TextField
                        fullWidth
                        label={translate('PhoneConfirmationCode')}
                        value={phoneConfirmationCode}
                        onChange={(e) => setPhoneConfirmationCode(e.target.value)}
                        margin="normal"
                        error={!!errors.confirmation && !errors.confirmation.includes('sent')}
                        helperText={errors.confirmation}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            onClick={handleResendPhoneCode}
                            disabled={isResendingPhone}
                            startIcon={isResendingPhone ? <CircularProgress size={16} /> : null}
                        >
                            {isResendingPhone ?
                                translate('ResendingCode') :
                                translate('ResendCode')
                            }
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirmationSubmit}
                            disabled={!phoneConfirmationCode || isConfirmingPhone}
                            endIcon={isConfirmingPhone ? <CircularProgress size={16} color="inherit" /> : null}
                            sx={getGlowEffect(theme.palette.primary.main, 'low')}
                        >
                            {isConfirmingPhone ?
                                <CircularProgress size={24} color="inherit" /> :
                                translate('ConfirmPhone')
                            }
                        </Button>
                    </Box>
                </>
            );
        }
        return null;
    };

    // Render the business signup form
    return (
        <Container maxWidth="md">
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 4 },
                    mt: 4,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius * 2,
                    boxShadow: theme.shadows[3],
                    ...getGlassMorphismStyle(0.8)
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: theme.palette.primary.main,
                        textAlign: 'center',
                        mb: 4,
                        fontWeight: theme.typography.fontWeightBold
                    }}
                >
                    {translate('BusinessSignupTitle')}
                </Typography>

                {errors.submit && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        onClose={() => setErrors(prev => ({ ...prev, submit: null }))}
                    >
                        {errors.submit}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupBusinessName')}
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                error={!!errors.businessName}
                                helperText={errors.businessName}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupEmail')}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupPhoneNumber')}
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                                variant="outlined"
                                required
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
                                error={!!errors.password}
                                helperText={errors.password || translate('BusinessSignupPasswordRequirements')}
                                variant="outlined"
                                required
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
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                variant="outlined"
                                required
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

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupAddress')}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupCity')}
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={!!errors.city}
                                helperText={errors.city}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupState')}
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={!!errors.state}
                                helperText={errors.state}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupZipCode')}
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                error={!!errors.zipCode}
                                helperText={errors.zipCode}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupCountry')}
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                error={!!errors.country}
                                helperText={errors.country}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl
                                fullWidth
                                error={!!errors.preferredMfaMethod}
                                variant="outlined"
                            >
                                <InputLabel>{translate('PreferredMfaMethod')}</InputLabel>
                                <Select
                                    name="preferredMfaMethod"
                                    value={formData.preferredMfaMethod}
                                    onChange={handleChange}
                                    label={translate('PreferredMfaMethod')}
                                >
                                    <MenuItem value="email">{translate('Email')}</MenuItem>
                                    <MenuItem value="phone">{translate('PhoneNumber')}</MenuItem>
                                </Select>
                                {errors.preferredMfaMethod && (
                                    <FormHelperText>{errors.preferredMfaMethod}</FormHelperText>
                                )}
                                <FormHelperText>
                                    {translate('MfaMethodExplanation')}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={isSigningUp}
                                    sx={{
                                        minWidth: 200,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        ...getGlowEffect(theme.palette.primary.main, 'medium')
                                    }}
                                >
                                    {isSigningUp ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        translate('BusinessSignupSubmitButton')
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <ConfirmationModal
                open={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                error={errors.confirmation}
            >
                {renderConfirmationModalContent()}
            </ConfirmationModal>
        </Container>
    );
};

export default BusinessSignup;