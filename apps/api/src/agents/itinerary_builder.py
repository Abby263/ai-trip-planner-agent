from datetime import datetime, timedelta

from src.graph.state import TripPlanningState, touch_state


class ItineraryBuilderAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        flights = state.get("flight_results", [])
        hotels = state.get("hotel_results", [])
        places = state.get("places_results", [])
        restaurants = state.get("restaurant_results", [])
        events = state.get("events_results", [])
        currency = state.get("currency", "CAD")
        requested_pace = state.get("travel_style") or "balanced"

        options = [
            _build_option(
                option_id="option_budget",
                name="Budget Saver",
                best_for="Travelers who want culture, vegetarian meals, and central routing at the lowest mock cost.",
                pace="relaxed" if requested_pace == "relaxed" else "balanced",
                flight=flights[0] if flights else None,
                hotel=hotels[0] if hotels else None,
                places=places,
                restaurants=restaurants,
                events=events[:1],
                currency=currency,
                state=state,
            ),
            _build_option(
                option_id="option_balanced",
                name="Smart Balanced",
                best_for="A first-time Delhi visitor who wants culture, photography, food, and manageable pacing.",
                pace=requested_pace,
                flight=flights[1] if len(flights) > 1 else flights[0] if flights else None,
                hotel=hotels[1] if len(hotels) > 1 else hotels[0] if hotels else None,
                places=places,
                restaurants=restaurants,
                events=events[:2],
                currency=currency,
                state=state,
            ),
            _build_option(
                option_id="option_premium",
                name="Premium Experience",
                best_for="Travelers who value shorter flights, higher comfort, photography time, and polished dining.",
                pace="balanced" if requested_pace == "relaxed" else requested_pace,
                flight=flights[2] if len(flights) > 2 else flights[-1] if flights else None,
                hotel=hotels[2] if len(hotels) > 2 else hotels[-1] if hotels else None,
                places=places,
                restaurants=restaurants,
                events=events[1:],
                currency=currency,
                state=state,
            ),
        ]
        state["itinerary_options"] = options
        return touch_state(state)


def _build_option(
    option_id: str,
    name: str,
    best_for: str,
    pace: str,
    flight: dict | None,
    hotel: dict | None,
    places: list[dict],
    restaurants: list[dict],
    events: list[dict],
    currency: str,
    state: TripPlanningState,
) -> dict:
    by_id = {item["id"]: item for item in places + restaurants}
    wants_shopping = any("shopping" in pref.lower() for pref in state.get("preferences", []))
    duration = state.get("duration_days") or 3

    day_templates = [
        {
            "title": "Arrival and Central Delhi",
            "theme": "Light exploration after travel",
            "ids": ["hotel_rest", "place_india_gate", "restaurant_saravana"],
        },
        {
            "title": "Old Delhi Heritage Route",
            "theme": "Culture, markets, and classic photography",
            "ids": ["event_craft_walk", "place_jama_masjid", "place_red_fort", "restaurant_cafe_lota"],
        },
        {
            "title": "Gardens, Tombs, and Local Evening",
            "theme": "Architecture, shopping, and an evening event",
            "ids": ["place_humayun_tomb", "place_lodhi_garden", "place_dilli_haat" if wants_shopping else "place_khan_market", "restaurant_sattvik", "event_sufi_evening"],
        },
    ]

    if pace == "relaxed":
        for template in day_templates:
            template["ids"] = template["ids"][:3]
    elif pace == "packed":
        day_templates[1]["ids"].append("restaurant_bikanervala")
        if wants_shopping:
            day_templates[2]["ids"].append("place_khan_market")

    days = []
    for index in range(min(duration, len(day_templates))):
        template = day_templates[index]
        days.append(
            {
                "day_number": index + 1,
                "date": _date_for_day(state.get("start_date"), index),
                "title": template["title"],
                "theme": template["theme"],
                "activities": _activities_for_ids(
                    template["ids"],
                    by_id=by_id,
                    events=events,
                    hotel=hotel,
                    currency=currency,
                    option_id=option_id,
                ),
            }
        )

    highlights = [
        "Old Delhi heritage route",
        "Vegetarian-friendly restaurants",
        "Route-aware day sequencing",
        "Booking-ready provider links",
    ]
    if any("photography" in pref.lower() for pref in state.get("preferences", [])):
        highlights.insert(1, "India Gate, Lodhi Garden, and Humayun's Tomb photography stops")
    if wants_shopping:
        highlights.append("Dilli Haat and Khan Market shopping options")

    option = {
        "id": option_id,
        "name": name,
        "best_for": best_for,
        "pace": pace,
        "estimated_total": 0,
        "currency": currency,
        "confidence": "medium",
        "highlights": highlights,
        "flight": flight,
        "hotel": hotel,
        "events": events,
        "days": days,
        "warnings": [
            "Mock data is being used; replace with live provider data before production booking decisions.",
            "Opening hours and ticket availability must be rechecked on provider sites.",
        ],
        "booking_links": _booking_links(flight, hotel, days, events),
    }
    return option


