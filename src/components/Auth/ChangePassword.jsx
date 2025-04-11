import React, { useState } from 'react';
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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useChangePasswordMutation } from '../../api/apiSlice';
import { useSelector } from 'react-redux';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import validatePassword from '../../utilities/PasswordValidator';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  margin: '0 auto',
}));

const ChangePassword = () => {
  const { translate } = useCustomTranslation();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any errors for this field when the user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    if (!validateForm()) return;
    if (!userId) {
      setStatusMessage({
        type: 'error',
        message: translate('NotLoggedIn')
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
      
      setStatusMessage({ 
        type: 'success', 
        message: translate('PasswordChangedSuccess')
      });
    } catch (error) {
      console.error('Error changing password:', error);
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
  };

  if (!userId) {
    return (
      <StyledPaper elevation={3}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {translate('NotLoggedIn')}
        </Alert>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" gutterBottom align="center">
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
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
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
  );
};

export default ChangePassword; 