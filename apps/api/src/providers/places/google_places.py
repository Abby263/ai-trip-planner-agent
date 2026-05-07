from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.place import PlaceOption, PlaceSearchRequest, RestaurantOption

from .base import PlacesProvider


class GooglePlacesProvider(PlacesProvider):
    name = "GooglePlacesProvider"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key

    async def search_places(self, request: PlaceSearchRequest) -> list[PlaceOption]:
        if not self.api_key:
            raise ProviderNotConfiguredError("Google Places API key is not configured.")
        raise NotImplementedError("Google Places integration placeholder.")

    async def get_place_details(self, place_id: str) -> PlaceOption:
        if not self.api_key:
            raise ProviderNotConfiguredError("Google Places API key is not configured.")
        raise NotImplementedError("Google Place Details integration placeholder.")

    async def search_restaurants(self, request: PlaceSearchRequest) -> list[RestaurantOption]:
        if not self.api_key:
            raise ProviderNotConfiguredError("Google Places API key is not configured.")
        raise NotImplementedError("Google Places restaurant integration placeholder.")
