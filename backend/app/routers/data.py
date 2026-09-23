from fastapi import APIRouter, HTTPException, Query, Request
from typing import List, Dict, Any, Optional
from ..db.database import query_table, resolve_table_name

router = APIRouter(prefix="/data", tags=["Generic Data Access"])

@router.get("/{table_name}", response_model=List[Dict[str, Any]])
def get_table_data(
    table_name: str,
    request: Request,
    order_by: Optional[str] = None,
    ascending: bool = True,
    limit: Optional[int] = None
):
    # Any extra query parameters become filters on the JSON fields
    query_params = dict(request.query_params)
    for reserved in ["order_by", "ascending", "limit"]:
        query_params.pop(reserved, None)

    filters = query_params if query_params else None
    data = query_table(
        table_name=table_name,
        filters=filters,
        order_by=order_by,
        ascending=ascending,
        limit=limit
    )
    return data
