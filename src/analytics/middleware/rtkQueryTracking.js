import { logError } from '../../utilities/Logger';
import { ErrorToast } from '../../components/demoComponents/ErrorToast';

/**
 * Setup tracking for RTK Query
 * @param {Object} apiSlice - The RTK Query API slice
 * @param {Object} analytics - The analytics instance
 */
const setupRtkQueryTracking = (apiSlice, analytics) => {
    // Get the original middleware
    const middleware = apiSlice.middleware;

    // Listen to RTK Query events
    apiSlice.middleware = (getDefaultMiddleware) => {
        const middlewareChain = middleware(getDefaultMiddleware);

        // Add RTK Query event listeners
        apiSlice.util.setupListeners((event, { getState, dispatch, extra, type, payload }) => {
            // Track start of request
            if (type.endsWith('/pending')) {
                const endpoint = payload.meta.arg.endpointName;
                analytics.trackApiRequest({
                    endpoint,
                    method: getMethodFromEndpoint(endpoint),
                    hasPayload: !!payload.meta.arg.originalArgs
                });
            }

            // Track successful responses
            if (type.endsWith('/fulfilled')) {
                const endpoint = payload.meta.arg.endpointName;
                const requestDuration = Date.now() - payload.meta.startedTimeStamp;

                analytics.trackApiResponse({
                    endpoint,
                    method: getMethodFromEndpoint(endpoint),
                    status: 200,
                    duration: requestDuration
                });
            }

            // Track errors
            if (type.endsWith('/rejected')) {
                const endpoint = payload.meta.arg.endpointName;
                const error = payload.error;
                const errorDetails = {
                    message: error.message || 'An error occurred',
                    status: error.status || 500,
                };

                // Log error details
                const errorMessage = `API Error: ${errorDetails.message}, Status: ${errorDetails.status}, Endpoint: ${endpoint}`;
                logError(errorMessage, 'red');

                // Show error toast
                ErrorToast(`Request failed: ${errorDetails.message} (Status: ${errorDetails.status})`);

                // Track error in analytics
                analytics.trackApiError({
                    endpoint,
                    method: getMethodFromEndpoint(endpoint),
                    status: errorDetails.status,
                    error: errorDetails.message
                });

                // Handle 401 errors (unauthorized)
                if (errorDetails.status === 401) {
                    // Note: This is handled in baseApi.js with our enhanced base query
                    // so we don't need to handle it here anymore
                }
            }
        });

        return middlewareChain;
    };
};

// Helper function to guess HTTP method from endpoint name
const getMethodFromEndpoint = (endpoint) => {
    if (endpoint.startsWith('get')) return 'GET';
    if (endpoint.startsWith('post') ||
        endpoint.startsWith('create') ||
        endpoint.startsWith('add')) return 'POST';
    if (endpoint.startsWith('update') ||
        endpoint.startsWith('edit') ||
        endpoint.startsWith('change')) return 'PUT';
    if (endpoint.startsWith('delete') ||
        endpoint.startsWith('remove')) return 'DELETE';
    return 'UNKNOWN';
};

export default setupRtkQueryTracking;