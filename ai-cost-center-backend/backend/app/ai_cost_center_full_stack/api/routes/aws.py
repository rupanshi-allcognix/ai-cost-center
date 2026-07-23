from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.ai_cost_center_core_stack.aws.service import (
    disconnect,
    get_connection_status,
    get_cost_trend,
    get_instance_costs,
    validate_and_connect,
)
from app.ai_cost_center_full_stack.database.mongodb import get_db

router = APIRouter()


class ConnectRequest(BaseModel):
    access_key: str
    secret_key: str


@router.post("/connect")
async def connect_aws(request: ConnectRequest):
    try:
        db = await get_db()
        result = await validate_and_connect(request.access_key, request.secret_key, db)
        return {"status": "connected", "account": result.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")


@router.get("/status")
async def aws_status():
    db = await get_db()
    status = await get_connection_status(db)
    return status


@router.get("/costs")
async def aws_costs(
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
):
    try:
        db = await get_db()
        status = await get_connection_status(db)
        if not status.get("connected"):
            raise HTTPException(status_code=400, detail="No AWS account connected.")
        costs = await get_instance_costs(db, start_date, end_date)
        return costs.model_dump()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch costs: {str(e)}")


@router.get("/cost-trend")
async def aws_cost_trend(days: int = Query(30, ge=1, le=90)):
    try:
        db = await get_db()
        status = await get_connection_status(db)
        if not status.get("connected"):
            raise HTTPException(status_code=400, detail="No AWS account connected.")
        trend = await get_cost_trend(db, days)
        return {"trend": [t.model_dump() for t in trend]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch trend: {str(e)}")


@router.post("/disconnect")
async def disconnect_aws():
    try:
        db = await get_db()
        removed = await disconnect(db)
        return {"status": "disconnected", "removed": removed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
