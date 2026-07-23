import base64
import os
import re
from datetime import UTC, datetime

import boto3
from cryptography.fernet import Fernet
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.ai_cost_center_core_stack.aws.models import (
    AWSConnectResponse,
    AWSCostSummary,
    AWSCostTrend,
    InstanceCost,
)
from app.ai_cost_center_core_stack.aws.pricing import get_instance_monthly_cost

ENCRYPTION_KEY = os.environ.get("AWS_CRED_ENCRYPTION_KEY", "")
_fernet: Fernet | None = None


def _get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        if not ENCRYPTION_KEY:
            key = Fernet.generate_key()
        else:
            key = base64.urlsafe_b64encode(ENCRYPTION_KEY.encode()[:32].ljust(32, b"\0"))
        _fernet = Fernet(key)
    return _fernet


def _encrypt(value: str) -> str:
    return _get_fernet().encrypt(value.encode()).decode()


def _decrypt(token: str) -> str:
    return _get_fernet().decrypt(token.encode()).decode()


def _validate_key_format(access_key: str, secret_key: str) -> bool:
    if not re.match(r"^AKIA[0-9A-Z]{16}$", access_key):
        return False
    if len(secret_key) < 20 or len(secret_key) > 60:
        return False
    return True


async def validate_and_connect(
    access_key: str, secret_key: str, db: AsyncIOMotorDatabase
) -> AWSConnectResponse:
    if not _validate_key_format(access_key, secret_key):
        raise ValueError("Invalid AWS key format. Access key must start with AKIA.")

    sts = boto3.client(
        "sts",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
    )
    identity = sts.get_caller_identity()

    account_id = identity["Account"]
    arn = identity["Arn"]
    user_id = identity.get("UserId", "")

    try:
        iam = boto3.client(
            "iam",
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
        )
        alias_resp = iam.list_account_aliases()
        account_alias = alias_resp.get("AccountAliases", [""])[0]
    except Exception:
        account_alias = ""

    encrypted_ak = _encrypt(access_key)
    encrypted_sk = _encrypt(secret_key)

    await db.aws_credentials.update_one(
        {"account_id": account_id},
        {
            "$set": {
                "account_id": account_id,
                "arn": arn,
                "user_id": user_id,
                "account_alias": account_alias,
                "access_key_enc": encrypted_ak,
                "secret_key_enc": encrypted_sk,
                "updated_at": datetime.now(UTC),
            },
            "$setOnInsert": {
                "created_at": datetime.now(UTC),
            },
        },
        upsert=True,
    )

    return AWSConnectResponse(
        account_id=account_id,
        arn=arn,
        account_alias=account_alias,
        user_id=user_id,
    )


async def get_connection_status(db: AsyncIOMotorDatabase) -> dict:
    doc = await db.aws_credentials.find_one(sort=[("created_at", -1)])
    if doc is None:
        return {"connected": False}
    return {
        "connected": True,
        "account_id": doc.get("account_id"),
        "arn": doc.get("arn"),
        "account_alias": doc.get("account_alias", ""),
    }


async def disconnect(db: AsyncIOMotorDatabase) -> bool:
    result = await db.aws_credentials.delete_many({})
    return result.deleted_count > 0


async def _get_boto3_clients(db: AsyncIOMotorDatabase):
    doc = await db.aws_credentials.find_one(sort=[("created_at", -1)])
    if doc is None:
        raise ValueError("No AWS credentials stored. Connect first.")

    access_key = _decrypt(doc["access_key_enc"])
    secret_key = _decrypt(doc["secret_key_enc"])

    ce = boto3.client(
        "ce",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name="us-east-1",
    )
    ec2 = boto3.client(
        "ec2",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name="us-east-1",
    )
    return ce, ec2, doc.get("account_id", "")


def _get_name_tag(tags: list[dict] | None) -> str:
    if not tags:
        return ""
    for tag in tags:
        if tag.get("Key") == "Name":
            return tag.get("Value", "")
    return ""


