from src.schemas.common import utc_now_iso
from src.schemas.hotel import HotelOption, HotelSearchRequest

from .base import HotelProvider


class MockHotelProvider(HotelProvider):
    name = "MockHotelProvider"

    async def search_hotels(self, request: HotelSearchRequest) -> list[HotelOption]:
        nights = max(request.nights, 1)
        fetched_at = utc_now_iso()
        return [
            HotelOption(
                id="hotel_budget_cp",
                name="Mock Central Stay Delhi",
                address="Barakhamba Road, Connaught Place, New Delhi",
                neighborhood="Connaught Place",
                lat=28.6315,
                lng=77.2167,
                rating=4.1,
                price_per_night=96,
                total_price=96 * nights,
                currency=request.currency,
                amenities=["Breakfast", "Metro access", "Wi-Fi"],
                cancellation_policy="Mock flexible cancellation until 48 hours before check-in.",
                booking_url="https://example.com/hotels/mock-central-stay",
                provider=self.name,
                fetched_at=fetched_at,
                price_confidence="estimated",
                ranking_reason="Central location with lower nightly price and transit access.",
            ),
            HotelOption(
                id="hotel_balanced_cp",
                name="Mock Heritage Hotel Delhi",
                address="Janpath Lane, Connaught Place, New Delhi",
                neighborhood="Connaught Place",
                lat=28.6289,
                lng=77.2195,
                rating=4.3,
                price_per_night=140,
                total_price=140 * nights,
                currency=request.currency,
                amenities=["Breakfast", "Concierge", "Airport transfer", "Wi-Fi"],
                cancellation_policy="Mock refundable rate; verify policy on provider site.",
                booking_url="https://example.com/hotels/mock-heritage-delhi",
                provider=self.name,
                fetched_at=fetched_at,
                price_confidence="estimated",
                ranking_reason="Best balance of comfort, neighborhood access, and route efficiency.",
            ),
            HotelOption(
                id="hotel_premium_lodhi",
                name="Mock Lodhi Garden Retreat",
                address="Lodhi Road, New Delhi",
                neighborhood="Lodhi Colony",
                lat=28.5918,
                lng=77.2197,
                rating=4.8,
                price_per_night=265,
                total_price=265 * nights,
                currency=request.currency,
                amenities=["Spa", "Pool", "Fine dining", "Photography walk access"],
                cancellation_policy="Mock semi-flexible cancellation.",
                booking_url="https://example.com/hotels/mock-lodhi-retreat",
                provider=self.name,
                fetched_at=fetched_at,
                price_confidence="estimated",
                ranking_reason="Premium comfort near gardens, museums, and photography-friendly areas.",
            ),
        ]
