from dataclasses import dataclass
from typing import Any


@dataclass
class ToolResult:
    name: str
    data: Any
    provider: str
    latency_ms: int | None = None
