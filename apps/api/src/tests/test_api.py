import httpx
import pytest
import pytest_asyncio

from src.main import app


@pytest_asyncio.fixture
async def client():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as async_client:
        yield async_client


@pytest.mark.asyncio
async def test_health_endpoint(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_plan_trip_endpoint(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/api/trips/plan",
        json={
            "query": "Plan a 3-day trip from Toronto to Delhi. I prefer vegetarian food, cultural places, photography spots, and a balanced pace.",
            "origin": "Toronto",
            "destination": "Delhi",
            "duration_days": 3,
            "traveler_count": 1,
            "budget": None,
            "currency": "CAD",
            "preferences": ["cultural places", "photography spots"],
            "dietary_preferences": ["vegetarian"],
            "travel_style": "balanced",
            "current_location": None,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "completed"
    assert len(body["result"]["options"]) == 3
    assert body["result"]["map_data"]["markers"]


@pytest.mark.asyncio
async def test_refine_endpoint(client: httpx.AsyncClient) -> None:
    plan = (
        await client.post(
            "/api/trips/plan",
            json={
                "query": "Plan a 3-day trip from Toronto to Delhi with vegetarian food.",
                "origin": "Toronto",
                "destination": "Delhi",
                "duration_days": 3,
                "traveler_count": 1,
                "currency": "CAD",
                "preferences": [],
                "dietary_preferences": ["vegetarian"],
                "travel_style": "balanced",
            },
        )
    ).json()
    response = await client.post(
        f"/api/trips/{plan['trip_id']}/refine",
        json={"instruction": "Make it more relaxed and add shopping."},
    )
    assert response.status_code == 200
    refined = response.json()
    assert refined["trip_id"] == plan["trip_id"]
    assert refined["result"]["options"][1]["pace"] == "relaxed"
