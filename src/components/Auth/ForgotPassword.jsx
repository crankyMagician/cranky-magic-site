import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation
} from '../../api/apiSlice';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import validatePassword from '../../utilities/PasswordValidator';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useCustomTranslation();
  const analytics = useAnalytics();
  const { getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'

  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [resetCodeSent, setResetCodeSent] = useState(false);

  // RTK Query hooks
  const [forgotPassword, { isLoading: isRequestingCode }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  // For analytics: track page view
  useEffect(() => {
    analytics.trackPageView({
      pageName: 'ForgotPassword',
      path: location.pathname,
      step: activeStep
    });
  }, [analytics, location.pathname, activeStep]);

  useEffect(() => {
    // Validate step 0 form
    if (activeStep === 0) {
      if (authMethod === 'email') {
        setFormValid(validateEmail(formData.email, false));
      } else {
        setFormValid(validatePhoneNumber(formData.phoneNumber, false));
      }
    }
    // Validate step 1 form
    else if (activeStep === 1) {
      const codeValid = !!formData.resetCode;
      const passwordsMatch = formData.newPassword === formData.confirmPassword;
      const passwordValid = formData.newPassword.length >= 8;
      setFormValid(codeValid && passwordsMatch && passwordValid);
    }
  }, [formData, activeStep, authMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input based on field type
    let sanitizedValue = value;
    if (name === 'email') {
      sanitizedValue = sanitizeEmail(value);
    } else if (name === 'phoneNumber') {
      sanitizedValue = sanitizePhoneNumber(value);
    } else if (name === 'resetCode') {
      sanitizedValue = value.trim();
    }

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

    // Clear any errors for this field when the user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Track form field interaction for analytics
    analytics.trackFormFieldInteraction('forgot_password', name, {
      step: activeStep,
      authMethod
    });
  };

  // Email sanitization
  const sanitizeEmail = (email) => {
    return email.trim().toLowerCase();
  };

  // Phone number sanitization
  const sanitizePhoneNumber = (phone) => {
    // Remove all non-numeric characters except + at the beginning
    return phone.replace(/[^\d+]/g, '');
  };

  // Email validation
  const validateEmail = (email, updateErrors = true) => {
    let valid = true;
    let newErrors = {...errors};

    if (!email) {
      if (updateErrors) newErrors.email = translate('EmailRequired');
      valid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      if (updateErrors) newErrors.email = translate('LoginErrorInvalidEmail');
      valid = false;
    }

    if (updateErrors) setErrors(newErrors);
    return valid;
  };

  // Phone number validation
  const validatePhoneNumber = (phone, updateErrors = true) => {
    let valid = true;
    let newErrors = {...errors};

    if (!phone) {
      if (updateErrors) newErrors.phoneNumber = translate('PhoneNumberRequired');
      valid = false;
    } else if (phone.length < 10) {
      if (updateErrors) newErrors.phoneNumber = translate('InvalidPhoneNumber');
      valid = false;
    }

    if (updateErrors) setErrors(newErrors);
    return valid;
  };

  const validateResetForm = () => {
    let valid = true;
    let newErrors = {...errors};

    if (!formData.resetCode) {
      newErrors.resetCode = translate('ResetCodeRequired');
      valid = false;
    }

    // Use the password validator utility
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.success) {
      newErrors.newPassword = passwordValidation.message;
      valid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = translate('PasswordsDoNotMatch');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAuthMethodChange = (e) => {
    const newMethod = e.target.value;
    setAuthMethod(newMethod);

    // Track auth method change
    analytics.trackEvent('forgot_password_auth_method_changed', {
      from: authMethod,
      to: newMethod
    });

    // Clear related errors
    setErrors({});
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();

    // Track reset code request attempt
    analytics.trackEvent('forgot_password_request_code', {
      method: authMethod
    });

    // Validate based on auth method
    let isValid = false;
    if (authMethod === 'email') {
      isValid = validateEmail(formData.email);
    } else {
      isValid = validatePhoneNumber(formData.phoneNumber);
    }

    if (!isValid) {
      // Track validation failure
      analytics.trackEvent('forgot_password_validation_error', {
        method: authMethod,
        step: 'request_code'
      });
      return;
    }

    try {
      setStatusMessage({ type: '', message: '' });

      // Create the request payload based on auth method
      const payload = authMethod === 'email'
          ? { email: formData.email }
          : { phoneNumber: formData.phoneNumber };

      await forgotPassword(payload).unwrap();

      // Track successful code request
      analytics.trackEvent('forgot_password_code_sent', {
        method: authMethod
      });

      setStatusMessage({
        type: 'success',
        message: authMethod === 'email'
            ? translate('ResetCodeSentEmail', { email: formData.email })
            : translate('ResetCodeSentPhone', { phone: formData.phoneNumber })
      });
      setResetCodeSent(true);
      setActiveStep(1);
    } catch (error) {
      console.error('Error requesting reset code:', error);

      // Track failed code request
      analytics.trackEvent('forgot_password_code_send_failed', {
        method: authMethod,
        error: error.data?.message || 'Unknown error',
        status: error.status
      });

      setStatusMessage({
        type: 'error',
        message: error.data?.message || translate('ResetCodeSentError')
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Track password reset attempt
    analytics.trackEvent('forgot_password_reset_attempt');

    // Validate the form
    if (!validateResetForm()) {
      // Track validation failure
      analytics.trackEvent('forgot_password_validation_error', {
        step: 'reset_password'
      });
      return;
    }

    try {
      setStatusMessage({ type: '', message: '' });

      // Create payload based on auth method
      const payload = {
        resetCode: formData.resetCode.trim(),
        newPassword: formData.newPassword.trim(),
        [authMethod === 'email' ? 'email' : 'phoneNumber']:
            authMethod === 'email' ? formData.email.trim() : formData.phoneNumber.trim()
      };

      // Submit password reset
      const response = await resetPassword(payload).unwrap();

      // Track successful password reset
      analytics.trackEvent('forgot_password_reset_success', {
        autoLogin: !!response.token
      });

      if (response.token) {
        setStatusMessage({
          type: 'success',
          message: translate('PasswordResetSuccessfulWithLogin')
        });

        setActiveStep(2);

        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setStatusMessage({
          type: 'success',
          message: translate('PasswordResetSuccess')
        });

        setActiveStep(2);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error in reset password flow:', error);

      // Track password reset failure
      analytics.trackEvent('forgot_password_reset_failure', {
        error: error.data?.message || 'Unknown error',
        status: error.status
      });

      setStatusMessage({
        type: 'error',
        message: error.data?.message || translate('PasswordResetError')
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, newPassword: value }));

    // Real-time validation using password validator
    const passwordValidation = validatePassword(value);
    if (value && !passwordValidation.success) {
      setErrors(prev => ({ ...prev, newPassword: passwordValidation.message }));
    } else if (formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: translate('PasswordsDoNotMatch') }));
    } else {
      setErrors(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: value === formData.confirmPassword ? '' : prev.confirmPassword
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, confirmPassword: value }));

    // Check if passwords match
    if (value !== formData.newPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: translate('PasswordsDoNotMatch') }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const steps = [
    translate('RequestResetCode'),
    translate('EnterCodeAndNewPassword'),
    translate('ResetSuccess')
  ];

  return (
      <Container maxWidth="sm">
        <Paper
            elevation={3}
            sx={{
              p: 4,
              mt: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[3],
              ...getGlassMorphismStyle(0.8)
            }}
        >
          <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 3
              }}
          >
            {resetCodeSent ? translate('ResetPassword') : translate('ForgotPassword')}
          </Typography>

          <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                width: '100%',
                mb: 4,
                '& .MuiStepLabel-root .Mui-completed': {
                  color: theme.palette.success.main
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: theme.palette.primary.main,
                  ...getGlowEffect(theme.palette.primary.main, 'low')
                }
              }}
          >
            {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
            ))}
          </Stepper>

          {statusMessage.message && (
              <Alert
                  severity={statusMessage.type || 'info'}
                  sx={{ width: '100%', mb: 2 }}
                  onClose={() => setStatusMessage({ type: '', message: '' })}
              >
                {statusMessage.message}
              </Alert>
          )}

          {activeStep === 0 && (
              <Box component="form" onSubmit={handleRequestCode} sx={{ width: '100%' }}>
                <Typography variant="body1" gutterBottom>
                  {translate('ForgotPasswordInstructions')}
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>{translate('AuthenticationMethod')}</InputLabel>
                  <Select
                      value={authMethod}
                      onChange={handleAuthMethodChange}
                      label={translate('AuthenticationMethod')}
                  >
                    <MenuItem value="email">{translate('Email')}</MenuItem>
                    <MenuItem value="phone">{translate('PhoneNumber')}</MenuItem>
                  </Select>
                </FormControl>

                {authMethod === 'email' ? (
                    <TextField
                        fullWidth
                        margin="normal"
                        label={translate('Email')}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isRequestingCode}
                        inputProps={{
                          autoComplete: "email"
                        }}
                        sx={{ mb: 3 }}
                    />
                ) : (
                    <TextField
                        fullWidth
                        margin="normal"
                        label={translate('PhoneNumber')}
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        disabled={isRequestingCode}
                        inputProps={{
                          autoComplete: "tel"
                        }}
                        sx={{ mb: 3 }}
                    />
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      mb: 3,
                      height: 48,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      ...getGlowEffect(theme.palette.primary.main, 'low')
                    }}
                    disabled={isRequestingCode || !formValid}
                >
                  {isRequestingCode ? (
                      <CircularProgress size={24} color="inherit" />
                  ) : (
                      translate('SendResetCode')
                  )}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link
                      href="/login"
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                  >
                    {translate('BackToLogin')}
                  </Link>
                </Box>
              </Box>
          )}

          {activeStep === 1 && (
              <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%' }}>
                <Typography variant="body1" gutterBottom>
                  {translate('ResetPasswordInstructions')}
                </Typography>

                <TextField
                    fullWidth
                    margin="normal"
                    label={translate('ResetCode')}
                    name="resetCode"
                    value={formData.resetCode}
                    onChange={handleInputChange}
                    error={!!errors.resetCode}
                    helperText={errors.resetCode}
                    disabled={isResettingPassword}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label={translate('NewPassword')}
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handlePasswordChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    disabled={isResettingPassword}
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
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label={translate('ConfirmPassword')}
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={isResettingPassword}
                    sx={{ mb: 3 }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      mb: 3,
                      height: 48,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      ...getGlowEffect(theme.palette.primary.main, 'low')
                    }}
                    disabled={isResettingPassword || !formValid}
                >
                  {isResettingPassword ? (
                      <CircularProgress size={24} color="inherit" />
                  ) : (
                      translate('ResetPassword')
                  )}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                      variant="outlined"
                      onClick={() => setActiveStep(0)}
                      disabled={isResettingPassword}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none'
                      }}
                  >
                    {translate('Back')}
                  </Button>

                  <Button
                      variant="text"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        color: theme.palette.primary.main
                      }}
                  >
                    {translate('BackToLogin')}
                  </Button>
                </Box>
              </Box>
          )}

          {activeStep === 2 && (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: theme.palette.success.main,
                      fontWeight: 'bold',
                      mb: 2
                    }}
                >
                  {translate('PasswordResetSuccessTitle')}
                </Typography>

                <Typography variant="body1" paragraph>
                  {translate('PasswordResetSuccessMessage')}
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    size="large"
                    sx={{
                      mt: 2,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.2,
                      ...getGlowEffect(theme.palette.primary.main, 'low')
                    }}
                >
                  {translate('GoToDashboard')}
                </Button>
              </Box>
          )}
        </Paper>
      </Container>
  );
};

export default ForgotPassword;