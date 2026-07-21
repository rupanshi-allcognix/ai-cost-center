"""Seed production secrets into HashiCorp Vault.

Usage:
    python vault/consul_prod.py

Requires:
    VAULT_ADDR=http://vault:8200
    VAULT_TOKEN=<root-token>
"""

import os

import hvac

VAULT_ADDR = os.getenv("VAULT_ADDR", "http://vault:8200")
VAULT_TOKEN = os.getenv("VAULT_TOKEN", "")
VAULT_PATH = "secret/ai-cost-center"

SECRETS = {
    "openai_api_key": "",
    "anthropic_api_key": "",
    "mongodb_uri": "mongodb://mongodb:27017/ai-cost-center",
    "redis_url": "redis://redis:6379/0",
    "rabbitmq_url": "amqp://guest:guest@rabbitmq:5672/",
    "r2_access_key_id": "",
    "r2_secret_access_key": "",
    "r2_endpoint_url": "",
    "r2_bucket": "ai-cost-center-prod",
    "keycloak_url": "https://auth-infra.allcognix.com/",
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
    print(f"Secrets written to {VAULT_PATH}")


if __name__ == "__main__":
    main()
