from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from src.core.config import settings
from src.core.exceptions import TripNotFoundError
from src.core.logging import configure_logging
from src.core.security import enforce_request_size
from src.memory.preference_store import get_preferences, update_preferences
from src.schemas.event import EventSearchRequest
from src.schemas.place import PlaceSearchRequest
from src.schemas.trip import PlanTripRequest, PlanTripResponse, RefineTripRequest, TripSessionResponse
from src.schemas.user import UserPreferencePatch, UserPreferenceResponse
from src.services.provider_registry import get_provider_registry
from src.services.streaming_service import sse_event_generator
from src.services.trip_service import trip_service

configure_logging()

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_size_middleware(request: Request, call_next):
    await enforce_request_size(request)
    return await call_next(request)


@app.get("/api/health")
async def health() -> dict:
    return {
        "status": "ok",
        "service": settings.app_name,
        "mock_mode": settings.mock_mode,
        "providers": {
            "flights": get_provider_registry().flights.name,
            "hotels": get_provider_registry().hotels.name,
            "places": get_provider_registry().places.name,
            "events": get_provider_registry().events.name,
            "routing": get_provider_registry().routing.name,
        },
    }


@app.post("/api/trips/plan", response_model=PlanTripResponse)
async def plan_trip(payload: PlanTripRequest) -> PlanTripResponse:
    return await trip_service.plan_trip(payload)


@app.get("/api/trips/{trip_id}", response_model=TripSessionResponse)
async def get_trip(trip_id: str) -> TripSessionResponse:
    try:
        return await trip_service.get_trip(trip_id)
    except TripNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/trips/{trip_id}/stream")
async def stream_trip(trip_id: str) -> StreamingResponse:
    return StreamingResponse(sse_event_generator(trip_id), media_type="text/event-stream")


@app.post("/api/trips/{trip_id}/refine", response_model=PlanTripResponse)
async def refine_trip(trip_id: str, payload: RefineTripRequest) -> PlanTripResponse:
    try:
        return await trip_service.refine_trip(trip_id, payload)
    except TripNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/api/events/search")
async def search_events(payload: EventSearchRequest) -> dict:
    events = await get_provider_registry().events.search_events(payload)
    return {"events": [event.model_dump(mode="json") for event in events]}


@app.post("/api/places/search")
async def search_places(payload: PlaceSearchRequest) -> dict:
    places = await get_provider_registry().places.search_places(payload)
    return {"places": [place.model_dump(mode="json") for place in places]}


@app.get("/api/users/preferences", response_model=UserPreferenceResponse)
async def read_preferences() -> UserPreferenceResponse:
    return get_preferences()


@app.patch("/api/users/preferences", response_model=UserPreferenceResponse)
async def patch_preferences(payload: UserPreferencePatch) -> UserPreferenceResponse:
    return update_preferences(payload)
