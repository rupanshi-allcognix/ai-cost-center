import json
import uuid

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from langchain_core.messages import HumanMessage

router = APIRouter()


async def run_workflow_stream(payload: dict):
    input_text = payload.get("input", "")
    from ..workflow import app as workflow_app

    config = {"configurable": {"thread_id": str(uuid.uuid4())}}
    inputs = {"messages": [HumanMessage(content=input_text)]}

    final_content = "Analysis complete."

    async for event in workflow_app.astream_events(inputs, config, version="v2"):
        kind = event.get("event", "")
        name = event.get("name", "")
        data = event.get("data", {})

        if kind == "on_chain_start" and name == "agent":
            yield (
                f"data: {json.dumps({'type': 'node_start', 'node': 'agent', 'content': 'Analyzing your query...', 'metadata': {}})}\n\n"
            )

        elif kind == "on_chain_start" and name == "tools":
            yield (
                f"data: {json.dumps({'type': 'node_start', 'node': 'tools', 'content': 'Querying data sources...', 'metadata': {}})}\n\n"
            )

        elif kind == "on_tool_start":
            yield (
                f"data: {json.dumps({'type': 'node_start', 'node': name, 'content': f'Using {name}...', 'metadata': {}})}\n\n"
            )

        elif kind == "on_tool_end":
            yield (
                f"data: {json.dumps({'type': 'token', 'node': name, 'content': f'{name} returned data', 'metadata': {}})}\n\n"
            )
            yield (
                f"data: {json.dumps({'type': 'node_end', 'node': name, 'content': f'Finished {name}', 'metadata': {}})}\n\n"
            )

        elif kind == "on_chat_model_end":
            output = data.get("output", "")
            if hasattr(output, "content") and output.content:
                has_tool_calls = hasattr(output, "tool_calls") and bool(output.tool_calls)
                if not has_tool_calls:
                    final_content = output.content

        elif kind == "on_chain_end" and name == "agent":
            output = data.get("output", {})
            if isinstance(output, dict):
                for msg in output.get("messages", []):
                    if (
                        hasattr(msg, "content")
                        and msg.content
                        and getattr(msg, "type", "") == "ai"
                    ):
                        has_tool_calls = hasattr(msg, "tool_calls") and bool(msg.tool_calls)
                        if not has_tool_calls:
                            final_content = msg.content
            yield (
                f"data: {json.dumps({'type': 'node_end', 'node': 'agent', 'content': 'Finished analysis.', 'metadata': {}})}\n\n"
            )

        elif kind == "on_chain_end" and name == "tools":
            yield (
                f"data: {json.dumps({'type': 'node_end', 'node': 'tools', 'content': 'Finished querying data.', 'metadata': {}})}\n\n"
            )

    yield (
        f"data: {json.dumps({'type': 'final', 'node': 'final', 'content': final_content, 'metadata': {}})}\n\n"
    )


@router.post("/chat")
async def chat(request: Request):
    body = await request.json()
    return StreamingResponse(run_workflow_stream(body), media_type="text/event-stream")


@router.post("/chat/stream")
async def chat_stream(request: Request):
    await request.json()

    async def streamer():
        services = [
            {"name": "EC2", "cost": 1200.0, "currency": "USD", "change_pct": 5.2},
            {"name": "S3", "cost": 300.0, "currency": "USD", "change_pct": -1.1},
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
            import asyncio

            await asyncio.sleep(0.1)
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(streamer(), media_type="text/event-stream")


@router.post("/copilot")
async def copilot_handler(request: Request):
    body = await request.json()
    return JSONResponse({"status": "ok", "received": body})
