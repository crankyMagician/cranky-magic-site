import React from 'react';
import { Box, Container } from '@mui/material';
import BusinessSignup from '../components/auth/BusinessSignup';
import useCustomTranslation from "../hooks/useCustomTranslation";
import { useSpatialTheme } from '../hooks/useSpatialTheme';
import { GuestGuard } from '../routes';

/**
 * BusinessSignupPage - Container component for the BusinessSignup form
 * Provides the layout and context for business registration
 * Protected by GuestGuard to prevent authenticated users from accessing
 */
const BusinessSignupPage = () => {
    const { translate } = useCustomTranslation();
    const { getGlassMorphismStyle, getAnimationDuration } = useSpatialTheme();

    // Note: No analytics tracking here since RouteContext handles page tracking

    return (
        <GuestGuard>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    backgroundColor: 'background.default',
                    transition: `all ${getAnimationDuration(300)}`,
                    ...getGlassMorphismStyle(0.4)
                }}
                aria-label={translate('BusinessSignupTitle')}
            >
                <Container maxWidth="lg">
                    <BusinessSignup />
                </Container>
            </Box>
        </GuestGuard>
    );
};

// Use React.memo to prevent unnecessary re-renders
export default BusinessSignupPage;