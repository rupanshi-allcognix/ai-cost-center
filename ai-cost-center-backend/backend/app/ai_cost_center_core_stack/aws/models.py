from pydantic import BaseModel, Field


class AWSCredentials(BaseModel):
    access_key: str = Field(..., min_length=1, max_length=40, examples=["AKIA..."])
    secret_key: str = Field(..., min_length=1, max_length=60, examples=["wJalr..."])


class AWSConnectResponse(BaseModel):
    account_id: str
    arn: str
    account_alias: str = ""
    user_id: str = ""


class AWSStatusResponse(BaseModel):
    connected: bool
    account_id: str | None = None
    arn: str | None = None
    account_alias: str = ""


class InstanceCost(BaseModel):
    instance_id: str
    instance_type: str
    region: str
    state: str
    monthly_cost: float
    daily_cost: float
    name: str = ""
    launch_time: str = ""
    tags: dict[str, str] = {}


class AWSCostSummary(BaseModel):
    total_monthly_cost: float
    total_daily_cost: float
    instance_count: int
    instances: list[InstanceCost]
    currency: str = "USD"
    period: str = ""


class AWSCostTrend(BaseModel):
    date: str
    amount: float
