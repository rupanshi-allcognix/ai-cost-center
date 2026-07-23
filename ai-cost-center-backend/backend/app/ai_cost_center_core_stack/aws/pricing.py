PRICING_REGION = "us-east-1"

ON_DEMAND_PRICING: dict[str, dict[str, float]] = {
    "t2.micro": {"vcpu": 1, "memory_gb": 1.0, "price_per_hour": 0.0116},
    "t2.small": {"vcpu": 1, "memory_gb": 2.0, "price_per_hour": 0.0232},
    "t2.medium": {"vcpu": 2, "memory_gb": 4.0, "price_per_hour": 0.0464},
    "t2.large": {"vcpu": 2, "memory_gb": 8.0, "price_per_hour": 0.0928},
    "t2.xlarge": {"vcpu": 4, "memory_gb": 16.0, "price_per_hour": 0.1856},
    "t3.micro": {"vcpu": 2, "memory_gb": 1.0, "price_per_hour": 0.0104},
    "t3.small": {"vcpu": 2, "memory_gb": 2.0, "price_per_hour": 0.0208},
    "t3.medium": {"vcpu": 2, "memory_gb": 4.0, "price_per_hour": 0.0416},
    "t3.large": {"vcpu": 2, "memory_gb": 8.0, "price_per_hour": 0.0832},
    "t3.xlarge": {"vcpu": 4, "memory_gb": 16.0, "price_per_hour": 0.1664},
    "t3.2xlarge": {"vcpu": 8, "memory_gb": 32.0, "price_per_hour": 0.3328},
    "m5.large": {"vcpu": 2, "memory_gb": 8.0, "price_per_hour": 0.096},
    "m5.xlarge": {"vcpu": 4, "memory_gb": 16.0, "price_per_hour": 0.192},
    "m5.2xlarge": {"vcpu": 8, "memory_gb": 32.0, "price_per_hour": 0.384},
    "m5.4xlarge": {"vcpu": 16, "memory_gb": 64.0, "price_per_hour": 0.768},
    "m5.8xlarge": {"vcpu": 32, "memory_gb": 128.0, "price_per_hour": 1.536},
    "c5.large": {"vcpu": 2, "memory_gb": 4.0, "price_per_hour": 0.085},
    "c5.xlarge": {"vcpu": 4, "memory_gb": 8.0, "price_per_hour": 0.17},
    "c5.2xlarge": {"vcpu": 8, "memory_gb": 16.0, "price_per_hour": 0.34},
    "c5.4xlarge": {"vcpu": 16, "memory_gb": 32.0, "price_per_hour": 0.68},
    "r5.large": {"vcpu": 2, "memory_gb": 16.0, "price_per_hour": 0.126},
    "r5.xlarge": {"vcpu": 4, "memory_gb": 32.0, "price_per_hour": 0.252},
    "r5.2xlarge": {"vcpu": 8, "memory_gb": 64.0, "price_per_hour": 0.504},
    "r5.4xlarge": {"vcpu": 16, "memory_gb": 128.0, "price_per_hour": 1.008},
}

REGION_MULTIPLIER: dict[str, float] = {
    "us-east-1": 1.0,
    "us-east-2": 1.0,
    "us-west-1": 1.1,
    "us-west-2": 1.05,
    "eu-west-1": 1.1,
    "eu-west-2": 1.15,
    "eu-central-1": 1.12,
    "ap-southeast-1": 1.15,
    "ap-southeast-2": 1.2,
    "ap-northeast-1": 1.18,
    "ap-south-1": 1.1,
    "sa-east-1": 1.3,
    "ca-central-1": 1.12,
}


HOURS_PER_MONTH = 730.0


def get_instance_hourly_cost(instance_type: str, region: str = "us-east-1") -> float:
    spec = ON_DEMAND_PRICING.get(instance_type)
    if spec is None:
        base = 0.05
    else:
        base = spec["price_per_hour"]
    multiplier = REGION_MULTIPLIER.get(region, 1.1)
    return base * multiplier


def get_instance_monthly_cost(instance_type: str, region: str = "us-east-1") -> float:
    return get_instance_hourly_cost(instance_type, region) * HOURS_PER_MONTH
