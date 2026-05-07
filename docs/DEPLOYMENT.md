# Deployment

## Frontend

Deploy `apps/web` to Vercel.

Required environment variables:

```text
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

## Backend

Deploy `apps/api` to Render, Railway, Fly.io, Azure Container Apps, Azure App Service, or AWS ECS.

Required environment variables:

```text
OPENAI_API_KEY=
DATABASE_URL=
REDIS_URL=
MOCK_MODE=true
CORS_ORIGINS=https://your-frontend-domain
```

## Database

Use Supabase Postgres, Neon, Azure PostgreSQL, or RDS. Enable `pgvector`.

## Redis

Use Upstash Redis, Azure Cache for Redis, or another managed Redis.

## Docker

Local infrastructure:

```bash
docker compose up postgres redis
```

Full local stack:

```bash
docker compose --profile web up --build
```
