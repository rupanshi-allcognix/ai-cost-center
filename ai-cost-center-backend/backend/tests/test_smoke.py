from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_detect_anomalies_zscore():
    from app.ai_cost_center_full_stack.api.routes.anomaly import detect_anomalies_zscore

    values = [100, 102, 98, 101, 99, 300, 97, 103, 99, 100]
    anomalies = detect_anomalies_zscore(values)
    assert len(anomalies) > 0
    assert anomalies[0]["severity"] in ("critical", "warning")


def test_detect_anomalies_moving_avg():
    from app.ai_cost_center_full_stack.api.routes.anomaly import detect_anomalies_moving_avg

    values = [100, 102, 98, 101, 99, 100, 97, 103, 99, 100]
    anomalies = detect_anomalies_moving_avg(values, window=5, factor=2.0)
    assert isinstance(anomalies, list)
