from dataclasses import dataclass

from src.core.config import settings
from src.providers.currency.base import CurrencyProvider
from src.providers.currency.exchangerate import ExchangeRateProvider
from src.providers.currency.mock import MockCurrencyProvider
from src.providers.events.base import EventsProvider
from src.providers.events.mock import MockEventsProvider
from src.providers.events.ticketmaster import TicketmasterEventsProvider
from src.providers.flights.amadeus import AmadeusFlightProvider
from src.providers.flights.base import FlightProvider
from src.providers.flights.mock import MockFlightProvider
from src.providers.hotels.amadeus import AmadeusHotelProvider
from src.providers.hotels.base import HotelProvider
from src.providers.hotels.mock import MockHotelProvider
from src.providers.places.base import PlacesProvider
from src.providers.places.google_places import GooglePlacesProvider
from src.providers.places.mock import MockPlacesProvider
from src.providers.routing.base import RoutingProvider
from src.providers.routing.google_routes import GoogleRoutesProvider
from src.providers.routing.mock import MockRoutingProvider
from src.providers.weather.base import WeatherProvider
from src.providers.weather.mock import MockWeatherProvider
from src.providers.weather.openweather import OpenWeatherProvider


@dataclass
class ProviderRegistry:
    flights: FlightProvider
    hotels: HotelProvider
    places: PlacesProvider
    events: EventsProvider
    routing: RoutingProvider
    weather: WeatherProvider
    currency: CurrencyProvider


def get_provider_registry() -> ProviderRegistry:
    if settings.mock_mode:
        return ProviderRegistry(
            flights=MockFlightProvider(),
            hotels=MockHotelProvider(),
            places=MockPlacesProvider(),
            events=MockEventsProvider(),
            routing=MockRoutingProvider(),
            weather=MockWeatherProvider(),
            currency=MockCurrencyProvider(),
        )
    return ProviderRegistry(
        flights=(
            AmadeusFlightProvider(settings.amadeus_client_id, settings.amadeus_client_secret)
            if settings.amadeus_client_id and settings.amadeus_client_secret
            else MockFlightProvider()
        ),
        hotels=(
            AmadeusHotelProvider(settings.amadeus_client_id, settings.amadeus_client_secret)
            if settings.amadeus_client_id and settings.amadeus_client_secret
            else MockHotelProvider()
        ),
        places=GooglePlacesProvider(settings.google_maps_api_key)
        if settings.google_maps_api_key
        else MockPlacesProvider(),
        events=TicketmasterEventsProvider(settings.ticketmaster_api_key)
        if settings.ticketmaster_api_key
        else MockEventsProvider(),
        routing=GoogleRoutesProvider(settings.google_maps_api_key)
        if settings.google_maps_api_key
        else MockRoutingProvider(),
        weather=OpenWeatherProvider(settings.openweather_api_key)
        if settings.openweather_api_key
        else MockWeatherProvider(),
        currency=ExchangeRateProvider(settings.exchange_rate_api_key)
        if settings.exchange_rate_api_key
        else MockCurrencyProvider(),
    )
