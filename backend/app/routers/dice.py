from fastapi import APIRouter, Query
from typing import Optional
from ..models.schemas import RollRequestSchema, RollResponseSchema
from ..services.dice import rolar_dados

router = APIRouter(prefix="/roll", tags=["Rolador de Dados"])

@router.post("", response_model=RollResponseSchema)
def post_roll_dice(dados: RollRequestSchema):
    return rolar_dados(dados)

@router.get("", response_model=RollResponseSchema)
def get_roll_dice(
    expr: str = Query("1d20+5", description="Expressão do dado, ex: 1d20+5, 3d20k1, 2d8+3"),
    critico: int = Query(20, ge=1, le=20, description="Margem de ameaça para crítico"),
    desc: Optional[str] = Query("Teste", description="Propósito do teste")
):
    request = RollRequestSchema(expressao=expr, margem_critico=critico, descricao=desc)
    return rolar_dados(request)
