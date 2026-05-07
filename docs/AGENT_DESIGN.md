# Agent Design

## Graph Nodes

- `IntentParserNode`
- `MissingInfoNode`
- `ResearchPlannerNode`
- `FlightSearchNode`
- `HotelSearchNode`
- `PlacesSearchNode`
- `RestaurantSearchNode`
- `EventsSearchNode`
- `WeatherSearchNode`
- `WebResearchNode`
- `ResultNormalizerNode`
- `RoutingNode`
- `ItineraryBuilderNode`
- `BudgetEstimatorNode`
- `ValidationNode`
- `CriticNode`
- `RepairNode`
- `FinalResponseNode`

## Principle

Provider/tool outputs are the source of truth. The itinerary builder can reason over structured results, but it must not invent flights, hotels, restaurants, prices, or event details.

## Repair Loop

High-severity validation failures route to `RepairNode`, then back through routing, itinerary building, budget estimation, validation, and critique. The MVP caps repair attempts to avoid infinite loops.
