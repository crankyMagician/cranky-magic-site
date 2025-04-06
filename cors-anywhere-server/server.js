// server.js
const cors_proxy = require('cors-anywhere');

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || 'localhost';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;

cors_proxy.createServer({
    // Allow all origins
    originWhitelist: [],
    // Remove all header requirements
    requireHeader: [],
    // Allow all methods
    removeHeaders: ['cookie', 'cookie2'],
    // Add special handler for SSL/TLS certificates to avoid certificate validation errors
    httpProxyOptions: {
        secure: false
    },
    // Add request logging for debugging
    onRequest: (req) => {
        console.log(`[CORS Proxy] Request: ${req.method} ${req.url}`);
    },
    onProxyRequest: (proxyReq, req) => {
        console.log(`[CORS Proxy] Proxying: ${req.method} ${req.url}`);
    },
    onProxyResponse: (proxyRes, req) => {
        console.log(`[CORS Proxy] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
    },
    onProxyError: (err, req, res) => {
        console.error(`[CORS Proxy] Error: ${err.message} for ${req.method} ${req.url}`);
    }
}).listen(port, host, () => {
    console.log(`CORS Anywhere proxy server running on http://${host}:${port}`);
    console.log(`Example usage: http://${host}:${port}/http://example.com`);
});