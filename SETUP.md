# Setup Guide

This project is a monorepo with two deployable apps:

- `apps/web`: Next.js frontend. Deploy this to Vercel.
- `apps/api`: FastAPI backend. For the mock MVP it can deploy to Vercel as a Python function using `apps/api/vercel.json`; for heavier production workloads, deploy it to Render, Railway, Fly.io, Azure Container Apps, Azure App Service, AWS ECS, or another backend host.

The frontend must point `NEXT_PUBLIC_API_BASE_URL` to the public HTTPS URL of the deployed API.

## 1. Local Setup

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
npm install
```

Run the backend:

```bash
cd apps/api
python3 -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

Run the frontend:

```bash
npm run dev --workspace web
```

Local URLs:

- Web: `http://127.0.0.1:3000`
- API: `http://127.0.0.1:8000`
- API health: `http://127.0.0.1:8000/api/health`

## 2. Vercel Frontend Setup

In Vercel:

1. Create a new Vercel project from this Git repository.
2. Set **Root Directory** to `apps/web`.
3. Use framework preset: **Next.js**.
4. Use install command: `npm install`.
5. Use build command: `npm run build`.
6. Use output directory: leave default.
7. Add the frontend environment variables below.
8. Deploy.

After the backend is deployed, update `NEXT_PUBLIC_API_BASE_URL` in Vercel to the backend URL and redeploy.

## 3. Frontend Environment Variables

Set these in Vercel Project Settings → Environment Variables.

| Variable | Required | Example | How to get it |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | `https://your-api-host.example.com` | Deploy `apps/api` and use its public HTTPS URL. For local dev use `http://localhost:8000`. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | `AIza...` | Google Cloud Console → enable Maps JavaScript API → create browser API key → restrict by Vercel domain. |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Optional | `pk...` | Mapbox account → Tokens → create public token. Only needed if you switch UI to Mapbox. |

Important: anything prefixed with `NEXT_PUBLIC_` is visible in the browser. Do not put secrets in these variables.

## 4. Backend Environment Variables

Set these on the backend host, not in the Vercel frontend project.

| Variable | Required | Example | How to get it |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | Required for real LLM calls | `sk-...` | OpenAI Platform → API keys. Keep secret. |
| `OPENAI_MODEL_STRONG` | Recommended | `gpt-4o` | Choose the stronger OpenAI model for itinerary reasoning, critique, and repair. |
| `OPENAI_MODEL_FAST` | Recommended | `gpt-4o-mini` | Choose a cheaper/faster model for classification and formatting. |
| `DATABASE_URL` | Required for production persistence | `postgresql://...` | Supabase, Neon, Azure PostgreSQL, or RDS. Use pooled connection if your provider recommends it. |
| `REDIS_URL` | Required for cache/jobs | `redis://...` or `rediss://...` | Upstash Redis, Azure Cache for Redis, Railway Redis, or managed Redis. |
| `MOCK_MODE` | Yes | `true` or `false` | Use `true` for local/demo mode. Use `false` when real provider keys are configured. |
| `CORS_ORIGINS` | Yes | `https://your-app.vercel.app,https://yourdomain.com` | Add the Vercel production URL and any custom frontend domains. |
| `LANGSMITH_API_KEY` | Optional | `lsv2_...` | LangSmith project settings. |
| `LANGSMITH_PROJECT` | Optional | `ai-trip-planner-agent` | Any LangSmith project name you want traces grouped under. |
| `LANGSMITH_TRACING` | Optional | `true` | Enable when LangSmith is configured. |
| `GOOGLE_MAPS_API_KEY` | Optional | `AIza...` | Google Cloud Console → enable Geocoding, Places API, Routes API. Backend key should be server-restricted if possible. |
| `AMADEUS_CLIENT_ID` | Optional | `...` | Amadeus for Developers → create app. |
| `AMADEUS_CLIENT_SECRET` | Optional | `...` | Amadeus for Developers app credentials. |
| `DUFFEL_API_KEY` | Optional | `duffel_test_...` | Duffel dashboard → API access. |
| `TICKETMASTER_API_KEY` | Optional | `...` | Ticketmaster Developer Portal → create app. |
| `OPENWEATHER_API_KEY` | Optional | `...` | OpenWeather account → API keys. |
| `EXCHANGE_RATE_API_KEY` | Optional | `...` | Your chosen exchange-rate provider account. |

For MVP/demo deployments, you can set:

```text
MOCK_MODE=true
OPENAI_API_KEY=
DATABASE_URL=<your postgres url>
REDIS_URL=<your redis url>
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

The mock providers let the API return realistic trip data without paid travel API keys.

## 5. Recommended Backend Hosts

### Vercel Python Function

This repo includes a Vercel adapter for the mock MVP:

- `apps/api/api/index.py` imports the existing FastAPI app.
- `apps/api/vercel.json` routes all API traffic to the Python function.
- `apps/api/requirements.txt` mirrors the backend runtime dependencies for hosts that expect requirements files.

Deploy:

```bash
cd apps/api
vercel link
vercel --prod
```

Then verify:

```bash
curl https://your-api.vercel.app/api/health
```

For a public demo, set:

```text
MOCK_MODE=true
CORS_ORIGINS=https://your-web.vercel.app
```

Vercel serverless Python is suitable for this synchronous mock MVP. For long-running agent jobs, Celery workers, durable queues, WebSockets, or sustained SSE streams, use a backend host such as Render, Railway, Fly.io, Azure Container Apps, or AWS ECS.

### Render

1. Create a new Web Service from the repo.
2. Set root directory to `apps/api`.
3. Runtime: Python.
4. Build command:

```bash
pip install -e .
```

5. Start command:

```bash
uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

6. Add backend environment variables.

### Railway

