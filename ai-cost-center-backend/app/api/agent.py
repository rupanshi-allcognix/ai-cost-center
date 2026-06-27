from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse, JSONResponse
import json
import asyncio

router = APIRouter()

async def run_workflow_stream(payload: dict):
    input_text = payload.get("input", "")
    # Build LangGraph events by running the workflow
    from ..workflow import app as workflow_app

    config = {"configurable": {"thread_id": "single"}}
    inputs = {"input": input_text}

    async for event in workflow_app.astream_events(inputs, config, version="v2"):
        kind = event.get("event", "")
        name = event.get("name", "")
        data = event.get("data", {})

        if kind == "on_chain_start":
            yield f"data: {json.dumps({'type': 'node_start', 'node': name, 'content': f'starting {name}', 'metadata': {'tokens': 0, 'cost_usd': 0, 'latency_ms': 0}})}\n\n"
        elif kind == "on_chain_end":
            yield f"data: {json.dumps({'type': 'node_end', 'node': name, 'content': f'finished {name}', 'metadata': {'tokens': 0, 'cost_usd': 0, 'latency_ms': 0}})}\n\n"
        elif kind == "on_chain_stream":
            output = data.get("output", "")
            if isinstance(output, dict) and output.get("response"):
                yield f"data: {json.dumps({'type': 'token', 'node': name, 'content': output['response'], 'metadata': {'tokens': 10, 'cost_usd': 0.0001, 'latency_ms': 50}})}\n\n"

    yield f"data: {json.dumps({'type': 'final', 'node': 'final', 'content': 'Analysis complete.', 'metadata': {}})}\n\n"

@router.post("/chat")
async def chat(request: Request):
    body = await request.json()
    return StreamingResponse(run_workflow_stream(body), media_type='text/event-stream')

@router.post("/chat/stream")
async def chat_stream(request: Request):
    body = await request.json()
    async def streamer():
        services = [
            {"name": "EC2", "cost": 1200.0, "currency": "USD", "change_pct": 5.2},
            {"name": "S3", "cost": 300.0, "currency": "USD", "change_pct": -1.1}
        ]
        total = sum(s["cost"] for s in services)
        obj = {"services": services, "total": total, "anomalies": []}
        yield f"data: {json.dumps({'type': 'object', 'value': obj})}\n\n"
        for i in range(3):
            if i == 1:
                services[0]["cost"] += 50
                obj["anomalies"].append({"service": "EC2", "severity": "medium", "delta": 50})
            else:
                services[1]["cost"] += 5
            obj["total"] = sum(s["cost"] for s in services)
            yield f"data: {json.dumps({'type': 'partial', 'value': obj})}\n\n"
            await asyncio.sleep(0.1)
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
    return StreamingResponse(streamer(), media_type='text/event-stream')

@router.post("/copilot")
async def copilot_handler(request: Request):
    body = await request.json()
    return JSONResponse({"status": "ok", "received": body})
