from src.graph.state import TripPlanningState, touch_state
from src.schemas.budget import BudgetItem, BudgetSummary


class BudgetEstimatorAgent:
    async def __call__(self, state: TripPlanningState) -> TripPlanningState:
        budget = state.get("budget")
        duration = state.get("duration_days") or 3
        currency = state.get("currency", "CAD")
        updated_options = []

        for option in state.get("itinerary_options", []):
            pace = option.get("pace", "balanced")
            flight_total = option["flight"]["price"] if option.get("flight") else 0
            hotel_total = option["hotel"]["total_price"] if option.get("hotel") else 0
            food_per_day = {"relaxed": 50, "balanced": 65, "packed": 80}.get(pace, 65)
            transport_per_day = {"relaxed": 24, "balanced": 34, "packed": 48}.get(pace, 34)
            activity_total = sum(
                activity.get("estimated_cost", 0)
                for day in option.get("days", [])
                for activity in day.get("activities", [])
            )
            event_total = sum((event.get("price_min") or 0) for event in option.get("events", []))
            items = [
                BudgetItem(
                    category="Flights",
                    amount=round(flight_total, 2),
                    currency=currency,
                    confidence=option["flight"]["price_confidence"] if option.get("flight") else "estimated",
                    notes="Provider fare estimate. Recheck before booking.",
                ),
                BudgetItem(
                    category="Hotel",
                    amount=round(hotel_total, 2),
                    currency=currency,
                    confidence=option["hotel"]["price_confidence"] if option.get("hotel") else "estimated",
                    notes=f"Based on {duration} night estimate.",
                ),
                BudgetItem(
                    category="Food",
                    amount=round(food_per_day * duration, 2),
                    currency=currency,
                    confidence="estimated",
                    notes="Vegetarian-friendly mid-range meal estimate.",
                ),
                BudgetItem(
                    category="Activities",
                    amount=round(activity_total, 2),
                    currency=currency,
                    confidence="estimated",
                    notes="Attraction and experience estimates where live price is unavailable.",
                ),
                BudgetItem(
                    category="Events",
                    amount=round(event_total, 2),
                    currency=currency,
                    confidence="estimated",
                    notes="Lowest listed mock ticket estimate.",
                ),
                BudgetItem(
                    category="Local transport",
                    amount=round(transport_per_day * duration, 2),
                    currency=currency,
                    confidence="estimated",
                    notes="Taxi/transit mix based on route density.",
                ),
            ]
            subtotal = round(sum(item.amount for item in items), 2)
            buffer = round(subtotal * 0.1, 2)
            total = round(subtotal + buffer, 2)
            summary = BudgetSummary(
                currency=currency,
                items=items,
                subtotal=subtotal,
                buffer=buffer,
                total_estimate=total,
                budget_status=_budget_status(total, budget),
            )
            option["budget_summary"] = summary.model_dump(mode="json")
            option["estimated_total"] = total
            updated_options.append(option)

        state["itinerary_options"] = updated_options
        if updated_options:
            state["budget_summary"] = updated_options[0].get("budget_summary")
        return touch_state(state)


def _budget_status(total: float, budget: float | None) -> str:
    if not budget:
        return "unknown"
    if total <= budget * 0.9:
        return "under_budget"
    if total <= budget * 1.05:
        return "near_budget"
    return "over_budget"
