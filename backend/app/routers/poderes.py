from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional, Union
from ..db.database import query_table, query_single

router = APIRouter(tags=["Poderes"])

@router.get("/poderes")
def list_poderes(
    classe: Optional[str] = None,
    codigo_poder: Optional[int] = Query(None, alias="codigo_poder"),
    single: Optional[bool] = False
) -> Any:
    filters: Dict[str, Any] = {}
    if classe:
        filters["Classe"] = classe
    if codigo_poder is not None:
        filters["Codigo_Poder"] = codigo_poder
        if single:
            poder = query_single("poderes", filters)
            if not poder:
                raise HTTPException(status_code=404, detail="Poder não encontrado")
            return poder
    return query_table("poderes", filters=filters, order_by="Nome")

@router.get("/poderes/{codigo_poder}", response_model=Dict[str, Any])
def get_poder(codigo_poder: int):
    poder = query_single("poderes", {"Codigo_Poder": codigo_poder})
    if not poder:
        raise HTTPException(status_code=404, detail="Poder não encontrado")
    return poder

@router.get("/poderes-paranormais", response_model=List[Dict[str, Any]])
@router.get("/poderes_paranormais", response_model=List[Dict[str, Any]])
def list_poderes_paranormais(elemento: Optional[str] = None):
    filters = {}
    if elemento:
        filters["Elemento"] = elemento
    return query_table("poderes_paranormais", filters=filters, order_by="Nome")
