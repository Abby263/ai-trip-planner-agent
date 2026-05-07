from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.hotel import HotelOption, HotelSearchRequest

from .base import HotelProvider


class AmadeusHotelProvider(HotelProvider):
    name = "AmadeusHotelProvider"

    def __init__(self, client_id: str | None = None, client_secret: str | None = None) -> None:
        self.client_id = client_id
        self.client_secret = client_secret

    async def search_hotels(self, request: HotelSearchRequest) -> list[HotelOption]:
        if not self.client_id or not self.client_secret:
            raise ProviderNotConfiguredError("Amadeus hotel credentials are not configured.")
        raise NotImplementedError("Amadeus hotel integration placeholder.")
