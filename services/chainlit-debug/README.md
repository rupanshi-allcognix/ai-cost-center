# Chainlit Debug Service

This service runs Chainlit for internal dev/debugging of the LangGraph agent.

Build and run with Docker Compose (top-level):

```bash
docker-compose up --build ai-cost-center-deployment
```

The service exposes port 8001 and connects to LangGraph via the `LANGGRAPH_URL` environment variable.
