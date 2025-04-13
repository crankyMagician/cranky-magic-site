import React, { useState, useEffect, useRef } from 'react';
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
  Container,
  useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation
} from '../../api/apiSlice';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import validatePassword from '../../utilities/PasswordValidator';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useMatrixText } from '../../hooks/useMatrixText';

const ForgotPassword = ({ redirectPath = '/' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useCustomTranslation();
  const analytics = useAnalytics();
  const {
    getGlassMorphismStyle,
    getGlowEffect,
    getFuturisticCardStyle,
    isSpatialTheme
  } = useSpatialTheme();

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

  // Use ref to track analytics to prevent duplicate events
  const analyticsTracked = useRef({
    formView: false,
    steps: new Set()
  });

  // Use matrix text effect for header if spatial theme
  const forgotPasswordTitle = translate(resetCodeSent ? 'ResetPassword' : 'ForgotPassword');
  const { text: titleText } = useMatrixText(forgotPasswordTitle, {
    speed: 20,
    iterations: 1,
    autoStart: isSpatialTheme
  });

  // Track form using form tracking analytics - only once per step
  useEffect(() => {
    if (!analyticsTracked.current.steps.has(activeStep)) {
      analytics.trackEvent('form_view', {
        form_name: 'forgot_password',
        step: activeStep,
        auth_method: authMethod
      });
      analyticsTracked.current.steps.add(activeStep);
    }
  }, [analytics, activeStep, authMethod]);

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
      const passwordValidation = validatePassword(formData.newPassword);
      setFormValid(codeValid && passwordsMatch && passwordValidation.success);
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
    analytics.trackEvent('form_field_change', {
      form_name: 'forgot_password',
      field_name: name,
      step: activeStep,
      auth_method: authMethod
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
      if (updateErrors) newErrors.email = translate('LoginErrorEmailRequired');
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
    analytics.trackEvent('auth_method_changed', {
      form_name: 'forgot_password',
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
      analytics.trackEvent('form_validation_error', {
        form_name: 'forgot_password',
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
      analytics.trackEvent('form_validation_error', {
        form_name: 'forgot_password',
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
        auto_login: !!response.token
      });

      if (response.token) {
        setStatusMessage({
          type: 'success',
          message: translate('PasswordResetSuccessfulWithLogin')
        });

        setActiveStep(2);

        // Add a breadcrumb for the navigation
        analytics.trackEvent('navigation_intent', {
          from: 'forgot_password',
          to: redirectPath,
          auto_redirect: true
        });

        setTimeout(() => {
          navigate(redirectPath);
        }, 2000);
      } else {
        setStatusMessage({
          type: 'success',
          message: translate('PasswordResetSuccess')
        });

        setActiveStep(2);

        // Add a breadcrumb for the navigation
        analytics.trackEvent('navigation_intent', {
          from: 'forgot_password',
          to: '/login',
          auto_redirect: true
        });

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

  const handleNavigateToLogin = () => {
    analytics.trackEvent('navigation', {
      from: 'forgot_password',
      to: '/login',
      step: activeStep
    });
    navigate('/login');
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
              p: { xs: 2, sm: 4 },
              mt: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[3],
              ...(isSpatialTheme ? getFuturisticCardStyle() : {})
            }}
        >
          <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 3,
                ...(isSpatialTheme ? getGlowEffect(theme.palette.primary.main, 'low') : {})
              }}
              aria-live="polite"
          >
            {isSpatialTheme ? titleText : forgotPasswordTitle}
          </Typography>

          <Stepper
              activeStep={activeStep}
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{
                width: '100%',
                mb: 4,
                '& .MuiStepLabel-root .Mui-completed': {
                  color: theme.palette.success.main
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: theme.palette.primary.main,
                  ...(isSpatialTheme ? getGlowEffect(theme.palette.primary.main, 'low') : {})
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
                  role="alert"
              >
                {statusMessage.message}
              </Alert>
          )}

          {activeStep === 0 && (
              <Box
                  component="form"
                  onSubmit={handleRequestCode}
                  sx={{ width: '100%' }}
                  noValidate
                  aria-label={translate('ForgotPassword')}
              >
                <Typography variant="body1" gutterBottom>
                  {translate('ForgotPasswordInstructions')}
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="auth-method-label">{translate('AuthenticationMethod')}</InputLabel>
                  <Select
                      labelId="auth-method-label"
                      value={authMethod}
                      onChange={handleAuthMethodChange}
                      label={translate('AuthenticationMethod')}
                      inputProps={{
                        'aria-label': translate('AuthenticationMethod')
                      }}
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
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isRequestingCode}
                        inputProps={{
                          autoComplete: "email",
                          'aria-label': translate('Email')
                        }}
                        sx={{ mb: 3 }}
                        required
                    />
                ) : (
                    <TextField
                        fullWidth
                        margin="normal"
                        label={translate('PhoneNumber')}
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        disabled={isRequestingCode}
                        inputProps={{
                          autoComplete: "tel",
                          'aria-label': translate('PhoneNumber')
                        }}
                        sx={{ mb: 3 }}
                        required
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
                      ...(isSpatialTheme ? getGlowEffect(theme.palette.primary.main, 'low') : {})
                    }}
                    disabled={isRequestingCode || !formValid}
                    aria-label={translate('SendResetCode')}
                >
                  {isRequestingCode ? (
                      <CircularProgress size={24} color="inherit" />
                  ) : (
                      translate('SendResetCode')
                  )}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                      variant="text"
                      onClick={handleNavigateToLogin}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                      startIcon={<ArrowBack />}
                      aria-label={translate('BackToLogin')}
                  >
                    {translate('BackToLogin')}
                  </Button>
                </Box>
              </Box>
          )}

          {activeStep === 1 && (
              <Box
                  component="form"
                  onSubmit={handleResetPassword}
                  sx={{ width: '100%' }}
                  noValidate
                  aria-label={translate('ResetPassword')}
              >
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
                    inputProps={{
                      'aria-label': translate('ResetCode')
                    }}
                    sx={{ mb: 2 }}
                    required
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
                    helperText={errors.newPassword || translate('BusinessSignupPasswordRequirements')}
                    disabled={isResettingPassword}
                    inputProps={{
                      'aria-label': translate('NewPassword')
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
                    sx={{ mb: 2 }}
                    required
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
                    inputProps={{
                      'aria-label': translate('ConfirmPassword')
                    }}
                    sx={{ mb: 3 }}
                    required
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
                      ...(isSpatialTheme ? getGlowEffect(theme.palette.primary.main, 'low') : {})
                    }}
                    disabled={isResettingPassword || !formValid}
                    aria-label={translate('ResetPassword')}
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
                      startIcon={<ArrowBack />}
                      aria-label={translate('Back')}
                  >
                    {translate('Back')}
                  </Button>

                  <Button
                      variant="text"
                      onClick={handleNavigateToLogin}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        color: theme.palette.primary.main
                      }}
                      aria-label={translate('BackToLogin')}
                  >
                    {translate('BackToLogin')}
                  </Button>
                </Box>
              </Box>
          )}

          {activeStep === 2 && (
              <Box
                  sx={{ width: '100%', textAlign: 'center' }}
                  role="alert"
                  aria-live="polite"
              >
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: theme.palette.success.main,
                      fontWeight: 'bold',
                      mb: 2,
                      ...(isSpatialTheme ? getGlowEffect(theme.palette.success.main, 'low') : {})
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
                      ...(isSpatialTheme ? getGlowEffect(theme.palette.primary.main, 'low') : {})
                    }}
                    aria-label={translate('GoToDashboard')}
                >
                  {translate('GoToDashboard')}
                </Button>
              </Box>
          )}
        </Paper>
      </Container>
  );
};

export default React.memo(ForgotPassword);