from typing import Literal

from pydantic import BaseModel, HttpUrl

from src.schemas.common import PriceConfidence


class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    start_date: str | None = None
    end_date: str | None = None
    traveler_count: int = 1
    cabin_class: str = "economy"
    currency: str = "CAD"
    preferences: dict = {}


class FlightOption(BaseModel):
    id: str
    airline: str
    flight_number: str | None = None
    origin_airport: str
    destination_airport: str
    departure_time: str
    arrival_time: str
    duration_minutes: int
    stops: int
    layovers: list[str]
    cabin_class: str
    price: float
    currency: str
    baggage_note: str | None = None
    booking_url: HttpUrl | str | None = None
    provider: str
    fetched_at: str
    price_confidence: PriceConfidence = "estimated"
    ranking_reason: str
    availability_status: Literal["confirmed_by_provider", "not_confirmed", "mock"] = "mock"
