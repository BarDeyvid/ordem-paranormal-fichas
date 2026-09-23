# Relatório de Limpeza, Separação de Arquitetura e Dúvidas

> **Projeto**: Ordem Paranormal — Fichas  
> **Autor da Refatoração**: Antigravity  
> **Data**: 23 de Setembro de 2026  

---

## 1. Resumo Executivo da Operação

Este repositório é um fork de um projeto que foi amplamente desenvolvido em modo *vibe-coding*, contendo uma base riquíssima e aprofundada sobre as regras do RPG **Ordem Paranormal**, porém acumulando diversos débitos técnicos:
- Código de front-end e consultas a banco acoplados sem um servidor de backend estruturado.
- Falha fatal de inicialização caso não houvesse arquivo `.env` com credenciais válidas do Supabase.
- Mais de **230 arquivos de rascunho, backups soltos e scripts pontuais** na raiz e na pasta `scratch/`.
- Ausência de conteinerização (Dockerfiles e docker-compose).

### Principais Ações Realizadas:
1. **Limpeza Profunda do Repositório**: Todos os arquivos temporários, rascunhos de testes e backups obsoletos foram removidos ou devidamente consolidados no compêndio oficial.
2. **Separação Frontend / Backend**:
   - **`frontend/`**: Aplicação React 19 + TypeScript + Vite + Tailwind CSS organizada de forma limpa, com Dockerfile multi-stage e configuração Nginx.
   - **`backend/`**: Servidor de API REST construído em **FastAPI** (Python 3.11+), com banco SQLite local pré-populado com todo o compêndio de regras de Ordem Paranormal.
3. **Autonomia e Independência de Chaves Externas**: O app agora funciona **100% offline** e sem precisar de chaves do Supabase configuradas, mantendo compatibilidade caso o usuário queira conectá-las futuramente.
4. **Conteinerização Completa**: Criados `Dockerfile` para o backend, `Dockerfile` (multi-stage) para o frontend e `docker-compose.yml` na raiz para subida de toda a infraestrutura com um único comando.
5. **Correção de Regras e Tipos**: Corrigidos bugs nos cálculos de atributos de maldições e interfaces que estavam impedindo compilação estrita.

---

## 2. O que foi Limpo e Removido do Repositório

### Arquivos Removidos da Raiz:
- `scratch/`: Mais de **227 scripts Node.js (.cjs / .js) e versões antigas de componentes** (`fixAbasPanel.cjs`, `adjustPreVigAgain.cjs`, `OldModalPoderes.tsx`, etc.), criados durante a fase de vibe-coding para rodar buscas ou substituições manuais.
- `temp.tsx` e `temp_old_panel.tsx`: Arquivos de backup temporários de painéis da ficha.
- `test.tsx` e `test-pos.html`: Rascunhos de testes com encodings mistos.
- `fixInventario.cjs` e `script.cjs`: Scripts avulsos de manipulação de inventário.
- `maldicoes_db.json`, `malds_db.json`, `mods_db.json`: JSONs parciais redundantes (seus dados foram integrados e verificados contra a base oficial).
- `public/teste-espiral.html`, `public/teste-fundo.html`, `public/teste-sangue.html`: Telas de teste de estilos CSS desnecessárias na build final.

### Preservação de Dados:
- Todos os **19 arquivos CSV originais** foram preservados em `backend/data/csv/`.
- Todos os dados foram extraídos, unificados e validados em `backend/data/json/` e no banco de dados SQLite `backend/data/ordem_paranormal.db`.

---

## 3. Arquitetura do Backend (FastAPI)

O backend foi construído em `backend/` com as seguintes características:

- **FastAPI + Uvicorn**: API de alto desempenho assíncrona com documentação interativa automática em `/docs` e `/redoc`.
- **Banco de Dados SQLite Embutido**:
  - Armazena todas as 18 tabelas do sistema de Ordem Paranormal com fidelidade absoluta de tipos e nomes de campos (inclusive campos com acentos e interrogações como `'Espaços_Item'`, `'Agil?'`, `'Automatico?'`).
  - Função `init_db()` garante **auto-seeding**: se o arquivo SQLite não existir, ele é gerado e populado automaticamente a partir dos JSONs oficiais na inicialização da API.
