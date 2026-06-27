from fastapi import FastAPI
from .api import agent, anomaly, notifications

app = FastAPI()

app.include_router(agent.router, prefix="/api/agent")
app.include_router(anomaly.router, prefix="/api/anomaly")
app.include_router(notifications.router, prefix="/api/notifications")
