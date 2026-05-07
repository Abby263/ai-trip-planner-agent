from abc import ABC, abstractmethod

from src.schemas.hotel import HotelOption, HotelSearchRequest


class HotelProvider(ABC):
    name: str

    @abstractmethod
    async def search_hotels(self, request: HotelSearchRequest) -> list[HotelOption]:
        raise NotImplementedError
