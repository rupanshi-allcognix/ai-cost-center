import os
import chainlit as cl

GRAPH_URL = os.environ.get('LANGGRAPH_URL', 'http://langgraph:8080')

try:
    from langgraph import Graph
    graph = Graph(GRAPH_URL)
except ImportError:
    graph = None

@cl.on_message
async def main(message: str):
    if graph is None:
        await cl.Message(content=f"LangGraph not available. Message received: {message}").send()
        return
    run = graph.run(message)
    for node_output in run.stream():
        step = cl.Step(name=node_output.node, content=node_output.content)
        step.set_metadata({
            'tokens': node_output.metadata.get('tokens'),
            'latency_ms': node_output.metadata.get('latency_ms'),
            'cost_usd': node_output.metadata.get('cost_usd')
        })
        await cl.sleep(0)
        await cl.send(step)

@cl.on_message
async def upload_file(msg: cl.AskFileMessage):
    if graph is None:
        await cl.Message(content="Upload received but LangGraph not available").send()
        return
    f = msg.file
    content = await f.read()
    graph.run({'upload': {'filename': f.name, 'content': content}})
    await cl.send('Uploaded and queued for ingestion')
