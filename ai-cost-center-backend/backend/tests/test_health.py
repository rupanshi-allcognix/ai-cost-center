from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_openapi_docs():
    response = client.get("/docs")
    assert response.status_code == 200


def test_health_returns_json():
    response = client.get("/health")
    assert response.headers["content-type"] == "application/json"
