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

def test_battlemat_session(client):
    res = client.get("/api/battlemat/session")
    assert res.status_code == 200
    data = res.json()
    assert data["online"] is True
    assert "round" in data
    assert "active_token_id" in data
    assert "tokens" in data
    assert "initiative" in data
    assert data["grid_size"] == {"cols": 8, "rows": 8}
    assert len(data["tokens"]) > 0

def test_battlemat_spawn_threat(client):
    payload = {
        "nome": "Esqueleto de Lodo",
        "grid": "F6",
        "vd": 20,
    }
    res = client.post("/api/battlemat/spawn-threat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["threat"]["nome"] == "Esqueleto de Lodo"
    assert data["threat"]["grid"] == "F6"

    # Confere na sessão
    session_res = client.get("/api/battlemat/session")
    session = session_res.json()
    assert any(t["nome"] == "Esqueleto de Lodo" for t in session["tokens"].values())

def test_battlemat_next_turn(client):
    # Executa o próximo turno da iniciativa
    payload = {"narrativa_mestre": "O ambiente treme violentamente."}
    res = client.post("/api/battlemat/next-turn", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "turn_decision" in data
    assert "feed_entry" in data
    assert "session" in data

def test_battlemat_feed(client):
    res = client.get("/api/battlemat/feed")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "feed" in data
    assert isinstance(data["feed"], list)
    assert len(data["feed"]) > 0

def test_battlemat_compendium(client):
    res = client.get("/api/battlemat/compendium")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["ameacas"]) > 0

def test_battlemat_advance_round_and_reset(client):
    res = client.post("/api/battlemat/advance-round", json={"round_increment": 2})
    assert res.status_code == 200
    data = res.json()
    assert data["round"] >= 3

    # Reset
    reset_res = client.post("/api/battlemat/reset")
    assert reset_res.status_code == 200
    reset_data = reset_res.json()
    assert reset_data["round"] == 1
