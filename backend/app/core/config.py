import os
from pathlib import Path
from typing import List

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "ordem_paranormal.db"
JSON_DIR = DATA_DIR / "json"
CSV_DIR = DATA_DIR / "csv"

# API Settings
PROJECT_NAME: str = "Ordem Paranormal - Fichas API"
VERSION: str = "1.0.0"
API_PREFIX: str = "/api"

# CORS
CORS_ORIGINS: List[str] = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

# Optional external connections
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
BATTLEMAT_HOST: str = os.getenv("BATTLEMAT_HOST", "localhost:8080")
