// baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import TokenDecoder from '../utilities/TokenDecoder';

// Direct API URLs - no proxying
const AUTH_API_URL = 'https://dev.auth.spatialmods.com/auth';
const MAIN_API_URL = 'https://dev.net-api.spatialmods.com';

// Helper function to construct direct URLs
const getApiUrl = (endpoint, apiType) => {
    // Select the appropriate base URL (direct, no proxy)
    const baseUrl = apiType === 'auth' ? AUTH_API_URL : MAIN_API_URL;

    // Remove any leading slashes in endpoint to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

    // Return the full direct URL
    return `${baseUrl}/${cleanEndpoint}`;
};

// Create a base query with direct URLs
const baseQuery = fetchBaseQuery({
    // Empty baseUrl since we're using full URLs in each request
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    },
    credentials: 'include'
});

// Enhanced base query with token handling
const enhancedBaseQuery = async (args, api, extraOptions) => {
    // Log the request
    if (typeof args === 'string') {
        console.log(`[API] Request: GET ${args}`);
    } else if (args.url) {
        console.log(`[API] Request: ${args.method || 'GET'} ${args.url}`);
    }

    // Execute the query
    let result = await baseQuery(args, api, extraOptions);

    console.log(`[API] Response status:`, result.error ? `Error: ${result.error.status}` : 'Success');

    // Handle 401 Unauthorized errors - token expired
    if (result.error && result.error.status === 401) {
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
        'Campaign',
        'Invitation',
        'Media',
        'Commo'
    ],
    endpoints: () => ({}),
});

// Export the needed APIs for compatibility with existing code
export const authApi = baseApi;
export const businessApi = baseApi;
export const mediaApi = baseApi;
export const campaignsApi = baseApi;
export const commoApi = baseApi;
export const invitationsApi = baseApi;

// Export reducers and middleware for store configuration
export const apiReducers = {
    [baseApi.reducerPath]: baseApi.reducer
};

export const apiMiddleware = [baseApi.middleware];

// Export the getApiUrl helper for use in API slices
export { getApiUrl };

export default baseApi;