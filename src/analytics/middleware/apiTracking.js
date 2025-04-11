import { sanitizeData } from '../utils/privacyUtils';
import { API_EVENTS } from '../constants/events';

/**
 * Configuration for API endpoint tracking
 * Define which endpoints should have their data logged and how
 */
const API_ENDPOINT_CONFIG = {
    // Authentication endpoints - more sensitive
    '/auth/login': {
        request: {
            include: false, // Don't log request data for login
            reason: 'Contains credentials'
        },
        response: {
            include: true,
            fields: {
                exclude: ['token', 'refreshToken'] // Don't log tokens
            }
        }
    },
    '/auth/register': {
        request: {
            include: true,
            fields: {
                exclude: ['password', 'confirmPassword']
            }
        },
        response: { include: true }
    },
    '/auth/forgot-password': {
        request: { include: true },
        response: { include: true }
    },
    '/auth/reset-password': {
        request: {
            include: true,
            fields: {
                exclude: ['token', 'password', 'confirmPassword']
            }
        },
        response: { include: true }
    },
    '/auth/change-password': {
        request: {
            include: false,
            reason: 'Contains password data'
        },
        response: { include: true }
    },

    // Profile/user data endpoints
    '/user/profile': {
        request: { include: true },
        response: {
            include: true,
            fields: {
                exclude: ['email'] // Optionally exclude emails from logs
            }
        }
    },

    // Default configuration for all other endpoints
    '*': {
        request: {
            include: true,
            fields: {
                exclude: ['password', 'token', 'apiKey', 'secret']
            }
        },
        response: {
            include: true,
            fields: {
                exclude: ['token', 'refreshToken', 'accessToken']
            }
        }
    }
};

/**
 * Get configuration for a specific endpoint
 * Handles wildcards and exact matches
 */
const getEndpointConfig = (url) => {
    // Try exact match first
    if (API_ENDPOINT_CONFIG[url]) {
        return API_ENDPOINT_CONFIG[url];
    }

    // Check for partial matches (e.g., if an endpoint contains a parameter)
    for (const endpoint in API_ENDPOINT_CONFIG) {
        if (endpoint !== '*' && url.includes(endpoint)) {
            return API_ENDPOINT_CONFIG[endpoint];
        }
    }

    // Return default config
    return API_ENDPOINT_CONFIG['*'];
};

/**
 * Process the data for an API request/response according to config
 */
const processApiData = (data, config) => {
    if (!data) return null;
    if (!config.include) return { redacted: true, reason: config.reason || 'Configuration excludes this data' };

    // Handle exclusion of fields
    if (config.fields && config.fields.exclude && config.fields.exclude.length > 0) {
        const processedData = { ...data };

        // Remove excluded fields
        config.fields.exclude.forEach(field => {
            if (field in processedData) {
                processedData[field] = '[REDACTED]';
            }
        });

        // Sanitize the data to remove any PII that might still be present
        return sanitizeData(processedData);
    }

    // If no field exclusions, just sanitize the entire payload
    return sanitizeData(data);
};

/**
 * Setup API tracking for axios instance
 *
 * @param {object} axiosInstance - The axios instance to track
 * @param {object} analytics - The analytics context with tracking methods
 */
export const setupApiTracking = (axiosInstance, analytics) => {
    // Skip if analytics not initialized
    if (!analytics || !analytics.trackEvent) {
        console.warn('API tracking setup failed: analytics not initialized');
        return;
    }

    // Request interceptor
    axiosInstance.interceptors.request.use(
        config => {
            // Generate a unique ID for correlating request and response
            const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            config.requestId = requestId;
            config.requestStartTime = Date.now();

            // Get endpoint path without base URL
            const url = config.url.replace(config.baseURL || '', '');
            // Get tracking config for this endpoint
            const endpointConfig = getEndpointConfig(url);

            // Process request data based on configuration
            const processedData = config.data ?
                processApiData(config.data, endpointConfig.request) :
                null;

            // Track API request
            analytics.trackEvent(API_EVENTS.REQUEST, {
                request_id: requestId,
                endpoint: url,
                method: config.method?.toUpperCase() || 'GET',
                has_payload: !!config.data,
                payload_size: config.data ?
                    (typeof config.data === 'string' ? config.data.length : JSON.stringify(config.data).length) :
                    0,
                payload: processedData
            });

            return config;
        },
        error => {
            // Track request error
            analytics.trackEvent(API_EVENTS.ERROR, {
                error_type: 'request_error',
                message: error.message,
                stack: error.stack
            });

            return Promise.reject(error);
        }
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
        response => {
            // Calculate request duration
            const requestStartTime = response.config.requestStartTime || Date.now();
            const duration = Date.now() - requestStartTime;

            // Get endpoint path
            const url = response.config.url.replace(response.config.baseURL || '', '');

            // Get tracking config for this endpoint
            const endpointConfig = getEndpointConfig(url);

            // Process response data based on configuration
            const processedData = response.data ?
                processApiData(response.data, endpointConfig.response) :
                null;

            // Track successful API response
            analytics.trackEvent(API_EVENTS.RESPONSE, {
                request_id: response.config.requestId,
                endpoint: url,
                method: response.config.method?.toUpperCase() || 'GET',
                status: response.status,
                status_text: response.statusText,
                duration_ms: duration,
                has_data: !!response.data,
                data_size: response.data ?
                    (typeof response.data === 'string' ? response.data.length : JSON.stringify(response.data).length) :
                    0,
                data: processedData
            });

            // Also track latency for performance monitoring
            analytics.trackEvent(API_EVENTS.LATENCY, {
                endpoint: url,
                method: response.config.method?.toUpperCase() || 'GET',
                duration_ms: duration,
                status: response.status
            });

            return response;
        },
        error => {
            // Calculate request duration
            const requestStartTime = error.config?.requestStartTime || Date.now();
            const duration = Date.now() - requestStartTime;

            // Get endpoint path if available
            const url = error.config?.url ?
                error.config.url.replace(error.config.baseURL || '', '') :
                'unknown';

            // Track API error
            analytics.trackEvent(API_EVENTS.ERROR, {
                request_id: error.config?.requestId,
                endpoint: url,
                method: error.config?.method?.toUpperCase() || 'unknown',
                status: error.response?.status || 0,
                status_text: error.response?.statusText || '',
                duration_ms: duration,
                error_message: error.message,
                error_name: error.name,
                error_stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });

            return Promise.reject(error);
        }
    );

    console.log('[Analytics] API tracking middleware initialized');
};

/**
 * Apply API tracking to multiple API service instances
 */
export const setupMultipleApiTracking = (apiInstances, analytics) => {
    if (!Array.isArray(apiInstances)) {
        console.error('setupMultipleApiTracking expects an array of API instances');
        return;
    }

    apiInstances.forEach((instance, index) => {
        setupApiTracking(instance, analytics);
        console.log(`[Analytics] API tracking applied to instance ${index}`);
    });
};

export default setupApiTracking;