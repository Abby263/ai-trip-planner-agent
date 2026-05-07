from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.flight import FlightOption, FlightSearchRequest

from .base import FlightProvider


class AmadeusFlightProvider(FlightProvider):
    name = "AmadeusFlightProvider"

    def __init__(self, client_id: str | None = None, client_secret: str | None = None) -> None:
        self.client_id = client_id
        self.client_secret = client_secret

    async def search_flights(self, request: FlightSearchRequest) -> list[FlightOption]:
        if not self.client_id or not self.client_secret:
            raise ProviderNotConfiguredError("Amadeus flight credentials are not configured.")
        raise NotImplementedError("Amadeus flight integration placeholder.")
