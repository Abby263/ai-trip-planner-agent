import asyncio
from datetime import datetime, timezone
from typing import Any

try:
    from langgraph.graph import END, START, StateGraph
except Exception:  # pragma: no cover - fallback keeps local tests usable without dependency install.
    END = "__end__"
    START = "__start__"
    StateGraph = None

from src.agents.budget_estimator import BudgetEstimatorAgent
from src.agents.critic import CriticAgent
from src.agents.final_response import FinalResponseAgent
from src.agents.intent_parser import IntentParserAgent
from src.agents.itinerary_builder import ItineraryBuilderAgent
from src.agents.repair import RepairAgent
from src.agents.research_planner import ResearchPlannerAgent
from src.agents.validator import ValidationAgent
from src.graph.checkpoints import save_checkpoint
from src.graph.state import TripPlanningState, touch_state
from src.schemas.event import EventSearchRequest
from src.schemas.flight import FlightSearchRequest
from src.schemas.hotel import HotelSearchRequest
from src.schemas.place import PlaceSearchRequest
from src.schemas.route import RoutePoint, RouteRequest
from src.services.provider_registry import ProviderRegistry, get_provider_registry
from src.services.provider_result_normalizer import normalize_provider_results


class TripPlanningGraph:
    def __init__(self, providers: ProviderRegistry | None = None) -> None:
        self.providers = providers or get_provider_registry()
        self.intent_parser = IntentParserAgent()
        self.research_planner = ResearchPlannerAgent()
        self.itinerary_builder = ItineraryBuilderAgent()
        self.budget_estimator = BudgetEstimatorAgent()
        self.validator = ValidationAgent()
        self.critic = CriticAgent()
        self.repair = RepairAgent()
        self.final_response = FinalResponseAgent()
        self._compiled = self._build_graph() if StateGraph else None

    async def run(self, state: TripPlanningState) -> TripPlanningState:
        if self._compiled is not None:
            result = await self._compiled.ainvoke(state)
            save_checkpoint(result)
            return result
        result = await self._run_fallback(state)
        save_checkpoint(result)
        return result

    def _build_graph(self) -> Any:
        graph = StateGraph(TripPlanningState)
        graph.add_node("IntentParserNode", self._node("IntentParserNode", self.intent_parser))
        graph.add_node("MissingInfoNode", self._node("MissingInfoNode", self._missing_info_node))
        graph.add_node("AskFollowUp", self._node("AskFollowUp", self._ask_follow_up_node))
        graph.add_node("ResearchPlannerNode", self._node("ResearchPlannerNode", self.research_planner))
        graph.add_node("FlightSearchNode", self._node("FlightSearchNode", self._flight_search_node))
        graph.add_node("HotelSearchNode", self._node("HotelSearchNode", self._hotel_search_node))
        graph.add_node("PlacesSearchNode", self._node("PlacesSearchNode", self._places_search_node))
        graph.add_node("RestaurantSearchNode", self._node("RestaurantSearchNode", self._restaurant_search_node))
        graph.add_node("EventsSearchNode", self._node("EventsSearchNode", self._events_search_node))
        graph.add_node("WeatherSearchNode", self._node("WeatherSearchNode", self._weather_search_node))
        graph.add_node("WebResearchNode", self._node("WebResearchNode", self._web_research_node))
        graph.add_node("ResultNormalizerNode", self._node("ResultNormalizerNode", self._normalizer_node))
        graph.add_node("RoutingNode", self._node("RoutingNode", self._routing_node))
        graph.add_node("ItineraryBuilderNode", self._node("ItineraryBuilderNode", self.itinerary_builder))
        graph.add_node("BudgetEstimatorNode", self._node("BudgetEstimatorNode", self.budget_estimator))
        graph.add_node("ValidationNode", self._node("ValidationNode", self.validator))
        graph.add_node("CriticNode", self._node("CriticNode", self.critic))
        graph.add_node("RepairNode", self._node("RepairNode", self.repair))
        graph.add_node("FinalResponseNode", self._node("FinalResponseNode", self.final_response))

        graph.add_edge(START, "IntentParserNode")
        graph.add_edge("IntentParserNode", "MissingInfoNode")
        graph.add_conditional_edges(
            "MissingInfoNode",
            self._route_missing_info,
            {"ask": "AskFollowUp", "continue": "ResearchPlannerNode"},
        )
        graph.add_edge("AskFollowUp", END)
        graph.add_edge("ResearchPlannerNode", "FlightSearchNode")
        graph.add_edge("FlightSearchNode", "HotelSearchNode")
        graph.add_edge("HotelSearchNode", "PlacesSearchNode")
        graph.add_edge("PlacesSearchNode", "RestaurantSearchNode")
        graph.add_edge("RestaurantSearchNode", "EventsSearchNode")
        graph.add_edge("EventsSearchNode", "WeatherSearchNode")
        graph.add_edge("WeatherSearchNode", "WebResearchNode")
        graph.add_edge("WebResearchNode", "ResultNormalizerNode")
        graph.add_edge("ResultNormalizerNode", "RoutingNode")
        graph.add_edge("RoutingNode", "ItineraryBuilderNode")
        graph.add_edge("ItineraryBuilderNode", "BudgetEstimatorNode")
        graph.add_edge("BudgetEstimatorNode", "ValidationNode")
        graph.add_edge("ValidationNode", "CriticNode")
        graph.add_conditional_edges(
            "CriticNode",
            self._route_validation,
            {"repair": "RepairNode", "final": "FinalResponseNode"},
        )
        graph.add_edge("RepairNode", "RoutingNode")
        graph.add_edge("FinalResponseNode", END)
        return graph.compile()

    def _node(self, name: str, func: Any):
        async def wrapped(state: TripPlanningState) -> TripPlanningState:
            self._trace(state, name, "running")
            result = await func(state)
            self._trace(result, name, "completed")
            save_checkpoint(result)
            return result

        return wrapped

    async def _run_fallback(self, state: TripPlanningState) -> TripPlanningState:
        for func in [
            self.intent_parser,
            self._missing_info_node,
        ]:
            state = await func(state)
        if state.get("missing_fields"):
            return await self._ask_follow_up_node(state)
        for func in [
            self.research_planner,
            self._flight_search_node,
            self._hotel_search_node,
            self._places_search_node,
            self._restaurant_search_node,
            self._events_search_node,
            self._weather_search_node,
            self._web_research_node,
            self._normalizer_node,
            self._routing_node,
            self.itinerary_builder,
            self.budget_estimator,
            self.validator,
            self.critic,
        ]:
            state = await func(state)
        while self._route_validation(state) == "repair":
            state = await self.repair(state)
            state = await self._routing_node(state)
            state = await self.itinerary_builder(state)
            state = await self.budget_estimator(state)
            state = await self.validator(state)
            state = await self.critic(state)
        return await self.final_response(state)

    async def _missing_info_node(self, state: TripPlanningState) -> TripPlanningState:
        questions = []
        for field in state.get("missing_fields", []):
            if field == "origin":
                questions.append("Where are you traveling from?")
            elif field == "destination":
                questions.append("Where would you like to go?")
            elif field == "duration_days":
                questions.append("How many days should I plan for?")
            elif field == "location":
                questions.append("What city or current location should I use?")
        state["follow_up_questions"] = questions
        return touch_state(state)

    async def _ask_follow_up_node(self, state: TripPlanningState) -> TripPlanningState:
        state["final_response"] = {
            "trip_id": state["session_id"],
            "status": "needs_input",
            "follow_up_questions": state.get("follow_up_questions", []),
            "summary": {
                "title": "More trip details needed",
                "origin": state.get("origin"),
                "destination": state.get("destination"),
                "duration_days": state.get("duration_days"),
                "traveler_count": state.get("traveler_count", 1),
                "currency": state.get("currency", "CAD"),
                "assumptions": state.get("assumptions", []),
            },
        }
        return touch_state(state)

    async def _flight_search_node(self, state: TripPlanningState) -> TripPlanningState:
        if "flights" not in (state.get("research_plan") or {}).get("required_tools", []):
            state["flight_results"] = []
            return touch_state(state)
        request = FlightSearchRequest(
            origin=state.get("origin") or "Toronto",
            destination=state.get("destination") or "Delhi",
            start_date=state.get("start_date"),
            end_date=state.get("end_date"),
            traveler_count=state.get("traveler_count", 1),
            currency=state.get("currency", "CAD"),
            preferences=state.get("flight_preferences", {}),
        )
        flights = await self.providers.flights.search_flights(request)
        state["flight_results"] = [flight.model_dump(mode="json") for flight in flights]
        return touch_state(state)

    async def _hotel_search_node(self, state: TripPlanningState) -> TripPlanningState:
        if "hotels" not in (state.get("research_plan") or {}).get("required_tools", []):
            state["hotel_results"] = []
            return touch_state(state)
        nights = max(state.get("duration_days") or 3, 1)
        request = HotelSearchRequest(
            destination=state.get("destination") or "Delhi",
            start_date=state.get("start_date"),
            end_date=state.get("end_date"),
            nights=nights,
            traveler_count=state.get("traveler_count", 1),
            currency=state.get("currency", "CAD"),
            preferences=state.get("hotel_preferences", {}),
        )
        hotels = await self.providers.hotels.search_hotels(request)
        state["hotel_results"] = [hotel.model_dump(mode="json") for hotel in hotels]
        return touch_state(state)

    async def _places_search_node(self, state: TripPlanningState) -> TripPlanningState:
        request = PlaceSearchRequest(
            destination=state.get("destination"),
            location=state.get("current_location"),
            categories=["landmark", "museum", "shopping", "nature", "religious"],
            preferences=state.get("preferences", []),
            dietary_preferences=state.get("dietary_preferences", []),
            limit=12,
        )
        places = await self.providers.places.search_places(request)
        state["places_results"] = [place.model_dump(mode="json") for place in places]
        return touch_state(state)

    async def _restaurant_search_node(self, state: TripPlanningState) -> TripPlanningState:
        if "restaurants" not in (state.get("research_plan") or {}).get("required_tools", []):
            state["restaurant_results"] = []
            return touch_state(state)
        request = PlaceSearchRequest(
            destination=state.get("destination"),
            location=state.get("current_location"),
            categories=["restaurant", "cafe"],
            preferences=state.get("preferences", []),
            dietary_preferences=state.get("dietary_preferences", []),
            limit=8,
        )
        restaurants = await self.providers.places.search_restaurants(request)
        state["restaurant_results"] = [restaurant.model_dump(mode="json") for restaurant in restaurants]
        return touch_state(state)

    async def _events_search_node(self, state: TripPlanningState) -> TripPlanningState:
        if "events" not in (state.get("research_plan") or {}).get("required_tools", []):
            state["events_results"] = []
            return touch_state(state)
        request = EventSearchRequest(
            location=state.get("current_location"),
            destination=state.get("destination"),
            start_date=state.get("start_date"),
            end_date=state.get("end_date"),
            categories=state.get("preferences", []),
            preferences=state.get("preferences", []),
            currency=state.get("currency", "CAD"),
            limit=6,
        )
        events = await self.providers.events.search_events(request)
        state["events_results"] = [event.model_dump(mode="json") for event in events]
        return touch_state(state)

    async def _weather_search_node(self, state: TripPlanningState) -> TripPlanningState:
        if "weather" not in (state.get("research_plan") or {}).get("required_tools", []):
            state["weather_results"] = []
            return touch_state(state)
        weather = await self.providers.weather.get_weather(
            {"destination": state.get("destination"), "current_location": state.get("current_location")},
            {"start_date": state.get("start_date"), "end_date": state.get("end_date")},
        )
        state["weather_results"] = [weather]
        return touch_state(state)

    async def _web_research_node(self, state: TripPlanningState) -> TripPlanningState:
        state["web_research_results"] = [
            {
                "provider": "MockWebResearchProvider",
                "fetched_at": datetime.now(timezone.utc).isoformat(),
                "confidence": "estimated",
                "source_url": "https://example.com/travel-advisory",
                "summary": "Verify passport, visa, and local travel requirements before booking.",
            }
        ]
        return touch_state(state)

    async def _normalizer_node(self, state: TripPlanningState) -> TripPlanningState:
        state["normalized_results"] = normalize_provider_results(state)
        return touch_state(state)

    async def _routing_node(self, state: TripPlanningState) -> TripPlanningState:
        points = []
        for hotel in state.get("hotel_results", [])[:1]:
            points.append(RoutePoint(id=hotel["id"], title=hotel["name"], lat=hotel["lat"], lng=hotel["lng"], type="hotel", day=None))
        for day, item in enumerate(state.get("places_results", [])[:6], start=1):
            points.append(RoutePoint(id=item["id"], title=item["name"], lat=item["lat"], lng=item["lng"], type=item["category"], day=((day - 1) % 3) + 1))
        if not points:
            state["route_results"] = {"segments": [], "provider": self.providers.routing.name}
            return touch_state(state)
        route = await self.providers.routing.optimize_route(RouteRequest(points=points, mode="mixed"))
        state["route_results"] = route.model_dump(mode="json")
        return touch_state(state)

    def _route_missing_info(self, state: TripPlanningState) -> str:
        return "ask" if state.get("missing_fields") else "continue"

    def _route_validation(self, state: TripPlanningState) -> str:
        report = state.get("validation_report") or {}
        has_high = any(issue.get("severity") == "high" for issue in report.get("issues", []))
        if has_high and state.get("repair_attempts", 0) < 2:
            return "repair"
        return "final"

    def _trace(self, state: TripPlanningState, step_name: str, status: str) -> None:
        state.setdefault("execution_trace", []).append(
            {
                "step_name": step_name,
                "status": status,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )


async def run_graph(state: TripPlanningState) -> TripPlanningState:
    graph = TripPlanningGraph()
    return await graph.run(state)


async def run_graph_parallel(states: list[TripPlanningState]) -> list[TripPlanningState]:
    return await asyncio.gather(*(run_graph(state) for state in states))
