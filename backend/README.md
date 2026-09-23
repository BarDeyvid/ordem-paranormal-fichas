# Ordem Paranormal — Backend (FastAPI)

Serviço de API para a aplicação de fichas de **Ordem Paranormal RPG**, construído em **FastAPI**, com banco de dados local SQLite e suporte para sincronização com Supabase e integração com Digital Battlemat.

## Funcionalidades

- **Base de Dados Completa e Autônoma**: Banco de dados SQLite pré-populado com todas as 18 tabelas do sistema de Ordem Paranormal (Armas, Proteções, Rituais, Poderes, Origens, Perícias, Trilhas, etc.).
- **Independência de Chaves**: Roda offline e sem necessidade de conexão externa ou credenciais privadas de terceiros.
- **Armazenamento de Fichas**: Endpoints REST para salvar, listar, carregar e remover fichas de personagens.
- **Bridge com Digital Battlemat**: Endpoints para recepção e transmissão de status (PV, SAN, PE) e lançamento de rituais com miniaturas.
- **Documentação Interativa**: Swagger UI (`/docs`) e ReDoc (`/redoc`) integrados.

## Como Executar

### 1. Usando Python diretamente (Local)

1. Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # No Windows: .venv\Scripts\activate
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Inicie o servidor:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. Acesse a documentação em: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Usando Docker

```bash
docker build -t ordem-backend .
docker run -p 8000:8000 ordem-backend
```

## Principais Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verificação de status da API |
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
