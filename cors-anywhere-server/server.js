// server.js
const cors_anywhere = require('cors-anywhere');

// Listen on a specific host via the HOST environment variable
const host = 'localhost';
// Listen on a specific port via the PORT environment variable
const port = 8080;

cors_anywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});