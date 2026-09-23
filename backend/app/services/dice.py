"""
Interpretador e Rolador de Dados para RPG de Mesa
Suporta expressões como 1d20+5, 3d20k1, 2d8+3, margem de ameaça e desastres.
"""

import re
import random
from typing import List, Tuple
from ..models.schemas import RollRequestSchema, RollResponseSchema, DieResult

DICE_PATTERN = re.compile(
    r"^(?P<qtd>\d+)?d(?P<faces>\d+)(?:k(?P<keep>[hl]?\d+))?(?P<mod>[+-]\d+)?$",
    re.IGNORECASE
)

def rolar_dados(dados: RollRequestSchema) -> RollResponseSchema:
    expr = dados.expressao.strip().replace(" ", "").lower()
    match = DICE_PATTERN.match(expr)

    if not match:
        # Se for apenas um número fixo
        try:
            val = int(expr)
            return RollResponseSchema(
                expressao_original=dados.expressao,
                total=val,
                dados_rolados=[],
                modificador=val,
                eh_critico=False,
                eh_desastre=False,
                detalhes=f"Valor constante {val}",
                descricao=dados.descricao or "Teste",
            )
        except ValueError:
            # Fallback seguro para 1d20
            match = DICE_PATTERN.match("1d20")

    qtd = int(match.group("qtd")) if match.group("qtd") else 1
    faces = int(match.group("faces"))
    keep_str = match.group("keep")
    mod_str = match.group("mod")
    modificador = int(mod_str) if mod_str else 0

    # Limites saudáveis
    qtd = min(max(1, qtd), 100)
    faces = min(max(1, faces), 1000)

    # Rolagem de cada dado
    rolagens: List[int] = [random.randint(1, faces) for _ in range(qtd)]
    
    # Determinação de quais dados são mantidos
    # k1 = kh1 = keep highest 1; kl1 = keep lowest 1
    indices_mantidos = set(range(qtd))
    if keep_str:
        keep_lowest = keep_str.startswith("l")
        num_keep_str = keep_str.lstrip("hl")
        num_keep = int(num_keep_str) if num_keep_str else 1
        num_keep = min(num_keep, qtd)

        # Ordena índices baseado no valor do dado
        indices_ordenados = sorted(range(qtd), key=lambda i: rolagens[i], reverse=not keep_lowest)
        indices_mantidos = set(indices_ordenados[:num_keep])

    die_results: List[DieResult] = []
    eh_critico = False
    eh_desastre = False

    for idx, valor in enumerate(rolagens):
        mantido = idx in indices_mantidos
        is_crit = (faces == 20 and valor >= dados.margem_critico and mantido)
        is_fumble = (faces == 20 and valor == 1 and mantido)

        if is_crit:
            eh_critico = True
        if is_fumble:
            eh_desastre = True

        die_results.append(DieResult(
            faces=faces,
            valor=valor,
            mantido=mantido,
            critico=is_crit,
            desastre=is_fumble,
        ))

    soma_mantidos = sum(rolagens[i] for i in indices_mantidos)
    total = soma_mantidos + modificador

    # Formatação dos detalhes
    dados_str = []
    for d in die_results:
        if d.mantido:
            dados_str.append(f"**{d.valor}**" if d.critico else str(d.valor))
        else:
            dados_str.append(f"~~{d.valor}~~")

    detalhes = f"[{', '.join(dados_str)}]"
    if modificador > 0:
        detalhes += f" + {modificador}"
    elif modificador < 0:
        detalhes += f" - {abs(modificador)}"

    return RollResponseSchema(
        expressao_original=dados.expressao,
        total=total,
        dados_rolados=die_results,
        modificador=modificador,
        eh_critico=eh_critico,
        eh_desastre=eh_desastre,
        detalhes=detalhes,
        descricao=dados.descricao or "Rolagem de Dados",
    )
