import os
import sys
from fastapi.testclient import TestClient

# 確保可以從 tests/ 匯入到 backend/main.py
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from main import app


client = TestClient(app)


def test_create_and_list_todos():
    payload = {"title": "pytest todo", "desc": "from pytest"}
    res = client.post("/todos", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == payload["title"]
    assert data["desc"] == payload["desc"]

    res_list = client.get("/todos")
    assert res_list.status_code == 200
    todos = res_list.json()
    assert any(t["id"] == data["id"] for t in todos)


def test_toggle_completed():
    res = client.post("/todos", json={"title": "toggle", "desc": None})
    todo = res.json()

    res_update = client.put(f"/todos/{todo['id']}", json={"completed": True})
    assert res_update.status_code == 200
    updated = res_update.json()
    assert updated["completed"] is True


def test_delete_todo():
    res = client.post("/todos", json={"title": "delete me", "desc": None})
    todo = res.json()

    res_del = client.delete(f"/todos/{todo['id']}")
    assert res_del.status_code == 204

    res_get = client.get(f"/todos/{todo['id']}")
    assert res_get.status_code == 404

