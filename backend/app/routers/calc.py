from fastapi import APIRouter
from ..models.schemas import CalculoRequestSchema, CalculoResponseSchema
from ..services.calculator import calcular_estatisticas_personagem

router = APIRouter(prefix="/calc", tags=["Cálculos de Personagem"])

@router.post("", response_model=CalculoResponseSchema)
def post_calcular_personagem(dados: CalculoRequestSchema):
    return calcular_estatisticas_personagem(dados)
