import os
from typing import Annotated, Literal, TypedDict

from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

from app.ai_cost_center_core_stack.deepagents.tools import (
    get_anomalies,
    get_cost_breakdown,
    get_forecast,
    get_resources,
    get_savings_opportunities,
)

tools = [
    get_cost_breakdown,
    get_anomalies,
    get_resources,
    get_forecast,
    get_savings_opportunities,
]

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()

if LLM_PROVIDER == "openai":
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.1,
        api_key=os.getenv("OPENAI_API_KEY"),
    ).bind_tools(tools)
else:
    raise ValueError(f"Unsupported LLM provider: {LLM_PROVIDER}")

SYSTEM_PROMPT = """You are a FinOps AI assistant with access to tools that return real-time cloud cost data.
Always call the appropriate tools to gather data before answering.
Use specific numbers from tool results in your responses.
Be concise and actionable.

Available tools:
- get_cost_breakdown: Returns cost by service (EC2, S3, Lambda, RDS, EKS) with amounts and percentages
- get_anomalies: Returns detected anomalies with severity and cost impact
- get_resources: Returns resource inventory with utilization, monthly cost, and status
- get_forecast: Returns spend forecast, daily average, projected month-end, and budget status
- get_savings_opportunities: Returns savings recommendations, realized/identified savings, and idle waste analysis"""


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]


def call_model(state: AgentState) -> AgentState:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + state["messages"]
    response = llm.invoke(messages)
    state["messages"].append(response)
    return state


def should_continue(state: AgentState) -> Literal["tools", "end"]:
    last = state["messages"][-1]
    has_tool_calls = hasattr(last, "tool_calls") and bool(last.tool_calls)
    return "tools" if has_tool_calls else "end"


tool_node = ToolNode(tools)

workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
workflow.add_edge("tools", "agent")

checkpointer = MemorySaver()

app = workflow.compile(checkpointer=checkpointer)
