from abc import ABC, abstractmethod


class WeatherProvider(ABC):
    name: str

    @abstractmethod
    async def get_weather(self, location: dict, date_range: dict) -> dict:
        raise NotImplementedError
