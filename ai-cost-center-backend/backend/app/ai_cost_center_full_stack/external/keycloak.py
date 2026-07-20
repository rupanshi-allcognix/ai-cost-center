from keycloak import KeycloakOpenID

from app.config import settings

_keycloak: KeycloakOpenID | None = None


def get_keycloak() -> KeycloakOpenID:
    global _keycloak
    if _keycloak is None:
        _keycloak = KeycloakOpenID(
            server_url=settings.keycloak_url,
            client_id=settings.keycloak_client_id,
            realm_name=settings.keycloak_realm,
            client_secret_key=settings.keycloak_client_secret,
        )
    return _keycloak
