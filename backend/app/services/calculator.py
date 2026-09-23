"""
Motor de Cálculo de Regras e Estatísticas de Ordem Paranormal RPG
Implementa todas as fórmulas oficiais de PV, PE, Sanidade, Defesa, Limite de PE,
DT de Rituais, Deslocamento e Regras Automáticas.
"""

from typing import List, Dict, Any, Set
from ..models.schemas import AtributosBase, CalculoRequestSchema, CalculoResponseSchema

# Tabelas base por classe
CLASSE_STATS = {
    "Combatente": {
        "pv_inicial": 20,
        "pv_por_nivel": 4,
        "pe_inicial": 2,
        "pe_por_nivel": 2,
        "san_inicial": 12,
        "san_por_nivel": 3,
    },
    "Especialista": {
        "pv_inicial": 16,
        "pv_por_nivel": 3,
        "pe_inicial": 3,
        "pe_por_nivel": 3,
        "san_inicial": 16,
        "san_por_nivel": 4,
    },
    "Ocultista": {
        "pv_inicial": 12,
        "pv_por_nivel": 2,
        "pe_inicial": 4,
        "pe_por_nivel": 4,
        "san_inicial": 20,
        "san_por_nivel": 5,
    },
}

def calcular_limite_pe(nex: int, regras_ativas: Set[int]) -> int:
    """Calcula o Limite de PE por rodada/turno baseado no NEX."""
    base_pe = max(1, nex // 5)
    if 6 in regras_ativas:
        base_pe += 1
    return base_pe

def calcular_estatisticas_personagem(dados: CalculoRequestSchema) -> CalculoResponseSchema:
    classe = dados.classe.strip().capitalize()
    if classe not in CLASSE_STATS:
        classe = "Combatente"

    cfg = CLASSE_STATS[classe]
    regras = set(dados.regras_ativas)
    passivos_aplicados: List[str] = []

    # Ajuste de NEX e Nível
    nex = dados.nex
    if 83 in regras:
        nex = min(99, nex + 5)
        passivos_aplicados.append("Regra 83: +5% de NEX efetivo")

    # Qtd de níveis de progressão (a cada 5% após o 5% inicial)
    # No NEX 5% = 0 aumentos adicionais de nível, 10% = 1 aumento, ..., 99% = 19 aumentos
    niveis_adicionais = max(0, (nex // 5) - 1)

    # Atributos com bônus passivos
    atributos_finais = AtributosBase(
        FOR=dados.atributos.FOR,
        AGI=dados.atributos.AGI,
        INT=dados.atributos.INT,
        PRE=dados.atributos.PRE,
        VIG=dados.atributos.VIG,
    )

    # 1. PONTOS DE VIDA (PV)
    # Base: Inicial + VIG + (PV_por_nivel + VIG) * niveis_adicionais
    vig = atributos_finais.VIG
    pv_ganho_por_nivel = cfg["pv_por_nivel"]
    if 2 in regras:
        pv_ganho_por_nivel += 1
        passivos_aplicados.append("Regra 2: +1 de Vida por nível de NEX")

    pv_max = (cfg["pv_inicial"] + vig) + ((pv_ganho_por_nivel + vig) * niveis_adicionais)
    pv_max += dados.bonus_pv_vestimentas

    # 2. PONTOS DE ESFORÇO (PE)
    # Base: Inicial + PRE + (PE_por_nivel + PRE) * niveis_adicionais
    pre = atributos_finais.PRE
    pe_max = (cfg["pe_inicial"] + pre) + ((cfg["pe_por_nivel"] + pre) * niveis_adicionais)

    if 6 in regras:
        # Recebe +1 PE e a cada nível ímpar ganha mais 1
        niveis_impares = (niveis_adicionais + 1) // 2
        pe_max += 1 + niveis_impares
        passivos_aplicados.append("Regra 6: +1 PE e bônus em NEX ímpares")

    pe_max += dados.bonus_pe_vestimentas

    # 3. SANIDADE (SAN)
    san_inicial = cfg["san_inicial"]
    if 1 in regras:
        san_inicial = san_inicial // 2
        passivos_aplicados.append("Regra 1: Inicia com metade da Sanidade básica")

    san_max = san_inicial + (cfg["san_por_nivel"] * niveis_adicionais)
    if 7 in regras:
        san_max += (nex // 5)
        passivos_aplicados.append("Regra 7: +1 de Sanidade a cada 5% de NEX")

    # 4. LIMITE DE PE POR RODADA
    pe_rodada = calcular_limite_pe(nex, regras)

    # 5. DEFESA TOTAL
    def_base = 10 + atributos_finais.AGI
    def_outros = dados.defesa_outros

    if 4 in regras:
        def_outros += 2
        passivos_aplicados.append("Regra 4: +2 na defesa")
    if 12 in regras:
        def_outros += 2
        passivos_aplicados.append("Regra 12: +2 na defesa")
    if 21 in regras:
        def_outros += 2
        passivos_aplicados.append("Regra 21: +2 na defesa (Proteção Pesada)")
    if 25 in regras:
        def_outros += 2
        passivos_aplicados.append("Regra 25: +2 na defesa (Proteção Leve)")

    defesa_total = def_base + dados.defesa_equipamentos + def_outros
    esquiva = defesa_total + atributos_finais.AGI
    bloqueio = defesa_total + atributos_finais.FOR

    # 6. DT DE RITUAIS
    dt_rituais = 10 + pe_rodada + atributos_finais.PRE

    # 7. DESLOCAMENTO
    deslocamento = 9
    if 12 in regras:
        deslocamento += 3
    if 22 in regras:
        deslocamento += 3
        passivos_aplicados.append("Regra 22: +3m de deslocamento")
    if 41 in regras:
        deslocamento += 3
        passivos_aplicados.append("Regra 41: +3m de deslocamento")

    # 8. CAPACIDADE DE CARGA
    forca = max(0, atributos_finais.FOR)
    capacidade_carga = 5 * forca if forca > 0 else 2

    return CalculoResponseSchema(
        pv_max=max(1, pv_max),
        pe_max=max(1, pe_max),
        san_max=max(1, san_max),
        pe_rodada=pe_rodada,
        defesa_total=defesa_total,
        esquiva=esquiva,
        bloqueio=bloqueio,
        dt_rituais=dt_rituais,
        deslocamento=deslocamento,
        capacidade_carga=capacidade_carga,
        atributos_finais=atributos_finais,
        passivos_aplicados=passivos_aplicados,
    )
