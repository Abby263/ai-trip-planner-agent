from typing import Any, Literal

from pydantic import BaseModel, HttpUrl


PlaceCategory = Literal[
    "landmark",
    "museum",
    "shopping",
    "nature",
    "religious",
    "cafe",
    "restaurant",
    "nightlife",
    "experience",
    "hotel",
    "airport",
]


class PlaceSearchRequest(BaseModel):
    destination: str | None = None
    location: dict | None = None
    query: str | None = None
    categories: list[str] = []
    preferences: list[str] = []
    dietary_preferences: list[str] = []
    limit: int = 12


class PlaceOption(BaseModel):
    id: str
    name: str
    category: PlaceCategory
    address: str
    lat: float
    lng: float
    rating: float | None = None
    price_level: str | None = None
    opening_hours: dict[str, Any] | None = None
    estimated_visit_duration_minutes: int
    booking_required: bool = False
    booking_url: HttpUrl | str | None = None
    provider: str
    fetched_at: str
    why_recommended: str
    source_url: HttpUrl | str | None = None


class RestaurantOption(BaseModel):
    id: str
    name: str
    cuisine: list[str]
    dietary_tags: list[str]
    address: str
    lat: float
    lng: float
    rating: float | None = None
    price_level: str | None = None
    opening_hours: dict[str, Any] | None = None
    reservation_url: HttpUrl | str | None = None
    provider: str
    fetched_at: str
    why_recommended: str
    source_url: HttpUrl | str | None = None
