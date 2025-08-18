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

# Copy build artifacts
COPY --from=builder /app/build/ .

# Copy assets if needed
COPY --from=builder /app/public/assets ./assets

# Apache config for React SPA
RUN printf " \
<Directory \"/usr/local/apache2/htdocs\">\n\
    AllowOverride None\n\
    Require all granted\n\
</Directory>\n\
\n\
# Send everything to index.html for SPA routing\n\
<IfModule mod_rewrite.c>\n\
    RewriteEngine On\n\
    RewriteCond %%{REQUEST_FILENAME} !-f\n\
    RewriteCond %%{REQUEST_FILENAME} !-d\n\
    RewriteRule ^ index.html [L]\n\
</IfModule>\n\
\n\
# Caching for static files\n\
<IfModule mod_expires.c>\n\
    ExpiresActive On\n\
    ExpiresByType text/css \"access plus 1 month\"\n\
    ExpiresByType application/javascript \"access plus 1 month\"\n\
    ExpiresByType image/jpeg \"access plus 1 year\"\n\
    ExpiresByType image/png \"access plus 1 year\"\n\
    ExpiresByType image/gif \"access plus 1 year\"\n\
    ExpiresByType font/woff2 \"access plus 1 year\"\n\
</IfModule>\n\
" > /usr/local/apache2/conf/extra/react-spa.conf \
 && echo "Include conf/extra/react-spa.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]
