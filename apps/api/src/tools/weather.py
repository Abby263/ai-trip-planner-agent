from src.services.provider_registry import get_provider_registry
from src.tools.base import ToolResult


async def get_weather_tool(location: dict, date_range: dict) -> ToolResult:
    provider = get_provider_registry().weather
    result = await provider.get_weather(location, date_range)
    return ToolResult("get_weather", result, provider.name)
