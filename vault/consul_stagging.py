"""Seed staging secrets into HashiCorp Vault.

Usage:
    python vault/consul_stagging.py
"""

import os

import hvac

VAULT_ADDR = os.getenv("VAULT_ADDR", "http://vault:8200")
VAULT_TOKEN = os.getenv("VAULT_TOKEN", "")
VAULT_PATH = "secret/ai-cost-center-staging"

SECRETS = {
    "openai_api_key": "",
    "anthropic_api_key": "",
    "mongodb_uri": "mongodb://mongodb:27017/ai-cost-center-staging",
    "redis_url": "redis://redis:6379/1",
    "rabbitmq_url": "amqp://guest:guest@rabbitmq:5672/",
    "r2_access_key_id": "",
    "r2_secret_access_key": "",
    "r2_endpoint_url": "",
    "r2_bucket": "ai-cost-center-staging",
    "keycloak_url": "http://keycloak:8080",
    "keycloak_realm": "ai-cost-center",
    "keycloak_client_id": "backend",
    "keycloak_client_secret": "",
    "stripe_secret_key": "",
    "stripe_webhook_secret": "",
    "razorpay_key_id": "",
    "razorpay_key_secret": "",
    "posthog_api_key": "",
    "posthog_host": "https://app.posthog.com",
}


def main():
    client = hvac.Client(url=VAULT_ADDR, token=VAULT_TOKEN)
    assert client.is_authenticated(), "Vault authentication failed"
    client.secrets.kv.v2.create_or_update_secret(path=VAULT_PATH, secret=SECRETS)
    print(f"Staging secrets written to {VAULT_PATH}")


if __name__ == "__main__":
    main()
