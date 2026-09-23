from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..db.database import query_table, query_single

router = APIRouter(prefix="/pericias", tags=["Perícias"])

@router.get("", response_model=List[Dict[str, Any]])
def list_pericias():
    return query_table("pericias", order_by="Nome_Pericia")

@router.get("/{codigo_pericia}", response_model=Dict[str, Any])
def get_pericia(codigo_pericia: int):
    pericia = query_single("pericias", {"Codigo_Pericia": codigo_pericia})
    if not pericia:
        raise HTTPException(status_code=404, detail="Perícia não encontrada")
    return pericia
