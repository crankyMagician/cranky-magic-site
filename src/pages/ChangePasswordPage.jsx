import React from 'react';
import { Box, Container } from '@mui/material';
import ChangePassword from '../components/auth/ChangePassword';
import AuthRouteWrapper from '../utilities/AuthRouteWrapper';

const ChangePasswordPage = () => {
  return (
    <AuthRouteWrapper>
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
          <ChangePassword />
        </Container>
      </Box>
    </AuthRouteWrapper>
  );
};

export default ChangePasswordPage; 