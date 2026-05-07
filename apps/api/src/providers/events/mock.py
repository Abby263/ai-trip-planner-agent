from src.schemas.common import utc_now_iso
from src.schemas.event import EventOption, EventSearchRequest

from .base import EventsProvider


class MockEventsProvider(EventsProvider):
    name = "MockEventsProvider"

    async def search_events(self, request: EventSearchRequest) -> list[EventOption]:
        fetched_at = utc_now_iso()
        date = request.start_date or "2026-09-03"
        return [
            EventOption(
                id="event_sufi_evening",
                name="Mock Sufi Music Evening",
                category="live_music",
                venue_name="India Habitat Centre",
                address="Lodhi Road, New Delhi",
                lat=28.5899,
                lng=77.2260,
                start_time=f"{date}T19:30:00+05:30",
                end_time=f"{date}T21:00:00+05:30",
                price_min=28,
                price_max=55,
                currency=request.currency,
                ticket_url="https://example.com/events/sufi-evening",
                provider=self.name,
                fetched_at=fetched_at,
                distance_from_user_or_hotel_km=4.2,
                why_recommended="Evening culture option near Lodhi and central Delhi hotel areas.",
            ),
            EventOption(
                id="event_comedy_cp",
                name="Mock Stand-Up Comedy Night",
                category="comedy",
                venue_name="Connaught Club Stage",
                address="Connaught Place, New Delhi",
                lat=28.6304,
                lng=77.2177,
                start_time=f"{date}T20:00:00+05:30",
                end_time=f"{date}T21:30:00+05:30",
                price_min=18,
                price_max=35,
                currency=request.currency,
                ticket_url="https://example.com/events/comedy-cp",
                provider=self.name,
                fetched_at=fetched_at,
                distance_from_user_or_hotel_km=0.6,
                why_recommended="Low-friction local evening plan near the suggested hotel.",
            ),
            EventOption(
                id="event_craft_walk",
                name="Mock Old Delhi Heritage Walk",
                category="local_experience",
                venue_name="Chandni Chowk Gate",
                address="Chandni Chowk, Old Delhi",
                lat=28.6505,
                lng=77.2303,
                start_time=f"{date}T09:00:00+05:30",
                end_time=f"{date}T11:30:00+05:30",
                price_min=42,
                price_max=42,
                currency=request.currency,
                ticket_url="https://example.com/events/old-delhi-walk",
                provider=self.name,
                fetched_at=fetched_at,
                distance_from_user_or_hotel_km=5.3,
                why_recommended="Adds guided context to Old Delhi photography and culture stops.",
            ),
        ][: request.limit]
