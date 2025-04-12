/**
 * Central configuration module for the application
 * Handles environment-specific settings and API URLs
 */

const config = {
    // Environment detection
    env: process.env.REACT_APP_ENV || 'development',

    // API Configuration
    api: {
        useProxy: process.env.REACT_APP_USE_PROXY === 'true',
        proxyUrl: process.env.REACT_APP_PROXY_URL || 'http://localhost:8080',
        authApiUrl: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:4000',
        mainApiUrl: process.env.REACT_APP_MAIN_API_URL || 'http://localhost:5000',
    },

    // Environment helper functions
    isProduction: () => config.env === 'production',
    isDevelopment: () => config.env === 'development',
    isStaging: () => config.env === 'staging',

    // Get full URLs with proxy handling if needed
    getAuthApiUrl: () => {
        if (config.api.useProxy) {
            return `${config.api.proxyUrl}/${config.api.authApiUrl.replace(/^https?:\/\//, '')}`;
        }
        return config.api.authApiUrl;
    },

    getMainApiUrl: () => {
        if (config.api.useProxy) {
            return `${config.api.proxyUrl}/${config.api.mainApiUrl.replace(/^https?:\/\//, '')}`;
        }
        return config.api.mainApiUrl;
    },

    // Get a complete URL for a specific endpoint
    getAuthEndpointUrl: (endpoint) => {
        return `${config.getAuthApiUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    },

    getMainEndpointUrl: (endpoint) => {
        return `${config.getMainApiUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    },
};

// Log configuration in development
if (config.isDevelopment()) {
    console.log('Application Configuration:', {
        environment: config.env,
        authApiUrl: config.getAuthApiUrl(),
        mainApiUrl: config.getMainApiUrl(),
        usingProxy: config.api.useProxy,
        proxyUrl: config.api.proxyUrl,
    });
}

export default config;