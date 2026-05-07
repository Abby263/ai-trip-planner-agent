from typing import Literal

from pydantic import BaseModel

from src.schemas.common import Coordinates


TravelMode = Literal["walking", "driving", "transit", "mixed"]


class RoutePoint(BaseModel):
    id: str
    title: str
    lat: float
    lng: float
    type: str
    day: int | None = None


class RouteRequest(BaseModel):
    points: list[RoutePoint]
    mode: TravelMode = "mixed"
    constraints: dict = {}


class RouteSegment(BaseModel):
    from_activity_id: str
    to_activity_id: str
    mode: TravelMode
    distance_km: float
    duration_minutes: int
    polyline: str | None = None
    provider: str


class RouteResult(BaseModel):
    day: int | None = None
    segments: list[RouteSegment]
    provider: str


class MapMarker(BaseModel):
    id: str
    label: str
    type: Literal["airport", "hotel", "attraction", "restaurant", "event"]
    title: str
    lat: float
    lng: float
    day: int | None = None


class DayRoute(BaseModel):
    day: int
    segments: list[RouteSegment]


class MapData(BaseModel):
    center: Coordinates
    markers: list[MapMarker]
    routes: list[DayRoute]
