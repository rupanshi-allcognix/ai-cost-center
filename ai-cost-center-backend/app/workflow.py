from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
import random
import math

class AgentState(TypedDict):
    input: str
    intent: str
    cost_data: dict | None
    anomalies: list
    recommendations: str
    response: str

def classify_intent(state: AgentState) -> AgentState:
    text = state.get("input", "").lower()
    if any(w in text for w in ["spike", "anomaly", "unusual", "jump", "increase"]):
        intent = "anomaly_investigation"
    elif any(w in text for w in ["forecast", "predict", "project", "future"]):
        intent = "forecast"
    elif any(w in text for w in ["saving", "optimize", "rightsize", "reduce", "cheap"]):
        intent = "optimization"
    elif any(w in text for w in ["resource", "idle", "utilization", "usage"]):
        intent = "resource_analysis"
    else:
        intent = "general"
    state["intent"] = intent
    return state

def query_cost_data(state: AgentState) -> AgentState:
    base = 10000
    n = 30
    data = [base + random.gauss(0, 800) + i * 150 for i in range(n)]
    if state["intent"] == "anomaly_investigation":
        spike_idx = random.randint(5, n - 1)
        data[spike_idx] += random.gauss(3000, 500)
    mean = sum(data) / n
    variance = sum((x - mean) ** 2 for x in data) / n
    std = math.sqrt(variance) or 1
    anomalies = []
    for i, v in enumerate(data):
        z = abs((v - mean) / std)
        if z > 2.5:
            anomalies.append({"day": i, "value": v, "z_score": round(z, 2)})
    state["cost_data"] = {"daily": data, "mean": round(mean, 2), "total": round(sum(data), 2)}
    state["anomalies"] = anomalies
    return state

def generate_recommendations(state: AgentState) -> AgentState:
    intent = state["intent"]
    anomalies = state.get("anomalies", [])
    if intent == "anomaly_investigation" and anomalies:
        top = max(anomalies, key=lambda a: a["z_score"])
        state["recommendations"] = f"Found a significant cost spike (z-score: {top['z_score']}). Investigate day {top['day']} resources for untagged or oversized instances."
    elif intent == "forecast":
        state["recommendations"] = "Based on current trend, projected EOM spend is ~$320k. Consider setting budget alerts at 80% and 90% thresholds."
    elif intent == "optimization":
        state["recommendations"] = "Identified 3 idle EBS volumes ($340/mo) and 1 over-provisioned RDS instance ($180/mo potential savings)."
    elif intent == "resource_analysis":
        state["recommendations"] = "EC2 fleet has 78% avg utilization. RDS db-main-prod is at 45% — consider downsizing from r5.large to r5.xlarge."
    else:
        state["recommendations"] = "Current MTD spend is $284.5k, down 8.8% from last month. No critical anomalies detected."
    return state

def build_response(state: AgentState) -> AgentState:
    state["response"] = state.get("recommendations", "Analysis complete.")
    return state

def should_continue(state: AgentState) -> Literal["query_cost_data", "generate_recommendations"]:
    return "query_cost_data" if state["intent"] == "anomaly_investigation" else "generate_recommendations"

workflow = StateGraph(AgentState)

workflow.set_entry_point("classify_intent")
workflow.add_node("classify_intent", classify_intent)
workflow.add_node("query_cost_data", query_cost_data)
workflow.add_node("generate_recommendations", generate_recommendations)
workflow.add_node("build_response", build_response)

workflow.add_conditional_edges("classify_intent", should_continue)
workflow.add_edge("query_cost_data", "generate_recommendations")
workflow.add_edge("generate_recommendations", "build_response")
workflow.add_edge("build_response", END)

checkpointer = MemorySaver()

app = workflow.compile(checkpointer=checkpointer)
