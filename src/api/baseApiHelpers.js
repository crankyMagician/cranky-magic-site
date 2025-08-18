// baseApiHelpers.js

/**
 * Helper functions for handling ServiceResponse format from .NET API
 */

/**
 * Transform a ServiceResponse to extract the data
 * @param {Object} response - The ServiceResponse from the API
 * @returns {*} The data from the response
 * @throws {Object} Error object if response indicates failure
 */
export const transformServiceResponse = (response) => {
    // If response is null or undefined, throw error
    if (!response) {
        throw {
            status: 'PARSING_ERROR',
            message: 'No response received from server'
        };
    }

    // If it's already unwrapped data (doesn't have success property), return as is
    // This handles backwards compatibility or non-ServiceResponse endpoints
    if (response.success === undefined && !response.hasOwnProperty('data')) {
        return response;
    }

    // Handle ServiceResponse format
    if (response.success === false) {
        throw {
            status: 'API_ERROR',
            message: response.message || 'Operation failed',
            data: response.data
        };
    }

    // Return the data from successful response
    return response.data;
};

/**
 * Transform error responses to a consistent format
 * @param {Object} response - The error response from RTK Query
 * @returns {Object} Formatted error object
 */
export const transformServiceErrorResponse = (response, defaultMessage = 'An error occurred') => {
    // Handle network errors or non-response errors
    if (!response || !response.data) {
        return {
            status: response?.status || 'NETWORK_ERROR',
            message: response?.error || defaultMessage,
            details: null
        };
    }

    const errorData = response.data;

    // Handle ServiceResponse error format
    if (errorData.success === false) {
        return {
            status: response.status,
            message: errorData.message || defaultMessage,
            details: errorData.data || null
        };
    }

    // Handle ASP.NET Core ProblemDetails format
    if (errorData.type || errorData.title || errorData.detail) {
        return {
            status: response.status || errorData.status,
            message: errorData.detail || errorData.title || defaultMessage,
            details: {
                type: errorData.type,
                title: errorData.title,
                errors: errorData.errors
            }
        };
    }

    // Handle raw error messages
    if (typeof errorData === 'string') {
        return {
            status: response.status,
            message: errorData,
            details: null
        };
    }

    // Default error format
    return {
        status: response.status,
        message: errorData.message || errorData.error || defaultMessage,
        details: errorData
    };
};

/**
 * Create standard query configuration with ServiceResponse handling
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query configuration object
 */
export const createServiceQuery = (url, method = 'GET', options = {}) => {
    return {
        url,
        method,
        ...options,
        // Note: transformResponse and transformErrorResponse should be added at the endpoint level
        // This is just a helper to construct the base query object
    };
};

/**
 * Helper to handle paginated ServiceResponse data
 * @param {Object} response - The ServiceResponse with paginated data
 * @returns {Object} Normalized pagination data
 */
export const transformPaginatedResponse = (response) => {
    const data = transformServiceResponse(response);

    // Handle different pagination formats from the API
    if (data && typeof data === 'object') {
        // If data has items array with pagination metadata
        if (Array.isArray(data.items)) {
            return {
                items: data.items,
                totalCount: data.totalCount || data.items.length,
                page: data.page || 1,
                pageSize: data.pageSize || data.items.length,
                totalPages: data.totalPages || 1
            };
        }

        // If data itself is an array (no pagination metadata)
        if (Array.isArray(data)) {
            return {
                items: data,
                totalCount: data.length,
                page: 1,
                pageSize: data.length,
                totalPages: 1
            };
        }

        // If data has results array (another common pattern)
        if (Array.isArray(data.results)) {
            return {
                items: data.results,
                totalCount: data.total || data.totalCount || data.results.length,
                page: data.page || data.currentPage || 1,
                pageSize: data.pageSize || data.size || data.results.length,
                totalPages: data.totalPages || data.pages || 1
            };
        }
    }

    // Return as is if we can't identify the pagination structure
    return data;
};

/**
 * Helper to handle file download responses
 * @param {Object} response - The response from a file download endpoint
 * @returns {Blob|Object} The file blob or ServiceResponse data
 */
export const transformFileDownloadResponse = (response) => {
    // If response is already a Blob, return it
    if (response instanceof Blob) {
        return response;
    }

    // Otherwise, treat it as a ServiceResponse
    return transformServiceResponse(response);
};

// Export all helpers
export default {
    transformServiceResponse,
    transformServiceErrorResponse,
    createServiceQuery,
    transformPaginatedResponse,
    transformFileDownloadResponse
};