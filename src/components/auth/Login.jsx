import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
    Tab,
    Tabs,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Phone } from '@mui/icons-material';
import { FaApple, FaGoogle, FaFacebook, FaMicrosoft } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import { useLoginMutation } from '../../api/apiSlice';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import validatePassword from '../../utilities/PasswordValidator';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';
import { useMatrixText } from '../../hooks/useMatrixText';

// Styled components
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
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(3),
    },
}));

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { getGlassMorphismStyle, getGlowEffect, isDark, getAnimationDuration, themePrefs } = useSpatialTheme();

    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'

    // Matrix effect for title
    const titleText = translate('LoginTitle');
    const { text: animatedTitle } = useMatrixText(titleText, {
        speed: 20,
        autoStart: true,
        iterations: 1
    });

    // Use RTK Query hook for login
    const [login, { isLoading, error: loginError }] = useLoginMutation();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        watch,
        reset
    } = useForm({
        defaultValues: {
            email: '',
            phoneNumber: '',
            password: '',
        }
    });

    // For analytics: track form view only (page view is handled by RouteContext)
    useEffect(() => {
        // Track login form view
        analytics.trackEvent('form_view', {
            form_name: 'login',
            location: location.pathname
        });
    }, [analytics, location.pathname]);

    // Custom validator using our password validator
    const passwordValidator = (value) => {
        if (!value) return translate('LoginErrorPasswordRequired');

        const validation = validatePassword(value);
        return validation.success || validation.message;
    };

    // Handle tab change (email/phone)
    const handleLoginMethodChange = (_, newValue) => {
        setLoginMethod(newValue);
        clearErrors('email');
        clearErrors('phoneNumber');

        // Track method change for analytics
        analytics.trackEvent('login_method_change', {
            method: newValue
        });
    };

    // Format phone number as user types
    const formatPhoneNumber = (value) => {
        if (!value) return '';

        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Format with + prefix if not already present
        if (value.startsWith('+') && digits.length > 0) {
            return `+${digits}`;
        } else if (digits.length > 0) {
            return `+${digits}`;
        }

        return value;
    };

    const handleLogin = async (data) => {
        // For analytics: track login attempt
        analytics.trackEvent('login_attempt', {
            method: loginMethod
        });

        // Validate password before submitting
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.success) {
            setError('password', {
                type: 'manual',
                message: passwordValidation.message,
            });

            // Track validation failure
            analytics.trackEvent('form_validation_error', {
                form: 'login',
                field: 'password',
                reason: passwordValidation.message
            });
            return;
        }

        try {
            // Prepare login payload based on selected method
            const loginPayload = {
                password: data.password,
                email: "",           // Always include email field
                phoneNumber: ""      // Always include phoneNumber field
            };

            // Set the appropriate field based on login method
            if (loginMethod === 'email') {
                loginPayload.email = data.email;
            } else {
                loginPayload.phoneNumber = data.phoneNumber;
            }

            // Use RTK Query mutation
            const result = await login(loginPayload).unwrap();

            if (result.token) {
                // Track successful login
                analytics.trackEvent('login_success', {
                    method: loginMethod
                });

                // Redirect to the intended page or dashboard
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error('Login error:', error);

            // Track login failure
            analytics.trackEvent('login_failure', {
                method: loginMethod,
                reason: error.data?.message || 'Unknown error',
                status: error.status
            });

            // Set appropriate error message
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

    // Memoize form based on selected method to avoid unnecessary re-renders
    const loginForm = useMemo(() => (
        <Box component="form" onSubmit={handleSubmit(handleLogin)} sx={{ width: '100%' }}>
            <Tabs
                value={loginMethod}
                onChange={handleLoginMethodChange}
                aria-label="login method tabs"
                sx={{ mb: 3 }}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab
                    icon={<Email fontSize="small" />}
                    label={translate('Email')}
                    value="email"
                    aria-controls="email-login-form"
                    id="email-login-tab"
                />
                <Tab
                    icon={<Phone fontSize="small" />}
                    label={translate('Phone')}
                    value="phone"
                    aria-controls="phone-login-form"
                    id="phone-login-tab"
                />
            </Tabs>

            {loginMethod === 'email' && (
                <TextField
                    fullWidth
                    id="email-input"
                    label={translate('Email')}
                    {...register('email', {
                        required: loginMethod === 'email' ? translate('LoginErrorEmailRequired') : false,
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
                    aria-describedby="email-error"
                />
            )}

            {loginMethod === 'phone' && (
                <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                        required: loginMethod === 'phone' ? translate('LoginErrorPhoneRequired') : false,
                        pattern: {
                            value: /^\+[1-9]\d{1,14}$/,
                            message: translate('LoginErrorInvalidPhone')
                        }
                    }}
                    render={({ field }) => (
                        <TextField
                            fullWidth
                            id="phone-input"
                            label={translate('PhoneNumber')}
                            value={field.value}
                            onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                            margin="normal"
                            variant="outlined"
                            placeholder="+12345678901"
                            InputProps={{
                                sx: { borderRadius: 1 }
                            }}
                            aria-describedby="phone-error"
                        />
                    )}
                />
            )}

            <TextField
                fullWidth
                id="password-input"
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
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                                aria-label={showPassword ? 'hide password' : 'show password'}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                aria-describedby="password-error"
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                    {translate('NoAccount')}{' '}
                    <Link
                        href="/business-signup"
                        variant="body2"
                        color="primary"
                        onClick={() => analytics.trackEvent('navigation', { to: 'business-signup' })}
                        sx={{
                            transition: `color ${getAnimationDuration(300)}`,
                            '&:hover': {
                                color: theme => theme.palette.primary.dark
                            }
                        }}
                    >
                        {translate('SignUpHere')}
                    </Link>
                </Typography>
                <Link
                    href="/forgot-password"
                    variant="body2"
                    color="primary"
                    onClick={() => analytics.trackEvent('navigation', { to: 'forgot-password' })}
                    sx={{
                        transition: `color ${getAnimationDuration(300)}`,
                        '&:hover': {
                            color: theme => theme.palette.primary.dark
                        }
                    }}
                >
                    {translate('ForgotPassword')}
                </Link>
            </Box>

            {(errors.root || loginError) && (
                <Typography
                    role="alert"
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
                    ...getGlowEffect(theme => theme.palette.primary.main, 'low'),
                    transition: getAnimationDuration(300),
                    '&:hover': {
                        transform: themePrefs.animationLevel !== 'none' ? 'translateY(-2px)' : 'none',
                    }
                }}
                disabled={isLoading}
                aria-busy={isLoading}
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
                {['apple', 'google', 'facebook', 'microsoft'].map((provider) => {
                    const icons = {
                        apple: <FaApple size={24} />,
                        google: <FaGoogle size={24} />,
                        facebook: <FaFacebook size={24} />,
                        microsoft: <FaMicrosoft size={24} />
                    };

                    return (
                        <IconButton
                            key={provider}
                            onClick={() => handleSSO(provider)}
                            sx={{
                                p: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                ...getGlassMorphismStyle(0.1),
                                transition: getAnimationDuration(300),
                                '&:hover': {
                                    transform: themePrefs.animationLevel !== 'none' ? 'scale(1.05)' : 'none',
                                    ...getGlowEffect(theme => theme.palette.primary.main, 'low')
                                }
                            }}
                            aria-label={`Continue with ${provider}`}
                        >
                            {icons[provider]}
                        </IconButton>
                    );
                })}
            </Box>
        </Box>
    ), [loginMethod, register, handleSubmit, errors, isLoading, showPassword, translate, control, isDark, getGlassMorphismStyle, getGlowEffect, getAnimationDuration, themePrefs.animationLevel, loginError, analytics]);

    return (
        <StyledPaper elevation={3} sx={isMobile ? { p: 2 } : {}}>
            <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{
                    color: theme => theme.palette.primary.main,
                    fontWeight: 'bold',
                    mb: 3,
                    ...(themePrefs.useGlowEffects && {
                        textShadow: theme => `0 0 10px ${theme.palette.primary.main}40`
                    })
                }}
            >
                {themePrefs.animationLevel !== 'none' ? animatedTitle : titleText}
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

            {loginForm}
        </StyledPaper>
    );
};

export default React.memo(Login);