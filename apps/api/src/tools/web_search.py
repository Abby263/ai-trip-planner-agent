from src.schemas.common import utc_now_iso
from src.tools.base import ToolResult


async def web_search_tool(query: str) -> ToolResult:
    return ToolResult(
        "web_search",
        [
            {
                "title": "Mock travel advisory",
                "url": "https://example.com/travel-advisory",
                "snippet": "Verify travel documents and local requirements before booking.",
                "provider": "MockWebResearchProvider",
                "fetched_at": utc_now_iso(),
            }
        ],
        "MockWebResearchProvider",
    )
