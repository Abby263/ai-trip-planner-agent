from src.services.provider_registry import get_provider_registry
from src.tools.base import ToolResult


async def convert_currency_tool(amount: float, from_currency: str, to_currency: str) -> ToolResult:
    provider = get_provider_registry().currency
    result = await provider.convert(amount, from_currency, to_currency)
    return ToolResult("convert_currency", result, provider.name)
