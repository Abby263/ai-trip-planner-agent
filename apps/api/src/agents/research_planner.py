from src.graph.state import TripPlanningState, touch_state


class ResearchPlannerAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        trip_type = state.get("trip_type")
        required_tools = _required_tools(trip_type)
        destination = state.get("destination") or "nearby"
        state["research_plan"] = {
            "required_tools": required_tools,
            "search_queries": [
                f"{destination} cultural attractions",
                f"{destination} vegetarian restaurants",
                f"{destination} events",
                f"{destination} route efficient itinerary",
            ],
            "provider_plan": {
                "flights": "FlightProvider",
                "hotels": "HotelProvider",
                "places": "PlacesProvider",
                "events": "EventsProvider",
                "routing": "RoutingProvider",
                "weather": "WeatherProvider",
            },
            "priority": "quality",
            "notes": [
                "Use provider outputs as source of truth.",
                "Mark mock prices as estimated.",
                "Validate daily pacing before final response.",
            ],
        }
        return touch_state(state)


def _required_tools(trip_type: str | None) -> list[str]:
    if trip_type == "local_event_search":
        return ["events", "places", "restaurants", "routing"]
    if trip_type == "weekend_plan":
        return ["places", "restaurants", "events", "routing", "weather"]
    if trip_type == "destination_inspiration":
        return ["flights", "hotels", "places", "weather", "currency"]
    return ["flights", "hotels", "places", "restaurants", "events", "routing", "weather", "web_search"]
