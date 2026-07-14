
_rng_seed = 42


def _rand():
    global _rng_seed
    _rng_seed = (_rng_seed * 16807) % 2147483647
    return (_rng_seed - 1) / 2147483646


SERVICES = [
    {"service": "EC2", "amount": 98500, "percentage": 34.6},
    {"service": "S3", "amount": 42700, "percentage": 15.0},
    {"service": "Lambda", "amount": 31200, "percentage": 11.0},
    {"service": "RDS", "amount": 28500, "percentage": 10.0},
    {"service": "EKS", "amount": 19800, "percentage": 7.0},
]

ANOMALIES = [
    {
        "title": "EC2 spend spike in us-east-1",
        "severity": "critical",
        "description": "Cost increased 340% vs 7-day average. 4 new instances launched without tags.",
        "amount": 8400,
        "resource": "i-0abcd1234",
    },
    {
        "title": "Unused RDS instance",
        "severity": "warning",
        "description": "db.r5.large running idle for 14 days with 0 connections.",
        "amount": 3200,
        "resource": "database-prod-01",
    },
    {
        "title": "Cross-region data transfer increasing",
        "severity": "info",
        "description": "Data transfer costs between regions up 45% this week.",
        "amount": 1200,
        "resource": "N/A",
    },
]

RESOURCES = [
    {"name": "web-server-prod-01", "type": "EC2", "region": "us-east-1", "monthly_spend": 2400, "utilization": 78, "status": "healthy"},
    {"name": "db-main-prod", "type": "RDS", "region": "us-east-1", "monthly_spend": 3800, "utilization": 45, "status": "over-provisioned"},
    {"name": "cache-cluster-01", "type": "ElastiCache", "region": "us-west-2", "monthly_spend": 1200, "utilization": 22, "status": "idle"},
    {"name": "ml-training-pool", "type": "ECS", "region": "us-east-1", "monthly_spend": 8900, "utilization": 92, "status": "healthy"},
    {"name": "logging-cluster", "type": "EKS", "region": "eu-west-1", "monthly_spend": 5400, "utilization": 65, "status": "healthy"},
]

BUDGET = {"budget": 420000, "spent": 284500, "remaining": 135500, "percentage": 68}

SAVINGS_MONTHLY = [
    {"month": "Jan", "realized": 12000, "identified": 18000},
    {"month": "Feb", "realized": 15000, "identified": 22000},
    {"month": "Mar", "realized": 18000, "identified": 25000},
    {"month": "Apr", "realized": 22000, "identified": 30000},
    {"month": "May", "realized": 26000, "identified": 38000},
    {"month": "Jun", "realized": 31000, "identified": 45000},
]


def get_total_spend() -> int:
    return sum(s["amount"] for s in SERVICES)


def get_daily_trend(days: int = 30) -> list[float]:
    return [8000 + _rand() * 3000 + i * 150 for i in range(days)]