def _activities_for_ids(
    ids: list[str],
    by_id: dict[str, dict],
    events: list[dict],
    hotel: dict | None,
    currency: str,
    option_id: str,
) -> list[dict]:
    event_by_id = {event["id"]: event for event in events}
    activities = []
    time_slots = [
        ("09:30", "11:00"),
        ("11:30", "13:00"),
        ("13:15", "14:15"),
        ("15:00", "17:00"),
        ("18:30", "20:00"),
        ("20:30", "22:00"),
    ]
    for index, item_id in enumerate(ids):
        start, end = time_slots[min(index, len(time_slots) - 1)]
        travel_time = None if index == 0 else 18 + index * 4
        if item_id == "hotel_rest" and hotel:
            activities.append(
                {
                    "id": f"{option_id}_hotel_rest",
                    "start_time": "11:00",
                    "end_time": "13:30",
                    "title": "Check in and rest",
                    "category": "hotel",
                    "description": "Recover from long-haul travel before sightseeing.",
                    "address": hotel["address"],
                    "lat": hotel["lat"],
                    "lng": hotel["lng"],
                    "estimated_cost": 0,
                    "currency": currency,
                    "travel_time_from_previous_minutes": None,
                    "booking_required": False,
                    "booking_url": hotel.get("booking_url"),
                    "source_provider": hotel["provider"],
                    "confidence": "medium",
                }
            )
            continue
        if item_id in by_id:
            item = by_id[item_id]
            category = "restaurant" if "cuisine" in item else item.get("category", "attraction")
            title = item["name"]
            activities.append(
                {
                    "id": f"{option_id}_{item['id']}",
                    "start_time": start,
                    "end_time": end,
                    "title": title,
                    "category": category,
                    "description": item.get("why_recommended", f"Recommended {category} stop."),
                    "address": item["address"],
                    "lat": item["lat"],
                    "lng": item["lng"],
                    "estimated_cost": _cost_for(item),
                    "currency": currency,
                    "travel_time_from_previous_minutes": travel_time,
                    "booking_required": item.get("booking_required", False),
                    "booking_url": item.get("booking_url") or item.get("reservation_url"),
                    "source_provider": item["provider"],
                    "confidence": "medium",
                }
            )
        elif item_id in event_by_id:
            event = event_by_id[item_id]
            activities.append(
                {
                    "id": f"{option_id}_{event['id']}",
                    "start_time": event["start_time"][11:16],
                    "end_time": event["end_time"][11:16] if event.get("end_time") else "21:00",
                    "title": event["name"],
                    "category": "event",
                    "description": event.get("why_recommended", "Recommended local event."),
                    "address": event["address"],
                    "lat": event["lat"],
                    "lng": event["lng"],
                    "estimated_cost": event.get("price_min") or 0,
                    "currency": currency,
                    "travel_time_from_previous_minutes": travel_time,
                    "booking_required": True,
                    "booking_url": event.get("ticket_url"),
                    "source_provider": event["provider"],
                    "confidence": "medium",
                }
            )
    return activities


def _cost_for(item: dict) -> float:
    if "cuisine" in item:
        return {"$": 18, "$$": 32, "$$$": 55}.get(item.get("price_level") or "$$", 30)
    if item.get("price_level") == "Free":
        return 0
    return {"$": 12, "$$": 24, "$$$": 45}.get(item.get("price_level") or "$", 15)


def _booking_links(flight: dict | None, hotel: dict | None, days: list[dict], events: list[dict]) -> list[dict]:
    links = []
    if flight and flight.get("booking_url"):
        links.append(
            {
                "label": "Book flight on provider site",
                "url": flight["booking_url"],
                "provider": flight["provider"],
                "link_type": "flight",
                "fetched_at": flight["fetched_at"],
            }
        )
    if hotel and hotel.get("booking_url"):
        links.append(
            {
                "label": "View hotel deal",
                "url": hotel["booking_url"],
                "provider": hotel["provider"],
                "link_type": "hotel",
                "fetched_at": hotel["fetched_at"],
            }
        )
    for event in events:
        if event.get("ticket_url"):
            links.append(
                {
                    "label": f"Open ticket link: {event['name']}",
                    "url": event["ticket_url"],
                    "provider": event["provider"],
                    "link_type": "event",
                    "fetched_at": event["fetched_at"],
                }
            )
    for day in days:
        for activity in day.get("activities", []):
            if activity.get("booking_url") and activity.get("category") != "event":
                links.append(
                    {
                        "label": f"Book on provider site: {activity['title']}",
                        "url": activity["booking_url"],
                        "provider": activity["source_provider"],
                        "link_type": "restaurant" if activity["category"] == "restaurant" else "activity",
                        "fetched_at": _fallback_fetched_at(flight, hotel),
                    }
                )
    deduped = []
    seen = set()
    for link in links:
        if link["url"] not in seen:
            seen.add(link["url"])
            deduped.append(link)
    return deduped


def _fallback_fetched_at(flight: dict | None, hotel: dict | None) -> str:
    if flight:
        return flight["fetched_at"]
    if hotel:
        return hotel["fetched_at"]
    return datetime.utcnow().isoformat()


def _date_for_day(start_date: str | None, offset: int) -> str | None:
    if not start_date:
        return None
    try:
        return (datetime.fromisoformat(start_date).date() + timedelta(days=offset)).isoformat()
    except ValueError:
        return None
