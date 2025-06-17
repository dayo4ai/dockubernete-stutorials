# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml first to leverage cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN apk add --no-cache python3 make g++ # Install build tools if needed
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build and export the Next.js application
RUN pnpm run build
RUN pnpm run export

# Stage 2: Serve the exported Next.js application
FROM nginx:alpine AS production

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the exported Next.js files to Nginx's root directory
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM oven/bun:1.0.35

# Set working directory
WORKDIR /app

# Copy entire project (ensure your .dockerignore isn't excluding required folders)
COPY . .

# Install dependencies using Bun
RUN bun install

# Expose the port your dev server will run on (adjust if necessary)
EXPOSE 3000

# Start the development server using Bun
CMD ["bun", "run", "dev"]