# AI Cost Center — Backend

FastAPI backend with a LangGraph agent workflow, anomaly detection, and notification dispatch.

## Quick Start

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) for interactive Swagger UI.

## Docker

```bash
docker-compose up
```

Backend on `:8000`, Chainlit debug deployment on `:8001`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/docs` | Swagger UI |
| POST | `/api/agent/chat` | LangGraph agent conversation |
| POST | `/api/anomaly/detect` | Z-score or moving average anomaly detection |
| GET | `/api/anomaly/simulate` | Generate simulated anomaly data |
| POST | `/api/notifications/slack` | Dispatch Slack webhook notification |

## Agent Workflow

5-node LangGraph state machine (`app/workflow.py`):

1. **classify_intent** — Parse user query intent
2. **query_cost_data** — Retrieve cost data (mock or real)
3. **generate_recommendations** — LLM-powered optimization suggestions
4. **build_response** — Format final response

## Anomaly Detection Methods

- **zscore**: Z-score thresholding (default threshold 2.5)
- **moving_avg**: Moving average deviation (default window 7, factor 2.0)

## Slack Notifications

POST `/api/notifications/slack` with a webhook URL. Supports severity-based emoji blocks (🔴 critical, 🟡 warning, 🔵 info).

## Environment

```
LLM_PROVIDER=anthropic   # or openai
ANTHROPIC_API_KEY=       # Required for Claude
OPENAI_API_KEY=          # Required for GPT
LANGGRAPH_URL=http://langgraph:8080
```

## Project Structure

```
app/
├── main.py              # FastAPI app, router registration
├── workflow.py          # LangGraph state machine
├── api/
│   ├── agent.py         # Chat endpoint
│   ├── anomaly.py       # Anomaly detection endpoints
│   └── notifications.py # Slack webhook endpoint
```
