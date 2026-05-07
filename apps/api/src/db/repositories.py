from src.schemas.trip import FinalTripResponse, ProgressEvent


TRIP_RESULTS: dict[str, dict] = {}
TRIP_STATUSES: dict[str, str] = {}
TRIP_PROGRESS: dict[str, list[ProgressEvent]] = {}


def save_trip_result(trip_id: str, status: str, result: FinalTripResponse | dict | None) -> None:
    TRIP_STATUSES[trip_id] = status
    if result is not None:
        if hasattr(result, "model_dump"):
            TRIP_RESULTS[trip_id] = result.model_dump(mode="json")
        else:
            TRIP_RESULTS[trip_id] = result


def get_trip_result(trip_id: str) -> dict | None:
    return TRIP_RESULTS.get(trip_id)


def get_trip_status(trip_id: str) -> str:
    return TRIP_STATUSES.get(trip_id, "failed")


def save_progress_event(trip_id: str, event: ProgressEvent) -> None:
    TRIP_PROGRESS.setdefault(trip_id, []).append(event)


def get_progress_events(trip_id: str) -> list[ProgressEvent]:
    return TRIP_PROGRESS.get(trip_id, [])
