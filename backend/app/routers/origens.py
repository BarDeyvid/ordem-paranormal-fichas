from fastapi import APIRouter
from typing import List, Dict, Any
from ..db.database import query_table

router = APIRouter(tags=["Origens"])

@router.get("/origens", response_model=List[Dict[str, Any]])
def list_origens():
    return query_table("origens", order_by="Nome")

@router.get("/grupos-origens", response_model=List[Dict[str, Any]])
@router.get("/grupos_origens", response_model=List[Dict[str, Any]])
@router.get("/grupo-de-origens", response_model=List[Dict[str, Any]])
def list_grupos_origens():
    return query_table("grupos_origens", order_by="Codigo_Grupo")
