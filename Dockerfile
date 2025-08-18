# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install
COPY . .

ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=${REACT_APP_ENV}
ARG PUBLIC_URL=/
ENV PUBLIC_URL=${PUBLIC_URL}
RUN npm run build

# ---- Runtime ----
FROM httpd:2.4-alpine
WORKDIR /usr/local/apache2/htdocs/

# Copy built React app
COPY --from=builder /app/build/ .

# Optional: custom Apache config for SPA
RUN printf "ServerName localhost\n\
<Directory /usr/local/apache2/htdocs/>\n\
    Options FollowSymLinks\n\
    AllowOverride None\n\
    Require all granted\n\
</Directory>\n\
\n\
# Redirect all requests to index.html for React Router\n\
<IfModule mod_rewrite.c>\n\
    RewriteEngine On\n\
    RewriteCond %%{REQUEST_FILENAME} !-f\n\
    RewriteCond %%{REQUEST_FILENAME} !-d\n\
    RewriteRule ^ index.html [L]\n\
</IfModule>\n" > /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]
