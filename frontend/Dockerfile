# Stage 1: Build React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci --silent || npm install

# Copy source files
COPY . .

# Accept optional backend API URL at build time
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle
RUN npm run build

# Stage 2: Serve via Lightweight Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (listening on 8080 for GCP Cloud Run)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Cloud Run default port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
