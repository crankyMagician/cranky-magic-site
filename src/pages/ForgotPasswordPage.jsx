import React from 'react';
import { Box, Container } from '@mui/material';
import ForgotPassword from '../components/auth/ForgotPassword';

const ForgotPasswordPage = () => {
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
      <Container maxWidth="sm">
        <ForgotPassword />
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage; 