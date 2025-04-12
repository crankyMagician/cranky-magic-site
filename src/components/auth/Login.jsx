import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FaApple, FaGoogle, FaFacebook, FaMicrosoft } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import { useLoginMutation } from '../../api/apiSlice';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import validatePassword from '../../utilities/PasswordValidator';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useCustomTranslation();
  const analytics = useAnalytics();
  const { getGlassMorphismStyle, getGlowEffect, isDark } = useSpatialTheme();
  const [showPassword, setShowPassword] = useState(false);

  // Use RTK Query hook for login
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // For analytics: track page view
  useEffect(() => {
    analytics.trackPageView({
      pageName: 'Login',
      path: location.pathname
    });
  }, [analytics, location.pathname]);

  // Custom validator using our password validator
  const passwordValidator = (value) => {
    if (!value) return translate('LoginErrorPasswordRequired');

    const validation = validatePassword(value);
    return validation.success || validation.message;
  };

  const handleLogin = async (data) => {
    // For analytics: track login attempt
    analytics.trackEvent('login_start', {
      method: 'email'
    });

    // Validate password before submitting
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.success) {
      setError('password', {
        type: 'manual',
        message: passwordValidation.message,
      });

      // Track validation failure
      analytics.trackEvent('login_validation_error', {
        field: 'password',
        reason: passwordValidation.message
      });
      return;
    }

    try {
      // Use RTK Query mutation
      const result = await login(data).unwrap();

      if (result.token) {
        // Track successful login
        analytics.trackEvent('login_success', {
          method: 'email'
        });

        // Redirect to the intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);

      // Track login failure
      analytics.trackEvent('login_failure', {
        reason: error.data?.message || 'Unknown error',
        status: error.status
      });

      setError('root', {
        type: 'manual',
        message: error.data?.message || translate('LoginErrorGeneral'),
      });
    }
  };

  const handleSSO = (provider) => {
    // For analytics: track SSO attempt
    analytics.trackEvent('login_sso_attempt', {
      provider
    });

    // Implement SSO logic here
    console.log(`SSO with ${provider}`);
  };

  return (
      <StyledPaper elevation={3}>
        <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: theme => theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}
        >
          {translate('LoginTitle')}
        </Typography>

        <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            align="center"
            sx={{ mb: 3 }}
        >
          {translate('LoginSubtitle')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(handleLogin)} sx={{ width: '100%' }}>
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
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1 }
              }}
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
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1 },
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {translate('NoAccount')}{' '}
              <Link href="/business-signup" variant="body2" color="primary">
                {translate('SignUpHere')}
              </Link>
            </Typography>
            <Link href="/forgot-password" variant="body2" color="primary">
              {translate('ForgotPassword')}
            </Link>
          </Box>

          {(errors.root || loginError) && (
              <Typography
                  color="error"
                  sx={{
                    mt: 1,
                    mb: 1,
                    p: 1.5,
                    bgcolor: theme => isDark ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'error.light'
                  }}
              >
                {errors.root?.message || loginError?.data?.message || translate('LoginErrorGeneral')}
              </Typography>
          )}

          <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 3,
                height: 48,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                ...getGlowEffect(theme => theme.palette.primary.main, 'low')
              }}
              disabled={isLoading}
          >
            {isLoading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                translate('LoginButton')
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {translate('OrContinueWith')}
            </Typography>
          </Divider>

          {/* SSO Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <IconButton
                onClick={() => handleSSO('apple')}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  ...getGlassMorphismStyle(0.1)
                }}
                aria-label="Continue with Apple"
            >
              <FaApple size={24} />
            </IconButton>
            <IconButton
                onClick={() => handleSSO('google')}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  ...getGlassMorphismStyle(0.1)
                }}
                aria-label="Continue with Google"
            >
              <FaGoogle size={24} />
            </IconButton>
            <IconButton
                onClick={() => handleSSO('facebook')}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  ...getGlassMorphismStyle(0.1)
                }}
                aria-label="Continue with Facebook"
            >
              <FaFacebook size={24} />
            </IconButton>
            <IconButton
                onClick={() => handleSSO('microsoft')}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  ...getGlassMorphismStyle(0.1)
                }}
                aria-label="Continue with Microsoft"
            >
              <FaMicrosoft size={24} />
            </IconButton>
          </Box>
        </Box>
      </StyledPaper>
  );
};

export default Login;