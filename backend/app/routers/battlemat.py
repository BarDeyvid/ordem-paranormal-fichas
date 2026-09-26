"""Router de Integração do Digital Battlemat e IA de Agentes no Backend do fichas-web."""

import json
import logging
import math
import random
import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# Inclusão da raiz do projeto no sys.path para carregar ai_agents
PROJECT_ROOT = Path(__file__).resolve().parents[4]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ..core.config import BATTLEMAT_HOST, JSON_DIR

logger = logging.getLogger("fichas_web.battlemat")

router = APIRouter(tags=["Battlemat Bridge & Tactical Panel"])

# Modelos Pydantic para requisições
class TokenStatusPayload(BaseModel):
    token_id: int
    nome: str
    classe: str
    pv_atual: int
    pv_max: int
    san_atual: int
    san_max: int
    pe_atual: int
    pe_max: int


class CastRitualPayload(BaseModel):
    token_id: int
    ritual: str
    elemento: str
    alcance: str
    custo_pe: int


class NextTurnPayload(BaseModel):
    narrativa_mestre: Optional[str] = Field("", description="Contexto narrativo do Mestre para o turno")
    token_id: Optional[int] = Field(None, description="Forçar turno de um token específico")


class SpawnThreatPayload(BaseModel):
    nome: str = Field(..., description="Nome da criatura no compêndio oficial")
    grid: Optional[str] = Field(None, description="Coordenada no grid 8x8 (ex: 'D5', 'F6')")
    vd: Optional[int] = Field(None, description="Valor de Dificuldade (VD)")
    custom_pv: Optional[int] = Field(None, description="PV customizado opcional")


class AdvanceRoundPayload(BaseModel):
    round_increment: int = Field(1, description="Quantidade de rodadas a avançar")


# Armazenamento em memória compatível com v1
token_states: Dict[int, Dict[str, Any]] = {}
cast_history: List[Dict[str, Any]] = []


