import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
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
    FormHelperText
} from '@mui/material';
import { useAuth } from "../../hooks/useAuth";
import { 
    useBusinessSignupMutation, 
    useConfirmSignupMutation,
    useConfirmPhoneMutation,
    useResendConfirmationMutation,
    useResendPhoneConfirmationMutation,
    useLoginMutation 
} from "../../api/apiSlice";
import { useNavigate } from 'react-router-dom';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import ConfirmationModal from '../common/ConfirmationModal';
import validatePassword from '../../utilities/PasswordValidator';

// Helper function to generate a slug from business name
const generateSlug = (businessName) => {
    return businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const BusinessSignup = () => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const navigate = useNavigate();
    
    // API mutations
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

    // UI state
    const [errors, setErrors] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [signupData, setSignupData] = useState(null);

    // Step state
    const [confirmStep, setConfirmStep] = useState('email'); // 'email' or 'phone'
    const [phoneConfirmed, setPhoneConfirmed] = useState(false);
    const [phoneConfirmationCode, setPhoneConfirmationCode] = useState('');

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
                preferredMfaMethod: formData.preferredMfaMethod
            };

            const response = await businessSignup(signupPayload).unwrap();

            if (response.requiresConfirmation) {
                setSignupData(signupPayload); // Store signup data for later use
                setShowConfirmationModal(true);
                // Default to email confirmation first, then do phone if needed
                setConfirmStep('email');
            }
        } catch (error) {
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
                const response = await confirmSignup({
                    email: formData.email,
                    confirmationCode,
                }).unwrap();

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
                const response = await confirmPhone({
                    phoneNumber: formData.phoneNumber,
                    confirmationCode: phoneConfirmationCode,
                }).unwrap();

                setPhoneConfirmed(true);
                completeSignupAndLogin();
            }
        } catch (error) {
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
            const loginResponse = await login({
                email: formData.email,
                password: formData.password
            }).unwrap();

            if (loginResponse.token) {
                navigate('/dashboard');
            }
        } catch (loginError) {
            setErrors(prev => ({
                ...prev,
                submit: loginError.data?.error || translate('LoginErrorGeneral')
            }));
        }
    };

    const handleResendCode = async () => {
        try {
            await resendConfirmation({ email: formData.email }).unwrap();
            // Show success message
            setErrors(prev => ({
                ...prev,
                confirmation: translate('BusinessSignupConfirmationCodeResent')
            }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                confirmation: error.data?.error || translate('BusinessSignupErrorResendCode')
            }));
        }
    };

    const handleResendPhoneCode = async () => {
        try {
            await resendPhoneConfirmation({ phoneNumber: formData.phoneNumber }).unwrap();
            // Show success message
            setErrors(prev => ({
                ...prev,
                confirmation: translate('PhoneConfirmationCodeResent')
            }));
        } catch (error) {
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
                        error={!!errors.confirmation}
                        helperText={errors.confirmation}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleResendCode}
                            disabled={isResendingEmail}
                        >
                            {isResendingEmail ? (
                                <CircularProgress size={24} />
                            ) : (
                                translate('ResendCode')
                            )}
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleConfirmationSubmit}
                            disabled={!confirmationCode || isConfirmingEmail}
                        >
                            {isConfirmingEmail ? (
                                <CircularProgress size={24} />
                            ) : (
                                translate('ConfirmSignup')
                            )}
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
                        error={!!errors.confirmation}
                        helperText={errors.confirmation}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleResendPhoneCode}
                            disabled={isResendingPhone}
                        >
                            {isResendingPhone ? (
                                <CircularProgress size={24} />
                            ) : (
                                translate('ResendCode')
                            )}
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleConfirmationSubmit}
                            disabled={!phoneConfirmationCode || isConfirmingPhone}
                        >
                            {isConfirmingPhone ? (
                                <CircularProgress size={24} />
                            ) : (
                                translate('ConfirmPhone')
                            )}
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
                    p: 4, 
                    mt: 4,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius * 2,
                    boxShadow: theme.shadows[3]
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
                    <Alert severity="error" sx={{ mb: 3 }}>
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
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupPhoneNumber')}
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupPassword')}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupConfirmPassword')}
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('BusinessSignupAddress')}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
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
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl 
                                fullWidth 
                                error={!!errors.preferredMfaMethod}
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
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                        }
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