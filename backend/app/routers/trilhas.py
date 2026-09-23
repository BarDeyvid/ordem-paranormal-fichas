from fastapi import APIRouter
from typing import List, Dict, Any, Optional
from ..db.database import query_table

router = APIRouter(prefix="/trilhas", tags=["Trilhas"])

@router.get("", response_model=List[Dict[str, Any]])
def list_trilhas(classe: Optional[str] = None):
    filters = {}
    if classe:
        filters["Classe"] = classe
    return query_table("trilhas", filters=filters, order_by="Nome_Trilha")
