from abc import ABC, abstractmethod

from src.schemas.flight import FlightOption, FlightSearchRequest


class FlightProvider(ABC):
    name: str

    @abstractmethod
    async def search_flights(self, request: FlightSearchRequest) -> list[FlightOption]:
        raise NotImplementedError
