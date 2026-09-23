from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
import httpx
from ..core.config import BATTLEMAT_HOST

router = APIRouter(tags=["Battlemat Bridge"])

# In-memory store of token status
token_states: Dict[int, Dict[str, Any]] = {}
cast_history: list[Dict[str, Any]] = []

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

@router.get("/status")
async def get_battlemat_status():
    return {
        "online": True,
        "mode": "Integrated Bridge Server",
        "tokens_tracked": len(token_states),
        "battlemat_host": BATTLEMAT_HOST
    }

@router.post("/token/status")
async def update_token_status(payload: TokenStatusPayload):
    token_states[payload.token_id] = payload.model_dump()
    return {"success": True, "token_id": payload.token_id}

@router.post("/token/cast")
async def cast_ritual(payload: CastRitualPayload):
    cast_entry = payload.model_dump()
    cast_history.append(cast_entry)
    if len(cast_history) > 100:
        cast_history.pop(0)
    return {
        "success": True,
        "message": f"Ritual '{payload.ritual}' projetado com sucesso!",
        "data": cast_entry
    }

@router.get("/token/states")
def get_all_token_states():
    return token_states
