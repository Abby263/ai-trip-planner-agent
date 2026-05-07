# Provider Integration Guide

## Rules

- Agents do not call external APIs directly.
- Every integration implements a provider interface.
- Provider responses must include provider name, fetched timestamp, source URL when available, confidence, and sanitized raw data only for debugging.
- If live credentials are missing, the registry falls back to mock providers.

## Current Interfaces

- `FlightProvider`
- `HotelProvider`
- `PlacesProvider`
- `EventsProvider`
- `RoutingProvider`
- `WeatherProvider`
- `CurrencyProvider`

## Real Provider Placeholders

- Amadeus flights and hotels
- Duffel flights
- Google Places
- Google Routes
- Mapbox Directions
- Ticketmaster events
- OpenWeather
- Exchange rate provider

## Cache TTLs

- Geocoding: 30 days
- Place details: 7 days
- Attractions: 7 days
- Restaurants: 1 to 3 days
- Routes: 1 day
- Events: 6 to 12 hours
- Hotels: 15 to 60 minutes
- Flights: 5 to 15 minutes
- Weather: 1 to 3 hours
- Currency: 1 to 6 hours
