import axios from 'axios';
import { API_BASE_URL } from '../utilities/apiConstants';

const baseURL = process.env.REACT_APP_API_URL || API_BASE_URL;

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Log the base URL being used for debugging
console.log('API Base URL:', baseURL);

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add logging to debug request URLs
    console.log('API Request URL:', config.url);
    
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.message, error.config?.url);
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 