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
} from '@mui/material';
import { useAuth } from "../../hooks/useAuth";
import { 
    useBusinessSignupMutation, 
    useConfirmSignupMutation,
    useResendConfirmationMutation,
    useLoginMutation 
} from "../../api/apiSlice";
import { useNavigate } from 'react-router-dom';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import ConfirmationModal from '../common/ConfirmationModal';

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
    const [confirmSignup, { isLoading: isConfirming }] = useConfirmSignupMutation();
    const [resendConfirmation, { isLoading: isResending }] = useResendConfirmationMutation();
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

    // UI state
    const [errors, setErrors] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [signupData, setSignupData] = useState(null);

    // Validation patterns
    const patterns = {
        businessName: /^[a-zA-Z0-9\s\-.,&'()]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
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
                if (!patterns.password.test(value)) return translate('BusinessSignupErrorInvalidPassword');
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

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
                businessDescription: `${formData.businessName} - ${formData.city}, ${formData.state}`
            };

            const response = await businessSignup(signupPayload).unwrap();

            if (response.requiresConfirmation) {
                setSignupData(signupPayload); // Store signup data for later use
                setShowConfirmationModal(true);
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
            const response = await confirmSignup({
                email: formData.email,
                confirmationCode,
                password: formData.password
            }).unwrap();

            setShowConfirmationModal(false);

            // After confirmation, attempt to log in
            const loginResponse = await login({
                email: formData.email,
                password: formData.password
            }).unwrap();

            if (loginResponse.token) {
                navigate('/dashboard');
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                confirmation: error.data?.error || translate('BusinessSignupErrorConfirmation')
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
                onConfirm={handleConfirmationSubmit}
                onResendCode={handleResendCode}
                title={translate('BusinessSignupConfirmationTitle')}
                description={translate('BusinessSignupConfirmationDescription')}
                confirmationCode={confirmationCode}
                setConfirmationCode={setConfirmationCode}
                isLoading={isConfirming}
                isResending={isResending}
                error={errors.confirmation}
                showResendOption={true}
            />
        </Container>
    );
};

export default BusinessSignup;