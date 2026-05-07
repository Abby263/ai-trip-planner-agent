from src.schemas.route import RouteRequest
from src.services.provider_registry import get_provider_registry
from src.tools.base import ToolResult


async def optimize_route_tool(request: RouteRequest) -> ToolResult:
    provider = get_provider_registry().routing
    result = await provider.optimize_route(request)
    return ToolResult("optimize_route", result, provider.name)
