from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import math
import random
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()

def detect_anomalies_zscore(values: list[float], threshold: float = 2.5) -> list[dict]:
    n = len(values)
    if n < 4:
        return []
    mean = sum(values) / n
    variance = sum((x - mean) ** 2 for x in values) / n
    std = math.sqrt(variance)
    if std == 0:
        return []
    results = []
    for i, v in enumerate(values):
        z = abs((v - mean) / std)
        if z > threshold:
            results.append({"index": i, "value": v, "z_score": round(z, 2), "severity": "critical" if z > 3.5 else "warning"})
    return results

def detect_anomalies_moving_avg(values: list[float], window: int = 7, factor: float = 2.0) -> list[dict]:
    if len(values) < window + 1:
        return []
    results = []
    for i in range(window, len(values)):
        window_vals = values[i - window:i]
        avg = sum(window_vals) / window
        dev = math.sqrt(sum((x - avg) ** 2 for x in window_vals) / window) or 1
        curr = values[i]
        if abs(curr - avg) > factor * dev:
            results.append({"index": i, "value": curr, "expected": round(avg, 2), "deviation": round((curr - avg) / avg * 100, 1), "severity": "critical" if abs(curr - avg) > 3 * dev else "warning"})
    return results

@router.post("/detect")
async def detect(
    values: list[float],
    method: str = Query("zscore", regex="^(zscore|moving_avg)$"),
    threshold: float = Query(2.5, ge=0.5, le=5.0),
    window: int = Query(7, ge=3, le=30),
):
    if method == "zscore":
        anomalies = detect_anomalies_zscore(values, threshold)
    else:
        anomalies = detect_anomalies_moving_avg(values, window, threshold)
    return {"method": method, "count": len(anomalies), "anomalies": anomalies}

@router.get("/simulate")
async def simulate(periods: int = Query(30, ge=7, le=90)):
    base = 10000
    values = []
    anomalies = []
    for i in range(periods):
        v = base + random.gauss(0, 800) + i * 150
        if random.random() < 0.08:
            v += random.gauss(3000, 500)
        values.append(round(v, 2))
        anomalies.extend(detect_anomalies_moving_avg(values, window=7))
    return {"periods": periods, "data": values, "anomalies": anomalies}
