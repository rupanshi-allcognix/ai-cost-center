# Chainlit Debug Service

Debugging service for the AI Cost Center LangGraph agent.

## Build & Run

```bash
docker build -t ai-cost-center-deployment .
docker run -p 8001:8001 -e LANGGRAPH_URL=http://host.docker.internal:8080 ai-cost-center-deployment
```

Or via Docker Compose from `ai-cost-center-backend/`:
```bash
cd ../ai-cost-center-backend
docker-compose up ai-cost-center-deployment
```

Exposes port 8001. Connects to LangGraph via `LANGGRAPH_URL`.
