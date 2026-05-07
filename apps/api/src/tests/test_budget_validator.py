import pytest

from src.agents.budget_estimator import BudgetEstimatorAgent
from src.agents.validator import validate_itinerary_options
from src.graph.state import TripPlanningState


@pytest.mark.asyncio
async def test_budget_estimator_adds_buffer_and_status() -> None:
    state = TripPlanningState(
        session_id="trip_test",
        raw_user_query="test",
        currency="CAD",
        duration_days=3,
        budget=3000,
        itinerary_options=[
            {
                "id": "option_balanced",
                "name": "Smart Balanced",
                "pace": "balanced",
                "flight": {"price": 1000, "price_confidence": "estimated"},
                "hotel": {"total_price": 450, "price_confidence": "estimated"},
                "events": [{"price_min": 50}],
                "days": [{"activities": [{"estimated_cost": 25}, {"estimated_cost": 20}]}],
            }
        ],
    )
    result = await BudgetEstimatorAgent()(state)
    summary = result["itinerary_options"][0]["budget_summary"]
    assert summary["buffer"] > 0
    assert summary["total_estimate"] > summary["subtotal"]
    assert summary["budget_status"] == "under_budget"


def test_validator_detects_overloaded_relaxed_day() -> None:
    option = {
        "id": "option_relaxed",
        "name": "Relaxed",
        "pace": "relaxed",
        "flight": {"provider": "MockFlightProvider"},
        "hotel": {"provider": "MockHotelProvider"},
        "booking_links": [{"url": "https://example.com"}],
        "days": [
            {
                "day_number": 1,
                "activities": [
                    {"id": str(index), "title": "A", "source_provider": "MockPlacesProvider"}
                    for index in range(5)
                ],
            }
        ],
    }
    report = validate_itinerary_options([option], ["vegetarian"], None)
    assert report["passed"] is False
    assert any(issue["severity"] == "high" for issue in report["issues"])


def test_validator_detects_missing_source() -> None:
    option = {
        "id": "option",
        "name": "Smart Balanced",
        "pace": "balanced",
        "flight": {"provider": "MockFlightProvider"},
        "hotel": {"provider": "MockHotelProvider"},
        "booking_links": [{"url": "https://example.com"}],
        "days": [{"day_number": 1, "activities": [{"id": "act", "title": "A"}]}],
    }
    report = validate_itinerary_options([option], [], None)
    assert report["passed"] is False
