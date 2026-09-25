# 📊 Relatório Comparativo: Projeto Original (Upstream) vs. Fork BarDeyvid

Este documento detalha de forma exaustiva todas as diferenças arquiteturais, estruturais, funcionais e o histórico completo de commits entre o repositório original (**Upstream**) e o **Fork de BarDeyvid**.

---

## 📌 1. Visão Geral dos Repositórios

| Propriedade | Projeto Original (Upstream) | Fork BarDeyvid |
| :--- | :--- | :--- |
| **URL do Repositório** | `https://github.com/quackthalia/ordem-paranormal-fichas` | `https://github.com/BarDeyvid/ordem-paranormal-fichas` |
| **Autor Original** | `@quackthalia` | `@BarDeyvid` |
| **Ponto de Divergência (Base)** | Commit `fcb88e9` | Commit `fcb88e9` |
| **Status de Sincronização** | Base com 112 commits integrados | **Totalmente sincronizado com upstream** (113 commits à frente do origin) |
| **Volume de Modificações** | — | **510 arquivos alterados**, **+40.086 inserções**, **-25.126 remoções** |
| **Arquitetura** | Frontend SPA isolado (React + Vite) | **Full-Stack Desacoplado** (FastAPI + React Vite + Docker) |
| **Design System / Componentes** | CSS Inline + Tailwind misto | **Storybook 8** + Componentes atômicos padronizados |
| **Gerenciamento de Fichas** | Ficha única ativa | **Galeria Multi-Fichas** com sincronização e fotos |
| **Regras Paranormais Automáticas** | Parcial (Cálculos estáticos na ficha) | **100% Automatizado** (Dados, Condições, Rituais, Ameaças) |

---

## 🪵 2. Histórico Completo de Commits do Fork

Abaixo está o registro cronológico de todos os 11 commits introduzidos no fork sobre a base da Thalia:

```
33d5495 (2026-09-23) - feat: add bestiary and threat sheets with gm combat tracker
587c3ce (2026-09-23) - feat: add official A4 sheet layout and PDF export preview
c9d1ad4 (2026-09-23) - feat: add active ritual casting, paranormal cost check and resistance DC
637a190 (2026-09-23) - feat: add conditions panel, official debuffs and survival state tracker
044fb1e (2026-09-23) - feat: add integrated dice roller, test tray and 1-click rolls for skills and weapons
0408dd8 (2026-09-23) - fix(storybook): wrap stories in RPGProvider and redesign AgenteCard with full-height portrait
77519b6 (2026-09-23) - feat: add character gallery and multiple sheet management with local and API sync
0e115a2 (2026-09-23) - refactor: componentize sheet panels and add Storybook stories
ee8ea58 (2026-09-23) - feat(storybook): configurar tema escuro e criar stories para CustomSelect, Collapse, InputOtimizado e ElementBadge
920eaff (2026-09-23) - feat: expandir backend com schemas Pydantic, calculador de regras, rolador de dados, CLI e testes pytest
356a5f6 (2026-09-23) - feat: separar frontend e backend (FastAPI), limpar repo e conteinerizar
```

---

## 🔍 3. Detalhamento de Cada Commit

### 1. `356a5f6` — *feat: separar frontend e backend (FastAPI), limpar repo e conteinerizar*
- **Reorganização de Raiz:** Migração da aplicação React da raiz para a pasta modular `frontend/`.
- **Criação do Backend:** Criação da pasta `backend/` com base FastAPI em Python 3.11.
- **Limpeza Profunda:** Remoção de mais de 45 scripts descartáveis e arquivos temporários deixados na raiz (`scratch/*.cjs`, `test-db*.cjs`, `check_db_*.ts`, `temp*.txt`, `temp*.tsx`).
- **Conteinerização:** Criação de `Dockerfile` para frontend (build Vite + Nginx), `Dockerfile` para backend (Python Uvicorn) e `docker-compose.yml` para orquestração com 1 comando.

### 2. `920eaff` — *feat: expandir backend com schemas Pydantic, calculador de regras, rolador de dados, CLI e testes pytest*
- **Modelagem Pydantic:** Modelos formais para Agentes, Atributos, Perícias, Itens, Armas, Rituais e Rolagens de Dados.
- **Motor de Regras Oficial:** Validador e calculador de regras do sistema de Ordem Paranormal RPG em Python.
- **Rolador de Dados do Sistema:** Implementação das mecânicas de rolar `Xd20` mantendo o maior (ou menor se atributo 0), acertos críticos, desastres e modificadores.
- **CLI & Testes:** Interface de linha de comando (`cli.py`) e suíte de testes com `pytest`.

