# Restructure ai-cost-center-backend to Reference Architecture

## Overview
Transform the flat `ai-cost-center-backend/` into the layered reference structure with `backend/`, `vault/`, `stagging/`, `docs/` at root level.

## Renaming Convention
- `assistant_full_stack` → `ai_cost_center_full_stack`
- `assistant_core_stack` → `ai_cost_center_core_stack`
- `assistant_analytics_stack` → `ai_cost_center_analytics_stack`

## Route Changes
- `POST /api/agent/chat` → `POST /api/chat`

---

## File-by-File Migration

### 1. Core New Files (write)

| File | Purpose |
|------|---------|
| `backend/app/config.py` | Pydantic `BaseSettings` — loads all env vars |
| `backend/app/__init__.py` | Package init |
| `backend/app/ai_cost_center_full_stack/startup/lifecycle.py` | `lifespan` context manager (connect/disconnect DBs, queues, vault) |
| `backend/app/ai_cost_center_full_stack/handler/exceptions.py` | Global exception handler + `register_exception_handlers(app)` |
| `backend/app/ai_cost_center_full_stack/handler/__init__.py` | Package init |
| `backend/app/ai_cost_center_full_stack/__init__.py` | Package init |

### 2. Migrated Files (move + update imports)

| Old Path | New Path | Import Changes |
|----------|----------|----------------|
| `app/data.py` | `backend/app/ai_cost_center_core_stack/chat/data.py` | No internal change; imported by tools.py |
| `app/tools.py` | `backend/app/ai_cost_center_core_stack/deepagents/tools.py` | `from ..chat.data` → `from app.ai_cost_center_core_stack.chat.data` |
| `app/workflow.py` | `backend/app/ai_cost_center_core_stack/deepagents/workflow.py` | `from .tools` → `from app.ai_cost_center_core_stack.deepagents.tools` |
| `app/api/agent.py` | `backend/app/ai_cost_center_full_stack/api/routes/chat.py` | Router prefix becomes `/api/chat`; imports → `from app.ai_cost_center_core_stack.deepagents.workflow` |
| `app/api/anomaly.py` | `backend/app/ai_cost_center_full_stack/api/routes/anomaly.py` | No internal import changes |
| `app/api/notifications.py` | `backend/app/ai_cost_center_full_stack/api/routes/notifications.py` | No internal import changes |

### 3. Rewritten `main.py` (`backend/app/main.py`)

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.ai_cost_center_full_stack.startup.lifecycle import lifespan
from app.ai_cost_center_full_stack.handler.exceptions import register_exception_handlers
from app.ai_cost_center_full_stack.api.routes import chat, anomaly, notifications

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

register_exception_handlers(app)

app.include_router(chat.router, prefix="/api/chat")
app.include_router(anomaly.router, prefix="/api/anomaly")
app.include_router(notifications.router, prefix="/api/notifications")

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### 4. Scaffold Files (write — each with relevant imports and placeholder)

| File | Content |
|------|---------|
| `database/mongodb.py` | `from motor.motor_asyncio import AsyncIOMotorClient` — `get_db()` singleton |
| `database/redis.py` | `from redis.asyncio import Redis` — connection pool |
| `external/keycloak.py` | `from keycloak import KeycloakOpenID` — client wrapper |
| `storage/r2.py` | `import boto3` — S3-compatible `client.put_object` / `generate_presigned_url` |
| `messaging/rabbitmq.py` | `import aio_pika` — connection manager |
| `task_queue/worker.py` | `from taskiq import TaskiqRabbitMQBroker, TaskiqScheduler` |
| `logging/logger.py` | `import structlog` — JSON formatter config |
| `vault/client.py` | `import hvac` — `Client` wrapper with `read_secret` |
| `payment/stripe.py` | `import stripe` — `stripe.api_key` config |
| `payment/razorpay.py` | `import razorpay` — `Client` wrapper |
| `posthog_analytics/client.py` | `from posthog import Posthog` — singleton |
| `chat/sessions.py` | Dict-based session store stub |
| `chat/streaming.py` | SSE helper utilities |
| `chat/memory.py` | LangGraph memory wrapper |
| `deepagents/__init__.py` | Re-export tools & workflow |
| `auth/service.py` | JWT decode / Keycloak token validation |
| `upload/service.py` | Pre-signed URL + extraction stub |
| `media/service.py` | Image gen stub |
| `voice/service.py` | STT stub |
| `toolkit/composio.py` | Composio client wrapper |
| `mcp/server.py` | MCP server stub |
| `skills/registry.py` | Skills registry dict |
| `scheduled_tasks/scheduler.py` | TaskIQ scheduler config |
| `billing/service.py` | Billing calculation stub |
| `library/service.py` | Prompt/asset library |
| `template/engine.py` | Jinja2 or prompt template |

### 5. Infrastructure Files

| File | Content |
|------|---------|
| `backend/docker/Dockerfile` | Updated from old `Dockerfile` — `WORKDIR /backend`, COPY `backend/` |
| `backend/scripts/start.sh` | `#!/bin/bash` — `case $1 in backend\|taskiq\|scheduler)` |
| `backend/requirements.txt` | Add: `pydantic-settings`, `motor`, `redis`, `aio-pika`, `taskiq`, `taskiq-aio-pika`, `hvac`, `boto3`, `stripe`, `razorpay`, `posthog`, `structlog`, `litellm`, `keycloak` |
| `backend/tests/test_smoke.py` | Update imports from old paths |
| `backend/tests/test_health.py` | New — test `/health` + `/docs` |
| `vault/consul_prod.py` | `import hvac` — seed Vault with production secrets |
| `vault/consul_stagging.py` | Seed Vault with staging secrets |
| `stagging/docker-compose.yml` | Compose with backend + nginx + vault-agent |
| `stagging/.env.example` | Staging env vars |
| `stagging/nginx.conf` | Nginx config for staging |
| `docs/architecture.md` | Architecture overview |
| `docs/setup.md` | Setup instructions |

### 6. Root-Level Updates in ai-cost-center-backend/

| File | Action |
|------|--------|
| `docker-compose.yml` | Update to point `build.context` → `./backend` and `dockerfile` → `docker/Dockerfile` |
| `.env.example` | Expand with all new env vars |
| `.gitignore` | Keep existing (already ignores `.env`) |
| `pyproject.toml` | Keep as-is (ruff + pytest config) |

---

## Execution Order

1. Write core new files (config.py, lifecycle.py, exceptions.py, all __init__.py)
2. Migrate existing code (move data.py, tools.py, workflow.py, 3 route files + update imports)
3. Write scaffold files (all 20+ module stubs)
4. Write infrastructure files (Dockerfile, start.sh, requirements.txt, tests)
5. Write vault/staging/docs files
6. Update root-level files
7. Clean up old `app/` and `app/api/` directories
8. Verify: `cd backend && pip install -r requirements.txt && python -c "from app.main import app; print('OK')"`
