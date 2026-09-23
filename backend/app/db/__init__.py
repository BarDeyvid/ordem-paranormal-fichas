"""
Database connection and query helpers
"""
from .database import (
    get_connection,
    init_db,
    query_table,
    query_single,
    save_ficha,
    list_fichas,
    get_ficha,
    delete_ficha,
    TABLE_MAPPING,
)

__all__ = [
    "get_connection",
    "init_db",
    "query_table",
    "query_single",
    "save_ficha",
    "list_fichas",
    "get_ficha",
    "delete_ficha",
    "TABLE_MAPPING",
]