### 3. `ee8ea58` — *feat(storybook): configurar tema escuro e criar stories para CustomSelect, Collapse, InputOtimizado e ElementBadge*
- **Instalação do Storybook 8:** Configuração do ambiente isolado de desenvolvimento de componentes no Frontend.
- **Tema Escuro Paranormal:** Configuração do preview e do manager do Storybook com a paleta do sistema (`zinc-900`, verde paranormal, tipografia idêntica).
- **Stories Iniciais:** Documentação interativa dos componentes centrais (`CustomSelect`, `Collapse`, `InputOtimizado`, `ElementBadge`).

### 4. `0e115a2` — *refactor: componentize sheet panels and add Storybook stories*
- **Desmembramento do Monolito de Inventário:** Divisão do arquivo `InventarioPanel.tsx` (>2.100 linhas) em componentes reutilizáveis, manuteníveis e isolados:
  - `SortableArmaItem.tsx`
  - `SortableProtecaoItem.tsx`
  - `SortableMunicaoItem.tsx`
  - `SortableItemGeral.tsx`
  - `ArmaCombateCard.tsx`
  - `InventarioHeader.tsx`
- **Stories de Inventário:** Adicionadas stories para cada item e bloco de inventário.

### 5. `77519b6` — *feat: add character gallery and multiple sheet management with local and API sync*
- **Galeria de Personagens (`GaleriaScreen.tsx`):**
  - Navegação entre múltiplos agentes da Ordo Realitas.
  - Criação de novos agentes, duplicação de fichas existentes e exclusão com modal de confirmação.
  - Sincronização automática entre `localStorage` e a API backend.
- **Cards de Agente (`AgenteCard.tsx`):**
  - Exibição de resumo: Patente, Classe, Trilha, NEX (%), PV, SAN, PE e Defesa.
  - Indicadores visuais dos 5 atributos principais e botão direto para abrir a ficha.

### 6. `0408dd8` — *fix(storybook): wrap stories in RPGProvider and redesign AgenteCard with full-height portrait*
- **Redesign do AgenteCard:** Inclusão de foto de retrato lateral de altura total com divisor temático.
- **Correção de Contexto no Storybook:** Empacotamento automático de todas as stories dependentes de estado dentro de um `MockRPGProvider` para eliminar erros de execução fora do app principal.

### 7. `044fb1e` — *feat: add integrated dice roller, test tray and 1-click rolls for skills and weapons (Fase 1)*
- **Rolagem de Perícias em 1 Clique:**
  - Clique no nome da perícia executa o teste com a quantidade de d20 do atributo correspondente.
  - Adição automática do modificador de treino (Destreinado +0, Treinado +5, Veterano +10, Expert +15).
  - Identificação visual imediata de Crítico (20 natural) e Desastre (1 natural).
- **Rolagem de Combate de Armas:**
  - Botão de Teste de Ataque (Luta ou Pontaria).
  - Botão de Rolagem de Dano Normal e Dano Crítico com multiplicadores e danos adicionais.
- **Bandeja de Dados Flutuante (`DiceTray.tsx`):**
  - Gaveta retrátil no canto da tela com abas: *Resultado Atual*, *Bandeja Livre* (`d4` a `d100`, vantagens/desvantagens) e *Histórico de Rolagens*.

### 8. `637a190` — *feat: add conditions panel, official debuffs and survival state tracker (Fase 2)*
- **Catálogo Oficial das 29 Condições (`ModalCondicoes.tsx`, `useCondicoes.ts`):**
  - Mentais, Físicas, Sentidos e Sobrevivência com descrições oficiais.
- **Automação Reativa de Penalidades:**
  - *Vulnerável* ou *Desprevenido*: Redução automática de -5 na Defesa.
  - *Fraco* ou *Debilitado*: Penalidade automática de dados em testes de Força e Agilidade.
  - *Lento*: Redução do Deslocamento pela metade.
- **Rastreador de Sobrevivência:**
  - Estados críticos *Morrendo* e *Enlouquecendo*.
  - Botão com 1 clique para rolar teste de sobrevivência contra DT 20 para estabilizar.

