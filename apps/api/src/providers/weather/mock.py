from src.schemas.common import utc_now_iso

from .base import WeatherProvider


class MockWeatherProvider(WeatherProvider):
    name = "MockWeatherProvider"

    async def get_weather(self, location: dict, date_range: dict) -> dict:
        return {
            "provider": self.name,
            "fetched_at": utc_now_iso(),
            "confidence": "estimated",
            "summary": "Warm and dry mock forecast; schedule outdoor photography early or late.",
            "daily": [
                {"day": 1, "condition": "sunny", "high_c": 32, "low_c": 22},
                {"day": 2, "condition": "sunny", "high_c": 33, "low_c": 23},
                {"day": 3, "condition": "partly_cloudy", "high_c": 31, "low_c": 22},
            ],
        }