1. Create a project from the repo.
2. Select `apps/api` as the service root.
3. Add Postgres and Redis services or external URLs.
4. Add backend environment variables.
5. Start command:

```bash
uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

### Fly.io or Azure Container Apps

Use `apps/api/Dockerfile`, then set backend environment variables on the service.

## 6. Database Setup

Use one of:

- Supabase Postgres
- Neon
- Azure PostgreSQL
- AWS RDS

Enable `pgvector` if available. The local Docker setup uses the `pgvector/pgvector:pg16` image.

For Supabase:

1. Create a Supabase project.
2. Go to Project Settings → Database.
3. Copy the Postgres connection string.
4. Set it as `DATABASE_URL` on the backend host.
5. Enable the vector extension in SQL editor if needed:

```sql
create extension if not exists vector;
```

For Neon:

1. Create a Neon project.
2. Copy the pooled connection string.
3. Set it as `DATABASE_URL`.

## 7. Redis Setup

Use one of:

- Upstash Redis
- Azure Cache for Redis
- Railway Redis
- Render Redis

For Upstash:

1. Create an Upstash Redis database.
2. Copy the Redis URL.
3. Set it as `REDIS_URL` on the backend host.

Use TLS URLs (`rediss://...`) when your provider supplies them.

## 8. Provider Key Setup

### OpenAI

1. Go to OpenAI Platform.
2. Create an API key.
3. Set `OPENAI_API_KEY` on the backend host.
4. Set `OPENAI_MODEL_STRONG` and `OPENAI_MODEL_FAST`.

### Google Maps, Places, and Routes

1. Go to Google Cloud Console.
2. Create or select a project.
3. Enable:
   - Maps JavaScript API for frontend maps.
   - Places API for real place search.
   - Routes API for routing.
   - Geocoding API if you add geocoding.
4. Create two keys:
   - Browser key for `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
   - Server key for `GOOGLE_MAPS_API_KEY`.
5. Restrict browser key by domain:
   - `https://your-app.vercel.app/*`
   - `https://your-custom-domain.com/*`
6. Restrict server key by backend host IP or API restrictions where possible.

### Amadeus

1. Create an Amadeus for Developers account.
2. Create an app.
3. Set `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET` on the backend host.

### Duffel

1. Create a Duffel account.
2. Get test or live API key.
3. Set `DUFFEL_API_KEY` on the backend host.

### Ticketmaster

1. Create a Ticketmaster Developer account.
2. Create an app.
3. Set `TICKETMASTER_API_KEY` on the backend host.

### OpenWeather

1. Create an OpenWeather account.
2. Generate an API key.
3. Set `OPENWEATHER_API_KEY` on the backend host.

### Exchange Rate Provider

1. Choose a provider.
2. Create an API key.
3. Set `EXCHANGE_RATE_API_KEY` on the backend host.

## 9. Vercel CLI Workflow

Install and log in:

```bash
npm i -g vercel
vercel login
```

Link the frontend project:

```bash
cd apps/web
vercel link
```

Pull Vercel env vars for local frontend development:

```bash
vercel env pull .env.local --yes
```

Deploy preview:

```bash
vercel
```

Deploy production:

```bash
vercel --prod
```

After editing env vars in the Vercel dashboard, redeploy. Vercel env var changes do not affect already-built deployments.

## 10. CI Variables for Vercel Deploys

Only needed if you deploy Vercel from GitHub Actions or another CI system instead of Vercel Git integration.

| Variable | Where to get it |
| --- | --- |
| `VERCEL_TOKEN` | Vercel account settings → Tokens. |
| `VERCEL_ORG_ID` | Run `vercel link`; then read `.vercel/project.json`. |
| `VERCEL_PROJECT_ID` | Run `vercel link`; then read `.vercel/project.json`. |

Store these as CI secrets. Never commit `.vercel/project.json` if it contains team/project details you do not want shared.

## 11. Production Checklist

- `apps/web` deployed on Vercel.
- `apps/api` deployed on a backend host.
- `NEXT_PUBLIC_API_BASE_URL` points to the backend HTTPS URL.
- Backend `CORS_ORIGINS` includes the Vercel production URL and custom domain.
- `MOCK_MODE=true` for demo or `MOCK_MODE=false` after real provider keys are configured.
- Postgres is reachable from the backend.
- Redis is reachable from the backend.
- No secrets are stored in `NEXT_PUBLIC_*` variables.
- API health endpoint returns `{"status":"ok"}`.
- Frontend planner can submit a trip request and render options, map, budget, sources, and booking links.

## 12. Common Issues

### Frontend cannot call API

Check:

- `NEXT_PUBLIC_API_BASE_URL` is set in Vercel.
- Backend URL uses HTTPS in production.
- Backend `CORS_ORIGINS` includes the exact Vercel/custom domain.
- Backend `/api/health` is publicly reachable.

### Google map does not render

Check:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in Vercel.
- Maps JavaScript API is enabled.
- Browser key domain restrictions include the Vercel/custom domain.
- Billing is enabled in Google Cloud.

The app still has a mock map fallback, so trip planning should work without Google Maps.

### Real providers return empty data

Check:

- `MOCK_MODE=false`.
- Provider API keys are set on the backend host.
- Provider account is approved for the endpoint you are calling.
- Backend logs show provider errors without exposing raw sensitive data.

### Vercel build cannot find dependencies

Check:

- Vercel Root Directory is `apps/web`.
- Install command is `npm install`.
- Build command is `npm run build`.
- Node version is current enough for Next.js 15.

## 13. Current MVP Mode

The app currently runs end-to-end with mock providers. For a safe public demo:

```text
MOCK_MODE=true
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

Then add real provider keys one by one and test each provider before setting `MOCK_MODE=false`.
