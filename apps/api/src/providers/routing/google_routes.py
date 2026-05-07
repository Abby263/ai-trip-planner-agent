from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.common import Coordinates
from src.schemas.route import RouteRequest, RouteResult

from .base import RoutingProvider


class GoogleRoutesProvider(RoutingProvider):
    name = "GoogleRoutesProvider"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key

    async def geocode(self, address: str) -> Coordinates:
        if not self.api_key:
            raise ProviderNotConfiguredError("Google Maps API key is not configured.")
        raise NotImplementedError("Google geocoding integration placeholder.")

    async def compute_route(self, request: RouteRequest) -> RouteResult:
        if not self.api_key:
            raise ProviderNotConfiguredError("Google Routes API key is not configured.")
        raise NotImplementedError("Google Routes integration placeholder.")

    async def optimize_route(self, request: RouteRequest) -> RouteResult:
        if not self.api_key:
            raise ProviderNotConfiguredError("Google Routes API key is not configured.")
        raise NotImplementedError("Google Routes optimization placeholder.")
