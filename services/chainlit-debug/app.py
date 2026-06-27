import os
import chainlit as cl
from langgraph import Graph  # assume langgraph python binding

GRAPH_URL = os.environ.get('LANGGRAPH_URL', 'http://langgraph:8080')

graph = Graph(GRAPH_URL)

@cl.on_message
async def main(message: str):
    # invoke LangGraph directly and stream node outputs as Steps
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
    # Accept an uploaded CSV and forward to LangGraph ingestion node
    f = msg.file
    content = await f.read()
    graph.run({'upload': {'filename': f.name, 'content': content}})
    await cl.send('Uploaded and queued for ingestion')
