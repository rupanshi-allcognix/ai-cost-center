from app.ai_cost_center_full_stack.external.keycloak import get_keycloak


def verify_token(token: str) -> dict | None:
    keycloak = get_keycloak()
    try:
        return keycloak.decode_token(token)
    except Exception:
        return None


def get_user_info(token: str) -> dict | None:
    keycloak = get_keycloak()
    try:
        return keycloak.get_userinfo(token)
    except Exception:
        return None
