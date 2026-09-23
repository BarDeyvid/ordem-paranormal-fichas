def test_battlemat_status(client):
    res = client.get("/api/status")
    assert res.status_code == 200
    data = res.json()
    assert data["online"] is True

def test_battlemat_token_status_update(client):
    payload = {
        "token_id": 1,
        "nome": "Investigador John",
        "classe": "Combatente",
        "pv_atual": 18,
        "pv_max": 20,
        "san_atual": 12,
        "san_max": 12,
        "pe_atual": 4,
        "pe_max": 4
    }
    res = client.post("/api/token/status", json=payload)
    assert res.status_code == 200
    assert res.json()["success"] is True

    # Check state recorded
    states_res = client.get("/api/token/states")
    assert states_res.status_code == 200
    states = states_res.json()
    assert "1" in states or 1 in states

def test_battlemat_cast_ritual(client):
    payload = {
        "token_id": 1,
        "ritual": "Decadência",
        "elemento": "Morte",
        "alcance": "Toque",
        "custo_pe": 1
    }
    res = client.post("/api/token/cast", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Decadência" in data["message"]
