from abc import ABC, abstractmethod

from src.schemas.event import EventOption, EventSearchRequest


class EventsProvider(ABC):
    name: str

    @abstractmethod
    async def search_events(self, request: EventSearchRequest) -> list[EventOption]:
        raise NotImplementedError
