from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, Field, HttpUrl


Confidence = Literal["high", "medium", "low"]
PriceConfidence = Literal["live", "cached", "estimated"]
TravelPace = Literal["relaxed", "balanced", "packed"]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Coordinates(BaseModel):
    lat: float
    lng: float


class ProviderMetadata(BaseModel):
    provider: str
    fetched_at: str = Field(default_factory=utc_now_iso)
    source_url: HttpUrl | str | None = None
    confidence: PriceConfidence | Confidence = "estimated"
    raw_data: dict[str, Any] | None = None


class BookingLink(BaseModel):
    label: str
    url: HttpUrl | str
    provider: str
    link_type: Literal["flight", "hotel", "event", "restaurant", "activity"]
    fetched_at: str


class SourceCitation(BaseModel):
    provider: str
    source_type: str
    source_url: HttpUrl | str | None = None
    fetched_at: str
    confidence: PriceConfidence | Confidence = "estimated"
