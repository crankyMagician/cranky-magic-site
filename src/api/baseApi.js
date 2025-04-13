// baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import TokenDecoder from '../utilities/TokenDecoder';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Create a base query that will work across environments
const baseQuery = fetchBaseQuery({
    // In development, always use the proxy server directly
    baseUrl: isDevelopment ? 'http://localhost:8080' : '/',
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

// Create enhanced base query with token handling
const enhancedBaseQuery = async (args, api, extraOptions) => {
    console.log(`[API] Request: ${args.method || 'GET'} ${baseQuery.baseUrl}${args.url}`);

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

export default baseApi;
