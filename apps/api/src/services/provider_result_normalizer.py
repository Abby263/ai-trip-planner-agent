from src.graph.state import TripPlanningState


def normalize_provider_results(state: TripPlanningState) -> dict:
    return {
        "flights": state.get("flight_results", []),
        "hotels": state.get("hotel_results", []),
        "places": state.get("places_results", []),
        "restaurants": state.get("restaurant_results", []),
        "events": state.get("events_results", []),
        "weather": state.get("weather_results", []),
        "web_research": state.get("web_research_results", []),
    }
