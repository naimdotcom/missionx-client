# # Build stage
# FROM oven/bun:1-alpine AS builder

# WORKDIR /app

# # Copy package files
# COPY package.json bun.lockb* ./

# # Install dependencies
# RUN bun install --frozen-lockfile || bun install

# # Copy source code
# COPY . .

# # syntax=docker/dockerfile:1
# FROM node:18-alpine as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .

# # Mount the secrets as environment variables ONLY during the build command
# RUN --mount=type=secret,id=VITE_FIREBASE_API_KEY \
#     --mount=type=secret,id=VITE_FIREBASE_AUTH_DOMAIN \
#     VITE_FIREBASE_API_KEY=$(cat /run/secrets/VITE_FIREBASE_API_KEY) \
#     VITE_FIREBASE_AUTH_DOMAIN=$(cat /run/secrets/VITE_FIREBASE_AUTH_DOMAIN) \
#     npm run build
# # Accept build arguments for Firebase configuration
# ARG VITE_FIREBASE_API_KEY
# ARG VITE_FIREBASE_AUTH_DOMAIN
# ARG VITE_FIREBASE_PROJECT_ID
# ARG VITE_FIREBASE_STORAGE_BUCKET
# ARG VITE_FIREBASE_MESSAGING_SENDER_ID
# ARG VITE_FIREBASE_APP_ID
# ARG VITE_API_BASE_URL

# # Set environment variables for build
# ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
# ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
# ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
# ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
# ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
# ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
# ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# # Build the application
# RUN bun run build

# # Production stage
# FROM nginx:alpine

# # Copy built assets from builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]

# syntax=docker/dockerfile:1
# 1. Change this from node:18-alpine to the official Bun image
FROM oven/bun:1-alpine AS build-stage
WORKDIR /app

# 2. Declare your secrets (same as before)
# ... (keep the same secret mount logic here)

# 3. Use bun install
COPY package*.json bun.lockb* ./
RUN bun install

COPY . .

# 4. Inject secrets and build
RUN --mount=type=secret,id=VITE_FIREBASE_API_KEY \
    --mount=type=secret,id=VITE_FIREBASE_AUTH_DOMAIN \
    --mount=type=secret,id=VITE_FIREBASE_PROJECT_ID \
    --mount=type=secret,id=VITE_FIREBASE_STORAGE_BUCKET \
    --mount=type=secret,id=VITE_FIREBASE_MESSAGING_SENDER_ID \
    --mount=type=secret,id=VITE_FIREBASE_APP_ID \
    --mount=type=secret,id=VITE_API_BASE_URL \
    VITE_FIREBASE_API_KEY=$(cat /run/secrets/VITE_FIREBASE_API_KEY) \
    VITE_FIREBASE_AUTH_DOMAIN=$(cat /run/secrets/VITE_FIREBASE_AUTH_DOMAIN) \
    VITE_FIREBASE_PROJECT_ID=$(cat /run/secrets/VITE_FIREBASE_PROJECT_ID) \
    VITE_FIREBASE_STORAGE_BUCKET=$(cat /run/secrets/VITE_FIREBASE_STORAGE_BUCKET) \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$(cat /run/secrets/VITE_FIREBASE_MESSAGING_SENDER_ID) \
    VITE_FIREBASE_APP_ID=$(cat /run/secrets/VITE_FIREBASE_APP_ID) \
    VITE_API_BASE_URL=$(cat /run/secrets/VITE_API_BASE_URL) \
    bun run build

# Stage 2: Serve with Nginx (this stays the same)
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]