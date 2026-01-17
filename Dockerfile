# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy env.sh script
COPY env.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start Nginx via entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

#docker buildx build --platform linux/amd64 --no-cache -t mc-frontend:v2  .
#docker save -o mc-frontend.tar mc-frontend:v2
#scp mc-frontend.tar target_machine
#docker load -i mc-frontend.tar
#docker compose stop frontendmc
#docker compose up --build -d frontendmc

#docker compose stop frontendmc && docker compose rm -f frontendmc && docker compose up --build -d frontendmc