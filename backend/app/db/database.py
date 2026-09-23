import json
import sqlite3
import os
from typing import Any, Dict, List, Optional
from ..core.config import DB_PATH, JSON_DIR, DATA_DIR

TABLE_MAPPING: Dict[str, str] = {
    # Original Supabase / friendly names to SQLite table names
    "armas": "armas",
    "Armas": "armas",
    "itens": "itens",
    "Itens": "itens",
    "itens_amaldicoados": "itens_amaldicoados",
    "itens-amaldicoados": "itens_amaldicoados",
    "Itens Amaldiçoados": "itens_amaldicoados",
    "maldicoes": "maldicoes",
    "Maldições": "maldicoes",
    "modificacoes": "modificacoes",
    "Modificações": "modificacoes",
    "municoes": "municoes",
    "Munições": "municoes",
    "origens": "origens",
    "Origens": "origens",
    "grupos_origens": "grupos_origens",
    "grupos-origens": "grupos_origens",
    "Grupo de Origens": "grupos_origens",
    "Grupos de Origens": "grupos_origens",
    "pericias": "pericias",
    "Perícias": "pericias",
    "poderes": "poderes",
    "Poderes": "poderes",
    "poderes_paranormais": "poderes_paranormais",
    "poderes-paranormais": "poderes_paranormais",
    "PoderesParanormais": "poderes_paranormais",
    "progressao_nex": "progressao_nex",
    "progressao-nex": "progressao_nex",
    "Progressão NEX": "progressao_nex",
    "protecoes": "protecoes",
    "Proteções": "protecoes",
    "rituais": "rituais",
    "Rituais": "rituais",
    "simbolos_rituais": "simbolos_rituais",
    "simbolos-rituais": "simbolos_rituais",
    "Símbolos Rituais": "simbolos_rituais",
    "trilhas": "trilhas",
    "Trilhas": "trilhas",
    "regras_pericias": "regras_pericias",
    "regras-pericias": "regras_pericias",
    "Regras Perícias": "regras_pericias",
    "regras_automaticas": "regras_automaticas",
    "regras-automaticas": "regras_automaticas",
    "Regras Automáticas": "regras_automaticas",
}

JSON_SOURCE_MAPPING: Dict[str, str] = {
    "armas": "Armas.json",
    "itens": "Itens.json",
    "itens_amaldicoados": "Itens Amaldiçoados.json",
    "maldicoes": "Maldições.json",
    "modificacoes": "Modificações.json",
    "municoes": "Munições.json",
    "origens": "Origens.json",
    "grupos_origens": "Grupo de Origens.json",
    "pericias": "Perícias.json",
    "poderes": "Poderes.json",
    "poderes_paranormais": "PoderesParanormais.json",
    "progressao_nex": "Progressão NEX.json",
    "protecoes": "Proteções.json",
    "rituais": "Rituais.json",
    "simbolos_rituais": "Símbolos Rituais.json",
    "trilhas": "Trilhas.json",
    "regras_pericias": "Regras Perícias.json",
    "regras_automaticas": "Regras Automáticas.json",
}

def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables and seeds from JSON files if not present."""
    conn = get_connection()
    cursor = conn.cursor()

    # Create user character sheets table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS fichas (
            id TEXT PRIMARY KEY,
            nome TEXT,
            classe TEXT,
            nex INTEGER,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            conteudo TEXT
        )
    """)

    for table_name, json_file in JSON_SOURCE_MAPPING.items():
        cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)")
        
        # Check if empty
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        
        if count == 0:
            json_path = JSON_DIR / json_file
            if json_path.exists():
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        cursor.execute(
                            f"INSERT INTO {table_name} (data) VALUES (?)",
                            (json.dumps(item, ensure_ascii=False),)
                        )
                print(f"[DB] Seeded {table_name} with {len(data)} items from {json_file}")

    conn.commit()
    conn.close()

def resolve_table_name(table_name: str) -> str:
    resolved = TABLE_MAPPING.get(table_name)
    if not resolved:
        # Try lowercase with underscores
        clean = table_name.lower().replace(" ", "_").replace("-", "_")
        resolved = TABLE_MAPPING.get(clean, clean)
    return resolved

def query_table(
    table_name: str,
    filters: Optional[Dict[str, Any]] = None,
    order_by: Optional[str] = None,
    ascending: bool = True,
    limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
    real_table = resolve_table_name(table_name)
    conn = get_connection()
    cursor = conn.cursor()

    query = f"SELECT data FROM {real_table}"
    params: List[Any] = []
    where_clauses: List[str] = []

    if filters:
        for key, value in filters.items():
            if value is not None:
                where_clauses.append(f"json_extract(data, '$.{key}') = ?")
                params.append(str(value) if isinstance(value, (int, float)) else value)

    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)

    if order_by:
        dir_str = "ASC" if ascending else "DESC"
        query += f" ORDER BY json_extract(data, '$.{order_by}') {dir_str}"

    if limit is not None and limit > 0:
        query += f" LIMIT {limit}"

    try:
        cursor.execute(query, params)
        rows = cursor.fetchall()
        result = [json.loads(row[0]) for row in rows]
        return result
    except Exception as e:
        print(f"[DB Error] Query failed on {real_table}: {e}")
        return []
    finally:
        conn.close()

def query_single(table_name: str, filters: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    results = query_table(table_name, filters=filters, limit=1)
    return results[0] if results else None

# Fichas Management
def save_ficha(ficha_id: str, nome: str, classe: str, nex: int, conteudo: Dict[str, Any]) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO fichas (id, nome, classe, nex, conteudo)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                nome=excluded.nome,
                classe=excluded.classe,
                nex=excluded.nex,
                conteudo=excluded.conteudo
        """, (ficha_id, nome, classe, nex, json.dumps(conteudo, ensure_ascii=False)))
        conn.commit()
        return True
    finally:
        conn.close()

def list_fichas() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, nome, classe, nex, data_criacao FROM fichas ORDER BY data_criacao DESC")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

def get_ficha(ficha_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM fichas WHERE id = ?", (ficha_id,))
        row = cursor.fetchone()
        if not row:
            return None
        data = dict(row)
        data["conteudo"] = json.loads(data["conteudo"])
        return data
    finally:
        conn.close()

def delete_ficha(ficha_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM fichas WHERE id = ?", (ficha_id,))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()
