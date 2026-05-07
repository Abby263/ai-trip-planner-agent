import asyncio
from datetime import datetime, timezone
from typing import AsyncIterator

from src.db.repositories import get_progress_events, save_progress_event
from src.schemas.trip import ProgressEvent


PROGRESS_LABELS = {
    "intent_parsed": "Understanding request",
    "missing_info_checked": "Checking required trip details",
    "researching": "Planning provider research",
    "searching_flights": "Searching flights",
    "searching_hotels": "Comparing hotels",
    "searching_places": "Finding attractions",
    "searching_events": "Finding local events",
    "optimizing_route": "Optimizing route",
    "building_itinerary": "Building itinerary options",
    "estimating_budget": "Estimating budget",
    "validating": "Validating plan",
    "repairing": "Repairing feasibility issues",
    "completed": "Trip plan completed",
    "failed": "Trip planning failed",
}


def publish_progress(trip_id: str, event: str, detail: str | None = None, status: str = "completed") -> ProgressEvent:
    progress = ProgressEvent(
        event=event,
        label=PROGRESS_LABELS.get(event, event.replace("_", " ").title()),
        status=status,
        detail=detail,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    save_progress_event(trip_id, progress)
    return progress


async def sse_event_generator(trip_id: str) -> AsyncIterator[str]:
    emitted = 0
    idle_ticks = 0
    while idle_ticks < 120:
        events = get_progress_events(trip_id)
        while emitted < len(events):
            event = events[emitted]
            emitted += 1
            yield f"event: {event.event}\ndata: {event.model_dump_json()}\n\n"
            if event.event in {"completed", "failed"}:
                return
        idle_ticks += 1
        await asyncio.sleep(0.5)
        yield ": keep-alive\n\n"
