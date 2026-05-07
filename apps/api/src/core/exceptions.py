class TripPlannerError(Exception):
    """Base domain exception."""


class ProviderNotConfiguredError(TripPlannerError):
    """Raised when a real provider is requested without required credentials."""


class TripNotFoundError(TripPlannerError):
    """Raised when a trip session is not available in the local store."""
