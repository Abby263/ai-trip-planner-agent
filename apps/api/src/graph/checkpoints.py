from src.graph.state import TripPlanningState


CHECKPOINTS: dict[str, TripPlanningState] = {}


def save_checkpoint(state: TripPlanningState) -> None:
    CHECKPOINTS[state["session_id"]] = dict(state)


def load_checkpoint(session_id: str) -> TripPlanningState | None:
    return CHECKPOINTS.get(session_id)
