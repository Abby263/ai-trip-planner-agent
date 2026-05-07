from datetime import datetime, timezone
from typing import Any, Literal, TypedDict
from uuid import uuid4

from pydantic import BaseModel, Field

from src.schemas.trip import PlanTripRequest


class TripPlanningState(TypedDict, total=False):
    session_id: str
    user_id: str | None
    raw_user_query: str
    trip_type: str | None

    origin: str | None
    destination: str | None
    current_location: dict | None

    start_date: str | None
    end_date: str | None
    duration_days: int | None
    traveler_count: int

    budget: float | None
    currency: str

    preferences: list[str]
    dietary_preferences: list[str]
    mobility_constraints: list[str]
    flight_preferences: dict
    hotel_preferences: dict
    event_preferences: dict
    travel_style: str | None

    missing_fields: list[str]
    follow_up_questions: list[str]
    assumptions: list[str]

    research_plan: dict | None

    flight_results: list[dict]
    hotel_results: list[dict]
    places_results: list[dict]
    restaurant_results: list[dict]
    events_results: list[dict]
    weather_results: list[dict]
    web_research_results: list[dict]

    normalized_results: dict | None
    route_results: dict | None
    itinerary_options: list[dict]
    budget_summary: dict | None

    validation_report: dict | None
    critique_report: dict | None
    repair_attempts: int

    booking_links: list[dict]
    source_citations: list[dict]
    warnings: list[str]

    final_response: dict | None

    progress_events: list[dict]
    execution_trace: list[dict]

    created_at: str
    updated_at: str


class TripPlanningStateModel(BaseModel):
    session_id: str
    user_id: str | None = None
    raw_user_query: str
    trip_type: str | None = None
    origin: str | None = None
    destination: str | None = None
    current_location: dict | None = None
    start_date: str | None = None
    end_date: str | None = None
    duration_days: int | None = None
    traveler_count: int = 1
    budget: float | None = None
    currency: str = "CAD"
    preferences: list[str] = Field(default_factory=list)
    dietary_preferences: list[str] = Field(default_factory=list)
    mobility_constraints: list[str] = Field(default_factory=list)
    flight_preferences: dict = Field(default_factory=dict)
    hotel_preferences: dict = Field(default_factory=dict)
    event_preferences: dict = Field(default_factory=dict)
    travel_style: Literal["relaxed", "balanced", "packed"] | None = None
    missing_fields: list[str] = Field(default_factory=list)
    assumptions: list[str] = Field(default_factory=list)
    research_plan: dict | None = None
    flight_results: list[dict] = Field(default_factory=list)
    hotel_results: list[dict] = Field(default_factory=list)
    places_results: list[dict] = Field(default_factory=list)
    restaurant_results: list[dict] = Field(default_factory=list)
    events_results: list[dict] = Field(default_factory=list)
    weather_results: list[dict] = Field(default_factory=list)
    web_research_results: list[dict] = Field(default_factory=list)
    normalized_results: dict | None = None
    route_results: dict | None = None
    itinerary_options: list[dict] = Field(default_factory=list)
    budget_summary: dict | None = None
    validation_report: dict | None = None
    repair_attempts: int = 0
    booking_links: list[dict] = Field(default_factory=list)
    source_citations: list[dict] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    final_response: dict | None = None
    progress_events: list[dict] = Field(default_factory=list)
    execution_trace: list[dict] = Field(default_factory=list)
    created_at: str
    updated_at: str


def new_state_from_request(request: PlanTripRequest, trip_id: str | None = None) -> TripPlanningState:
    now = datetime.now(timezone.utc).isoformat()
    return TripPlanningState(
        session_id=trip_id or f"trip_{uuid4().hex[:12]}",
        user_id=None,
        raw_user_query=request.query,
        trip_type=None,
        origin=request.origin,
        destination=request.destination,
        current_location=request.current_location.model_dump() if request.current_location else None,
        start_date=request.start_date,
        end_date=request.end_date,
        duration_days=request.duration_days,
        traveler_count=request.traveler_count,
        budget=request.budget,
        currency=request.currency.upper(),
        preferences=list(request.preferences),
        dietary_preferences=list(request.dietary_preferences),
        mobility_constraints=[],
        flight_preferences={},
        hotel_preferences={},
        event_preferences={},
        travel_style=request.travel_style,
        missing_fields=[],
        follow_up_questions=[],
        assumptions=[],
        research_plan=None,
        flight_results=[],
        hotel_results=[],
        places_results=[],
        restaurant_results=[],
        events_results=[],
        weather_results=[],
        web_research_results=[],
        normalized_results=None,
        route_results=None,
        itinerary_options=[],
        budget_summary=None,
        validation_report=None,
        critique_report=None,
        repair_attempts=0,
        booking_links=[],
        source_citations=[],
        warnings=[],
        final_response=None,
        progress_events=[],
        execution_trace=[],
        created_at=now,
        updated_at=now,
    )


def touch_state(state: TripPlanningState) -> TripPlanningState:
    state["updated_at"] = datetime.now(timezone.utc).isoformat()
    return state
