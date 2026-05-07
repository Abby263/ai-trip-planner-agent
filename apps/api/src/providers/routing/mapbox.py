from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.common import Coordinates
from src.schemas.route import RouteRequest, RouteResult

from .base import RoutingProvider


class MapboxDirectionsProvider(RoutingProvider):
    name = "MapboxDirectionsProvider"

    def __init__(self, token: str | None = None) -> None:
        self.token = token

    async def geocode(self, address: str) -> Coordinates:
        if not self.token:
            raise ProviderNotConfiguredError("Mapbox token is not configured.")
        raise NotImplementedError("Mapbox geocoding integration placeholder.")

    async def compute_route(self, request: RouteRequest) -> RouteResult:
        if not self.token:
            raise ProviderNotConfiguredError("Mapbox token is not configured.")
        raise NotImplementedError("Mapbox Directions integration placeholder.")

    async def optimize_route(self, request: RouteRequest) -> RouteResult:
        if not self.token:
            raise ProviderNotConfiguredError("Mapbox token is not configured.")
        raise NotImplementedError("Mapbox Optimization integration placeholder.")
