import json
from functools import lru_cache
from typing import Any

from redis.asyncio import Redis

from src.core.config import settings


@lru_cache
def get_redis() -> Redis:
    return Redis.from_url(settings.redis_url, decode_responses=True)


class CacheService:
    async def get_json(self, key: str) -> dict[str, Any] | None:
        value = await get_redis().get(key)
        return json.loads(value) if value else None

    async def set_json(self, key: str, value: dict[str, Any], ttl_seconds: int) -> None:
        await get_redis().set(key, json.dumps(value), ex=ttl_seconds)
