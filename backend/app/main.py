from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import PROJECT_NAME, VERSION, API_PREFIX, CORS_ORIGINS
from .db.database import init_db
from .routers import (
    armas_router,
    itens_router,
    origens_router,
    pericias_router,
    poderes_router,
    progressao_router,
    protecoes_router,
    rituais_router,
    trilhas_router,
    regras_router,
    battlemat_router,
    fichas_router,
    data_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    init_db()
    yield

app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    description="Backend oficial da aplicação Ordem Paranormal - Fichas",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health checks
@app.get("/health", tags=["Status"])
@app.get(f"{API_PREFIX}/health", tags=["Status"])
def health_check():
    return {
        "status": "healthy",
        "service": PROJECT_NAME,
        "version": VERSION
    }

# Include all API routers
app.include_router(armas_router, prefix=API_PREFIX)
app.include_router(itens_router, prefix=API_PREFIX)
app.include_router(origens_router, prefix=API_PREFIX)
app.include_router(pericias_router, prefix=API_PREFIX)
app.include_router(poderes_router, prefix=API_PREFIX)
app.include_router(progressao_router, prefix=API_PREFIX)
app.include_router(protecoes_router, prefix=API_PREFIX)
app.include_router(rituais_router, prefix=API_PREFIX)
app.include_router(trilhas_router, prefix=API_PREFIX)
app.include_router(regras_router, prefix=API_PREFIX)
app.include_router(battlemat_router, prefix=API_PREFIX)
app.include_router(fichas_router, prefix=API_PREFIX)
app.include_router(data_router, prefix=API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
