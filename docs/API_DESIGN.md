# API Design

## Endpoints

- `POST /api/trips/plan`
- `GET /api/trips/{trip_id}`
- `GET /api/trips/{trip_id}/stream`
- `POST /api/trips/{trip_id}/refine`
- `POST /api/events/search`
- `POST /api/places/search`
- `GET /api/users/preferences`
- `PATCH /api/users/preferences`
- `GET /api/health`

## Streaming Events

SSE events include `intent_parsed`, `missing_info_checked`, `researching`, `searching_flights`, `searching_hotels`, `searching_places`, `searching_events`, `optimizing_route`, `building_itinerary`, `estimating_budget`, `validating`, `repairing`, `completed`, and `failed`.
