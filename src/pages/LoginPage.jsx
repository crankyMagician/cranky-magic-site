import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Login from '../components/auth/Login';
import { useAuth } from '../hooks/useAuth';
import useAnalytics from '../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../hooks/useSpatialTheme';
import { GuestGuard } from '../routes';

/**
 * Login Page component
 * Contains the login form and handles redirections for authenticated users
 */
const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const analytics = useAnalytics();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { isDark, getGlassMorphismStyle } = useSpatialTheme();

    // Track redirects only (page view is handled by RouteContext)
    useEffect(() => {
        // Track if user was redirected here from a protected route
        if (location.state?.from) {
            analytics.trackEvent('auth_redirect', {
                from: location.state.from.pathname,
                to: location.pathname,
                reason: 'unauthenticated'
            });
        }
    }, [analytics, location]);

    // The LoginPage component is wrapped with GuestGuard
    // which handles the redirect for authenticated users
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: { xs: 1, sm: 2 },
                background: theme => isDark
                    ? 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,245,0.8) 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...(isMobile ? {} : getGlassMorphismStyle(0.2))
                }}
            >
                <Login />
            </Container>
        </Box>
    );
};

// Wrap the component with GuestGuard to prevent authenticated users from accessing it
const ProtectedLoginPage = () => (
    <GuestGuard redirectPath="/dashboard">
        <LoginPage />
    </GuestGuard>
);

export default ProtectedLoginPage;