async def get_instance_costs(
    db: AsyncIOMotorDatabase,
    start_date: str | None = None,
    end_date: str | None = None,
) -> AWSCostSummary:
    ce, ec2, account_id = await _get_boto3_clients(db)

    if end_date is None:
        end_date = datetime.now(UTC).strftime("%Y-%m-%d")
    if start_date is None:
        start_dt = datetime.now(UTC).replace(day=1)
        start_date = start_dt.strftime("%Y-%m-%d")

    cost_by_instance: dict[str, float] = {}
    try:
        response = ce.get_cost_and_usage(
            TimePeriod={"Start": start_date, "End": end_date},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
            GroupBy=[{"Type": "DIMENSION", "Key": "RESOURCE_NAME"}],
            Filter={
                "Dimensions": {"Key": "SERVICE", "Values": ["Amazon Elastic Compute Cloud - Compute"]}
            },
        )
        for result in response.get("ResultsByTime", []):
            for group in result.get("Groups", []):
                resource_name = group["Keys"][0]
                amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
                if amount > 0:
                    cost_by_instance[resource_name] = cost_by_instance.get(resource_name, 0) + amount
    except Exception:
        pass

    total_cost_from_ce = sum(cost_by_instance.values())
    ce_available = total_cost_from_ce > 0

    instances: list[InstanceCost] = []
    regions_to_scan = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"]
    total_monthly = 0.0
    all_instances: list[dict] = []

    for region in regions_to_scan:
        try:
            regional_ec2 = boto3.client(
                "ec2",
                aws_access_key_id=_decrypt(
                    (await db.aws_credentials.find_one(sort=[("created_at", -1)]))["access_key_enc"]
                ),
                aws_secret_access_key=_decrypt(
                    (await db.aws_credentials.find_one(sort=[("created_at", -1)]))["secret_key_enc"]
                ),
                region_name=region,
            )
            paginator = regional_ec2.get_paginator("describe_instances")
            for page in paginator.paginate():
                for reservation in page.get("Reservations", []):
                    for inst in reservation.get("Instances", []):
                        all_instances.append(inst)
        except Exception:
            continue

    for inst in all_instances:
        instance_id = inst["InstanceId"]
        instance_type = inst["InstanceType"]
        region = inst["Placement"].get("RegionName", "unknown")
        state = inst["State"].get("Name", "unknown")
        name = _get_name_tag(inst.get("Tags"))
        launch_time = inst.get("LaunchTime", "")
        if hasattr(launch_time, "isoformat"):
            launch_time = launch_time.isoformat()
        tags = {t["Key"]: t["Value"] for t in inst.get("Tags", []) if t["Key"] != "Name"}

        if ce_available and instance_id in cost_by_instance:
            monthly = cost_by_instance[instance_id]
        elif ce_available:
            monthly = total_cost_from_ce / len(all_instances) if all_instances else 0
        else:
            monthly = get_instance_monthly_cost(instance_type, region)

        daily = monthly / 30.0

        total_monthly += monthly
        instances.append(
            InstanceCost(
                instance_id=instance_id,
                instance_type=instance_type,
                region=region,
                state=state,
                monthly_cost=round(monthly, 2),
                daily_cost=round(daily, 2),
                name=name,
                launch_time=str(launch_time),
                tags=tags,
            )
        )

    instances.sort(key=lambda x: x.monthly_cost, reverse=True)

    days_in_period = max(1, (
        datetime.strptime(end_date, "%Y-%m-%d") - datetime.strptime(start_date, "%Y-%m-%d")
    ).days)
    total_daily = total_monthly / days_in_period if days_in_period > 0 else total_monthly / 30

    return AWSCostSummary(
        total_monthly_cost=round(total_monthly, 2),
        total_daily_cost=round(total_daily, 2),
        instance_count=len(instances),
        instances=instances,
        period=f"{start_date} to {end_date}",
    )


async def get_cost_trend(
    db: AsyncIOMotorDatabase,
    days: int = 30,
) -> list[AWSCostTrend]:
    ce, ec2, account_id = await _get_boto3_clients(db)

    end_date = datetime.now(UTC).strftime("%Y-%m-%d")
    start_dt = datetime.now(UTC).replace(day=1)
    start_date = start_dt.strftime("%Y-%m-%d")

    trend: list[AWSCostTrend] = []
    try:
        response = ce.get_cost_and_usage(
            TimePeriod={"Start": start_date, "End": end_date},
            Granularity="DAILY",
            Metrics=["UnblendedCost"],
            Filter={
                "Dimensions": {"Key": "SERVICE", "Values": ["Amazon Elastic Compute Cloud - Compute"]}
            },
        )
        for result in response.get("ResultsByTime", []):
            time_period = result["TimePeriod"]["Start"]
            amount = float(result["Metrics"]["UnblendedCost"]["Amount"])
            trend.append(AWSCostTrend(date=time_period, amount=round(amount, 2)))
    except Exception:
        total = await get_instance_costs(db, start_date, end_date)
        daily = total.total_monthly_cost / 30.0
        for i in range(days):
            d = datetime.now(UTC).replace(day=1)
            from datetime import timedelta
            d = d + timedelta(days=i)
            trend.append(AWSCostTrend(date=d.strftime("%Y-%m-%d"), amount=round(daily, 2)))

    return trend
