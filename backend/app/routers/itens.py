from fastapi import APIRouter
from typing import List, Dict, Any, Optional
from ..db.database import query_table

router = APIRouter(tags=["Itens e Equipamentos"])

@router.get("/itens", response_model=List[Dict[str, Any]])
def list_itens(tipo: Optional[str] = None):
    filters = {}
    if tipo:
        filters["Tipo_Item"] = tipo
    return query_table("itens", filters=filters, order_by="Nome_Item")

@router.get("/itens-amaldicoados", response_model=List[Dict[str, Any]])
@router.get("/itens_amaldicoados", response_model=List[Dict[str, Any]])
def list_itens_amaldicoados():
    return query_table("itens_amaldicoados", order_by="Nome_Item")

@router.get("/maldicoes", response_model=List[Dict[str, Any]])
def list_maldicoes():
    return query_table("maldicoes", order_by="Nome")

@router.get("/modificacoes", response_model=List[Dict[str, Any]])
def list_modificacoes():
    return query_table("modificacoes", order_by="Nome")

@router.get("/municoes", response_model=List[Dict[str, Any]])
def list_municoes():
    return query_table("municoes", order_by="Nome_Item")
