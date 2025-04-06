import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/controllers/authController';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 480,
  margin: 'auto',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const SSOButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  textTransform: 'none',
  padding: theme.spacing(1.5),
  justifyContent: 'flex-start',
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(2),
  },
}));

const Login = () => {
  const { t } = useCustomTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data);
      navigate('/dashboard');
    },
    onError: (error) => {
      setError(error.response?.data?.error || t('LoginErrorGeneral'));
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    loginMutation.mutate(data);
  };

  const handleSSO = (provider) => {
    window.location.href = `/auth/${provider}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('LoginTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          {t('LoginSubtitle')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              {...register('email', {
                required: t('LoginErrorEmailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('LoginErrorInvalidEmail'),
                },
              })}
              label={t('Email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              {...register('password', {
                required: t('LoginErrorPasswordRequired'),
                minLength: {
                  value: 8,
                  message: t('LoginErrorPasswordLength'),
                },
              })}
              label={t('Password')}
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
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

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loginMutation.isPending}
              fullWidth
            >
              {loginMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                t('LoginButton')
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {t('ForgotPassword')}
                </Typography>
              </Link>
            </Box>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t('OrContinueWith')}
          </Typography>
        </Divider>

        <Stack spacing={2}>
          <SSOButton
            variant="outlined"
            startIcon={<img src="/apple-logo.svg" alt="Apple" width={24} />}
            onClick={() => handleSSO('apple')}
          >
            {t('ContinueWithApple')}
          </SSOButton>

          <SSOButton
            variant="outlined"
            startIcon={<img src="/google-logo.svg" alt="Google" width={24} />}
            onClick={() => handleSSO('google')}
          >
            {t('ContinueWithGoogle')}
          </SSOButton>

          <SSOButton
            variant="outlined"
            startIcon={<img src="/facebook-logo.svg" alt="Facebook" width={24} />}
            onClick={() => handleSSO('facebook')}
          >
            {t('ContinueWithFacebook')}
          </SSOButton>

          <SSOButton
            variant="outlined"
            startIcon={<img src="/microsoft-logo.svg" alt="Microsoft" width={24} />}
            onClick={() => handleSSO('microsoft')}
          >
            {t('ContinueWithMicrosoft')}
          </SSOButton>
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('NoAccount')}{' '}
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Typography
                component="span"
                variant="body2"
                color="primary"
                sx={{ fontWeight: 'medium' }}
              >
                {t('SignUpHere')}
              </Typography>
            </Link>
          </Typography>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Login; 