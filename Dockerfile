# syntax=docker/dockerfile:1.7

# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install
COPY . .

# Build React app
ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=${REACT_APP_ENV}
ARG PUBLIC_URL=/
ENV PUBLIC_URL=${PUBLIC_URL}
RUN npm run build

# ---- Runtime Stage ----
FROM node:20-alpine
WORKDIR /app

# Install only production deps (Express)
RUN npm install express serve-static

# Copy built React app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Add a minimal server.js
RUN printf "const express = require('express');\n\
const path = require('path');\n\
const app = express();\n\
\n\
// Serve static files\n\
app.use(express.static(path.join(__dirname, 'build')));\n\
\n\
// SPA fallback\n\
app.get('*', (req, res) => {\n\
  res.sendFile(path.join(__dirname, 'build', 'index.html'));\n\
});\n\
\n\
const port = process.env.PORT || 3000;\n\
app.listen(port, () => console.log(\`React app listening on port \${port}\`));\n" > server.js

EXPOSE 3000
CMD ["node", "server.js"]
