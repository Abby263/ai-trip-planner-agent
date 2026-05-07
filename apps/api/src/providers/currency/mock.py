from src.schemas.common import utc_now_iso

from .base import CurrencyProvider


class MockCurrencyProvider(CurrencyProvider):
    name = "MockCurrencyProvider"

    async def convert(self, amount: float, from_currency: str, to_currency: str) -> dict:
        rates = {("USD", "CAD"): 1.36, ("INR", "CAD"): 0.016, ("CAD", "CAD"): 1}
        rate = rates.get((from_currency, to_currency), 1)
        return {
            "amount": round(amount * rate, 2),
            "from_currency": from_currency,
            "to_currency": to_currency,
            "rate": rate,
            "provider": self.name,
            "fetched_at": utc_now_iso(),
            "confidence": "estimated",
        }
