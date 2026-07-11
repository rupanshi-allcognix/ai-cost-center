import json
import os

import chainlit as cl
import httpx

BACKEND_URL = os.environ.get("LANGGRAPH_URL", "http://ai-cost-center-backend:8000").rstrip("/")


@cl.on_message
async def main(message: str):
    msg = cl.Message(content="")
    await msg.send()

    async with httpx.AsyncClient(timeout=60) as client:
        try:
            async with client.stream(
                "POST",
                f"{BACKEND_URL}/api/agent/chat",
                json={"input": message},
            ) as response:
                if response.status_code != 200:
                    await msg.stream_token(
                        f"Error: Backend returned {response.status_code}"
                    )
                    return

                current_step = None
                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    data_str = line[6:]
                    try:
                        event = json.loads(data_str)
                    except json.JSONDecodeError:
                        continue

                    etype = event.get("type", "")
                    node = event.get("node", "")
                    content = event.get("content", "")

                    if etype == "node_start":
                        current_step = cl.Step(name=node)
                        await current_step.start()
                    elif etype == "node_end":
                        if current_step:
                            current_step.output = content
                            await current_step.send()
                            current_step = None
                    elif etype == "token":
                        await msg.stream_token(content)
                    elif etype == "final":
                        await msg.stream_token(f"\n\n{content}")

        except httpx.ConnectError:
            await msg.stream_token(
                "Backend is unavailable. Please ensure the service is running."
            )
