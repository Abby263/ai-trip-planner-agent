from math import asin, cos, radians, sin, sqrt

from src.schemas.common import Coordinates
from src.schemas.route import RouteRequest, RouteResult, RouteSegment

from .base import RoutingProvider


class MockRoutingProvider(RoutingProvider):
    name = "MockRoutingProvider"

    async def geocode(self, address: str) -> Coordinates:
        normalized = address.lower()
        if "delhi" in normalized:
            return Coordinates(lat=28.6139, lng=77.2090)
        if "toronto" in normalized:
            return Coordinates(lat=43.6532, lng=-79.3832)
        return Coordinates(lat=28.6139, lng=77.2090)

    async def compute_route(self, request: RouteRequest) -> RouteResult:
        segments = []
        for previous, current in zip(request.points, request.points[1:], strict=False):
            distance = _haversine(previous.lat, previous.lng, current.lat, current.lng)
            duration = max(8, int(distance / 18 * 60)) if request.mode != "walking" else max(6, int(distance / 4.5 * 60))
            segments.append(
                RouteSegment(
                    from_activity_id=previous.id,
                    to_activity_id=current.id,
                    mode=request.mode,
                    distance_km=round(distance, 1),
                    duration_minutes=duration,
                    polyline=None,
                    provider=self.name,
                )
            )
        return RouteResult(day=request.points[0].day if request.points else None, segments=segments, provider=self.name)

    async def optimize_route(self, request: RouteRequest) -> RouteResult:
        if not request.points:
            return RouteResult(day=None, segments=[], provider=self.name)
        first, *rest = request.points
        ordered = [first]
        remaining = rest[:]
        while remaining:
            current = ordered[-1]
            next_point = min(
                remaining,
                key=lambda point: _haversine(current.lat, current.lng, point.lat, point.lng),
            )
            ordered.append(next_point)
            remaining.remove(next_point)
        return await self.compute_route(RouteRequest(points=ordered, mode=request.mode, constraints=request.constraints))


def _haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    radius_km = 6371
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    c = 2 * asin(sqrt(a))
    return radius_km * c
