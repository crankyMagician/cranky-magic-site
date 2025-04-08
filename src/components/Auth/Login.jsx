import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginMutation } from '../../api/apiSlice';
import { setCredentials } from '../../reducers/authReducer';
import { styled } from '@mui/material/styles';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import AuthTokenService from '../../services/AuthTokenService';
import { FaApple, FaGoogle, FaFacebook, FaMicrosoft } from 'react-icons/fa';
import validatePassword from '../../utilities/PasswordValidator';

const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  margin: '0 auto',
}));

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { translate } = useCustomTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Custom validator using our password validator
  const passwordValidator = (value) => {
    if (!value) return translate('LoginErrorPasswordRequired');
    
    const validation = validatePassword(value);
    return validation.success || validation.message;
  };

  const handleLogin = async (data) => {
    // Validate password before submitting
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.success) {
      setError('password', {
        type: 'manual',
        message: passwordValidation.message,
      });
      return;
    }
    
    try {
      const result = await login(data).unwrap();
      console.log('Login result:', result);
      
      // Save token in localStorage first via AuthTokenService
      AuthTokenService.setAuthInfo({
        isAuthenticated: true,
        user: result.user,
        authToken: result.token,
        roles: result.roles || [],
        businesses: result.businesses || [],
        activeBusiness: result.activeBusiness || null
      });
      
      // Update Redux state
      dispatch(setCredentials(result));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('root', {
        type: 'manual',
        message: translate('LoginErrorGeneral'),
      });
    }
  };

  const handleSSO = (provider) => {
    // Implement SSO logic here
    console.log(`SSO with ${provider}`);
  };

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom>
        {translate('LoginTitle')}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {translate('LoginSubtitle')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleLogin)} sx={{ mt: 2, width: '100%' }}>
        <TextField
          fullWidth
          label={translate('Email')}
          {...register('email', {
            required: translate('LoginErrorEmailRequired'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: translate('LoginErrorInvalidEmail'),
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="normal"
        />

        <TextField
          fullWidth
          label={translate('Password')}
          type={showPassword ? 'text' : 'password'}
          {...register('password', {
            required: translate('LoginErrorPasswordRequired'),
            validate: passwordValidator
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="normal"
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {translate('NoAccount')}{' '}
            <Link href="/business-signup" variant="body2">
              {translate('SignUpHere')}
            </Link>
          </Typography>
          <Link href="/forgot-password" variant="body2">
            {translate('ForgotPassword')}
          </Link>
        </Box>

        {errors.root && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errors.root.message}
          </Typography>
        )}

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
            translate('LoginButton')
          )}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <IconButton onClick={() => console.log('SSO with Apple')}>
            <FaApple size={40} />
          </IconButton>
          <IconButton onClick={() => console.log('SSO with Google')}>
            <FaGoogle size={40} />
          </IconButton>
          <IconButton onClick={() => console.log('SSO with Facebook')}>
            <FaFacebook size={40} />
          </IconButton>
          <IconButton onClick={() => console.log('SSO with Microsoft')}>
            <FaMicrosoft size={40} />
          </IconButton>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default Login; 