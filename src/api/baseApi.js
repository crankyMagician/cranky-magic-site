/**
 * Base API configuration for RTK Query
 * Sets up base query with authentication handling
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';
import TokenDecoder from '../utilities/TokenDecoder';

// Prepare base query with authentication header
const baseQuery = fetchBaseQuery({
    baseUrl: config.getAuthApiUrl(), // Default to auth API
    prepareHeaders: (headers, { getState }) => {
        // Get token from state
        const token = getState().auth.token;

        // Set auth header if token exists
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        // Set content type for JSON
        headers.set('Content-Type', 'application/json');
        return headers;
    },
    credentials: 'include', // Include cookies if your API uses them
});

// Create enhanced base query with token handling
const enhancedBaseQuery = async (args, api, extraOptions) => {
    // Execute the original query
    let result = await baseQuery(args, api, extraOptions);

    // Handle 401 Unauthorized errors - token expired
    if (result.error && result.error.status === 401) {
        // Get current token and check if it's expired
        const state = api.getState();
        const token = state.auth.token;

        if (token) {
            const isExpired = TokenDecoder.isExpired(token);

            if (isExpired) {
                // Token expired, log out user by dispatching logout action
                api.dispatch({ type: 'auth/logout' });
            }
        }
    }

    return result;
};

// Create the base API slice
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: enhancedBaseQuery,
    tagTypes: [
        'Auth',
        'User',
        'Business',
        'BusinessUsers',
        'BusinessRoles',
    ],
    endpoints: () => ({}),
});

export default baseApi;