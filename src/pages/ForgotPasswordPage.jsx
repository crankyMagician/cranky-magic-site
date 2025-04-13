import React from 'react';
import { Box, Container } from '@mui/material';
import ForgotPassword from '../components/auth/ForgotPassword';
import { useLocation } from 'react-router-dom';
import { useSpatialTheme } from '../hooks/useSpatialTheme';
import { GuestGuard } from '../routes';

// Define as a proper function component
const ForgotPasswordPage = () => {
    const location = useLocation();
    const { getGlassMorphismStyle, getAnimationDuration } = useSpatialTheme();

    return (
        <GuestGuard>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    p: { xs: 1, sm: 2 },
                    backgroundImage: 'none',
                    transition: `all ${getAnimationDuration(300)}`,
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

// Make sure to export the function component correctly
export default ForgotPasswordPage;