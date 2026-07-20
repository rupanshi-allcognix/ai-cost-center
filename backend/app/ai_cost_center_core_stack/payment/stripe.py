import stripe as stripe_sdk

from app.config import settings

stripe_sdk.api_key = settings.stripe_secret_key


def create_checkout_session(price_id: str, customer_id: str | None = None) -> str:
    session = stripe_sdk.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        customer=customer_id,
        success_url="https://example.com/success",
        cancel_url="https://example.com/cancel",
    )
    return session.url
