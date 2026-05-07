from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.flight import FlightOption, FlightSearchRequest

from .base import FlightProvider


class DuffelFlightProvider(FlightProvider):
    name = "DuffelFlightProvider"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key

    async def search_flights(self, request: FlightSearchRequest) -> list[FlightOption]:
        if not self.api_key:
            raise ProviderNotConfiguredError("Duffel API key is not configured.")
        raise NotImplementedError("Duffel flight integration placeholder for future booking support.")
