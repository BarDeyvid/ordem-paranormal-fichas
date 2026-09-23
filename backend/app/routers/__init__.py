"""
Routers for all Ordem Paranormal endpoints
"""
from .armas import router as armas_router
from .itens import router as itens_router
from .origens import router as origens_router
from .pericias import router as pericias_router
from .poderes import router as poderes_router
from .progressao import router as progressao_router
from .protecoes import router as protecoes_router
from .rituais import router as rituais_router
from .trilhas import router as trilhas_router
from .regras import router as regras_router
from .battlemat import router as battlemat_router
from .fichas import router as fichas_router
from .data import router as data_router
from .calc import router as calc_router
from .dice import router as dice_router
from .audit import router as audit_router

__all__ = [
    "armas_router",
    "itens_router",
    "origens_router",
    "pericias_router",
    "poderes_router",
    "progressao_router",
    "protecoes_router",
    "rituais_router",
    "trilhas_router",
    "regras_router",
    "battlemat_router",
    "fichas_router",
    "data_router",
    "calc_router",
    "dice_router",
    "audit_router",
]
