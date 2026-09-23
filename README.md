# Ordem Paranormal — Fichas

Sistema completo de criação e gerenciamento de fichas de personagens para o RPG **Ordem Paranormal**, com arquitetura modular separando **Frontend (React 19 + TypeScript + Vite + Tailwind CSS)** e **Backend (Python FastAPI + SQLite)**, além de suporte completo a **Docker e Docker Compose**.

---

## Estrutura do Repositório

```text
ordem-paranormal-fichas/
├── frontend/                     # Aplicação Web (Interface do Usuário)
│   ├── src/                      # Componentes, Telas, Hooks, Context e Tipos
│   ├── public/                   # Recursos estáticos (ícones, fontes, imagens)
│   ├── Dockerfile                # Build multi-stage (Node 22 + Nginx)
│   ├── nginx.conf                # Configuração do Nginx com reverse proxy para /api/
│   ├── package.json              # Dependências e scripts do frontend
│   └── vite.config.ts            # Configuração do Vite com proxy para o backend local
│
├── backend/                      # API REST em FastAPI
│   ├── app/                      # Código da API
│   │   ├── main.py               # Ponto de entrada FastAPI, CORS e rotas
│   │   ├── core/config.py        # Configurações de ambiente e caminhos
│   │   ├── db/database.py        # Conexão SQLite, auto-seeding e queries
│   │   └── routers/              # Rotas modulares (armas, itens, rituais, poderes, etc.)
│   ├── data/                     # Dados do RPG
│   │   ├── ordem_paranormal.db   # Banco de dados SQLite pré-populado
│   │   ├── json/                 # 18 tabelas oficiais exportadas em JSON
│   │   └── csv/                  # CSVs originais do sistema preservados
│   ├── Dockerfile                # Imagem Python 3.11-slim para a API
│   ├── requirements.txt          # Dependências Python (FastAPI, Uvicorn, Pydantic, etc.)
│   └── .env.example              # Modelo de variáveis de ambiente do backend
│
├── docker-compose.yml            # Orquestração de frontend e backend em containers
├── RELATORIO_E_DUVIDAS.md        # Relatório de limpeza, decisões técnicas e anotações
└── README.md                     # Esta documentação
```

---

## Como Rodar

Você pode rodar o projeto de duas formas: **via Docker Compose** (recomendado em produção/deploy) ou **localmente sem Docker** (usando Node e Python/uv).

---

### Opção 1: Com Docker Compose (Recomendado)

Se você tiver o Docker instalado, basta um único comando na raiz do projeto:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Documentação Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)

Para parar:
```bash
docker compose down
```

---

### Opção 2: Localmente sem Docker

#### 1. Iniciar o Backend (FastAPI)

Na raiz do repositório:

```bash
# Criar e ativar o ambiente virtual (usando uv ou python venv)
uv venv backend/.venv
source backend/.venv/bin/activate  # No Windows: backend\.venv\Scripts\activate

# Instalar dependências
uv pip install -r backend/requirements.txt

# Iniciar o servidor
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

O backend estará ativo em [http://localhost:8000](http://localhost:8000) e os dados do compêndio estarão disponíveis imediatamente via SQLite local.

#### 2. Iniciar o Frontend (Vite)

Em outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse o frontend em [http://localhost:5173](http://localhost:5173). As chamadas para `/api/` são automaticamente encaminhadas pelo Vite para `http://localhost:8000`.

---

## Funcionalidades e Sistemas

- **Criação Guiada**: Escolha sequencial de Atributos, Origem, Classe e Ficha Completa.
- **Progressão de NEX**: Sistema que acompanha o Nível de Exposição Paranormal do personagem, destravando Habilidades, Poderes e Aumentos de Atributo.
- **Grimório de Rituais**: Filtros por círculo, elemento, custo de PE e cálculo automático de Limite de PE por turno.
- **Inventário e Equipamentos**:
  - Armas, Munições e Proteções integradas com a ficha.
  - Drag and Drop para reordenar inventário e agrupar munições às armas.
  - Modificações de Armas e Proteções, Itens Amaldiçoados e Maldições.
  - Controle de Carga, Limite de Itens, Prestígio, Patentes e Crédito.
- **Digital Battlemat (Mesa Digital)**:
  - Envio de atualizações de PV, Sanidade e PE do personagem para o Unreal Engine.
  - Projeção de símbolos de rituais no chão 3D sob o marcador ArUco físico.
- **API REST Modular e Offline**:
  - Todas as 18 tabelas de regras (Armas, Proteções, Rituais, Origens, Poderes, etc.) hospedadas no backend FastAPI com banco SQLite local.
  - Endpoint para salvamento, listagem e carregamento de fichas de personagens.
  - Suporte opcional a sincronização direta com Supabase caso credenciais sejam fornecidas.

---

## Documentação da API

Quando o backend estiver em execução, acesse:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Mais Detalhes

Para entender o processo de refatoração, limpeza dos arquivos temporários e notas sobre o projeto, consulte o arquivo [RELATORIO_E_DUVIDAS.md](RELATORIO_E_DUVIDAS.md).
