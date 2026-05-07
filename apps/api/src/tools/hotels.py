from src.schemas.hotel import HotelSearchRequest
from src.services.provider_registry import get_provider_registry
from src.tools.base import ToolResult


async def search_hotels_tool(request: HotelSearchRequest) -> ToolResult:
    provider = get_provider_registry().hotels
    results = await provider.search_hotels(request)
    return ToolResult("search_hotels", results, provider.name)
