from src.graph.state import TripPlanningState, touch_state
from src.schemas.common import BookingLink, SourceCitation
from src.schemas.route import Coordinates, DayRoute, MapData, MapMarker, RouteSegment
from src.schemas.trip import FinalTripResponse, TripSummary


class FinalResponseAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        options = state.get("itinerary_options", [])
        booking_links = _collect_booking_links(options)
        sources = _collect_sources(state)
        warnings = _warnings(state)
        map_data = _build_map_data(options)
        response = FinalTripResponse(
            trip_id=state["session_id"],
            summary=TripSummary(
                title=_title(state),
                origin=state.get("origin"),
                destination=state.get("destination"),
                duration_days=state.get("duration_days"),
                traveler_count=state.get("traveler_count", 1),
                currency=state.get("currency", "CAD"),
                assumptions=state.get("assumptions", []),
            ),
            options=options,
            map_data=map_data,
            booking_links=booking_links,
            warnings=warnings,
            sources=sources,
            validation_report=state.get("validation_report"),
        )
        state["booking_links"] = [link.model_dump(mode="json") for link in booking_links]
        state["source_citations"] = [source.model_dump(mode="json") for source in sources]
        state["warnings"] = warnings
        state["final_response"] = response.model_dump(mode="json")
        return touch_state(state)


def _title(state: TripPlanningState) -> str:
    duration = state.get("duration_days")
    destination = state.get("destination") or "Local"
    origin = state.get("origin")
    if origin and duration:
        return f"{duration}-Day {origin} to {destination} Trip"
    if duration:
        return f"{duration}-Day {destination} Trip"
    return f"{destination} Trip Plan"


def _collect_booking_links(options: list[dict]) -> list[BookingLink]:
    links: list[BookingLink] = []
    seen: set[str] = set()
    for option in options:
        for link in option.get("booking_links", []):
            url = link.get("url")
            if url and url not in seen:
                seen.add(url)
                links.append(BookingLink(**link))
    return links


def _collect_sources(state: TripPlanningState) -> list[SourceCitation]:
    sources: list[SourceCitation] = []
    seen: set[tuple[str, str]] = set()
    buckets = [
        ("flight", state.get("flight_results", [])),
        ("hotel", state.get("hotel_results", [])),
        ("place", state.get("places_results", [])),
        ("restaurant", state.get("restaurant_results", [])),
        ("event", state.get("events_results", [])),
        ("weather", state.get("weather_results", [])),
        ("web", state.get("web_research_results", [])),
    ]
    for source_type, items in buckets:
        for item in items:
            provider = item.get("provider", "unknown")
            fetched_at = item.get("fetched_at")
            key = (provider, source_type)
            if fetched_at and key not in seen:
                seen.add(key)
                sources.append(
                    SourceCitation(
                        provider=provider,
                        source_type=source_type,
                        source_url=item.get("source_url") or item.get("booking_url") or item.get("ticket_url"),
                        fetched_at=fetched_at,
                        confidence=item.get("price_confidence") or item.get("confidence") or "estimated",
                    )
                )
    return sources


def _warnings(state: TripPlanningState) -> list[str]:
    warnings = list(state.get("warnings", []))
    warnings.extend(
        [
            "Flight, hotel, and event prices can change quickly; book on provider sites only after rechecking.",
            "No booking, reservation, payment, or ticket purchase has been completed by this MVP.",
            "Verify passport, visa, health, and local travel requirements before buying non-refundable travel.",
        ]
    )
    seen = set()
    return [warning for warning in warnings if not (warning in seen or seen.add(warning))]


def _build_map_data(options: list[dict]) -> MapData:
    option = next((item for item in options if item.get("id") == "option_balanced"), options[0] if options else None)
    if not option:
        return MapData(center=Coordinates(lat=28.6139, lng=77.209), markers=[], routes=[])
    markers: list[MapMarker] = []
    routes: list[DayRoute] = []
    label = 1
    hotel = option.get("hotel")
    if hotel:
        markers.append(
            MapMarker(
                id=hotel["id"],
                label="H",
                type="hotel",
                title=hotel["name"],
                lat=hotel["lat"],
                lng=hotel["lng"],
                day=None,
            )
        )
    for day in option.get("days", []):
        day_points = []
        if hotel:
            day_points.append({"id": hotel["id"], "lat": hotel["lat"], "lng": hotel["lng"]})
        for activity in day.get("activities", []):
            marker_type = "restaurant" if activity.get("category") == "restaurant" else "event" if activity.get("category") == "event" else "attraction"
            markers.append(
                MapMarker(
                    id=activity["id"],
                    label=str(label),
                    type=marker_type,
                    title=activity["title"],
                    lat=activity["lat"],
                    lng=activity["lng"],
                    day=day["day_number"],
                )
            )
            label += 1
            day_points.append(activity)
        segments = []
        for previous, current in zip(day_points, day_points[1:], strict=False):
            segments.append(
                RouteSegment(
                    from_activity_id=previous["id"],
                    to_activity_id=current["id"],
                    mode="mixed",
                    distance_km=2.8,
                    duration_minutes=current.get("travel_time_from_previous_minutes") or 18,
                    polyline=None,
                    provider="MockRoutingProvider",
                )
            )
        routes.append(DayRoute(day=day["day_number"], segments=segments))
    center = Coordinates(lat=hotel["lat"], lng=hotel["lng"]) if hotel else Coordinates(lat=28.6139, lng=77.209)
    return MapData(center=center, markers=markers, routes=routes)
