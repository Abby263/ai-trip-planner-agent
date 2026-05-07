from pydantic import BaseModel, HttpUrl

from src.schemas.common import PriceConfidence


class HotelSearchRequest(BaseModel):
    destination: str
    start_date: str | None = None
    end_date: str | None = None
    nights: int = 3
    traveler_count: int = 1
    currency: str = "CAD"
    preferences: dict = {}


class HotelOption(BaseModel):
    id: str
    name: str
    address: str
    neighborhood: str
    lat: float
    lng: float
    rating: float | None = None
    price_per_night: float
    total_price: float
    currency: str
    amenities: list[str]
    cancellation_policy: str | None = None
    booking_url: HttpUrl | str | None = None
    provider: str
    fetched_at: str
    price_confidence: PriceConfidence = "estimated"
    ranking_reason: str
