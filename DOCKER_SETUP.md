# Docker Setup Documentation

## Project Dockerization Status

✅ **Your project is successfully dockerized!**

## Available Docker Configurations

### 1. Development Environment (`docker-compose.dev.yml`)

- **Base Image**: `oven/bun:1-alpine`
- **Port**: `3000` (mapped to host:3000)
- **Features**:
  - Hot module reload
  - Volume mounting for live code updates
  - Optimized for development workflow

### 2. Production Environment (`docker-compose.yml`)

- **Base Image**: `oven/bun:1-alpine` (build stage) + `nginx:alpine` (runtime)
- **Port**: `80` (mapped to host:80)
- **Features**:
  - Multi-stage build for optimized image size (93.3MB)
  - Nginx serving static files
  - Production-ready configuration

## Docker Commands

### Development

```bash
# Build and start development container
docker compose -f docker-compose.dev.yml up --build -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop container
docker compose -f docker-compose.dev.yml down

# Restart container
docker compose -f docker-compose.dev.yml restart

# Access container shell
docker compose -f docker-compose.dev.yml exec missionx-client-dev sh
```

### Production

```bash
# Build production image
docker compose -f docker-compose.yml build

# Start production container
docker compose -f docker-compose.yml up -d

# View logs
docker compose -f docker-compose.yml logs -f

# Stop container
docker compose -f docker-compose.yml down
```

## Verification Tests

### Development Container

- **Status**: ✅ Running
- **Container Name**: `missionx-client-dev`
- **Access**: http://localhost:3000
- **Image Size**: 826MB (with dev dependencies)

### Production Container

- **Status**: ✅ Built
- **Container Name**: `missionx-client`
- **Access**: http://localhost:80
- **Image Size**: 93.3MB (optimized)

## Configuration Files

### Dockerfile.dev

```dockerfile
FROM oven/bun:1-alpine
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install
EXPOSE 3000
CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Dockerfile (Production)

```dockerfile
# Build stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install
COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Network Configuration

Both containers use the `missionx-network` bridge network, allowing them to communicate with each other if needed.

## Volume Mounts (Development)

The development container mounts:

- `.:/app` - Your source code
- `/app/node_modules` - Isolated node_modules

This allows hot reload while keeping dependencies isolated.

## Next Steps

1. **Access the development app**: Open http://localhost:3000 in your browser
2. **Test production build**: Run `docker compose -f docker-compose.yml up -d` and access http://localhost:80
3. **Deploy**: Use the production Dockerfile for deployment to any container platform

## Troubleshooting

### Port Already in Use

If port 3000 or 80 is already in use, modify the port mapping in the compose files:

```yaml
ports:
  - "NEW_PORT:3000" # For dev
  - "NEW_PORT:80" # For prod
```

### Container Not Starting

Check logs:

```bash
docker compose -f docker-compose.dev.yml logs
```

### Rebuild After Changes

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

## Image Information

```
REPOSITORY                           TAG      SIZE
missionx-client-missionx-client-dev  latest   826MB (development)
missionx-client-missionx-client      latest   93.3MB (production)
```

## Current Running Containers

```
CONTAINER ID   NAME                  PORTS                    STATUS
fdd90ab292bd   missionx-client-dev   0.0.0.0:3000->3000/tcp   Running
```

---

✨ **Your React + Vite + TypeScript project is now fully dockerized and ready for development and production!**
