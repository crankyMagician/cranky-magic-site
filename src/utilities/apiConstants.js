// Direct API URL without protocol (for use with CORS proxy)
export const API_TARGET = 'https://dev.auth.spatialmods.com';

// Direct API URL (for direct access)
export const DIRECT_API_URL = 'https://dev.auth.spatialmods.com';

// CORS proxy base URL
export const CORS_PROXY = 'http://localhost:8080/';

// The fully formatted proxy URL that works with cors-anywhere format
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://dev.auth.spatialmods.com';

// For testing and direct API endpoints
export const API_ENDPOINTS = {
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/auth/reset-password`,
  directResetPassword: 'http://localhost:4000/auth/reset-password',
  proxyResetPassword: 'http://localhost:8080/http://localhost:4000/auth/reset-password'
};

console.log('API Configuration:', {
  directApiUrl: DIRECT_API_URL,
  corsProxy: CORS_PROXY,
  apiBaseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS
});

