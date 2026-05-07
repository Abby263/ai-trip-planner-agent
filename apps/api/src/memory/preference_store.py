from src.schemas.user import UserPreferencePatch, UserPreferenceResponse


PREFERENCES: dict[str, UserPreferenceResponse] = {}


def get_preferences(user_id: str = "demo") -> UserPreferenceResponse:
    return PREFERENCES.get(user_id, UserPreferenceResponse())


def update_preferences(payload: UserPreferencePatch, user_id: str = "demo") -> UserPreferenceResponse:
    current = get_preferences(user_id).model_dump()
    current.update(payload.model_dump(exclude_none=True))
    updated = UserPreferenceResponse(**current)
    PREFERENCES[user_id] = updated
    return updated
