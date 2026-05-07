import re
from datetime import date

from src.graph.state import TripPlanningState, touch_state


class IntentParserAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        query = state["raw_user_query"]
        lower = query.lower()
        trip_type = _classify_trip_type(lower)

        origin = state.get("origin") or _extract_route_part(query, "from")
        destination = state.get("destination") or _extract_destination(query)
        duration_days = state.get("duration_days") or _extract_duration(lower)
        travel_style = state.get("travel_style") or _extract_travel_style(lower)
        dietary = sorted(set(state.get("dietary_preferences", []) + _extract_dietary(lower)))
        preferences = sorted(set(state.get("preferences", []) + _extract_preferences(lower)))

        assumptions = list(state.get("assumptions", []))
        if not state.get("start_date") and duration_days:
            assumptions.append("Specific travel dates were not provided; itinerary days are shown without fixed dates.")
        if not state.get("budget"):
            assumptions.append("No explicit budget was provided; estimates are compared against an unknown budget.")
        if "mock" not in " ".join(assumptions).lower():
            assumptions.append("Mock provider data is used in local MVP mode; verify live prices before booking.")

        state.update(
            trip_type=trip_type,
            origin=origin,
            destination=destination,
            duration_days=duration_days,
            travel_style=travel_style,
            dietary_preferences=dietary,
            preferences=preferences,
            assumptions=assumptions,
            missing_fields=_missing_fields(trip_type, origin, destination, duration_days, state.get("current_location")),
        )
        return touch_state(state)


def _classify_trip_type(lower: str) -> str:
    if any(term in lower for term in ["make it", "add ", "reduce ", "cheaper", "relaxed"]):
        return "itinerary_refinement"
    if any(term in lower for term in ["near me", "nearby", "tonight"]):
        if any(term in lower for term in ["event", "show", "concert", "comedy", "music"]):
            return "local_event_search"
        return "weekend_plan"
    if any(term in lower for term in ["suggest", "where should", "places from"]):
        return "destination_inspiration"
    if any(term in lower for term in ["book", "booking"]):
        return "booking_assistance"
    return "full_trip"


def _extract_duration(lower: str) -> int | None:
    match = re.search(r"(\d+)\s*[- ]?(day|days|night|nights)", lower)
    return int(match.group(1)) if match else None


def _extract_route_part(query: str, marker: str) -> str | None:
    pattern = rf"{marker}\s+([A-Za-z\s]+?)(?:\s+to\s+|\s+for\s+|\s+with\s+|\.|$)"
    match = re.search(pattern, query, flags=re.IGNORECASE)
    if not match:
        return None
    return _clean_place(match.group(1))


def _extract_destination(query: str) -> str | None:
    explicit = re.search(r"\bto\s+([A-Za-z\s]+?)(?:\s+trip|\s+with|\s+for|\.|$)", query, flags=re.IGNORECASE)
    if explicit:
        return _clean_place(explicit.group(1))
    for known in ["Delhi", "Paris", "Italy", "Toronto"]:
        if known.lower() in query.lower():
            return known
    return None


def _clean_place(value: str) -> str:
    stop_words = {"a", "an", "the", "trip"}
    parts = [part for part in value.strip(" .").split() if part.lower() not in stop_words]
    return " ".join(parts).strip().title()


def _extract_travel_style(lower: str) -> str | None:
    if "relaxed" in lower or "slow" in lower:
        return "relaxed"
    if "packed" in lower or "busy" in lower:
        return "packed"
    if "balanced" in lower:
        return "balanced"
    return None


def _extract_dietary(lower: str) -> list[str]:
    preferences = []
    for term in ["vegetarian", "vegan", "jain", "halal", "gluten-free"]:
        if term in lower:
            preferences.append(term)
    return preferences


def _extract_preferences(lower: str) -> list[str]:
    mapping = {
        "culture": "cultural places",
        "cultural": "cultural places",
        "photography": "photography spots",
        "photo": "photography spots",
        "shopping": "shopping",
        "music": "live music",
        "comedy": "comedy shows",
        "luxury": "luxury",
        "cheap": "budget-friendly",
        "budget": "budget-friendly",
        "scenic cafe": "scenic cafes",
        "vegetarian": "vegetarian food",
    }
    return [value for token, value in mapping.items() if token in lower]


def _missing_fields(
    trip_type: str,
    origin: str | None,
    destination: str | None,
    duration_days: int | None,
    current_location: dict | None,
) -> list[str]:
    missing: list[str] = []
    if trip_type == "full_trip":
        if not origin:
            missing.append("origin")
        if not destination:
            missing.append("destination")
        if not duration_days:
            missing.append("duration_days")
    if trip_type in {"weekend_plan", "local_event_search"} and not current_location and not destination:
        missing.append("location")
    if trip_type == "destination_inspiration":
        if not origin:
            missing.append("origin")
        if not duration_days:
            missing.append("duration_days")
    return missing


def today_iso() -> str:
    return date.today().isoformat()
