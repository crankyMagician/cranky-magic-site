import React from 'react';
import { Box, Container } from '@mui/material';
import BusinessSignup from '../components/Auth/BusinessSignup';
import useCustomTranslation from "../hooks/useCustomTranslation";

const BusinessSignupPage = () => {
    const { customT } = useCustomTranslation();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                backgroundColor: 'background.default'
            }}
        >
            <Container maxWidth="lg">
                <BusinessSignup />
            </Container>
        </Box>
    );
};

export default BusinessSignupPage; 