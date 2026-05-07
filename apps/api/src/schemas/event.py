from pydantic import BaseModel, HttpUrl


class EventSearchRequest(BaseModel):
    location: dict | None = None
    destination: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    categories: list[str] = []
    preferences: list[str] = []
    currency: str = "CAD"
    limit: int = 8


class EventOption(BaseModel):
    id: str
    name: str
    category: str
    venue_name: str
    address: str
    lat: float
    lng: float
    start_time: str
    end_time: str | None = None
    price_min: float | None = None
    price_max: float | None = None
    currency: str
    ticket_url: HttpUrl | str | None = None
    provider: str
    fetched_at: str
    distance_from_user_or_hotel_km: float | None = None
    why_recommended: str
    source_url: HttpUrl | str | None = None
