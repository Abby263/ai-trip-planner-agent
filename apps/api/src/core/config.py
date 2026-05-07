from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,
        enable_decoding=False,
    )

    app_name: str = "AI Trip Planner Agent API"
    environment: str = "development"
    openai_api_key: str | None = None
    openai_model_strong: str = "gpt-4o"
    openai_model_fast: str = "gpt-4o-mini"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/tripplanner"
    redis_url: str = "redis://localhost:6379"
    mock_mode: bool = True

    langsmith_api_key: str | None = None
    langsmith_project: str = "ai-trip-planner-agent"
    langsmith_tracing: bool = False

    google_maps_api_key: str | None = None
    amadeus_client_id: str | None = None
    amadeus_client_secret: str | None = None
    duffel_api_key: str | None = None
    ticketmaster_api_key: str | None = None
    openweather_api_key: str | None = None
    exchange_rate_api_key: str | None = None

    cors_origins: str = "http://localhost:3000"
    api_rate_limit_per_minute: int = 60

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
