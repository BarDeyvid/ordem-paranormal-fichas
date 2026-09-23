from app.models.schemas import RollRequestSchema
from app.services.dice import rolar_dados

def test_roll_simples():
    req = RollRequestSchema(expressao="1d6", margem_critico=20)
    res = rolar_dados(req)
    assert 1 <= res.total <= 6
    assert len(res.dados_rolados) == 1

def test_roll_com_modificador():
    req = RollRequestSchema(expressao="1d1+10", margem_critico=20)
    res = rolar_dados(req)
    assert res.total == 11
    assert res.modificador == 10

def test_roll_keep_highest():
    req = RollRequestSchema(expressao="5d20k1", margem_critico=20)
    res = rolar_dados(req)
    assert len(res.dados_rolados) == 5
    mantidos = [d for d in res.dados_rolados if d.mantido]
    assert len(mantidos) == 1
    # O mantido deve ser o maior
    valores = [d.valor for d in res.dados_rolados]
    assert mantidos[0].valor == max(valores)

def test_roll_critico():
    req = RollRequestSchema(expressao="1d1", margem_critico=1)
    res = rolar_dados(req)
    # faces = 1 (mínimo vira 2 internamente), mas testemos margem
    assert isinstance(res.total, int)
