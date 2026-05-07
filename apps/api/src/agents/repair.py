from src.graph.state import TripPlanningState, touch_state


class RepairAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        repaired = []
        for option in state.get("itinerary_options", []):
            max_count = 4 if option.get("pace") == "relaxed" else 6
            for day in option.get("days", []):
                if len(day.get("activities", [])) > max_count:
                    day["activities"] = day["activities"][:max_count]
                    option.setdefault("warnings", []).append(
                        f"Day {day.get('day_number')} was simplified during validation repair."
                    )
            if not option.get("booking_links"):
                option["booking_links"] = []
                if option.get("flight", {}).get("booking_url"):
                    option["booking_links"].append(
                        {
                            "label": "Book flight on provider site",
                            "url": option["flight"]["booking_url"],
                            "provider": option["flight"]["provider"],
                            "link_type": "flight",
                            "fetched_at": option["flight"]["fetched_at"],
                        }
                    )
            repaired.append(option)
        state["itinerary_options"] = repaired
        state["repair_attempts"] = state.get("repair_attempts", 0) + 1
        state.setdefault("warnings", []).append("The itinerary was repaired after validation detected feasibility issues.")
        return touch_state(state)
