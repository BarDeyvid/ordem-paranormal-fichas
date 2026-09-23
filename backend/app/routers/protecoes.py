from fastapi import APIRouter
from typing import List, Dict, Any
from ..db.database import query_table

router = APIRouter(prefix="/protecoes", tags=["Proteções"])

@router.get("", response_model=List[Dict[str, Any]])
def list_protecoes():
    return query_table("protecoes", order_by="Nome_Item")
