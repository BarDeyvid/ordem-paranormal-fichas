from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from ..db.database import query_table, query_single

router = APIRouter(prefix="/armas", tags=["Armas"])

@router.get("", response_model=List[Dict[str, Any]])
def list_armas(tipo: Optional[str] = None):
    filters = {}
    if tipo:
        filters["Tipo_Arma"] = tipo
    return query_table("armas", filters=filters, order_by="Nome_Item")

@router.get("/{codigo_arma}", response_model=Dict[str, Any])
def get_arma(codigo_arma: int):
    arma = query_single("armas", {"Codigo_Arma": codigo_arma})
    if not arma:
        raise HTTPException(status_code=404, detail="Arma não encontrada")
    return arma
