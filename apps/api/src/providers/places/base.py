from abc import ABC, abstractmethod

from src.schemas.place import PlaceOption, PlaceSearchRequest, RestaurantOption


class PlacesProvider(ABC):
    name: str

    @abstractmethod
    async def search_places(self, request: PlaceSearchRequest) -> list[PlaceOption]:
        raise NotImplementedError

    @abstractmethod
    async def get_place_details(self, place_id: str) -> PlaceOption:
        raise NotImplementedError

    @abstractmethod
    async def search_restaurants(self, request: PlaceSearchRequest) -> list[RestaurantOption]:
        raise NotImplementedError
