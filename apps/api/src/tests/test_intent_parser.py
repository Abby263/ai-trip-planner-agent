import pytest

from src.agents.intent_parser import IntentParserAgent
from src.graph.state import new_state_from_request
from src.schemas.trip import PlanTripRequest


@pytest.mark.asyncio
async def test_intent_parser_full_trip() -> None:
    state = new_state_from_request(
        PlanTripRequest(
            query="Plan a 3-day trip from Toronto to Delhi with vegetarian food and photography.",
            traveler_count=1,
            currency="CAD",
            preferences=[],
            dietary_preferences=[],
        )
    )
    result = await IntentParserAgent()(state)
    assert result["trip_type"] == "full_trip"
    assert result["origin"] == "Toronto"
    assert result["destination"] == "Delhi"
    assert result["duration_days"] == 3
    assert "vegetarian" in result["dietary_preferences"]
    assert "photography spots" in result["preferences"]


@pytest.mark.asyncio
async def test_intent_parser_local_event_search_missing_location() -> None:
    state = new_state_from_request(
        PlanTripRequest(
            query="Find comedy shows near me tonight.",
            traveler_count=1,
            currency="CAD",
            preferences=[],
            dietary_preferences=[],
        )
    )
    result = await IntentParserAgent()(state)
    assert result["trip_type"] == "local_event_search"
    assert "location" in result["missing_fields"]


@pytest.mark.asyncio
async def test_intent_parser_refinement() -> None:
    state = new_state_from_request(
        PlanTripRequest(
            query="Make it more relaxed and add shopping.",
            origin="Toronto",
            destination="Delhi",
            duration_days=3,
            traveler_count=1,
            currency="CAD",
            preferences=[],
            dietary_preferences=["vegetarian"],
        )
    )
    result = await IntentParserAgent()(state)
    assert result["trip_type"] == "itinerary_refinement"
    assert result["travel_style"] == "relaxed"
    assert "shopping" in result["preferences"]
