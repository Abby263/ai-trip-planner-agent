from abc import ABC, abstractmethod

from src.schemas.common import Coordinates
from src.schemas.route import RouteRequest, RouteResult


class RoutingProvider(ABC):
    name: str

    @abstractmethod
    async def geocode(self, address: str) -> Coordinates:
        raise NotImplementedError

    @abstractmethod
    async def compute_route(self, request: RouteRequest) -> RouteResult:
        raise NotImplementedError

    @abstractmethod
    async def optimize_route(self, request: RouteRequest) -> RouteResult:
        raise NotImplementedError
