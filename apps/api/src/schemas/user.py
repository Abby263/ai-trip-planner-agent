from pydantic import BaseModel, EmailStr


class UserPreferenceResponse(BaseModel):
    home_city: str | None = None
    home_airport: str | None = None
    preferred_currency: str = "CAD"
    dietary_preferences: list[str] = []
    hotel_preferences: list[str] = []
    travel_style: str | None = None
    favorite_activities: list[str] = []


class UserPreferencePatch(UserPreferenceResponse):
    email: EmailStr | None = None
