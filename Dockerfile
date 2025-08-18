# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS builder
WORKDIR /app

# Copy package definitions first
COPY package*.json ./

# Install deps (works even if no lockfile)
RUN --mount=type=cache,target=/root/.npm npm install

# Copy rest of app
COPY . .

# Build React
ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=${REACT_APP_ENV}
ARG PUBLIC_URL=/
ENV PUBLIC_URL=${PUBLIC_URL}
RUN npm run build

# ---- Runtime ----
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Copy build artifacts
COPY --from=builder /app/build .

# Minimal nginx.conf for React SPA
RUN printf "server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri /index.html;\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

#HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
#  CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
