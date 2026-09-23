from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
from ..db.database import save_ficha, list_fichas, get_ficha, delete_ficha

router = APIRouter(prefix="/fichas", tags=["Fichas de Personagem"])

class FichaPayload(BaseModel):
    id: Optional[str] = None
    nome: Optional[str] = "Investigador Sem Nome"
    classe: Optional[str] = "Investigador"
    nex: Optional[int] = 5
    conteudo: Dict[str, Any]

@router.get("", response_model=List[Dict[str, Any]])
def get_all_fichas():
    return list_fichas()

@router.get("/{ficha_id}", response_model=Dict[str, Any])
def get_single_ficha(ficha_id: str):
    ficha = get_ficha(ficha_id)
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha não encontrada")
    return ficha

@router.post("", response_model=Dict[str, Any])
def create_or_update_ficha(payload: FichaPayload):
    ficha_id = payload.id or str(uuid.uuid4())
    success = save_ficha(
        ficha_id=ficha_id,
        nome=payload.nome or "Investigador Sem Nome",
        classe=payload.classe or "Investigador",
        nex=payload.nex or 5,
        conteudo=payload.conteudo
    )
    if not success:
        raise HTTPException(status_code=500, detail="Erro ao salvar ficha")
    return {"id": ficha_id, "success": True, "message": "Ficha salva com sucesso"}

@router.delete("/{ficha_id}")
def remove_ficha(ficha_id: str):
    success = delete_ficha(ficha_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ficha não encontrada para exclusão")
    return {"success": True, "message": "Ficha removida com sucesso"}
