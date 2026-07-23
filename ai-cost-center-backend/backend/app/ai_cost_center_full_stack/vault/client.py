import hvac

from app.config import settings

_client: hvac.Client | None = None


def get_vault_client() -> hvac.Client:
    global _client
    if _client is None:
        _client = hvac.Client(url=settings.vault_addr, token=settings.vault_token)
    return _client


def read_secret(path: str | None = None) -> dict:
    client = get_vault_client()
    secret_path = path or settings.vault_path
    response = client.secrets.kv.v2.read_secret_version(path=secret_path)
    return response.get("data", {}).get("data", {})
