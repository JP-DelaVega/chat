from fastapi.testclient import TestClient

from app.main import app


class DummyChain:
    def stream(self, question):
        return ["Hello", " ", "world"]


def test_stream_endpoint_returns_text(monkeypatch):
    monkeypatch.setattr("app.main.rag_chain", DummyChain())

    client = TestClient(app)
    response = client.post("/ask/stream", json={"question": "Hello"})

    assert response.status_code == 200
    assert response.text == "Hello world"
