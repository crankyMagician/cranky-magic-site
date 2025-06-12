import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../../reducers/authReducer';
import AuthTokenService from '../../services/AuthTokenService';
import { API_ENDPOINTS } from '../../utilities/apiConstants';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import validatePassword from '../../utilities/PasswordValidator';

const DirectPasswordReset = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.resetCode || !formData.newPassword) {
      setStatus({
        type: 'error',
        message: 'All fields are required'
      });
      return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.success) {
      setStatus({
        type: 'error',
        message: passwordValidation.message
      });
      return;
    }
    
    try {
      setLoading(true);
      setStatus({ type: '', message: '' });
      
      // Direct API call to reset password
      console.log('Making direct API call to reset password');
      
      const payload = {
        email: formData.email,
        resetCode: formData.resetCode,
        newPassword: formData.newPassword
      };
      
      // Try first with CORS proxy
      try {
        console.log('Attempting reset with proxy URL:', API_ENDPOINTS.proxyResetPassword);
        const response = await axios.post(
          API_ENDPOINTS.proxyResetPassword,
          payload,
          { 
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        console.log('Reset password response:', response.data);
        
        if (response.data.token) {
          // Handle successful login with token
          AuthTokenService.setAuthInfo({
            isAuthenticated: true,
            user: response.data.user,
            authToken: response.data.token,
            roles: response.data.roles || [],
            businesses: response.data.businesses || [],
            activeBusiness: response.data.activeBusiness || null
          });
          
          dispatch(setCredentials(response.data));
          
          setStatus({
            type: 'success',
            message: 'Password reset successful! You are now logged in'
          });
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus({
            type: 'success',
            message: 'Password reset successful! Please login with your new password'
          });
        }
      } catch (proxyError) {
        // If proxy fails, try direct call
        console.error('Proxy call failed:', proxyError);
        console.log('Trying direct API call to:', API_ENDPOINTS.directResetPassword);
        
        const directResponse = await axios.post(
          API_ENDPOINTS.directResetPassword,
          payload,
          { 
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        console.log('Direct reset password response:', directResponse.data);
        
        if (directResponse.data.token) {
          // Handle successful login with token
          AuthTokenService.setAuthInfo({
            isAuthenticated: true,
            user: directResponse.data.user,
            authToken: directResponse.data.token,
            roles: directResponse.data.roles || [],
            businesses: directResponse.data.businesses || [],
            activeBusiness: directResponse.data.activeBusiness || null
          });
          
          dispatch(setCredentials(directResponse.data));
          
          setStatus({
            type: 'success',
            message: 'Password reset successful! You are now logged in'
          });
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus({
            type: 'success',
            message: 'Password reset successful! Please login with your new password'
          });
        }
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      console.error('Error response:', error.response?.data);
      
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to reset password'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom align="center">
        Direct Password Reset
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        Use this form to reset your password directly
      </Typography>
      
      {status.message && (
        <Alert 
          severity={status.type || 'info'} 
          sx={{ width: '100%', mb: 2 }}
          onClose={() => setStatus({ type: '', message: '' })}
        >
          {status.message}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Reset Code"
          name="resetCode"
          value={formData.resetCode}
          onChange={handleChange}
          disabled={loading}
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="New Password"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          disabled={loading}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Reset Password'}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="text" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          Debug Info:
          
          Proxy URL: {API_ENDPOINTS.proxyResetPassword}
          Direct URL: {API_ENDPOINTS.directResetPassword}
          
          This form makes direct API calls bypassing RTK Query.
        </Typography>
      </Box>
    </Paper>
  );
};

export default DirectPasswordReset; 