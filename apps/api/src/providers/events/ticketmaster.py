from src.core.exceptions import ProviderNotConfiguredError
from src.schemas.event import EventOption, EventSearchRequest

from .base import EventsProvider


class TicketmasterEventsProvider(EventsProvider):
    name = "TicketmasterEventsProvider"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key

    async def search_events(self, request: EventSearchRequest) -> list[EventOption]:
        if not self.api_key:
            raise ProviderNotConfiguredError("Ticketmaster API key is not configured.")
        raise NotImplementedError("Ticketmaster integration placeholder.")
