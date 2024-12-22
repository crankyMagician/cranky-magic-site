/**
 * axios setup to use mock service
 */
//src/utilities/axios.js
import axios from 'axios';
import { logError } from './Logger';
import { ErrorToast } from '../components/demoComponents/ErrorToast';
import {API_BASE_URL} from "./apiConstants";

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_API_URL || API_BASE_URL
});

// Interceptor for http
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

        return Promise.reject(error);
    }
);


export default axiosServices;
