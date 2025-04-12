import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert,
  Container,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useChangePasswordMutation } from '../../api/apiSlice';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import validatePassword from '../../utilities/PasswordValidator';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const ChangePassword = () => {
  const location = useLocation();
  const { translate } = useCustomTranslation();
  const analytics = useAnalytics();
  const { getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const userId = useSelector(state => state.auth.user?.id);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  // For analytics: track page view
  useEffect(() => {
    analytics.trackPageView({
      pageName: 'ChangePassword',
      path: location.pathname
    });
  }, [analytics, location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear any errors for this field when the user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Track form field interaction for analytics
    analytics.trackFormFieldInteraction('change_password', name, {
      hasValue: !!value
    });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = translate('CurrentPasswordRequired');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Track password change attempt
    analytics.trackEvent('change_password_attempt');

    if (!validateForm()) {
      // Track validation failure
      analytics.trackEvent('change_password_validation_error', {
        errors: Object.keys(errors)
      });
      return;
    }

    if (!userId) {
      setStatusMessage({
        type: 'error',
        message: translate('NotLoggedIn')
      });

      // Track error: not logged in
      analytics.trackEvent('change_password_error', {
        reason: 'not_logged_in'
      });
      return;
    }

    try {
      setStatusMessage({ type: '', message: '' });
      await changePassword({
        userId,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }).unwrap();

      // Reset form on success
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Track successful password change
      analytics.trackEvent('change_password_success');

      setStatusMessage({
        type: 'success',
        message: translate('PasswordChangedSuccess')
      });
    } catch (error) {
      console.error('Error changing password:', error);

      // Track password change failure
      analytics.trackEvent('change_password_failure', {
        reason: error.data?.message || 'Unknown error',
        status: error.status
      });

      setStatusMessage({
        type: 'error',
        message: error.data?.message || translate('PasswordChangeError')
      });
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
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

    // Track password strength
    analytics.trackFormFieldInteraction('change_password', 'newPassword', {
      hasValue: !!value,
      isValid: passwordValidation.success
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, confirmPassword: value }));

    // Check if passwords match
    if (value !== formData.newPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: translate('PasswordsDoNotMatch') }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }

    // Track password confirmation
    analytics.trackFormFieldInteraction('change_password', 'confirmPassword', {
      hasValue: !!value,
      matches: value === formData.newPassword
    });
  };

  if (!userId) {
    return (
        <Container maxWidth="sm">
          <StyledPaper elevation={3} sx={getGlassMorphismStyle(0.8)}>
            <Alert severity="error" sx={{ width: '100%' }}>
              {translate('NotLoggedIn')}
            </Alert>
            <Button
                variant="contained"
                href="/login"
                sx={{
                  mt: 3,
                  width: '100%',
                  ...getGlowEffect('primary.main', 'low')
                }}
            >
              {translate('Login')}
            </Button>
          </StyledPaper>
        </Container>
    );
  }

  return (
      <Container maxWidth="sm">
        <StyledPaper elevation={3} sx={getGlassMorphismStyle(0.8)}>
          <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ color: theme => theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}
          >
            {translate('ChangePasswordTitle')}
          </Typography>

          {statusMessage.message && (
              <Alert
                  severity={statusMessage.type || 'info'}
                  sx={{ width: '100%', mb: 2 }}
                  onClose={() => setStatusMessage({ type: '', message: '' })}
              >
                {statusMessage.message}
              </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
                fullWidth
                margin="normal"
                label={translate('CurrentPassword')}
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                            aria-label={showCurrentPassword ? 'hide password' : 'show password'}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                margin="normal"
                label={translate('NewPassword')}
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleNewPasswordChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            aria-label={showNewPassword ? 'hide password' : 'show password'}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
                type={showNewPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                sx={{ mb: 3 }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  mb: 2,
                  height: 48,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  ...getGlowEffect('primary.main', 'low')
                }}
                disabled={isLoading}
            >
              {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
              ) : (
                  translate('ChangePassword')
              )}
            </Button>
          </Box>
        </StyledPaper>
      </Container>
  );}

export default ChangePassword