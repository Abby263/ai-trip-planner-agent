from abc import ABC, abstractmethod


class CurrencyProvider(ABC):
    name: str

    @abstractmethod
    async def convert(self, amount: float, from_currency: str, to_currency: str) -> dict:
        raise NotImplementedError