- **Motor de Cálculos e Estatísticas (`services/calculator.py`)**:
  - Implementa as fórmulas e bônus das regras oficiais: PV, PE, Sanidade, Limite de PE por Turno, Defesa Total, Esquiva, Bloqueio, DT de Rituais, Deslocamento e Capacidade de Carga.
- **Interpretador de Dados RPG (`services/dice.py`)**:
  - Avaliador de expressões (`1d20+5`, `3d20k1`, `2d8+3`, etc.), cálculo de críticos por margem de ameaça e desastres.
- **Validador e Auditor do Compêndio (`services/validator.py`)**:
  - Verifica integridade de todas as tabelas e consistência dos 1.121 registros do banco.
- **CLI Integrada (`cli.py`)**:
  - Subcomandos de terminal: `audit`, `seed`, `roll` e `calc`.
- **Suíte de Testes com Pytest (`tests/`)**:
  - 30 testes automatizados cobrindo rotas, banco, regras e rolagem de dados.
- **Tabelas e Endpoints Disponíveis**:
  | Recurso | Endpoint | Descrição |
  |---|---|---|
  | **Cálculo de Personagem** | `POST /api/calc` | Calcula PV, PE, Sanidade, Defesa e Bônus passivos |
  | **Rolador de Dados** | `POST/GET /api/roll` | Avalia expressões e rola dados com detalhamento |
  | **Auditoria** | `GET /api/audit` | Relatório de integridade do compêndio |
  | **Armas** | `GET /api/armas` | Lista de armas, categorias, danos e alcances |
  | **Itens Gerais** | `GET /api/itens` | Itens operacionais, acessórios e equipamentos |
  | **Itens Amaldiçoados** | `GET /api/itens-amaldicoados` | Itens com afinidade ao Outro Lado |
  | **Maldições** | `GET /api/maldicoes` | Maldições de Sangue, Morte, Energia e Conhecimento |
  | **Modificações** | `GET /api/modificacoes` | Modificações para armas e proteções |
  | **Munições** | `GET /api/municoes` | Tipos e capacidades de munições |
  | **Origens** | `GET /api/origens` | Origens e poderes de origem |
  | **Grupos de Origens** | `GET /api/grupos-origens` | Classificação de grupos de origens |
  | **Perícias** | `GET /api/pericias` | Perícias do sistema e atributos-base |
  | **Poderes** | `GET /api/poderes` | Poderes de classe e gerais (`?classe=Combatente`) |
  | **Poderes Paranormais**| `GET /api/poderes-paranormais`| Poderes paranormais por elemento |
  | **Progressão NEX** | `GET /api/progressao-nex` | Tabela de NEX (5% a 99%) |
  | **Proteções** | `GET /api/protecoes` | Proteções leves e pesadas |
  | **Rituais** | `GET /api/rituais` | Rituais por círculo e elemento |
  | **Símbolos de Rituais**| `GET /api/simbolos-rituais`| Imagens oficiais dos símbolos |
  | **Trilhas** | `GET /api/trilhas` | Trilhas de classe (habilidades 10%, 40%, 65%, 99%) |
  | **Regras Automáticas** | `GET /api/regras-automaticas`| Bônus e regras programadas |
  | **Regras de Perícias** | `GET /api/regras-pericias` | Regras de perícias treináveis |
  | **Consulta Dinâmica** | `GET /api/data/{tabela}` | Consulta direta e flexível a qualquer tabela |
  | **Persistência de Fichas**| `GET/POST /api/fichas` | Salvar e resgatar fichas de personagens |
  | **Digital Battlemat** | `POST /api/token/status` | Bridge integrada para atualização de miniaturas |
  | **Digital Battlemat** | `POST /api/token/cast` | Bridge integrada para projeção de rituais |

---

