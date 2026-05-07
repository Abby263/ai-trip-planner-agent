from src.schemas.event import EventSearchRequest
from src.services.provider_registry import get_provider_registry
from src.tools.base import ToolResult


async def search_events_tool(request: EventSearchRequest) -> ToolResult:
    provider = get_provider_registry().events
    results = await provider.search_events(request)
    return ToolResult("search_events", results, provider.name)
