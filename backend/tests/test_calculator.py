from app.models.schemas import CalculoRequestSchema, AtributosBase
from app.services.calculator import calcular_estatisticas_personagem

def test_calculo_combatente_nex5():
    req = CalculoRequestSchema(
        classe="Combatente",
        nex=5,
        atributos=AtributosBase(FOR=2, AGI=2, INT=1, PRE=1, VIG=2),
        regras_ativas=[]
    )
    res = calcular_estatisticas_personagem(req)
    # Combatente inicial: PV = 20 + VIG (2) = 22
    assert res.pv_max == 22
    # PE = 2 + PRE (1) = 3
    assert res.pe_max == 3
    # SAN = 12
    assert res.san_max == 12
    # Defesa = 10 + AGI (2) = 12
    assert res.defesa_total == 12
    assert res.pe_rodada == 1
    assert res.deslocamento == 9
    assert res.capacidade_carga == 10

def test_calculo_regras_passivas():
    req = CalculoRequestSchema(
        classe="Combatente",
        nex=10,
        atributos=AtributosBase(FOR=2, AGI=2, INT=1, PRE=1, VIG=2),
        regras_ativas=[2, 4, 6, 22]  # Regra 2: +1 PV/nex, Regra 4: +2 def, Regra 6: +1 pe, Regra 22: +3m desloc
    )
    res = calcular_estatisticas_personagem(req)
    # NEX 10% = 1 aumento. PV base = 22 + (4 + 2 + 1) = 29
    assert res.pv_max == 29
    assert res.defesa_total == 14  # 12 + 2 da regra 4
    assert res.deslocamento == 12  # 9 + 3 da regra 22
    assert res.pe_rodada == 3      # 10//5 = 2 + 1 da regra 6

def test_calculo_regra_1_meia_sanidade():
    req = CalculoRequestSchema(
        classe="Ocultista",
        nex=5,
        atributos=AtributosBase(FOR=1, AGI=1, INT=3, PRE=3, VIG=1),
        regras_ativas=[1]  # Começa com metade da sanidade
    )
    res = calcular_estatisticas_personagem(req)
    # Ocultista base = 20 // 2 = 10
    assert res.san_max == 10
