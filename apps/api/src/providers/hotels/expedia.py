from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.hotel import HotelOption, HotelSearchRequest

from .base import HotelProvider


class ExpediaHotelProvider(HotelProvider):
    name = "ExpediaHotelProvider"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key

    async def search_hotels(self, request: HotelSearchRequest) -> list[HotelOption]:
        if not self.api_key:
            raise ProviderNotConfiguredError("Expedia credentials are not configured.")
        raise NotImplementedError("Expedia affiliate hotel integration placeholder.")
