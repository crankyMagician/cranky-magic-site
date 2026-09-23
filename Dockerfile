# syntax=docker/dockerfile:1.7

# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install

# Copy source and build React app
COPY . .
ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=${REACT_APP_ENV}
ARG PUBLIC_URL=/
ENV PUBLIC_URL=${PUBLIC_URL}
RUN npm run build

# ---- Runtime Stage ----
FROM nginx:1.27-alpine

# Copy built React app to nginx html folder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config with optimized caching headers for static assets
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
