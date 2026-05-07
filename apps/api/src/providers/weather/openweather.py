from src.core.exceptions import ProviderNotConfiguredError

from .base import WeatherProvider


class OpenWeatherProvider(WeatherProvider):
    name = "OpenWeatherProvider"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key

    async def get_weather(self, location: dict, date_range: dict) -> dict:
        if not self.api_key:
            raise ProviderNotConfiguredError("OpenWeather API key is not configured.")
        raise NotImplementedError("OpenWeather integration placeholder.")
