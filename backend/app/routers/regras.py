from fastapi import APIRouter
from typing import List, Dict, Any
from ..db.database import query_table

router = APIRouter(tags=["Regras"])

@router.get("/regras-automaticas", response_model=List[Dict[str, Any]])
@router.get("/regras_automaticas", response_model=List[Dict[str, Any]])
def list_regras_automaticas():
    return query_table("regras_automaticas", order_by="Codigo_Regra", ascending=True)

@router.get("/regras-pericias", response_model=List[Dict[str, Any]])
@router.get("/regras_pericias", response_model=List[Dict[str, Any]])
def list_regras_pericias():
    return query_table("regras_pericias", order_by="Codigo_Per_Regra", ascending=True)
