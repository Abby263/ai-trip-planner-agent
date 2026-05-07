from src.core.exceptions import ProviderNotConfiguredError

from .base import CurrencyProvider


class ExchangeRateProvider(CurrencyProvider):
    name = "ExchangeRateProvider"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key

    async def convert(self, amount: float, from_currency: str, to_currency: str) -> dict:
        if not self.api_key:
            raise ProviderNotConfiguredError("Exchange rate API key is not configured.")
        raise NotImplementedError("Exchange rate integration placeholder.")
