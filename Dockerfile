# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source (node_modules is ignored by .dockerignore)
COPY . .

# Build static assets
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine

# SPA-friendly nginx config (see nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
