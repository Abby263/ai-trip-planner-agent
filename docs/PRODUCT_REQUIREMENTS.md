# Product Requirements

## Vision

AI Trip Planner Agent is a premium travel concierge that produces complete, source-backed trip plans with flights, hotels, attractions, restaurants, events, maps, budget estimates, warnings, and booking-ready external links.

## MVP User Flow

1. User submits a natural-language request.
2. Backend extracts intent, constraints, preferences, and missing fields.
3. Provider tools return mock or live data.
4. The graph normalizes results, estimates routing, builds 3 itinerary options, estimates budget, validates feasibility, repairs if needed, and returns structured JSON.
5. Frontend renders itinerary tabs, map markers, source badges, freshness badges, booking links, warnings, and refinement input.

## Non-Goals

- No bookings in MVP.
- No payment collection.
- No untrusted arbitrary URL browsing by the model.
- No provider raw responses exposed to the frontend.
