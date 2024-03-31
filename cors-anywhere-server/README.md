
---
# CORS Anywhere Setup Guide 🌍

This guide explains how to set up and use CORS Anywhere for local development, helping to resolve CORS issues when making API requests. For use with [[Blazar Software]]'s [[Grant Search]] front end as well as [[Managemint]].

## Step 1: Install Node.js 🛠️

Ensure Node.js is installed on your system. If not, download and install it from [nodejs.org](https://nodejs.org/).

## Step 2: Set Up CORS Anywhere Locally 💻

1. **Create a new directory**:
   ```bash
   mkdir cors-anywhere-server
   cd cors-anywhere-server
   ```

2. **Initialize a new Node.js project**:
   ```bash
   npm init -y
   ```

3. **Install CORS Anywhere**:
   ```bash
   npm install cors-anywhere
   ```

4. **Create a server file (`server.js`)**:
   ```javascript
   // server.js
   const cors_anywhere = require('cors-anywhere');

   const host = 'localhost';
   const port = 8080;

   cors_anywhere.createServer({
       originWhitelist: [], // Allow all origins
       requireHeader: ['origin', 'x-requested-with'],
       removeHeaders: ['cookie', 'cookie2']
   }).listen(port, host, function() {
       console.log('Running CORS Anywhere on ' + host + ':' + port);
   });
   ```

5. **Run the server**:
   ```bash
   node server.js
   ```

## Step 3: Use the CORS Anywhere Server in Your Application 🔗

Modify your API requests in the React application to use the local CORS Anywhere server:

Before:
```javascript
fetch('https://api.novagrant.com/createuser', {
    // ... other settings ...
});
```

After:
```javascript
fetch('http://localhost:8080/https://api.novagrant.com/createuser', {
    // ... other settings ...
});
```

## Important Notes 📝

- **For Development Only**: CORS Anywhere should be used only for development.
- **Server Load**: Be mindful of the performance impact.
- **Security**: Use CORS Anywhere responsibly and ensure only trusted requests are made through it.

Happy coding! 🚀


---
### Signature

🖋️ *Signed by [crankyMagician](https://github.com/crankyMagician)*

*Created at 2024-03-20 17:58
tags: [#code. #documentation, #javascript, #programming, #cors, #node]

---