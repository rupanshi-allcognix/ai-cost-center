# Architecture

## Layers

- **ai_cost_center_full_stack** — Platform / infrastructure layer
  - API routes, database repos (MongoDB, Redis), external clients (Keycloak), storage (R2), messaging (RabbitMQ), task queue (TaskIQ), logging (structlog), vault (HashiCorp Vault), startup lifecycle, exception handlers

- **ai_cost_center_core_stack** — Business logic
  - Auth, chat (sessions, streaming, memory), deep agents (LangGraph), upload, media, voice, toolkit (Composio), MCP servers, skills, scheduled tasks, billing, payment (Stripe, Razorpay), library, template engine

- **ai_cost_center_analytics_stack** — Analytics
  - PostHog product analytics

## Data Flow

Client → Nginx → FastAPI → [Middleware → Router → Service → Database/External]
       ↕ SSE streaming for chat
       ↕ Webhook callbacks for payments
