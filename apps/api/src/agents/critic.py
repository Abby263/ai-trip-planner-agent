from src.graph.state import TripPlanningState, touch_state


class CriticAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        report = state.get("validation_report") or {"issues": []}
        state["critique_report"] = {
            "summary": "Validation passed with source-backed provider outputs." if report.get("passed") else "Repair is recommended before final response.",
            "quality_notes": [
                "Prices are not guaranteed and must be checked on provider sites.",
                "Route durations are mock estimates in local mode.",
            ],
            "issue_count": len(report.get("issues", [])),
        }
        return touch_state(state)
