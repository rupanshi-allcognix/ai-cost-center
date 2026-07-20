from posthog import Posthog

from app.config import settings

_ph: Posthog | None = None


def get_posthog() -> Posthog:
    global _ph
    if _ph is None:
        _ph = Posthog(settings.posthog_api_key, host=settings.posthog_host)
    return _ph


def capture_event(distinct_id: str, event: str, properties: dict | None = None):
    ph = get_posthog()
    ph.capture(distinct_id, event, properties)
