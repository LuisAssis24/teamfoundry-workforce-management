FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies based on lockfile for reproducible builds
COPY package*.json ./
RUN npm ci

# Copy application sources and build the production bundle
COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine AS runtime

# Replace default server config to serve Angular app with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
