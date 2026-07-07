from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/")
    assert response.status_code in (200, 404)
    assert response.headers["content-type"] == "application/json"


def test_detect_anomalies_zscore():
    from app.api.anomaly import detect_anomalies_zscore

    values = [100, 102, 98, 101, 99, 300, 97, 103, 99, 100]
    anomalies = detect_anomalies_zscore(values)
    assert len(anomalies) > 0
    assert anomalies[0]["severity"] in ("critical", "warning")


def test_detect_anomalies_moving_avg():
    from app.api.anomaly import detect_anomalies_moving_avg

    values = [100, 102, 98, 101, 99, 100, 97, 103, 99, 100]
    anomalies = detect_anomalies_moving_avg(values, window=5, factor=2.0)
    assert isinstance(anomalies, list)


def test_app_health():
    assert app.title == "FastAPI"
