import razorpay

from app.config import settings

_client: razorpay.Client | None = None


def get_client() -> razorpay.Client:
    global _client
    if _client is None:
        _client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
    return _client


def create_order(amount: int, currency: str = "INR") -> dict:
    client = get_client()
    return client.order.create({"amount": amount, "currency": currency})
