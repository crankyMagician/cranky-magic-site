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
COPY --from=builder /app/build .

RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
