from src.schemas.event import EventOption, EventSearchRequest

from .base import EventsProvider


class WebSearchEventsProvider(EventsProvider):
    name = "WebSearchEventsProvider"

    async def search_events(self, request: EventSearchRequest) -> list[EventOption]:
        raise NotImplementedError("Allowlisted event web search provider placeholder.")
