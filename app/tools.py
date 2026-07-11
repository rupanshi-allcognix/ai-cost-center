from .data import (
    SERVICES,
    ANOMALIES,
    RESOURCES,
    BUDGET,
    SAVINGS_MONTHLY,
    get_total_spend,
    get_daily_trend,
)


def get_cost_breakdown() -> dict:
    """Get a detailed cost breakdown by service for the current month. Returns total spend and per-service amounts."""
    return {"total": get_total_spend(), "services": SERVICES}


def get_anomalies(min_severity: str | None = None) -> list[dict]:
    """Get active anomalies detected across your cloud infrastructure.
    Optionally filter by minimum severity level: 'critical', 'warning', or 'info'.
    """
    if min_severity:
        levels = {"critical": 0, "warning": 1, "info": 2}
        threshold = levels.get(min_severity, 0)
        return [a for a in ANOMALIES if levels.get(a["severity"], 99) >= threshold]
    return ANOMALIES


def get_resources(status: str | None = None) -> list[dict]:
    """Get cloud resources and their utilization details.
    Optionally filter by status: 'healthy', 'idle', or 'over-provisioned'.
    """
    if status:
        return [r for r in RESOURCES if r["status"] == status]
    return RESOURCES


def get_forecast() -> dict:
    """Get spend forecast based on current trends. Returns MTD spend, daily average,
    projected month-end, budget status, and whether you're on track to exceed budget.
    """
    trend = get_daily_trend()
    daily_avg = sum(trend) / len(trend)
    projected = daily_avg * 30
    return {
        "mtd_spend": BUDGET["spent"],
        "daily_avg": round(daily_avg, 2),
        "projected_month_end": round(projected, 2),
        "budget": BUDGET,
        "over_budget": projected > BUDGET["budget"],
    }


def get_savings_opportunities() -> dict:
    """Get savings opportunities including idle resource waste and rightsizing recommendations.
    Returns monthly savings data, YTD realized savings, current month status, and estimated waste.
    """
    waste = sum(r["monthly_spend"] for r in RESOURCES if r["status"] in ("idle", "over-provisioned"))
    return {
        "monthly_savings": SAVINGS_MONTHLY,
        "total_realized_ytd": sum(s["realized"] for s in SAVINGS_MONTHLY),
        "current_month": SAVINGS_MONTHLY[-1],
        "idle_waste": waste,
        "recommendations": [
            "Review idle resources for deletion or stop",
            "Right-size over-provisioned instances",
            "Set up auto-scaling for variable workloads",
        ],
    }
