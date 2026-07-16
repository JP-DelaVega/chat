from types import SimpleNamespace

from fastapi.testclient import TestClient

import app.main as main


class FakeUsersCollection:
    def __init__(self):
        self.docs = []

    def find_one(self, query):
        if "email" in query:
            for doc in self.docs:
                if doc["email"] == query["email"]:
                    return doc
        return None

    def insert_one(self, doc):
        self.docs.append(doc)
        return SimpleNamespace(inserted_id="fake-id")

    def create_index(self, *args, **kwargs):
        return None


def override_users_collection():
    return FakeUsersCollection()


def test_register_and_login_flow():
    main.get_users_collection = override_users_collection

    client = TestClient(main.app)

    register_response = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "secret123"},
    )
    assert register_response.status_code == 200
    register_body = register_response.json()
    assert register_body["user"]["email"] == "user@example.com"
    assert register_body["token"]

    login_response = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "secret123"},
    )
    assert login_response.status_code == 200
    login_body = login_response.json()
    assert login_body["token"]
    assert login_body["user"]["email"] == "user@example.com"