# ============================================================
# GERENCIADOR DA SESSÃO TÁTICA DO BATTLEMAT (INTEGRAÇÃO COM IA)
# ============================================================
class BattlematSessionManager:
    def __init__(self):
        self.orchestrator = None
        self.round: int = 1
        self.turn_index: int = 0
        self.initiative_order: List[int] = []
        self.threats: Dict[int, Dict[str, Any]] = {}
        self.feed_history: List[Dict[str, Any]] = []
        self.compendium_cache: List[Dict[str, Any]] = []

        self._init_compendium()
        self._init_orchestrator()

    def _init_compendium(self):
        """Carrega compêndio de ameaças oficiais."""
        ameacas_path = JSON_DIR / "Ameacas.json"
        if ameacas_path.exists():
            try:
                with open(ameacas_path, "r", encoding="utf-8") as f:
                    self.compendium_cache = json.load(f)
                    return
            except Exception as e:
                logger.error(f"Erro ao carregar Ameacas.json: {e}")

        # Fallback de compêndio padrão
        self.compendium_cache = [
            {
                "id": "zumbi-de-sangue",
                "nome": "Zumbi de Sangue",
                "elemento": "Sangue",
                "vd": 20,
                "tamanho": "Médio",
                "tipo": "Criatura",
                "pv": 45,
                "defesa": 15,
                "deslocamento": "9m",
                "iniciativa": 2,
                "rd": {"Corte": 5, "Impacto": 5, "Balístico": 5},
                "vulnerabilidades": ["Morte"],
                "acoes": [
                    {"nome": "Garras", "tipo": "PADRÃO", "bonus": 5, "dano": "1d8+3", "alcance": "Corpo a corpo"},
                    {"nome": "Mordida", "tipo": "PADRÃO", "bonus": 5, "dano": "1d10+3", "alcance": "Corpo a corpo"},
                ],
                "descricao": "Um cadáver reanimado transbordando de sangue espesso e fervente.",
            },
            {
                "id": "esqueleto-de-lodo",
                "nome": "Esqueleto de Lodo",
                "elemento": "Morte",
                "vd": 20,
                "tamanho": "Médio",
                "tipo": "Criatura",
                "pv": 40,
                "defesa": 14,
                "deslocamento": "9m",
                "iniciativa": 3,
                "rd": {"Perfuração": 5, "Balístico": 5},
                "vulnerabilidades": ["Energia"],
                "acoes": [
                    {"nome": "Toque Entrópico", "tipo": "PADRÃO", "bonus": 5, "dano": "1d8+2", "alcance": "Corpo a corpo"}
                ],
                "descricao": "Ossos cobertos por lodo espiralado, com cinzas flutuando.",
            },
            {
                "id": "anarquico",
                "nome": "Anárquico",
                "elemento": "Energia",
                "vd": 20,
                "tamanho": "Pequeno",
                "tipo": "Criatura",
                "pv": 40,
                "defesa": 16,
                "deslocamento": "12m",
                "iniciativa": 6,
                "rd": {"Eletricidade": 99},
                "vulnerabilidades": ["Conhecimento"],
                "acoes": [
                    {"nome": "Descarga Caótica", "tipo": "PADRÃO", "bonus": 7, "dano": "1d10+4", "alcance": "Curto (9m)"}
                ],
                "descricao": "Uma esfera errática de luz roxa fluorescente e estática crepitante.",
            },
            {
                "id": "existido",
                "nome": "Existido",
                "elemento": "Conhecimento",
                "vd": 20,
                "tamanho": "Médio",
                "tipo": "Criatura",
                "pv": 35,
                "defesa": 14,
                "deslocamento": "9m",
                "iniciativa": 2,
                "rd": {"Mental": 99},
                "vulnerabilidades": ["Sangue"],
                "acoes": [
                    {"nome": "Toque do Esquecimento", "tipo": "PADRÃO", "bonus": 5, "dano": "1d6+3", "alcance": "Corpo a corpo"}
                ],
                "descricao": "Rosto sem feições coberto de sigilos dourados reluzentes.",
            }
        ]

    def _init_orchestrator(self):
        """Inicializa ou reconecta o AgenteGameOrchestrator dos agentes LLM."""
        try:
            from ai_agents.orchestrator import AgenteGameOrchestrator
            self.orchestrator = AgenteGameOrchestrator()
            logger.info("AgenteGameOrchestrator carregado com sucesso.")
        except Exception as e:
            logger.warning(f"Não foi possível inicializar AgenteGameOrchestrator: {e}. Usando modo simulado.")
            self.orchestrator = None

        self.reset_session()

    def reset_session(self):
        """Reinicia a sessão tática para o estado inicial."""
        self.round = 1
        self.turn_index = 0
        self.threats.clear()
        self.feed_history.clear()

        # Ameaça inicial padrão: Zumbi de Sangue (ID 11)
        zumbi_comp = next((c for c in self.compendium_cache if "zumbi" in c["nome"].lower()), None)
        self.threats[11] = {
            "token_id": 11,
            "nome": zumbi_comp["nome"] if zumbi_comp else "Zumbi de Sangue",
            "classe": "Sangue",
            "tipo": "criatura",
            "vd": zumbi_comp.get("vd", 20) if zumbi_comp else 20,
            "pv_atual": zumbi_comp.get("pv", 45) if zumbi_comp else 45,
            "pv_max": zumbi_comp.get("pv", 45) if zumbi_comp else 45,
            "san_atual": 0,
            "san_max": 0,
            "pe_atual": 0,
            "pe_max": 0,
            "defesa": zumbi_comp.get("defesa", 15) if zumbi_comp else 15,
            "grid": "D5",
            "x": 0.4375,
            "y": 0.5625,
            "status": "Ameaça Ativa",
            "acoes": zumbi_comp.get("acoes", []) if zumbi_comp else [
                {"nome": "Garras", "tipo": "PADRÃO", "bonus": 5, "dano": "1d8+3"}
            ],
            "habilidade_especial": zumbi_comp.get("habilidade_especial", "Sede de Sangue") if zumbi_comp else "",
            "descricao": zumbi_comp.get("descricao", "Criatura de Sangue feroz.") if zumbi_comp else "",
        }

        # Sincroniza ameaças com o orchestrator
        if self.orchestrator:
            self.orchestrator.ameacas = [
                {
                    "id": 11,
                    "name": self.threats[11]["nome"],
                    "tipo": "Criatura de Sangue",
                    "grid": self.threats[11]["grid"],
                    "distancia": "Curta (2 quadrados)",
                    "pv": self.threats[11]["pv_atual"],
                }
            ]

        # Ordem de iniciativa padrão: Investigadores principais primeiro, depois criaturas
        # Arthur (#1), Kaiser (#2), Dante (#3), Zumbi (#11)
        self.initiative_order = [1, 2, 3, 11]

        # Mensagem de abertura do Mestre
        self._add_feed_entry(
            token_id=0,
            autor="O Mestre",
            classe="Mestre",
            tipo="mestre",
            pensamento="A Membrana na sala está em Ruptura. O combate se inicia.",
            fala="A temperatura despenca e um cheiro metálico sufocante invade o ar. Uma criatura emerge das sombras em D5! Preparem suas ações!",
            acao="Início do Combate - Rodada 1",
            detalhes={"round": 1}
        )

    def _grid_to_coords(self, grid: str) -> tuple[float, float]:
        """Converte coordenadas como 'C3' para X, Y normalizados (0.0 a 1.0)."""
        if not grid or len(grid) < 2:
            return 0.5, 0.5
        col = ord(grid[0].upper()) - ord("A")
        try:
            row = int(grid[1:]) - 1
        except ValueError:
            row = 0
        norm_x = round((col + 0.5) / 8.0, 4)
        norm_y = round((row + 0.5) / 8.0, 4)
        return norm_x, norm_y

    def _coords_to_grid(self, col: int, row: int) -> str:
        """Converte índices 0..7 para formato de grid 'A1'..'H8'."""
        col_clamped = max(0, min(7, col))
        row_clamped = max(0, min(7, row))
        return f"{chr(ord('A') + col_clamped)}{row_clamped + 1}"

    def _grid_to_indices(self, grid: str) -> tuple[int, int]:
        """Converte 'C3' para (col_idx, row_idx)."""
        if not grid or len(grid) < 2:
            return 3, 3
        col = ord(grid[0].upper()) - ord("A")
        try:
            row = int(grid[1:]) - 1
        except ValueError:
            row = 0
        return max(0, min(7, col)), max(0, min(7, row))

    def _add_feed_entry(
        self,
        token_id: int,
        autor: str,
        classe: str,
        tipo: str,
        pensamento: str,
        fala: str,
        acao: str,
        movimento: Optional[Dict[str, Any]] = None,
        detalhes: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Registra uma fala, pensamento ou ação de combate no histórico do feed."""
        entry = {
            "id": str(uuid.uuid4())[:8],
            "timestamp": datetime.now().isoformat(),
            "round": self.round,
            "token_id": token_id,
            "autor": autor,
            "classe": classe,
            "tipo": tipo,  # "investigador" | "criatura" | "mestre"
            "pensamento": pensamento,
            "fala": fala,
            "acao": acao,
            "movimento": movimento,
            "detalhes": detalhes or {},
        }
        self.feed_history.append(entry)
        if len(self.feed_history) > 150:
            self.feed_history.pop(0)
        return entry

    def get_all_tokens(self) -> Dict[int, Dict[str, Any]]:
        """Retorna todos os tokens (investigadores + criaturas) unificados."""
        tokens_map: Dict[int, Dict[str, Any]] = {}

        # 1. Investigadores (do Orchestrator)
        if self.orchestrator:
            for tid, ag in self.orchestrator.agentes.items():
                norm_x, norm_y = self._grid_to_coords(ag.grid)
                tokens_map[tid] = {
                    "token_id": tid,
                    "nome": ag.nome,
                    "classe": ag.classe,
                    "trilha": ag.trilha,
                    "tipo": "investigador",
                    "nex": ag.nex,
                    "pv_atual": ag.pv_atual,
                    "pv_max": ag.pv_max,
                    "san_atual": ag.san_atual,
                    "san_max": ag.san_max,
                    "pe_atual": ag.pe_atual,
                    "pe_max": ag.pe_max,
                    "defesa": ag.defesa,
                    "grid": ag.grid,
                    "x": norm_x,
                    "y": norm_y,
                    "status": "Inconsciente" if ag.pv_atual <= 0 else ("Enlouquecendo" if ag.san_atual <= 0 else "Operante"),
                    "armas": ag.armas,
                    "rituais": ag.rituais,
                    "personalidade": ag.personalidade,
                }
        else:
            # Fallback simulado se orchestrator não estiver importado
            defaults = [
                (1, "Arthur Cervero", "Combatente", "Aniquilador", 28, 32, 14, 20, 6, 10, 17, "C3"),
                (2, "Kaiser", "Especialista", "Infiltrador", 20, 22, 18, 24, 12, 16, 15, "A2"),
                (3, "Dante", "Ocultista", "Graduado", 14, 16, 9, 22, 15, 20, 13, "B1"),
            ]
            for tid, nome, classe, trilha, pv, pvm, san, sanm, pe, pem, df, gr in defaults:
                nx, ny = self._grid_to_coords(gr)
                tokens_map[tid] = {
                    "token_id": tid,
                    "nome": nome,
                    "classe": classe,
                    "trilha": trilha,
                    "tipo": "investigador",
                    "nex": 20,
                    "pv_atual": pv,
                    "pv_max": pvm,
                    "san_atual": san,
                    "san_max": sanm,
                    "pe_atual": pe,
                    "pe_max": pem,
                    "defesa": df,
                    "grid": gr,
                    "x": nx,
                    "y": ny,
                    "status": "Operante",
                    "armas": ["Arma Padrão"],
                    "rituais": [],
                    "personalidade": "Determinado a sobreviver.",
                }

        # 2. Criaturas / Ameaças
        for tid, threat in self.threats.items():
            nx, ny = self._grid_to_coords(threat.get("grid", "D5"))
            threat_copy = dict(threat)
            threat_copy["x"] = nx
            threat_copy["y"] = ny
            threat_copy["status"] = "Derrotado" if threat_copy.get("pv_atual", 1) <= 0 else "Ameaça Ativa"
            tokens_map[tid] = threat_copy

        # 3. Mescla com atualizações do token_states recebidas externamente via /api/token/status
        for tid, ext in token_states.items():
            if tid in tokens_map:
                tokens_map[tid]["pv_atual"] = ext.get("pv_atual", tokens_map[tid]["pv_atual"])
                tokens_map[tid]["pv_max"] = ext.get("pv_max", tokens_map[tid]["pv_max"])
                tokens_map[tid]["san_atual"] = ext.get("san_atual", tokens_map[tid]["san_atual"])
                tokens_map[tid]["san_max"] = ext.get("san_max", tokens_map[tid]["san_max"])
                tokens_map[tid]["pe_atual"] = ext.get("pe_atual", tokens_map[tid]["pe_atual"])
                tokens_map[tid]["pe_max"] = ext.get("pe_max", tokens_map[tid]["pe_max"])

        return tokens_map

    def get_session_state(self) -> Dict[str, Any]:
        """Gera o estado completo da sessão de combate para o frontend."""
        tokens = self.get_all_tokens()

        # Garante que a iniciativa contenha todos os tokens ativos
        valid_order = [tid for tid in self.initiative_order if tid in tokens]
        if not valid_order:
            valid_order = sorted(tokens.keys())
            self.initiative_order = valid_order

        # Token ativo da rodada
        if self.turn_index >= len(valid_order):
            self.turn_index = 0
        active_token_id = valid_order[self.turn_index] if valid_order else 1

        # Lista de iniciativa com metadados para exibição no HUD
        initiative_list = []
        for tid in valid_order:
            tk = tokens.get(tid, {})
            initiative_list.append({
                "token_id": tid,
                "nome": tk.get("nome", f"Token {tid}"),
                "tipo": tk.get("tipo", "investigador"),
                "classe": tk.get("classe", ""),
                "grid": tk.get("grid", "??"),
                "pv_atual": tk.get("pv_atual", 0),
                "pv_max": tk.get("pv_max", 0),
                "ativo": (tid == active_token_id),
                "derrotado": tk.get("pv_atual", 1) <= 0,
            })

        return {
            "online": True,
            "round": self.round,
            "turn_index": self.turn_index,
            "active_token_id": active_token_id,
            "initiative_order": valid_order,
            "initiative": initiative_list,
            "tokens": tokens,
            "grid_size": {"cols": 8, "rows": 8},
            "total_tokens": len(tokens),
            "threats_count": len([t for t in tokens.values() if t.get("tipo") == "criatura" and t.get("pv_atual", 0) > 0]),
            "investigators_count": len([t for t in tokens.values() if t.get("tipo") == "investigador" and t.get("pv_atual", 0) > 0]),
        }

    def advance_turn(self, narrativa_mestre: str = "", forced_token_id: Optional[int] = None) -> Dict[str, Any]:
        """Avança o turno de combate, disparando a IA do agente ou monstro."""
        tokens = self.get_all_tokens()
        valid_order = [tid for tid in self.initiative_order if tid in tokens]
        if not valid_order:
            valid_order = sorted(tokens.keys())
            self.initiative_order = valid_order

        # Determina o token ativo
        if forced_token_id and forced_token_id in valid_order:
            token_id = forced_token_id
            self.turn_index = valid_order.index(forced_token_id)
        else:
            if self.turn_index >= len(valid_order):
                self.turn_index = 0
            token_id = valid_order[self.turn_index]

        acting_token = tokens.get(token_id)
        if not acting_token:
            raise HTTPException(status_code=404, detail=f"Token {token_id} não encontrado na sessão.")

        turn_decision = {}
        feed_entry = {}

        # ----------------------------------------------------
        # CASO 1: TURNO DE INVESTIGADOR (LLM / IA DE AGENTE)
        # ----------------------------------------------------
        if acting_token.get("tipo") == "investigador":
            if self.orchestrator and token_id in self.orchestrator.agentes:
                try:
                    decisao = self.orchestrator.executar_turno_agente(
                        token_id=token_id,
                        narrativa_mestre=narrativa_mestre,
                    )
                    turn_decision = decisao.model_dump()
                except Exception as e:
                    logger.error(f"Erro ao executar turno do agente {token_id}: {e}")
                    turn_decision = {
                        "pensamento": "Mantenho minha posição em alerta contra a ameaça.",
                        "fala": "Atenção equipe! Mantenham a linha de tiro!",
                        "movimento": {"destino_grid": acting_token.get("grid", "C3")},
                        "acao_padrao": {"tipo": "ataque", "arma": acting_token.get("armas", ["Arma"])[0]},
                    }
            else:
                turn_decision = {
                    "pensamento": "Calculo a distância e recarrego meu armamento.",
                    "fala": "Cobram cobertura, vou atacar essa criatura!",
                    "movimento": {"destino_grid": acting_token.get("grid", "C3")},
                    "acao_padrao": {"tipo": "ataque", "arma": acting_token.get("armas", ["Revólver"])[0]},
                }

            # Resumo da Ação
            acao_obj = turn_decision.get("acao_padrao") or {}
            tipo_acao = acao_obj.get("tipo", "ação")
            alvo = acao_obj.get("alvo_nome") or "Ameaça"
            arma_ou_ritual = acao_obj.get("arma") or acao_obj.get("ritual") or ""

            # Se atacou um alvo e há criatura visada, aplica resolução mecânica
            if tipo_acao in ("ataque", "ritual"):
                target_threat = None
                for th in self.threats.values():
                    if th.get("pv_atual", 0) > 0:
                        target_threat = th
                        break

                if target_threat:
                    # Simula acerto e dano no monstro
                    dano_causado = random.randint(8, 18)
                    target_threat["pv_atual"] = max(0, target_threat["pv_atual"] - dano_causado)
                    resumo_acao = (
                        f"{tipo_acao.title()} com {arma_ou_ritual} contra {target_threat['nome']}! "
                        f"Acerto! Causou {dano_causado} de dano ({target_threat['pv_atual']}/{target_threat['pv_max']} PV restantes)."
                    )
                else:
                    resumo_acao = f"{tipo_acao.title()} com {arma_ou_ritual} contra {alvo}."
            else:
                resumo_acao = f"Executou manobra de {tipo_acao} tática."

            feed_entry = self._add_feed_entry(
                token_id=token_id,
                autor=acting_token["nome"],
                classe=acting_token.get("classe", "Investigador"),
                tipo="investigador",
                pensamento=turn_decision.get("pensamento", ""),
                fala=turn_decision.get("fala", ""),
                acao=resumo_acao,
                movimento=turn_decision.get("movimento"),
                detalhes=turn_decision,
            )

        # ----------------------------------------------------
        # CASO 2: TURNO DE CRIATURA / AMEAÇA (IA DO MONSTRO)
        # ----------------------------------------------------
        else:
            threat = self.threats.get(token_id)
            if not threat:
                threat = acting_token

            # Se a criatura já estiver derrotada, pula
            if threat.get("pv_atual", 0) <= 0:
                feed_entry = self._add_feed_entry(
                    token_id=token_id,
                    autor=threat["nome"],
                    classe=threat.get("classe", "Criatura"),
                    tipo="criatura",
                    pensamento="A carcaça paranormal sucumbe sem vida.",
                    fala="*O corpo se dissolve em poças de lodo fumegante...*",
                    acao="Criatura inerte (Derrotada)",
                )
            else:
                # 1. Encontra o investigador vivo mais próximo no grid
                inv_tokens = [
                    t for t in tokens.values()
                    if t.get("tipo") == "investigador" and t.get("pv_atual", 0) > 0
                ]
                target_inv = None
                threat_col, threat_row = self._grid_to_indices(threat.get("grid", "D5"))

                if inv_tokens:
                    # Encontra o mais próximo
                    best_dist = 999.0
                    for inv in inv_tokens:
                        ic, ir = self._grid_to_indices(inv.get("grid", "C3"))
                        dist = math.hypot(threat_col - ic, threat_row - ir)
                        if dist < best_dist:
                            best_dist = dist
                            target_inv = inv
                else:
                    target_inv = None

                # 2. Movimento tático da criatura em direção ao alvo
                new_grid = threat.get("grid", "D5")
                if target_inv:
                    tc, tr = self._grid_to_indices(target_inv.get("grid", "C3"))
                    # Dá um passo de 1 quadrado na direção do alvo
                    step_c = threat_col + (1 if tc > threat_col else (-1 if tc < threat_col else 0))
                    step_r = threat_row + (1 if tr > threat_row else (-1 if tr < threat_row else 0))
                    new_grid = self._coords_to_grid(step_c, step_r)
                    threat["grid"] = new_grid
                    nx, ny = self._grid_to_coords(new_grid)
                    threat["x"] = nx
                    threat["y"] = ny

                    # Despacha UDP se orchestrator bridge estiver disponível
                    if self.orchestrator and hasattr(self.orchestrator, "bridge"):
                        self.orchestrator.bridge.move_token_in_unreal(token_id, "criatura", nx, ny)

                # 3. Ataque da criatura
                acoes_disponiveis = threat.get("acoes") or [{"nome": "Garras", "bonus": 5, "dano": "1d8+3"}]
                ataque_escolhido = acoes_disponiveis[0]
                bonus_ataque = int(ataque_escolhido.get("bonus", 5))
                nome_ataque = ataque_escolhido.get("nome", "Ataque Bestial")

                dado_d20 = random.randint(1, 20)
                total_ataque = dado_d20 + bonus_ataque

                if target_inv:
                    defesa_alvo = target_inv.get("defesa", 15)
                    acerto = total_ataque >= defesa_alvo or dado_d20 == 20
                    target_name = target_inv.get("nome", "Investigador")

                    if acerto:
                        dano = random.randint(6, 14)
                        novo_pv = max(0, target_inv.get("pv_atual", 20) - dano)
                        target_inv["pv_atual"] = novo_pv

                        # Atualiza no orchestrator caso seja personagem ativo
                        if self.orchestrator and target_inv["token_id"] in self.orchestrator.agentes:
                            self.orchestrator.agentes[target_inv["token_id"]].pv_atual = novo_pv
                            self.orchestrator.bridge.update_character_status(
                                token_id=target_inv["token_id"],
                                nome=target_inv["nome"],
                                classe=target_inv["classe"],
                                pv_atual=novo_pv,
                                pv_max=target_inv["pv_max"],
                                san_atual=target_inv["san_atual"],
                                san_max=target_inv["san_max"],
                                pe_atual=target_inv["pe_atual"],
                                pe_max=target_inv["pe_max"],
                            )

                        acao_str = (
                            f"Atacou {target_name} com {nome_ataque}! "
                            f"Rolou {dado_d20}+{bonus_ataque} = {total_ataque} vs Def {defesa_alvo} (Acerto!). "
                            f"Causou {dano} de dano! ({target_name} ficou com {novo_pv}/{target_inv['pv_max']} PV)"
                        )
                    else:
                        acao_str = (
                            f"Tentou atacar {target_name} com {nome_ataque}, "
                            f"mas tirou {total_ataque} e errou a Defesa {defesa_alvo}!"
                        )
                else:
                    acao_str = f"Uivou nas trevas preparando-se para emboscar."

                # Roleplay e diálogos do monstro conforme elemento
                elemento = threat.get("elemento", "Sangue")
                if elemento == "Sangue":
                    grito = f"ROAAAR! *{threat['nome']} arranha as paredes com ferocidade incontrolável!*"
                    pensamento = "Carne fresca... Dor e carne pulsante precisam ser rasgadas."
                elif elemento == "Morte":
                    grito = f"*Um som de relógios quebrando e lodo escorrendo ecoa de {threat['nome']}...*"
                    pensamento = "O tempo deles acabou. O lodo consome cada batimento cardíaco."
                elif elemento == "Energia":
                    grito = f"BZZZZT! *Relâmpagos roxos crepitam enquanto {threat['nome']} distorce a luz ambiente!*"
                    pensamento = "Caos e sobrecarga! Nada permanece estável."
                else:
                    grito = f"*Símbolos dourados e sussurros perturbadores ecoam de {threat['nome']}...*"
                    pensamento = "Eles não suportarão o peso do que está escrito."

                turn_decision = {
                    "pensamento": pensamento,
                    "fala": grito,
                    "movimento": {"destino_grid": new_grid},
                    "acao_padrao": {"tipo": "ataque", "arma": nome_ataque, "alvo_nome": target_inv["nome"] if target_inv else ""},
                }

                feed_entry = self._add_feed_entry(
                    token_id=token_id,
                    autor=threat["nome"],
                    classe=elemento,
                    tipo="criatura",
                    pensamento=pensamento,
                    fala=grito,
                    acao=acao_str,
                    movimento={"destino_grid": new_grid},
                    detalhes={"d20": dado_d20, "ataque": total_ataque},
                )

        # ----------------------------------------------------
        # AVANÇO DA INICIATIVA / RODADA
        # ----------------------------------------------------
        self.turn_index += 1
        if self.turn_index >= len(valid_order):
            self.turn_index = 0
            self.round += 1
            # Notifica virada de rodada
            self._add_feed_entry(
                token_id=0,
                autor="O Mestre",
                classe="Mestre",
                tipo="mestre",
                pensamento=f"Início da Rodada {self.round}. A pressão psicológica aumenta.",
                fala=f"--- FIM DA RODADA {self.round - 1} | INÍCIO DA RODADA {self.round} ---",
                acao=f"Virada de Rodada ({self.round})",
                detalhes={"nova_rodada": self.round},
            )

        updated_session = self.get_session_state()

        return {
            "success": True,
            "previous_acting_token_id": token_id,
            "next_active_token_id": updated_session["active_token_id"],
            "round": self.round,
            "turn_index": self.turn_index,
            "turn_decision": turn_decision,
            "feed_entry": feed_entry,
            "session": updated_session,
        }

    def spawn_threat(
        self,
        nome: str,
        grid: Optional[str] = None,
        vd: Optional[int] = None,
        custom_pv: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Spawna uma nova criatura no grid baseada no compêndio oficial."""
        # 1. Busca no compêndio
        matched = None
        for comp in self.compendium_cache:
            if comp["nome"].lower() == nome.strip().lower() or comp["id"].lower() == nome.strip().lower():
                matched = comp
                break

        if not matched:
            # Busca parcial
            for comp in self.compendium_cache:
                if nome.strip().lower() in comp["nome"].lower():
                    matched = comp
                    break

        if not matched:
            # Criatura padrão se não encontrar
            matched = {
                "id": f"ameaca-{uuid.uuid4().hex[:6]}",
                "nome": nome.strip().title(),
                "elemento": "Medo",
                "vd": vd or 20,
                "pv": custom_pv or 50,
                "defesa": 15,
                "deslocamento": "9m",
                "iniciativa": 3,
                "acoes": [{"nome": "Golpe Sobrenatural", "bonus": 6, "dano": "1d10+4"}],
                "descricao": "Uma entidade desconhecida invocada pela fissura na Membrana.",
            }

        # 2. Atribui ID único (a partir de 11)
        used_ids = list(self.threats.keys())
        if self.orchestrator:
            used_ids.extend(self.orchestrator.agentes.keys())
        new_token_id = max([10] + used_ids) + 1

        # 3. Determina grid cell desocupada
        if not grid:
            occupied = {t.get("grid") for t in self.get_all_tokens().values()}
            candidates = ["E5", "E6", "F5", "F6", "D6", "G5", "G6", "E4", "F4", "H5"]
            grid = next((c for c in candidates if c not in occupied), "F6")

        final_pv = custom_pv or matched.get("pv", 45)
        final_vd = vd or matched.get("vd", 20)
        final_def = matched.get("defesa", 15)
        nx, ny = self._grid_to_coords(grid)

        threat_obj = {
            "token_id": new_token_id,
            "nome": matched["nome"],
            "elemento": matched.get("elemento", "Sangue"),
            "classe": matched.get("elemento", "Sangue"),
            "tipo": "criatura",
            "vd": final_vd,
            "pv_atual": final_pv,
            "pv_max": final_pv,
            "san_atual": 0,
            "san_max": 0,
            "pe_atual": 0,
            "pe_max": 0,
            "defesa": final_def,
            "grid": grid,
            "x": nx,
            "y": ny,
            "status": "Ameaça Ativa",
            "acoes": matched.get("acoes", [{"nome": "Ataque", "bonus": 5, "dano": "1d8+3"}]),
            "habilidade_especial": matched.get("habilidade_especial", ""),
            "descricao": matched.get("descricao", ""),
        }

        self.threats[new_token_id] = threat_obj
        self.initiative_order.append(new_token_id)

        # Sincroniza com orchestrator
        if self.orchestrator:
            self.orchestrator.ameacas.append({
                "id": new_token_id,
                "name": matched["nome"],
                "tipo": f"Criatura de {matched.get('elemento', 'Medo')}",
                "grid": grid,
                "distancia": "Média",
                "pv": final_pv,
            })
            if hasattr(self.orchestrator, "bridge"):
                self.orchestrator.bridge.move_token_in_unreal(new_token_id, "criatura", nx, ny)

        # Mensagem narrativa no Feed
        feed_entry = self._add_feed_entry(
            token_id=0,
            autor="O Mestre",
            classe="Mestre",
            tipo="mestre",
            pensamento=f"Manifestação de {matched['nome']} no grid {grid}.",
            fala=f"A névoa paranormal se adensa... {matched['nome']} (VD {final_vd}) rasteja para a cena na posição {grid}!",
            acao=f"Spawn de Ameaça: {matched['nome']} em {grid}",
            detalhes=threat_obj,
        )

        return {
            "success": True,
            "threat": threat_obj,
            "feed_entry": feed_entry,
            "session": self.get_session_state(),
        }


# Instância global da sessão tática
session_manager = BattlematSessionManager()


# ============================================================
# ENDPOINTS REST DO BATTLEMAT (LEGADO & INTEGRADO)
# ============================================================

@router.get("/status")
@router.get("/battlemat/status")
async def get_battlemat_status():
    """Status geral da ponte e do servidor integrado."""
    return {
        "online": True,
        "mode": "Integrated Bridge & Tactical Engine",
        "tokens_tracked": len(session_manager.get_all_tokens()),
        "round": session_manager.round,
        "battlemat_host": BATTLEMAT_HOST,
        "orchestrator_active": session_manager.orchestrator is not None,
    }


@router.post("/token/status")
async def update_token_status(payload: TokenStatusPayload):
    """Atualização de PV/SAN/PE vinda de fichas web ou atores externos."""
    token_states[payload.token_id] = payload.model_dump()
    return {"success": True, "token_id": payload.token_id}


@router.post("/token/cast")
async def cast_ritual(payload: CastRitualPayload):
    """Dispara efeito visual de ritual projetado na mesa."""
    cast_entry = payload.model_dump()
    cast_history.append(cast_entry)
    if len(cast_history) > 100:
        cast_history.pop(0)

    # Registra no feed tático também
    session_manager._add_feed_entry(
        token_id=payload.token_id,
        autor=f"Token {payload.token_id}",
        classe="Ocultista",
        tipo="investigador",
        pensamento=f"O sigilo de {payload.elemento} foi cravado na Membrana.",
        fala=f"Eu convoco: {payload.ritual}!",
        acao=f"Conjurou ritual '{payload.ritual}' ({payload.elemento}, {payload.custo_pe} PE)",
        detalhes=cast_entry,
    )

    return {
        "success": True,
        "message": f"Ritual '{payload.ritual}' projetado com sucesso!",
        "data": cast_entry,
    }


@router.get("/token/states")
def get_all_token_states():
    """Retorna os estados brutos armazenados."""
    return token_states


# ============================================================
# NOVOS ENDPOINTS TÁTICOS SOLICITADOS NA MISSÃO
# ============================================================

@router.get("/battlemat/session")
async def get_battlemat_session():
    """Retorna o estado completo da batalha (rodada, iniciativa, grid, PV/SAN/PE)."""
    return session_manager.get_session_state()


@router.post("/battlemat/next-turn")
async def advance_battlemat_turn(payload: Optional[NextTurnPayload] = None):
    """Avança a iniciativa e dispara o turno do próximo combatente (agente IA ou monstro)."""
    narrativa = payload.narrativa_mestre if payload else ""
    token_forced = payload.token_id if payload else None
    return session_manager.advance_turn(narrativa_mestre=narrativa, forced_token_id=token_forced)


@router.post("/battlemat/spawn-threat")
async def spawn_battlemat_threat(payload: SpawnThreatPayload):
    """Spawna uma criatura no grid com base no compêndio oficial."""
    return session_manager.spawn_threat(
        nome=payload.nome,
        grid=payload.grid,
        vd=payload.vd,
        custom_pv=payload.custom_pv,
    )


@router.get("/battlemat/feed")
async def get_battlemat_feed(limit: int = 50):
    """Retorna o histórico de falas, pensamentos e ações dos agentes."""
    feed = session_manager.feed_history[-limit:]
    return {
        "success": True,
        "feed": feed,
        "total": len(session_manager.feed_history),
    }


@router.get("/battlemat/compendium")
async def get_threats_compendium():
    """Retorna lista de criaturas oficiais disponíveis para spawn."""
    return {
        "success": True,
        "ameacas": session_manager.compendium_cache,
        "total": len(session_manager.compendium_cache),
    }


@router.post("/battlemat/advance-round")
async def advance_round(payload: Optional[AdvanceRoundPayload] = None):
    """Avança diretamente o contador de rodadas."""
    inc = payload.round_increment if payload else 1
    session_manager.round += inc
    session_manager.turn_index = 0
    session_manager._add_feed_entry(
        token_id=0,
        autor="O Mestre",
        classe="Mestre",
        tipo="mestre",
        pensamento=f"O tempo avança. Rodada {session_manager.round}.",
        fala=f"O Mestre avança o combate para a Rodada {session_manager.round}!",
        acao=f"Avanço Manual de Rodada (+{inc})",
    )
    return session_manager.get_session_state()


@router.post("/battlemat/reset")
async def reset_battlemat_session():
    """Reinicia a batalha para a rodada 1 com posições iniciais."""
    session_manager.reset_session()
    return session_manager.get_session_state()
