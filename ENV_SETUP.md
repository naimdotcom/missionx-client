# Environment Setup Guide

## Local Development

1. Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in the `.env` file:

   ```
   VITE_FIREBASE_API_KEY=your_actual_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_BASE_URL=https://auth.brainchat.cloud/
   ```

3. Run locally:
   ```bash
   bun install
   bun run dev
   ```

## Docker Development

The environment variables are automatically picked up from your `.env` file:

```bash
docker-compose -f docker-compose.dev.yml up
```

The variables are passed to the container via the environment section.

## Production Build & Deployment

### Using docker-compose

Pass environment variables when building:

```bash
docker-compose build
docker-compose up
```

The `.env` file will be automatically used, or you can export variables:

```bash
export VITE_FIREBASE_API_KEY=your_key
export VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... set all other variables

docker-compose up --build
```

### Manual Docker build

```bash
docker build \
  --build-arg VITE_FIREBASE_API_KEY=your_key \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=your_domain \
  --build-arg VITE_FIREBASE_PROJECT_ID=your_project \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=your_bucket \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  --build-arg VITE_FIREBASE_APP_ID=your_app_id \
  --build-arg VITE_API_BASE_URL=https://auth.brainchat.cloud/ \
  -t missionx-client .
```

### Server/CI/CD Environment

1. Set environment variables on your server:

   ```bash
   export VITE_FIREBASE_API_KEY=your_key
   export VITE_FIREBASE_AUTH_DOMAIN=your_domain
   # ... set all variables
   ```

2. Clone your repo and build:
   ```bash
   git clone <repo>
   cd missionx-client
   docker-compose build
   docker-compose up -d
   ```

## Important Notes

- Environment variables are **compiled at build time** in Vite (not runtime)
- Variables must be prefixed with `VITE_` to be accessible in the browser
- The `.env` file should **never be committed** to version control
- Each deployment environment needs its own set of credentials
- For CI/CD, inject variables during the build process, not when running the container

## Troubleshooting

If you see `undefined` values in the browser console:

1. Check that `.env` file exists locally
2. Ensure variables are properly exported before docker build:
   ```bash
   set -a && source .env && set +a
   docker-compose build
   ```
3. For production, verify all build args are passed to the docker build command
