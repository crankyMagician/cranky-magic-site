# syntax=docker/dockerfile:1.7

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=${REACT_APP_ENV}
RUN npm run build

# Run stage
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Copy build output
COPY --from=builder /app/build .

# Drop in minimal nginx.conf directly
RUN printf "server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri /index.html;\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
