from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
import json
from typing import Optional

router = APIRouter()

class SlackWebhookPayload(BaseModel):
    webhook_url: str
    message: str
    severity: Optional[str] = "info"

class AnomalyAlert(BaseModel):
    resource_id: str
    metric: str
    observed: float
    expected: float
    severity: str
    timestamp: str

@router.post("/slack/test")
async def test_slack(payload: SlackWebhookPayload):
    blocks = [
        {"type": "header", "text": {"type": "plain_text", "text": "AI Cost Center — Test Notification"}},
        {"type": "section", "text": {"type": "mrkdwn", "text": f"*Severity:* {payload.severity}\n{payload.message}"}},
        {"type": "context", "elements": [{"type": "mrkdwn", "text": "AI Cost Center Notification System"}]},
    ]
    async with httpx.AsyncClient() as client:
        resp = await client.post(payload.webhook_url, json={"blocks": blocks})
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=f"Slack returned {resp.status_code}")
    return {"status": "ok"}

@router.post("/slack/alert")
async def send_alert(alert: AnomalyAlert, webhook_url: str):
    severity_emoji = {"critical": "🔴", "warning": "🟡", "info": "🔵"}
    emoji = severity_emoji.get(alert.severity, "⚪")
    blocks = [
        {"type": "header", "text": {"type": "plain_text", "text": f"{emoji} Anomaly Detected: {alert.resource_id}"}},
        {"type": "section", "text": {"type": "mrkdwn", "text": f"*Metric:* {alert.metric}\n*Observed:* {alert.observed}\n*Expected:* {alert.expected}\n*Severity:* {alert.severity}"}},
        {"type": "context", "elements": [{"type": "mrkdwn", "text": f"Detected at {alert.timestamp}"}]},
    ]
    async with httpx.AsyncClient() as client:
        resp = await client.post(webhook_url, json={"blocks": blocks})
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=f"Slack returned {resp.status_code}")
    return {"status": "sent", "severity": alert.severity, "resource": alert.resource_id}
