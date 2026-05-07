from src.graph.state import TripPlanningState, touch_state


class ValidationAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        report = validate_itinerary_options(
            state.get("itinerary_options", []),
            state.get("dietary_preferences", []),
            state.get("budget"),
        )
        state["validation_report"] = report
        return touch_state(state)


def validate_itinerary_options(
    options: list[dict],
    dietary_preferences: list[str] | None = None,
    budget: float | None = None,
) -> dict:
    issues = []
    dietary_preferences = dietary_preferences or []
    for option in options:
        if not option.get("flight") and option.get("name") != "Local Discovery":
            issues.append(_issue("high", "A full-trip option is missing a flight source.", option.get("id"), "Attach a flight provider result."))
        if not option.get("hotel") and option.get("name") != "Local Discovery":
            issues.append(_issue("medium", "A full-trip option is missing a hotel source.", option.get("id"), "Attach a hotel provider result."))
        if not option.get("booking_links"):
            issues.append(_issue("medium", "Booking-ready links are missing.", option.get("id"), "Add external provider booking links."))
        if budget and option.get("estimated_total", 0) > budget * 1.25:
            issues.append(_issue("medium", "The plan is materially over budget.", option.get("id"), "Choose lower-priced flight, hotel, or activities."))
        for day in option.get("days", []):
            activity_count = len(day.get("activities", []))
            if option.get("pace") == "relaxed" and activity_count > 4:
                issues.append(_issue("high", "A relaxed day has too many scheduled activities.", str(day.get("day_number")), "Remove or move lower-priority activities."))
            if option.get("pace") != "packed" and activity_count > 6:
                issues.append(_issue("high", "The day is overloaded for the selected pace.", str(day.get("day_number")), "Reduce activity count or split across days."))
            for activity in day.get("activities", []):
                if not activity.get("source_provider"):
                    issues.append(_issue("high", "Activity is missing provider/source metadata.", activity.get("id"), "Attach source provider."))
        if any(pref in {"vegetarian", "vegan", "jain"} for pref in dietary_preferences):
            activity_titles = " ".join(
                activity.get("title", "").lower()
                for day in option.get("days", [])
                for activity in day.get("activities", [])
            )
            if not any(token in activity_titles for token in ["saravana", "sattvik", "cafe lota", "bikanervala"]):
                issues.append(_issue("medium", "Dietary preferences are not clearly reflected in restaurant picks.", option.get("id"), "Add vegetarian-aligned restaurants."))

    high_count = sum(issue["severity"] == "high" for issue in issues)
    medium_count = sum(issue["severity"] == "medium" for issue in issues)
    score = max(0, 100 - high_count * 30 - medium_count * 12 - len(issues) * 2)
    return {"passed": high_count == 0, "score": score, "issues": issues}


def _issue(severity: str, message: str, affected_item_id: str | None, suggested_fix: str) -> dict:
    return {
        "severity": severity,
        "message": message,
        "affected_item_id": affected_item_id,
        "suggested_fix": suggested_fix,
    }
