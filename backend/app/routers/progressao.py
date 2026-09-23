from fastapi import APIRouter
from typing import List, Dict, Any
from ..db.database import query_table

router = APIRouter(tags=["Progressão NEX"])

@router.get("/progressao-nex", response_model=List[Dict[str, Any]])
@router.get("/progressao_nex", response_model=List[Dict[str, Any]])
def list_progressao_nex():
    return query_table("progressao_nex", order_by="Codigo_Progrecao", ascending=True)
