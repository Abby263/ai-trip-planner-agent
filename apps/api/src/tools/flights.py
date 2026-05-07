from src.schemas.flight import FlightSearchRequest
from src.services.provider_registry import get_provider_registry
from src.tools.base import ToolResult


async def search_flights_tool(request: FlightSearchRequest) -> ToolResult:
    provider = get_provider_registry().flights
    results = await provider.search_flights(request)
    return ToolResult("search_flights", results, provider.name)
