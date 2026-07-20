from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Cost Center"
    debug: bool = False

    vault_enabled: bool = False
    vault_addr: str = "http://127.0.0.1:8200"
    vault_token: str = ""
    vault_path: str = "secret/ai-cost-center"

    llm_provider: str = "openai"
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    langgraph_url: str = "http://langgraph:8080"

    mongodb_uri: str = "mongodb://localhost:27017/ai-cost-center"
    redis_url: str = "redis://localhost:6379/0"
    rabbitmq_url: str = "amqp://guest:guest@localhost:5672/"

    r2_endpoint_url: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket: str = "ai-cost-center"

    keycloak_url: str = "http://localhost:8080"
    keycloak_realm: str = "ai-cost-center"
    keycloak_client_id: str = "backend"
    keycloak_client_secret: str = ""

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""

    posthog_api_key: str = ""
    posthog_host: str = "https://app.posthog.com"

    log_level: str = "INFO"
    cors_origins: str = "http://localhost:3000,http://localhost:8001"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
