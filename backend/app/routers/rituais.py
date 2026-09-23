from fastapi import APIRouter
from typing import List, Dict, Any, Optional
from ..db.database import query_table

router = APIRouter(tags=["Rituais"])

@router.get("/rituais", response_model=List[Dict[str, Any]])
def list_rituais(circulo: Optional[int] = None, elemento: Optional[str] = None):
    filters = {}
    if circulo is not None:
        filters["Circulo_Ritual"] = circulo
    if elemento:
        filters["Elemento_Ritual"] = elemento
    return query_table("rituais", filters=filters, order_by="Circulo_Ritual", ascending=True)

@router.get("/simbolos-rituais", response_model=List[Dict[str, Any]])
@router.get("/simbolos_rituais", response_model=List[Dict[str, Any]])
def list_simbolos_rituais():
    return query_table("simbolos_rituais", order_by="Codigo_Ritual", ascending=True)
