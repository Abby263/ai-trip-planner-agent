import pytest

from src.providers.events.mock import MockEventsProvider
from src.providers.flights.mock import MockFlightProvider
from src.providers.hotels.mock import MockHotelProvider
from src.providers.places.mock import MockPlacesProvider
from src.providers.routing.mock import MockRoutingProvider
from src.schemas.event import EventSearchRequest
from src.schemas.flight import FlightSearchRequest
from src.schemas.hotel import HotelSearchRequest
from src.schemas.place import PlaceSearchRequest
from src.schemas.route import RoutePoint, RouteRequest


@pytest.mark.asyncio
async def test_mock_flight_provider() -> None:
    results = await MockFlightProvider().search_flights(FlightSearchRequest(origin="Toronto", destination="Delhi"))
    assert len(results) == 3
    assert results[0].provider == "MockFlightProvider"
    assert results[0].price_confidence == "estimated"


@pytest.mark.asyncio
async def test_mock_hotel_provider() -> None:
    results = await MockHotelProvider().search_hotels(HotelSearchRequest(destination="Delhi", nights=3))
    assert len(results) == 3
    assert results[1].total_price == results[1].price_per_night * 3


@pytest.mark.asyncio
async def test_mock_places_and_restaurants() -> None:
    provider = MockPlacesProvider()
    places = await provider.search_places(PlaceSearchRequest(destination="Delhi"))
    restaurants = await provider.search_restaurants(PlaceSearchRequest(destination="Delhi", dietary_preferences=["vegetarian"]))
    assert any(place.category == "shopping" for place in places)
    assert all("vegetarian" in " ".join(restaurant.dietary_tags) for restaurant in restaurants[:2])


@pytest.mark.asyncio
async def test_mock_events_provider() -> None:
    events = await MockEventsProvider().search_events(EventSearchRequest(destination="Delhi"))
    assert any(event.category == "comedy" for event in events)


@pytest.mark.asyncio
async def test_mock_routing_provider() -> None:
    route = await MockRoutingProvider().optimize_route(
        RouteRequest(
            points=[
                RoutePoint(id="a", title="A", lat=28.63, lng=77.21, type="hotel"),
                RoutePoint(id="b", title="B", lat=28.61, lng=77.22, type="landmark"),
            ]
        )
    )
    assert route.segments[0].duration_minutes > 0