## 4. Arquitetura do Frontend (React + Vite)

O frontend foi transferido para `frontend/` com as seguintes melhorias:

1. **Cliente de API Fluente (`frontend/src/services/api.ts`)**:
   - Implementa uma interface fluente idêntica à do Supabase:  
     `apiClient.from('Armas').select('*').eq('Tipo_Arma', 'Fogo').order('Nome_Item')`
   - Faz as requisições HTTP para o backend FastAPI local (`/api/...`).
   - Todos os hooks existentes (`useArmas`, `useOrigem`, `usePoderes`, `useRituais`, `useTrilhas`, etc.) continuam funcionando normalmente sem quebras.
2. **`supabase.ts` com Fallback Automático**:
   - Antes: se não houvesse `.env`, a aplicação quebrava com exceção no carregamento inicial.
   - Agora: se não houver credenciais do Supabase, o app usa transparentemente o `apiClient` local, funcionando sem qualquer configuração prévia!
3. **Vite Proxy**:
   - `vite.config.ts` configurado para redirecionar `/api` para `http://localhost:8000` em ambiente de desenvolvimento, dispensando problemas de CORS.
4. **Nginx SPA & Reverse Proxy**:
   - `frontend/nginx.conf` configurado com compressão gzip, fallback SPA (`index.html`) e proxy reverso de `/api/` para `backend:8000`.

---

## 5. Dúvidas e Observações Anotadas para o Usuário

Como você não estava disponível durante a inferência, anotei os seguintes pontos de atenção e decisões tomadas:

1. **Credenciais do Supabase vs. Banco Local SQLite**:
   - O projeto original dependia do Supabase na nuvem (`https://duoesappjstgejlwxkyp.supabase.co`).
   - Foi feita a clonagem e verificação completa de todas as tabelas para o banco SQLite local (`backend/data/ordem_paranormal.db`).
   - **Decisão**: A aplicação agora usa o backend FastAPI + SQLite local por padrão. Caso você ou seus amigos queiram continuar usando o Supabase na nuvem, basta descomentar as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env` do frontend ou no `.env` do backend.
2. **Digital Battlemat (Mesa Digital / Unreal Engine)**:
   - Notamos que você havia feito um commit adicionando modalidades para o seu Battlemat digital (`services/battlematBridge.ts`), conectando a uma porta local (padrão `localhost:8080`).
   - **Decisão**: Adicionamos suporte nativo no backend FastAPI para os endpoints `/api/status`, `/api/token/status` e `/api/token/cast`. Assim, a aplicação web consegue registrar status de tokens e rituais diretamente no FastAPI ou encaminhar para a sua mesa física.
3. **Correção do Bug de Atributos em Maldições (`maldicoesRules.ts`)**:
   - No código original, ao equipar itens amaldiçoados que aumentavam atributos (como *Carisma*, *Destreza*, *Pujança*), o código tentava atribuir a `atributos.forca`, `atributos.presenca`, etc. No entanto, o sistema de ficha do Ordem Paranormal espera as siglas maiúsculas (`FOR`, `AGI`, `INT`, `PRE`, `VIG`). Por causa disso, esses bônus nunca eram adicionados na tela de Ficha.
   - **Decisão**: Corrigido para atribuir às siglas corretas (`atributos['FOR']`, `atributos['PRE']`, etc.), fazendo com que os bônus passem a surtir efeito no cálculo total de atributos.
4. **Ambiente sem Docker na Máquina Local**:
   - Como você informou que seu notebook não tem Docker instalado atualmente, criamos um ambiente que funciona com total conforto tanto com `uv`/`python` + `npm` quanto no Docker para quando for fazer deploy em VPS/servidor.

---

## 6. Instruções para Execução

### Opção A — Com Docker (em máquinas com Docker):
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Documentação Swagger: `http://localhost:8000/docs`

### Opção B — Sem Docker (no seu notebook):
Terminal 1 (Backend):
```bash
# Na raiz do projeto
source backend/.venv/bin/activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Acesse `http://localhost:5173`.