### 9. `c9d1ad4` — *feat: add active ritual casting, paranormal cost check and resistance DC (Fase 3)*
- **Painel Ativo de Rituais (`RitualCard.tsx`):**
  - Botão interativo **`🔮 Conjurar`**.
  - Dedução automática de PE do agente (consumindo PE temporário primeiro).
  - Validação estrita de limite de PE por turno (`peTurno`) e verificação de condições impeditivas (*Perturbado*).
- **Custo do Paranormal Automatizado:**
  - Disparo automático do teste de Ocultismo contra DT `20 + PE gastos`.
  - Redução direta da Sanidade em caso de falha no teste de resistência mental.
- **DT de Resistência Dinâmica:**
  - Cálculo oficial da DT da criatura (`10 + peTurno + PRE`, ou INT para a trilha Graduado).
  - Botão de rolagem direta de dano/cura do ritual no `DiceTray`.

### 10. `587c3ce` — *feat: add official A4 sheet layout and PDF export preview (Fase 4)*
- **Folhas de Impressão Oficiais A4 (`src/components/PrintA4/`):**
  - **Página 1 (Frente - `FichaA4Page1.tsx`):** Identificação oficial, atributos em destaque, barras vitais (PV, SAN, PE), defesas, proteções e tabela completa das 28 perícias em 2 colunas.
  - **Página 2 (Verso - `FichaA4Page2.tsx`):** Tabela de armas e ataques com linhas para anotação, poderes e habilidades, grimório de rituais com DTs, inventário com cálculo de carga e anotações da missão.
- **Estilos `@media print` Otimizados (`src/index.css`):**
  - Fundo 100% branco para máxima economia de tinta e toner.
  - Ocultamento de elementos interativos da interface (dados, botões, modais).
  - Quebra de página exata em 2 folhas A4.
- **Modal de Pré-visualização (`ModalPrintPreview.tsx`):**
  - Alternância de páginas e disparo nativo de impressão/geração de PDF (`window.print()`).

### 11. `33d5495` — *feat: add bestiary and threat sheets with gm combat tracker (Fase 5)*
- **Catálogo de 19 Ameaças Paranormais (`src/data/ameacas.ts`):**
  - Criaturas oficiais cobrindo todos os 5 elementos (Sangue, Morte, Conhecimento, Energia, Medo) e níveis de VD de 20 a 380 (incluindo as 4 Relíquias do Outro Lado).
- **Ficha Rápida com Combat Tracker do Mestre (`AmeacaCard.tsx`):**
  - Rastreador de PV interativo com botões rápidos (`-1`, `-5`, `-10`, `+5`, `Resetar`) e barra de vida com cores reativas.
  - Botão `⚔️ Atacar`: rola o ataque da criatura no DiceTray.
  - Botão `💥 Dano`: rola a fórmula de dano com tipos físicos e elementais.
  - Rolagem de Presença Perturbadora com DT oficial.
- **Tela do Bestiário (`BestiarioScreen.tsx`):**
  - Filtro por elemento com as cores temáticas oficiais.
  - Filtro por faixa de VD via `<CustomSelect>`.
  - Layout flexível Masonry de 2 colunas e integração com `<DiceTray>`.

---

## 🏛️ 4. Comparativo de Arquitetura e Engenharia de Software

```
PROJETO ORIGINAL (Upstream):
ordem-paranormal-fichas/
├── src/                          # Frontend React misturado na raiz
│   ├── screens/
│   │   └── Ficha/
│   │       └── InventarioPanel.tsx # Monolito com mais de 2.100 linhas
│   └── ...
├── scratch/                      # Dezenas de scripts temporários (.cjs)
├── test-db*.cjs                  # Arquivos de teste soltos na raiz
└── (sem backend, sem docker, sem storybook)

FORK BARDEYVID:
ordem-paranormal-fichas/
├── backend/                      # Backend desacoplado em Python FastAPI
│   ├── app/
│   │   ├── api/                  # Endpoints REST e WebSockets
│   │   ├── core/                 # Motor de regras e rolador de dados
│   │   ├── models/               # Schemas Pydantic tipados
│   │   └── cli.py                # CLI do sistema
│   ├── tests/                    # Suíte de testes automatizados com pytest
│   └── Dockerfile
├── frontend/                     # Frontend moderno Vite + React
│   ├── .storybook/               # Ambiente Storybook 8 com tema escuro
│   ├── src/
│   │   ├── components/
│   │   │   ├── Bestiario/        # Fichas e cards de ameaças para o mestre
│   │   │   ├── PrintA4/          # Layout oficial A4 de impressão em 2 páginas
│   │   │   ├── DiceTray.tsx      # Gaveta de dados retrátil e histórico
│   │   │   ├── ModalCondicoes.tsx# Painel reativo das 29 condições
│   │   │   ├── CustomSelect.tsx  # Dropdown acessível padronizado
│   │   │   └── Collapse.tsx      # Animações de expansão suaves
│   │   ├── data/
│   │   │   └── ameacas.ts        # Banco de dados com 19 criaturas oficiais
│   │   ├── screens/
│   │   │   ├── BestiarioScreen.tsx# Bestiário completo com filtros e masonry
│   │   │   └── GaleriaScreen.tsx # Gerenciador de múltiplos personagens
│   │   └── stories/              # 16+ arquivos de stories completas
│   └── Dockerfile
├── docker-compose.yml            # Orquestração completa de containers
├── DIFERENCAS_FORK.md            # Este relatório
└── ROADMAP.md                    # Roadmap com as 5 fases 100% concluídas
```

