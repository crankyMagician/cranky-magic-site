import React, { useState, useEffect, useRef } from 'react';
import { Box, Container } from '@mui/material';
import ForgotPassword from '../components/auth/ForgotPassword';
import { useLocation } from 'react-router-dom';
import usePageTracking from '../analytics/hooks/usePageTracking';
import { useSpatialTheme } from '../hooks/useSpatialTheme';
import { GuestGuard } from '../routes';
import useAnalytics from '../analytics/hooks/useAnalytics';

const ForgotPasswordPage = () => {
    // Use page tracking for analytics
    usePageTracking();

    // Track form view only once with a ref
    const { trackEvent } = useAnalytics();
    const hasTrackedForm = useRef(false);

    useEffect(() => {
        if (!hasTrackedForm.current) {
            trackEvent('form_view', {
                form_name: 'forgot_password',
                step: 0,
                auth_method: 'email'
            });
            hasTrackedForm.current = true;
        }
    }, [trackEvent]);

    const location = useLocation();
    const { getGlassMorphismStyle } = useSpatialTheme();

    return (
        <GuestGuard>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    p: { xs: 1, sm: 2 }, // Responsive padding
                    backgroundImage: 'none', // Ensure consistent background
                    ...getGlassMorphismStyle(0.4)
                }}
            >
                <Container maxWidth="sm">
                    <ForgotPassword redirectPath={location.state?.from?.pathname || '/'} />
                </Container>
            </Box>
        </GuestGuard>
    );
};

export default React.memo(ForgotPasswordPage); // Prevent unnecessary re-renders