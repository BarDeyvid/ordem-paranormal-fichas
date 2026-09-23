def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_list_armas(client):
    res = client.get("/api/armas")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 60
    assert any(a["Nome_Item"] == "Faca" for a in data)

def test_list_itens(client):
    res = client.get("/api/itens")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 100

def test_list_itens_amaldicoados(client):
    res = client.get("/api/itens-amaldicoados")
    assert res.status_code == 200
    assert len(res.json()) >= 70

def test_list_maldicoes(client):
    res = client.get("/api/maldicoes")
    assert res.status_code == 200
    assert len(res.json()) >= 40

def test_list_modificacoes(client):
    res = client.get("/api/modificacoes")
    assert res.status_code == 200
    assert len(res.json()) >= 30

def test_list_municoes(client):
    res = client.get("/api/municoes")
    assert res.status_code == 200
    assert len(res.json()) >= 10

def test_list_origens(client):
    res = client.get("/api/origens")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 80

def test_list_grupos_origens(client):
    res = client.get("/api/grupos-origens")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 7

def test_list_pericias(client):
    res = client.get("/api/pericias")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 28

def test_list_poderes_with_filter(client):
    res_all = client.get("/api/poderes")
    assert res_all.status_code == 200
    assert len(res_all.json()) >= 200

    res_comb = client.get("/api/poderes?classe=Combatente")
    assert res_comb.status_code == 200
    assert len(res_comb.json()) >= 50
    assert all(p["Classe"] == "Combatente" for p in res_comb.json())

def test_list_poderes_paranormais(client):
    res = client.get("/api/poderes-paranormais")
    assert res.status_code == 200
    assert len(res.json()) >= 50

def test_list_progressao_nex(client):
    res = client.get("/api/progressao-nex")
    assert res.status_code == 200
    assert len(res.json()) == 15

def test_list_protecoes(client):
    res = client.get("/api/protecoes")
    assert res.status_code == 200
    assert len(res.json()) >= 3

def test_list_rituais(client):
    res = client.get("/api/rituais")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 120

def test_list_simbolos_rituais(client):
    res = client.get("/api/simbolos-rituais")
    assert res.status_code == 200
    assert len(res.json()) >= 120

def test_list_trilhas(client):
    res = client.get("/api/trilhas")
    assert res.status_code == 200
    assert len(res.json()) >= 40

def test_list_regras_automaticas(client):
    res = client.get("/api/regras-automaticas")
    assert res.status_code == 200
    assert len(res.json()) >= 80

def test_generic_data_query(client):
    res = client.get("/api/data/Perícias")
    assert res.status_code == 200
    assert len(res.json()) >= 28
