// baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import TokenDecoder from '../utilities/TokenDecoder';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function to construct proper URLs based on environment
const getApiUrl = (endpoint, apiType) => {
    // Select the appropriate base path
    const basePath = apiType === 'auth'
        ? '/auth-api'
        : '/main-api';

    // Remove any leading slashes in endpoint to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

    // Return the full path (Static Web App will handle proxying to the real domain)
    return `${basePath}/${cleanEndpoint}`;
};

// Create a base query that will work across environments
const baseQuery = fetchBaseQuery({
    baseUrl: '/',
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

// Create enhanced base query with token handling and URL construction
const enhancedBaseQuery = async (args, api, extraOptions) => {
    // If we have a complete URL in args, use it as is
    if (typeof args === 'string') {
        console.log(`[API] Request: GET ${args}`);
    } else if (args.url) {
        // We don't modify the URL here as it will be constructed by the endpoints
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

// Export the getApiUrl helper for use in API slices
export { getApiUrl };

export default baseApi;