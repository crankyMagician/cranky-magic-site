/**
 * Central configuration module for the application
 * Handles environment-specific settings and API URLs
 */

// Log at load time to see when this module initializes
console.log('=== CONFIG MODULE INITIALIZATION ===');
console.log('Environment variables at load time:');
console.log('REACT_APP_ENV:', process.env.REACT_APP_ENV);
console.log('REACT_APP_USE_PROXY:', process.env.REACT_APP_USE_PROXY);
console.log('REACT_APP_PROXY_URL:', process.env.REACT_APP_PROXY_URL);
console.log('REACT_APP_AUTH_API_URL:', process.env.REACT_APP_AUTH_API_URL);
console.log('REACT_APP_MAIN_API_URL:', process.env.REACT_APP_MAIN_API_URL);

const config = {
    // Environment detection
    env: process.env.REACT_APP_ENV || 'development',

    // API Configuration
    api: {
        useProxy: process.env.REACT_APP_USE_PROXY === 'true',
        proxyUrl: process.env.REACT_APP_PROXY_URL || 'http://localhost:8080',
        authApiUrl: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:8080/https://dev.auth.spatialmods.com',
        mainApiUrl: process.env.REACT_APP_MAIN_API_URL || 'http://localhost:8080/https://dev.net-api.spatialmods.com',
    },


    // Environment helper functions
    isProduction: () => {
        const isProd = config.env === 'production';
        console.log(`isProduction() called, returning: ${isProd}`);
        return isProd;
    },

    isDevelopment: () => {
        const isDev = config.env === 'development';
        console.log(`isDevelopment() called, returning: ${isDev}`);
        return isDev;
    },

    isStaging: () => {
        const isStaging = config.env === 'staging';
        console.log(`isStaging() called, returning: ${isStaging}`);
        return isStaging;
    },

    // Get full URLs with proxy handling if needed
    getAuthApiUrl: () => {
        console.log('getAuthApiUrl() called with:');
        console.log('  config.api.useProxy:', config.api.useProxy);
        console.log('  config.isDevelopment():', config.isDevelopment());
        console.log('  config.api.proxyUrl:', config.api.proxyUrl);
        console.log('  config.api.authApiUrl:', config.api.authApiUrl);

        let result;
        if (config.api.useProxy && config.isDevelopment()) {
            // Just return '/auth' for development with proxy
            result = '/auth';
            console.log('  Using development proxy path: /auth');
        } else if (config.api.useProxy) {
            // For non-development environments with proxy
            result = `${config.api.proxyUrl}/${config.api.authApiUrl.replace(/^https?:\/\//, '')}`;
            console.log('  Using proxy URL:', result);
        } else {
            // Direct API access without proxy
            result = config.api.authApiUrl;
            console.log('  Using direct API URL:', result);
        }

        console.log('  getAuthApiUrl() returning:', result);
        return result;
    },

    getMainApiUrl: () => {
        console.log('getMainApiUrl() called with:');
        console.log('  config.api.useProxy:', config.api.useProxy);
        console.log('  config.api.proxyUrl:', config.api.proxyUrl);
        console.log('  config.api.mainApiUrl:', config.api.mainApiUrl);

        let result;
        if (config.api.useProxy && config.isDevelopment()) {
            // Just return '/api' for development with proxy
            result = '/api';
            console.log('  Using development proxy path: /api');
        } else if (config.api.useProxy) {
            result = `${config.api.proxyUrl}/${config.api.mainApiUrl.replace(/^https?:\/\//, '')}`;
            console.log('  Using proxy URL:', result);
        } else {
            result = config.api.mainApiUrl;
            console.log('  Using direct API URL:', result);
        }

        console.log('  getMainApiUrl() returning:', result);
        return result;
    },

    // Get a complete URL for a specific endpoint
    getAuthEndpointUrl: (endpoint) => {
        console.log('getAuthEndpointUrl() called with endpoint:', endpoint);
        const baseUrl = config.getAuthApiUrl();
        const formatted = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const result = `${baseUrl}${formatted}`;
        console.log('  getAuthEndpointUrl() returning:', result);
        return result;
    },

    getMainEndpointUrl: (endpoint) => {
        console.log('getMainEndpointUrl() called with endpoint:', endpoint);
        const baseUrl = config.getMainApiUrl();
        const formatted = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const result = `${baseUrl}${formatted}`;
        console.log('  getMainEndpointUrl() returning:', result);
        return result;
    },
};

// Dump the full config object to check all values
console.log('=== FULL CONFIG OBJECT ===');
console.log('config.env:', config.env);
console.log('config.api:', {
    useProxy: config.api.useProxy,
    proxyUrl: config.api.proxyUrl,
    authApiUrl: config.api.authApiUrl,
    mainApiUrl: config.api.mainApiUrl
});
console.log('config.getAuthApiUrl():', config.getAuthApiUrl());
console.log('config.getMainApiUrl():', config.getMainApiUrl());
console.log('config.getAuthEndpointUrl("/login"):', config.getAuthEndpointUrl('/login'));

// Log configuration in development
if (config.isDevelopment()) {
    console.log('=== DEVELOPMENT CONFIG SUMMARY ===');
    console.log('Application Configuration:', {
        environment: config.env,
        authApiUrl: config.getAuthApiUrl(),
        mainApiUrl: config.getMainApiUrl(),
        usingProxy: config.api.useProxy,
        proxyUrl: config.api.proxyUrl,
    });
}

export default config;