---

## 🎯 5. Matriz de Novas Funcionalidades

| Funcionalidade | Upstream (Original) | Fork BarDeyvid | Detalhes no Fork |
| :--- | :---: | :---: | :--- |
| **Galeria de Personagens** | ❌ Não | ✅ **Sim** | Criação, clonagem, exclusão e troca de fichas com fotos |
| **Rolagem de Dados com 1 Clique** | ❌ Não | ✅ **Sim** | Rola perícias, armas, rituais e monstros no painel de dados |
| **Gaveta de Dados (`DiceTray`)** | ❌ Não | ✅ **Sim** | Bandeja flutuante, seletores rápidos e log de rolagens |
| **Painel de 29 Condições Oficiais** | ❌ Não | ✅ **Sim** | Aplicação automática de debuffs na Defesa, Deslocamento e Testes |
| **Contador de Sobrevivência** | ❌ Não | ✅ **Sim** | Estados *Morrendo* e *Enlouquecendo* com teste DT 20 integrado |
| **Conjuração Ativa de Rituais** | ❌ Não | ✅ **Sim** | Dedução de PE, validação de limites de turno e custo de Sanidade |
| **Folha de Impressão Oficial A4** | ❌ Não | ✅ **Sim** | 2 páginas A4 diagramadas fiéis ao livro, com economia de tinta |
| **Pré-visualizador de PDF** | ❌ Não | ✅ **Sim** | Modal dedicado com alternância de páginas e disparo nativo |
| **Bestiário de Ameaças Paranormais** | ❌ Não | ✅ **Sim** | 19 criaturas oficiais, filtros por VD e Elemento |
| **GM Combat Tracker** | ❌ Não | ✅ **Sim** | Rastreador de PV em tempo real para o mestre conduzir combates |
| **Layout Masonry Responsivo** | ❌ Não | ✅ **Sim** | Cards em 2 colunas sem quebra de layout ao expandir |
| **Animações Fluidas (`Collapse`)** | ⚠️ Parcial | ✅ **Sim** | Padronizado em todos os modais, cards e fichas |
| **Select Customizado (`CustomSelect`)** | ⚠️ Misto | ✅ **Sim** | Sem `<select>` nativo, com animações e pesquisa |
| **Storybook 8 Integrado** | ❌ Não | ✅ **Sim** | Ambiente de documentação e teste visual de componentes |
| **Backend FastAPI + Python** | ❌ Não | ✅ **Sim** | API REST, CLI de terminal, schemas Pydantic e testes pytest |
| **Conteinerização Docker** | ❌ Não | ✅ **Sim** | `docker-compose.yml` para subida instantânea de frontend e backend |

---

## 🚀 6. Como Rodar o Fork

### Opção 1: Via Docker Compose (Recomendado para Full-Stack)
```bash
docker compose up --build
```
- Frontend acessível em: `http://localhost:5173`
- Backend / Documentação OpenAPI Swagger em: `http://localhost:8000/docs`

### Opção 2: Localmente (Frontend)
```bash
cd frontend
npm install
npm run dev
```
Para abrir o Storybook:
```bash
npm run storybook
```

### Opção 3: Localmente (Backend)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Para rodar os testes do backend:
```bash
pytest
```

---

*Relatório gerado em 24 de Setembro de 2026. Todas as alterações foram testadas, validadas via builds e integradas à branch `main` do repositório.*
