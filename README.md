# AI Trip Planner Agent

A production-oriented monorepo for a tool-first, source-backed AI travel concierge. The MVP runs locally with mock providers, while the backend architecture is ready for real flight, hotel, places, routing, events, weather, and currency APIs.

## What This Builds

- Next.js App Router frontend with a premium map-first planner UI.
- FastAPI backend with LangGraph orchestration, provider interfaces, validation, repair, and source metadata.
- Mock providers for end-to-end trip generation without paid API keys.
- SSE progress streaming endpoint for agent step visibility.
- PostgreSQL, Redis, pgvector-ready persistence model, and deployment-ready Docker config.

## Local Setup

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Install dependencies:

```bash
pnpm install
cd apps/api
uv venv
uv pip install -e ".[dev]"
```

Start infrastructure:

```bash
docker compose up postgres redis
```

Run backend:

```bash
cd apps/api
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Run frontend:

```bash
pnpm --filter web dev
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/api/health

## MVP Demo Prompt

```text
Plan a 3-day trip from Toronto to Delhi. I prefer vegetarian food, cultural places, photography spots, and a balanced pace.
```

The backend will use mock providers when `MOCK_MODE=true`, returning 3 itinerary options with flights, hotel options, attractions, vegetarian restaurants, local events, routes, budget estimates, booking links, warnings, and provider source metadata.

## Architecture Principles

This is not a single LLM prompt. The backend follows:

```text
Intent parsing
→ missing info checks
→ research planning
→ provider/tool calls
→ normalization
→ route optimization
→ itinerary building
→ budget estimation
→ validation
→ critique
→ repair loop
→ final structured response
```

LLMs are reserved for reasoning, summarization, critique, and personalization. Deterministic services handle retrieval, calculations, validation, routing, and provider boundaries.

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
cd apps/api && uv run pytest
```

## Deployment

- Frontend: Vercel
- Backend: Render, Railway, Fly.io, Azure Container Apps, Azure App Service, or AWS ECS
- Database: Supabase Postgres, Neon, Azure PostgreSQL, or RDS
- Redis: Upstash Redis, Azure Cache for Redis, or managed Redis

See `docs/DEPLOYMENT.md` for details.
