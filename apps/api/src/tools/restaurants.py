from src.schemas.place import PlaceSearchRequest
from src.services.provider_registry import get_provider_registry
from src.tools.base import ToolResult


async def search_restaurants_tool(request: PlaceSearchRequest) -> ToolResult:
    provider = get_provider_registry().places
    results = await provider.search_restaurants(request)
    return ToolResult("search_restaurants", results, provider.name)
