import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import agent, anomaly, notifications

app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent.router, prefix="/api/agent")
app.include_router(anomaly.router, prefix="/api/anomaly")
app.include_router(notifications.router, prefix="/api/notifications")
