from typing import Any, Literal

from pydantic import BaseModel, Field

from src.schemas.budget import BudgetSummary
from src.schemas.common import BookingLink, Confidence, SourceCitation, TravelPace
from src.schemas.event import EventOption
from src.schemas.flight import FlightOption
from src.schemas.hotel import HotelOption
from src.schemas.route import MapData


TripStatus = Literal["queued", "running", "completed", "needs_input", "failed"]
TripType = Literal[
    "full_trip",
    "weekend_plan",
    "local_event_search",
    "destination_inspiration",
    "itinerary_refinement",
    "booking_assistance",
]


class CurrentLocation(BaseModel):
    lat: float
    lng: float


class PlanTripRequest(BaseModel):
    query: str = Field(min_length=4, max_length=4000)
    origin: str | None = None
    destination: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    duration_days: int | None = Field(default=None, ge=1, le=45)
    traveler_count: int = Field(default=1, ge=1, le=12)
    budget: float | None = Field(default=None, ge=0)
    currency: str = Field(default="CAD", min_length=3, max_length=3)
    preferences: list[str] = []
    dietary_preferences: list[str] = []
    travel_style: TravelPace | None = None
    current_location: CurrentLocation | None = None


class RefineTripRequest(BaseModel):
    instruction: str = Field(min_length=3, max_length=2000)
    selected_option_id: str | None = None


class ProgressEvent(BaseModel):
    event: str
    label: str
    status: Literal["queued", "running", "completed", "failed"] = "completed"
    detail: str | None = None
    timestamp: str


class TripSummary(BaseModel):
    title: str
    origin: str | None = None
    destination: str | None = None
    duration_days: int | None = None
    traveler_count: int
    currency: str
    assumptions: list[str] = []


class ItineraryActivity(BaseModel):
    id: str
    start_time: str
    end_time: str
    title: str
    category: str
    description: str
    address: str
    lat: float
    lng: float
    estimated_cost: float
    currency: str
    travel_time_from_previous_minutes: int | None = None
    booking_required: bool = False
    booking_url: str | None = None
    source_provider: str
    confidence: Confidence = "medium"


class ItineraryDay(BaseModel):
    day_number: int
    date: str | None = None
    title: str
    theme: str
    activities: list[ItineraryActivity]


class ItineraryOption(BaseModel):
    id: str
    name: str
    best_for: str
    pace: TravelPace
    estimated_total: float
    currency: str
    confidence: Confidence
    highlights: list[str]
    flight: FlightOption | None = None
    hotel: HotelOption | None = None
    events: list[EventOption] = []
    days: list[ItineraryDay]
    budget_summary: BudgetSummary | None = None
    warnings: list[str] = []
    booking_links: list[BookingLink] = []


class FinalTripResponse(BaseModel):
    trip_id: str
    summary: TripSummary
    options: list[ItineraryOption]
    map_data: MapData
    booking_links: list[BookingLink]
    warnings: list[str]
    sources: list[SourceCitation]
    validation_report: dict[str, Any] | None = None


class PlanTripResponse(BaseModel):
    trip_id: str
    status: TripStatus
    follow_up_questions: list[str] = []
    result: FinalTripResponse | dict[str, Any] | None = None


class TripSessionResponse(BaseModel):
    trip_id: str
    status: TripStatus
    result: FinalTripResponse | dict[str, Any] | None = None
    progress_events: list[ProgressEvent] = []
