import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../api/apiSlice';
import { setCredentials } from '../../reducers/authReducer';
import { useTranslation } from 'react-i18next';
import AuthTokenService from '../../services/AuthTokenService';
import validatePassword from '../../utilities/PasswordValidator';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utilities/apiConstants';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  margin: '0 auto',
}));

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [forgotPassword, { isLoading: isRequestingCode }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResettingPassword, mutate: resetPasswordMutate }] = useResetPasswordMutation();
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [resetCodeSent, setResetCodeSent] = useState(false);

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
  };

  // Email sanitization
  const sanitizeEmail = (email) => {
    return email.trim().toLowerCase();
  };

  // Phone number sanitization
  const sanitizePhoneNumber = (phone) => {
    // Remove all non-numeric characters
    return phone.replace(/[^\d+]/g, '');
  };

  // Email validation
  const validateEmail = (email, updateErrors = true) => {
    let valid = true;
    let newErrors = {...errors};

    if (!email) {
      if (updateErrors) newErrors.email = t('EmailRequired');
      valid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      if (updateErrors) newErrors.email = t('InvalidEmail');
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
      if (updateErrors) newErrors.phoneNumber = t('PhoneNumberRequired');
      valid = false;
    } else if (phone.length < 10) {
      if (updateErrors) newErrors.phoneNumber = t('InvalidPhoneNumber');
      valid = false;
    }

    if (updateErrors) setErrors(newErrors);
    return valid;
  };

  const validateResetForm = () => {
    let valid = true;
    let newErrors = {...errors};

    if (!formData.resetCode) {
      newErrors.resetCode = t('ResetCodeRequired');
      valid = false;
    }

    // Use the password validator utility
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.success) {
      newErrors.newPassword = passwordValidation.message;
      valid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('PasswordsDoNotMatch');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAuthMethodChange = (e) => {
    setAuthMethod(e.target.value);
    // Clear related errors
    setErrors({});
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    
    // Validate based on auth method
    let isValid = false;
    if (authMethod === 'email') {
      isValid = validateEmail(formData.email);
    } else {
      isValid = validatePhoneNumber(formData.phoneNumber);
    }
    
    if (!isValid) return;

    try {
      setStatusMessage({ type: '', message: '' });
      
      // Create the request payload based on auth method
      const payload = authMethod === 'email' 
        ? { email: formData.email } 
        : { phoneNumber: formData.phoneNumber };
      
      await forgotPassword(payload).unwrap();
      setStatusMessage({ 
        type: 'success', 
        message: t('ResetCodeSentEmail', { email: formData.email })
      });
      setResetCodeSent(true);
      setActiveStep(1);
    } catch (error) {
      console.error('Error requesting reset code:', error);
      setStatusMessage({ 
        type: 'error', 
        message: error.data?.message || t('UnknownError')
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setStatusMessage({ type: '', message: '' });

      // Additional validation for better user feedback
      if (!formData.resetCode || !formData.newPassword || !formData.confirmPassword) {
        setStatusMessage({
          type: 'error',
          message: t('AllFieldsRequired')
        });
        return;
      }

      // Create payload based on auth method
      const payload = {
        resetCode: formData.resetCode.trim(),
        newPassword: formData.newPassword.trim(),
        [authMethod === 'email' ? 'email' : 'phoneNumber']: 
          authMethod === 'email' ? formData.email.trim() : formData.phoneNumber.trim()
      };

      console.log('Resetting password with payload:', payload);

      // Try with RTK Query first
      try {
        const response = await resetPassword(payload).unwrap();
        console.log('Reset password response:', response);

        if (response.token) {
          // Handle successful login with token
          AuthTokenService.setAuthInfo({
            isAuthenticated: true,
            user: response.user,
            authToken: response.token,
            roles: response.roles || [],
            businesses: response.businesses || [],
            activeBusiness: response.activeBusiness || null
          });

          dispatch(setCredentials(response));

          setStatusMessage({
            type: 'success',
            message: t('PasswordResetSuccessful')
          });

          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatusMessage({
            type: 'success',
            message: t('PasswordResetSuccessLogin')
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (rtkError) {
        // If RTK Query fails, try direct axios call
        console.error('RTK Query call failed:', rtkError);
        console.log('Trying direct API call to:', API_ENDPOINTS.proxyResetPassword);

        try {
          const directResponse = await axios.post(
            API_ENDPOINTS.proxyResetPassword,
            payload,
            { headers: { 'Content-Type': 'application/json' } }
          );

          console.log('Direct API call response:', directResponse.data);

          if (directResponse.data.token) {
            // Handle successful login with token
            AuthTokenService.setAuthInfo({
              isAuthenticated: true,
              user: directResponse.data.user,
              authToken: directResponse.data.token,
              roles: directResponse.data.roles || [],
              businesses: directResponse.data.businesses || [],
              activeBusiness: directResponse.data.activeBusiness || null
            });

            dispatch(setCredentials(directResponse.data));

            setStatusMessage({
              type: 'success',
              message: t('PasswordResetSuccessful')
            });

            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            setStatusMessage({
              type: 'success',
              message: t('PasswordResetSuccessLogin')
            });
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        } catch (directError) {
          // Try one more time with the direct URL
          console.error('Proxy API call failed:', directError);
          console.log('Trying direct API call without proxy:', API_ENDPOINTS.directResetPassword);
          
          try {
            const fallbackResponse = await axios.post(
              API_ENDPOINTS.directResetPassword,
              payload,
              { headers: { 'Content-Type': 'application/json' } }
            );
            
            console.log('Fallback API call response:', fallbackResponse.data);
            
            if (fallbackResponse.data.token) {
              // Handle successful login with token
              AuthTokenService.setAuthInfo({
                isAuthenticated: true,
                user: fallbackResponse.data.user,
                authToken: fallbackResponse.data.token,
                roles: fallbackResponse.data.roles || [],
                businesses: fallbackResponse.data.businesses || [],
                activeBusiness: fallbackResponse.data.activeBusiness || null
              });
  
              dispatch(setCredentials(fallbackResponse.data));
  
              setStatusMessage({
                type: 'success',
                message: t('PasswordResetSuccessful')
              });
  
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              setStatusMessage({
                type: 'success',
                message: t('PasswordResetSuccessLogin')
              });
              setTimeout(() => {
                navigate('/login');
              }, 2000);
            }
          } catch (fallbackError) {
            console.error('All reset password attempts failed:', fallbackError);
            setStatusMessage({
              type: 'error',
              message: fallbackError.response?.data?.message || 
                       fallbackError.message || 
                       t('PasswordResetFailed')
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in reset password flow:', error);
      setStatusMessage({
        type: 'error',
        message: error.response?.data?.message || error.message || t('PasswordResetFailed')
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
      setErrors(prev => ({ ...prev, confirmPassword: t('PasswordsDoNotMatch') }));
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
      setErrors(prev => ({ ...prev, confirmPassword: t('PasswordsDoNotMatch') }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const steps = [
    t('RequestResetCode'),
    t('EnterCodeAndNewPassword'),
    t('ResetSuccess')
  ];

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" gutterBottom align="center">
        {resetCodeSent ? t('ResetPassword') : t('ForgotPassword')}
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 4 }}>
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
            {t('ForgotPasswordInstructions')}
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('AuthenticationMethod')}</InputLabel>
            <Select
              value={authMethod}
              onChange={handleAuthMethodChange}
              label={t('AuthenticationMethod')}
            >
              <MenuItem value="email">{t('Email')}</MenuItem>
              <MenuItem value="phone">{t('PhoneNumber')}</MenuItem>
            </Select>
          </FormControl>
          
          {authMethod === 'email' ? (
            <TextField
              fullWidth
              margin="normal"
              label={t('Email')}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isRequestingCode}
              inputProps={{
                autoComplete: "email"
              }}
            />
          ) : (
            <TextField
              fullWidth
              margin="normal"
              label={t('PhoneNumber')}
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              disabled={isRequestingCode}
              inputProps={{
                autoComplete: "tel"
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isRequestingCode || !formValid}
          >
            {isRequestingCode ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('SendResetCode')
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/login" variant="body2">
              {t('BackToLogin')}
            </Link>
          </Box>
        </Box>
      )}

      {activeStep === 1 && (
        <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%' }}>
          <Typography variant="body1" gutterBottom>
            {t('ResetPasswordInstructions')}
          </Typography>
          
          <TextField
            fullWidth
            margin="normal"
            label={t('ResetCode')}
            name="resetCode"
            value={formData.resetCode}
            onChange={handleInputChange}
            error={!!errors.resetCode}
            helperText={errors.resetCode}
            disabled={isResettingPassword}
          />

          <TextField
            fullWidth
            margin="normal"
            label={t('NewPassword')}
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
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label={t('ConfirmPassword')}
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={isResettingPassword}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isResettingPassword || !formValid}
          >
            {isResettingPassword ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('ResetPassword')
            )}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="text" 
              onClick={() => setActiveStep(0)}
              disabled={isResettingPassword}
            >
              {t('Back')}
            </Button>
            
            <Button
              variant="text"
              onClick={() => navigate('/login')}
            >
              {t('BackToLogin')}
            </Button>
          </Box>

          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Having issues? Try our 
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/direct-reset')}
                  sx={{ ml: 1 }}
                >
                  Direct Password Reset
                </Button>
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {activeStep === 2 && (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {t('PasswordResetSuccessTitle')}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {t('PasswordResetSuccessMessage')}
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            {t('GoToDashboard')}
          </Button>
        </Box>
      )}
    </StyledPaper>
  );
};

export default ForgotPassword; 