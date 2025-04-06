/**
 * axios setup to use mock service
 */
//src/utilities/axios.js
import axios from 'axios';
import { logError } from './Logger';
import { ErrorToast } from '../components/demoComponents/ErrorToast';
import {API_BASE_URL} from "./apiConstants";
import store from "../state/store";

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_API_URL || API_BASE_URL
});

// Request interceptor
axiosServices.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosServices.interceptors.response.use(
    response => response,
    error => {
        const errorDetails = {
            message: error.response?.data?.message || 'An error occurred',
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.response?.headers,
        };

        const errorMessage = `API Error: ${errorDetails.message}, Status: ${errorDetails.status}, Method: ${errorDetails.method}, URL: ${errorDetails.url}`;

        // Log the detailed error message to the console
        logError(errorMessage, 'red');

        // Show a detailed error message in a toast
        // Be mindful of exposing sensitive information in the toast
        ErrorToast(`Request failed: ${errorDetails.message} (Status: ${errorDetails.status})`);

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            store.dispatch({ type: 'auth/logout' });
        }

        return Promise.reject(error);
    }
);

export default axiosServices;
