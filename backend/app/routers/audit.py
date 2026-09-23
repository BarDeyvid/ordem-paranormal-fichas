from fastapi import APIRouter
from ..models.schemas import AuditReportSchema
from ..services.validator import auditar_compendio

router = APIRouter(prefix="/audit", tags=["Auditoria do Compêndio"])

@router.get("", response_model=AuditReportSchema)
def get_audit():
    return auditar_compendio()
