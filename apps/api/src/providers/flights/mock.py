from src.schemas.common import utc_now_iso
from src.schemas.flight import FlightOption, FlightSearchRequest

from .base import FlightProvider


class MockFlightProvider(FlightProvider):
    name = "MockFlightProvider"

    async def search_flights(self, request: FlightSearchRequest) -> list[FlightOption]:
        fetched_at = utc_now_iso()
        origin_airport = _airport_code(request.origin)
        destination_airport = _airport_code(request.destination)
        return [
            FlightOption(
                id="flight_budget_yyz_del",
                airline="Mock Air",
                flight_number="MA 214",
                origin_airport=origin_airport,
                destination_airport=destination_airport,
                departure_time=f"{request.start_date or '2026-09-01'}T21:30:00-04:00",
                arrival_time=f"{request.start_date or '2026-09-02'}T22:15:00+05:30",
                duration_minutes=855,
                stops=1,
                layovers=["Doha"],
                cabin_class=request.cabin_class,
                price=1325,
                currency=request.currency,
                baggage_note="One checked bag estimate; verify with provider before booking.",
                booking_url="https://example.com/flights/mock-air-yyz-del",
                provider=self.name,
                fetched_at=fetched_at,
                price_confidence="estimated",
                ranking_reason="Lowest mock fare with one manageable connection.",
            ),
            FlightOption(
                id="flight_balanced_yyz_del",
                airline="Maple Sky",
                flight_number="MS 88",
                origin_airport=origin_airport,
                destination_airport=destination_airport,
                departure_time=f"{request.start_date or '2026-09-01'}T18:55:00-04:00",
                arrival_time=f"{request.start_date or '2026-09-02'}T20:40:00+05:30",
                duration_minutes=825,
                stops=1,
                layovers=["London"],
                cabin_class=request.cabin_class,
                price=1450,
                currency=request.currency,
                baggage_note="Mock fare includes seat selection estimate.",
                booking_url="https://example.com/flights/maple-sky-yyz-del",
                provider=self.name,
                fetched_at=fetched_at,
                price_confidence="estimated",
                ranking_reason="Good balance of price, total duration, and evening departure.",
            ),
            FlightOption(
                id="flight_premium_yyz_del",
                airline="Global Connect",
                flight_number="GC 17",
                origin_airport=origin_airport,
                destination_airport=destination_airport,
                departure_time=f"{request.start_date or '2026-09-01'}T14:10:00-04:00",
                arrival_time=f"{request.start_date or '2026-09-02'}T17:25:00+05:30",
                duration_minutes=765,
                stops=0,
                layovers=[],
                cabin_class=request.cabin_class,
                price=1980,
                currency=request.currency,
                baggage_note="Direct mock option; verify baggage rules with provider.",
                booking_url="https://example.com/flights/global-connect-yyz-del",
                provider=self.name,
                fetched_at=fetched_at,
                price_confidence="estimated",
                ranking_reason="Shortest itinerary with no layover for comfort-focused travelers.",
            ),
        ]


def _airport_code(city_or_airport: str) -> str:
    normalized = city_or_airport.lower()
    if "toronto" in normalized or "yyz" in normalized:
        return "YYZ"
    if "delhi" in normalized or "del" in normalized:
        return "DEL"
    if "paris" in normalized:
        return "CDG"
    return city_or_airport[:3].upper()
