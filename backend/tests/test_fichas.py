def test_fichas_crud(client):
    payload = {
        "id": "teste-ficha-123",
        "nome": "Arthur Cervero",
        "classe": "Combatente",
        "nex": 15,
        "conteudo": {
            "origem": "Policial",
            "trilha": "Guerreiro",
            "pvAtual": 28,
            "pvMax": 28
        }
    }
    # Create
    create_res = client.post("/api/fichas", json=payload)
    assert create_res.status_code == 200
    assert create_res.json()["success"] is True

    # Get Single
    get_res = client.get("/api/fichas/teste-ficha-123")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["nome"] == "Arthur Cervero"
    assert data["conteudo"]["origem"] == "Policial"

    # List
    list_res = client.get("/api/fichas")
    assert list_res.status_code == 200
    assert any(f["id"] == "teste-ficha-123" for f in list_res.json())

    # Delete
    del_res = client.delete("/api/fichas/teste-ficha-123")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Verify deleted
    not_found = client.get("/api/fichas/teste-ficha-123")
    assert not_found.status_code == 404
