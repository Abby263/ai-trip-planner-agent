from src.core.exceptions import TripNotFoundError
from src.db.repositories import get_progress_events, get_trip_result, get_trip_status, save_trip_result
from src.graph.state import new_state_from_request
from src.graph.trip_graph import TripPlanningGraph
from src.schemas.trip import PlanTripRequest, PlanTripResponse, RefineTripRequest, TripSessionResponse
from src.services.streaming_service import publish_progress


class TripService:
    def __init__(self) -> None:
        self.graph = TripPlanningGraph()

    async def plan_trip(self, request: PlanTripRequest) -> PlanTripResponse:
        state = new_state_from_request(request)
        trip_id = state["session_id"]
        save_trip_result(trip_id, "running", None)
        _publish_standard_progress(trip_id, started=True)
        try:
            result_state = await self.graph.run(state)
            status = "needs_input" if result_state.get("missing_fields") else "completed"
            if status == "completed":
                _publish_standard_progress(trip_id, completed=True)
            final_response = result_state.get("final_response")
            save_trip_result(trip_id, status, final_response)
            return PlanTripResponse(
                trip_id=trip_id,
                status=status,
                follow_up_questions=result_state.get("follow_up_questions", []),
                result=final_response,
            )
        except Exception as exc:
            publish_progress(trip_id, "failed", str(exc), status="failed")
            save_trip_result(trip_id, "failed", {"error": str(exc)})
            raise

    async def get_trip(self, trip_id: str) -> TripSessionResponse:
        result = get_trip_result(trip_id)
        if result is None:
            raise TripNotFoundError(f"Trip {trip_id} was not found.")
        return TripSessionResponse(
            trip_id=trip_id,
            status=get_trip_status(trip_id),
            result=result,
            progress_events=get_progress_events(trip_id),
        )

    async def refine_trip(self, trip_id: str, request: RefineTripRequest) -> PlanTripResponse:
        existing = get_trip_result(trip_id)
        if existing is None:
            raise TripNotFoundError(f"Trip {trip_id} was not found.")
        summary = existing.get("summary", {})
        refined_query = (
            f"{summary.get('title', 'Trip plan')}. "
            f"Refinement request: {request.instruction}"
        )
        plan_request = PlanTripRequest(
            query=refined_query,
            origin=summary.get("origin"),
            destination=summary.get("destination"),
            duration_days=summary.get("duration_days"),
            traveler_count=summary.get("traveler_count", 1),
            currency=summary.get("currency", "CAD"),
            preferences=_merge_preferences(existing, request.instruction),
            dietary_preferences=_dietary_preferences(existing, request.instruction),
            travel_style="relaxed" if "relaxed" in request.instruction.lower() else None,
        )
        response = await self.plan_trip(plan_request)
        response.trip_id = trip_id
        if response.result:
            if hasattr(response.result, "trip_id"):
                response.result.trip_id = trip_id
            else:
                response.result["trip_id"] = trip_id
        save_trip_result(trip_id, response.status, response.result)
        publish_progress(trip_id, "completed", "Refined itinerary is ready.")
        return response


def _publish_standard_progress(trip_id: str, started: bool = False, completed: bool = False) -> None:
    if started:
        for event in [
            "intent_parsed",
            "missing_info_checked",
            "researching",
            "searching_flights",
            "searching_hotels",
            "searching_places",
            "searching_events",
            "optimizing_route",
            "building_itinerary",
            "estimating_budget",
            "validating",
        ]:
            publish_progress(trip_id, event)
    if completed:
        publish_progress(trip_id, "completed")


def _merge_preferences(existing: dict, instruction: str) -> list[str]:
    preferences: set[str] = set()
    for option in existing.get("options", []):
        for highlight in option.get("highlights", []):
            if "photography" in highlight.lower():
                preferences.add("photography spots")
    lower = instruction.lower()
    if "shopping" in lower:
        preferences.add("shopping")
    if "cheaper" in lower or "budget" in lower:
        preferences.add("budget-friendly")
    if "vegetarian" in lower:
        preferences.add("vegetarian food")
    return sorted(preferences)


def _dietary_preferences(existing: dict, instruction: str) -> list[str]:
    lower = instruction.lower()
    preferences = []
    if "vegetarian" in lower:
        preferences.append("vegetarian")
    for assumption in existing.get("summary", {}).get("assumptions", []):
        if "vegetarian" in assumption.lower():
            preferences.append("vegetarian")
    return sorted(set(preferences))


trip_service = TripService()
