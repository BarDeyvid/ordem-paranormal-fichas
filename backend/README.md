# Ordem Paranormal — Backend (FastAPI)

Serviço de API para a aplicação de fichas de **Ordem Paranormal RPG**, construído em **FastAPI**, com banco de dados local SQLite, motor de cálculos de regras oficiais, interpretador de dados e suporte para sincronização com Supabase e integração com Digital Battlemat.

## Funcionalidades

- **Base de Dados Completa e Autônoma**: Banco de dados SQLite pré-populado com todas as 18 tabelas do sistema de Ordem Paranormal (Armas, Proteções, Rituais, Poderes, Origens, Perícias, Trilhas, etc.).
- **Motor de Cálculos de Regras (`calculator.py`)**: Fórmulas oficiais de PV, PE, Sanidade, Limite de PE por Turno, Defesa Total, Esquiva, Bloqueio, DT de Rituais, Deslocamento e Regras Automáticas.
- **Rolador de Dados RPG (`dice.py`)**: Interpretador de expressões (`1d20+5`, `3d20k1`, `2d8+3`), detecção automática de críticos, desastres e detalhamento de cada dado.
- **Tipagem Estrita com Pydantic v2 (`schemas.py`)**: Schemas completos para todas as 18 tabelas e operações da API.
- **Auditoria do Compêndio (`validator.py`)**: Validador de integridade referencial, contagem de registros e consistência dos dados.
- **CLI Integrada (`cli.py`)**: Comandos de terminal para auditar o banco, rodar dados e calcular fichas.
- **Suíte de Testes Automatizados (`tests/`)**: 30 testes com `pytest` cobrindo endpoints, banco, regras de cálculo e rolagem de dados.
- **Bridge com Digital Battlemat**: Endpoints para recepção e transmissão de status (PV, SAN, PE) e lançamento de rituais com miniaturas.
- **Armazenamento de Fichas**: Endpoints REST para salvar, listar, carregar e remover fichas de personagens.
- **Documentação Interativa**: Swagger UI (`/docs`) e ReDoc (`/redoc`) integrados.

---

## Como Executar

### 1. Usando Python diretamente (Local)

1. Crie e ative um ambiente virtual:
   ```bash
   uv venv .venv
   source .venv/bin/activate  # No Windows: .venv\Scripts\activate
   ```

2. Instale as dependências:
   ```bash
   uv pip install -r requirements.txt
   ```

3. Inicie o servidor:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. Acesse a documentação em: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Usando a CLI (Terminal)

```bash
# Auditar a integridade do compêndio
python cli.py audit

# Rolar dados de RPG
python cli.py roll 3d20k1+5

# Calcular estatísticas de um personagem
python cli.py calc --classe Combatente --nex 25 --vigor 3 --forca 2
```

### 3. Rodando os Testes Automatizados

```bash
pytest tests -v
```

### 4. Usando Docker

```bash
docker build -t ordem-backend .
docker run -p 8000:8000 ordem-backend
```

---

## Principais Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verificação de status da API |
| `POST` | `/api/calc` | Calcula PV, PE, Sanidade, Defesa e Bônus de regras |
| `POST/GET` | `/api/roll` | Interpretador e rolador de dados com detalhes |
| `GET` | `/api/audit` | Relatório completo de auditoria do compêndio |
| `GET` | `/api/armas` | Lista todas as armas e estatísticas |
| `GET` | `/api/itens` | Lista itens de inventário e equipamentos |
| `GET` | `/api/itens-amaldicoados` | Itens amaldiçoados pelo Outro Lado |
| `GET` | `/api/maldicoes` | Lista de maldições disponíveis |
| `GET` | `/api/modificacoes` | Modificações para armas e proteções |
| `GET` | `/api/municoes` | Munições para armas de fogo/disparo |
| `GET` | `/api/origens` | Lista de origens e poderes de origem |
| `GET` | `/api/grupos-origens` | Grupos de origens |
| `GET` | `/api/pericias` | Perícias do sistema e atributos associados |
| `GET` | `/api/poderes` | Poderes de classe e gerais (`?classe=...`) |
| `GET` | `/api/poderes-paranormais`| Poderes do Outro Lado por elemento |
| `GET` | `/api/progressao-nex` | Tabela de progressão NEX de 5% a 99% |
| `GET` | `/api/protecoes` | Proteções leves e pesadas |
| `GET` | `/api/rituais` | Rituais por círculo e elemento |
| `GET` | `/api/simbolos-rituais` | Links e dados dos símbolos de rituais |
| `GET` | `/api/trilhas` | Trilhas de Combatente, Especialista e Ocultista |
| `GET` | `/api/regras-automaticas`| Regras automáticas programadas |
| `GET` | `/api/data/{tabela}` | Consulta dinâmica a qualquer tabela |
| `GET/POST`| `/api/fichas` | Salvar e listar fichas salvas |
| `POST` | `/api/token/status` | Bridge: Atualiza status do investigador |
| `POST` | `/api/token/cast` | Bridge: Projeta ritual no tabuleiro digital |
