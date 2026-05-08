# Deployment

## Current Production URLs

- Frontend: [https://ai-trip-concierge-agent.vercel.app](https://ai-trip-concierge-agent.vercel.app)
- Backend API: [https://ai-trip-concierge-agent-api.vercel.app](https://ai-trip-concierge-agent-api.vercel.app)
- API health check: [https://ai-trip-concierge-agent-api.vercel.app/api/health](https://ai-trip-concierge-agent-api.vercel.app/api/health)

## Frontend

Deploy `apps/web` to Vercel.

Required environment variables:

```text
NEXT_PUBLIC_API_BASE_URL=https://ai-trip-concierge-agent-api.vercel.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

## Backend

The current mock MVP deploys `apps/api` to Vercel as project `ai-trip-planner-agent-backend`. For long-running production workloads, deploy `apps/api` to Render, Railway, Fly.io, Azure Container Apps, Azure App Service, AWS ECS, or another backend host with workers.

Required environment variables:

```text
OPENAI_API_KEY=
DATABASE_URL=
REDIS_URL=
MOCK_MODE=true
CORS_ORIGINS=https://ai-trip-concierge-agent.vercel.app
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
