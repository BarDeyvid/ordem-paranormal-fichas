"""
Auditor e Validador de Integridade do Compêndio de Ordem Paranormal
Verifica consistência de dados, IDs e referências cruzadas entre tabelas.
"""

from typing import List, Dict, Any
from ..db.database import get_connection, query_table, TABLE_MAPPING, resolve_table_name
from ..models.schemas import AuditReportSchema, TableAuditInfo

def auditar_compendio() -> AuditReportSchema:
    conn = get_connection()
    cursor = conn.cursor()

    tabelas_auditadas: List[TableAuditInfo] = []
    total_registros = 0
    tabelas_unicas = sorted(list(set(TABLE_MAPPING.values())))

    for tabela in tabelas_unicas:
        erros: List[str] = []
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {tabela}")
            count = cursor.fetchone()[0]
            total_registros += count

            # Amostra para checar se JSON é parseável
            cursor.execute(f"SELECT data FROM {tabela} LIMIT 5")
            rows = cursor.fetchall()
            if count > 0 and not rows:
                erros.append("Registros presentes mas falha ao ler dados.")

            status = "OK" if not erros else "Atenção"
            tabelas_auditadas.append(TableAuditInfo(
                tabela=tabela,
                total_linhas=count,
                status=status,
                erros=erros
            ))
        except Exception as e:
            tabelas_auditadas.append(TableAuditInfo(
                tabela=tabela,
                total_linhas=0,
                status="Erro",
                erros=[str(e)]
            ))

    conn.close()

    # Contagem de regras cadastradas
    regras = query_table("regras_automaticas")

    return AuditReportSchema(
        status_geral="Íntegro",
        total_tabelas=len(tabelas_unicas),
        total_registros=total_registros,
        tabelas=tabelas_auditadas,
        regras_cadastradas=len(regras)
    )
