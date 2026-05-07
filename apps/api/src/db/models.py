from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:12]}"


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(default_factory=lambda: new_id("user"), primary_key=True)
    email: str = Field(index=True, unique=True)
    name: str | None = None
    created_at: datetime = Field(default_factory=now_utc)


class UserPreference(SQLModel, table=True):
    __tablename__ = "user_preferences"

    id: str = Field(default_factory=lambda: new_id("pref"), primary_key=True)
    user_id: str = Field(index=True, foreign_key="users.id")
    home_city: str | None = None
    home_airport: str | None = None
    preferred_currency: str = "CAD"
    dietary_preferences: list[str] = Field(default_factory=list, sa_column=Column(JSONB))
    hotel_preferences: list[str] = Field(default_factory=list, sa_column=Column(JSONB))
    travel_style: str | None = None
    favorite_activities: list[str] = Field(default_factory=list, sa_column=Column(JSONB))
    embedding: list[float] | None = Field(default=None, sa_column=Column(JSONB))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class TripSession(SQLModel, table=True):
    __tablename__ = "trip_sessions"

    id: str = Field(default_factory=lambda: new_id("trip"), primary_key=True)
    user_id: str | None = Field(default=None, index=True)
    raw_query: str
    status: str = Field(default="queued", index=True)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class TripPlan(SQLModel, table=True):
    __tablename__ = "trip_plans"

    id: str = Field(default_factory=lambda: new_id("plan"), primary_key=True)
    session_id: str = Field(index=True, foreign_key="trip_sessions.id")
    title: str
    origin: str | None = None
    destination: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    duration_days: int | None = None
    traveler_count: int = 1
    budget: float | None = None
    currency: str = "CAD"
    assumptions: list[str] = Field(default_factory=list, sa_column=Column(JSONB))
    warnings: list[str] = Field(default_factory=list, sa_column=Column(JSONB))
    created_at: datetime = Field(default_factory=now_utc)


class ItineraryOptionRecord(SQLModel, table=True):
    __tablename__ = "itinerary_options"

    id: str = Field(default_factory=lambda: new_id("option"), primary_key=True)
    trip_plan_id: str = Field(index=True, foreign_key="trip_plans.id")
    name: str
    best_for: str
    pace: str
    estimated_total: float
    currency: str
    confidence: str
    selected: bool = False
    created_at: datetime = Field(default_factory=now_utc)


class ItineraryDayRecord(SQLModel, table=True):
    __tablename__ = "itinerary_days"

    id: str = Field(default_factory=lambda: new_id("day"), primary_key=True)
    itinerary_option_id: str = Field(index=True, foreign_key="itinerary_options.id")
    day_number: int
    date: str | None = None
    title: str
    theme: str


class ItineraryActivityRecord(SQLModel, table=True):
    __tablename__ = "itinerary_activities"

    id: str = Field(default_factory=lambda: new_id("act"), primary_key=True)
    itinerary_day_id: str = Field(index=True, foreign_key="itinerary_days.id")
    start_time: str
    end_time: str
    title: str
    category: str
    description: str
    address: str
    lat: float
    lng: float
    estimated_cost: float
    currency: str
    booking_required: bool = False
    booking_url: str | None = None
    source_provider: str
    confidence: str


class ProviderCache(SQLModel, table=True):
    __tablename__ = "provider_cache"

    id: str = Field(default_factory=lambda: new_id("cache"), primary_key=True)
    cache_key: str = Field(index=True)
    provider: str = Field(index=True)
    request_hash: str = Field(index=True)
    response_json: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    expires_at: datetime
    created_at: datetime = Field(default_factory=now_utc)
