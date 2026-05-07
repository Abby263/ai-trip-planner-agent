# Architecture

```text
User request
→ FastAPI
→ TripPlanningGraph
→ Provider tools
→ Normalized provider data
→ Routing
→ Itinerary builder
→ Budget estimator
→ Validation
→ Critic
→ Repair loop
→ Final structured response
```

## Layers

- Frontend: Next.js, Tailwind, shadcn-style components, TanStack Query, Zustand, Google Maps SDK fallback.
- API: FastAPI, Pydantic v2 schemas, SSE progress, in-memory MVP store, DB models for Postgres.
- Agent graph: LangGraph node orchestration with conditional edges.
- Providers: interface-first mock and real-provider placeholders.
- Persistence: SQLModel definitions for users, preferences, trips, itinerary records, sources, provider cache.
- Observability: structured logs, trace helper, metrics counters, LangSmith/OpenTelemetry-ready configuration.

## Booking Safety

The app provides external links only. It never claims a booking, reservation, payment, ticket, flight availability, or hotel availability has been completed unless a future booking provider explicitly confirms it.
