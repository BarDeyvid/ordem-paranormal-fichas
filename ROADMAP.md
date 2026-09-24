# 🗺️ Roadmap de Desenvolvimento — Ordem Paranormal Fichas

Este documento organiza as próximas grandes funcionalidades e marcos arquiteturais do projeto, alinhados com o sistema de regras oficial de **Ordem Paranormal RPG** e a identidade investigativa da **Ordo Realitas**.

---

## 🎯 Prioridades e Fases de Implementação

### 🎲 Fase 1: Rolador de Dados & Painel de Testes Integrado *(Concluída)*
> **Objetivo:** Permitir rolagem imediata de qualquer teste da ficha com um clique, aplicando regras oficiais de dados de atributo, vantagens, desvantagens, margens de crítico e transmissão em tempo real.

- **Testes com 1 Clique em Perícias:**
  - Rolagem automática baseada no valor do atributo: rola `Xd20` e mantém o maior dado (se atributo for 0, rola 2d20 e mantém o menor).
  - Soma automática do grau de treino (Destreinado +0, Treinado +5, Veterano +10, Expert +15), vestimentas, itens e modificadores.
  - Destaque imediato para acertos críticos (20 natural) e desastres (1 natural).
- **Ataque e Dano de Armas no Combate:**
  - Botão de Teste de Ataque usando a perícia correspondente (Luta ou Pontaria) com modificações de arma.
  - Botão de Rolagem de Dano Normal e Dano Crítico com cálculo automático de multiplicadores e danos elementais/paranormais.
- **Bandeja de Rolagem Livre (Dice Tray Flutuante / Retrátil):**
  - Seletor rápido de dados: `d4`, `d6`, `d8`, `d10`, `d12`, `d20`, `d100` com contador, modificador fixo e botão de limpar.
  - Modos Vantagem / Normal / Desvantagem.
- **Histórico & Log de Rolagens:**
  - Histórico detalhado de rolagens com discriminação dos dados individuais, descartados e somas.
  - Sincronização automática com a Mesa Digital (Battlemat / Unreal Engine via WebSocket).
  - Execução híbrida: rolador local offline instantâneo com suporte à API `/api/dice/roll` do FastAPI.

---

### 🩸 Fase 2: Painel de Condições & Estados Paranormais *(Concluída)*
> **Objetivo:** Rastrear condições físicas e mentais que afetam os investigadores, aplicando debuffs automáticos na ficha em tempo real.

- **Catálogo de Condições Oficiais:**
  - *Mentais:* Abalado, Apavorado, Confuso, Fascinado, Perturbado.
  - *Físicas:* Caído, Cego, Debilitado, Desprevenido, Enfeitiçado, Enredado, Esmorecido, Exausto, Fatigado, Fraco, Imóvel, Inconsciente, Indefeso, Lento, Paralisado, Pasmo, Sangrando, Sufocado, Surdo, Vulnerável.
- **Automação de Penalidades:**
  - *Vulnerável / Desprevenido:* Redução automática na Defesa (-5).
  - *Debilitado / Fraco:* Penalidades automáticas nos dados de testes de Força e Agilidade.
  - *Lento:* Redução de deslocamento pela metade.
- **Contador de Sobrevivência:**
  - Rastreamento dos estados *Morrendo* e *Enlouquecendo*.
  - Testes de morte automatizados a cada rodada (DT 20 para estabilizar).

---

### 🔮 Fase 3: Conjuração Ativa de Rituais & Custo do Paranormal *(Concluída)*
> **Objetivo:** Transformar o Grimório em um painel interativo de conjuração ritualística fiel às regras do Outro Lado.

- **Validação de Limites por NEX:**
  - Bloqueio/alerta para rituais além do círculo permitido pelo NEX (1º Círculo no NEX 5%, 2º no NEX 25%, 3º no NEX 55%, 4º no NEX 85%).
  - Validação de gasto máximo de PE por rodada (`peTurno`).
- **Execução do Ritual:**
  - Botão de "Conjurar" que desconta os PE diretamente dos Pontos de Esforço atuais.
  - Seleção da forma de conjuração: *Normal*, *Discente* ou *Verdadeira* com recálculo dinâmico de custo de PE e DT.
- **Custo do Paranormal:**
  - Rolagem automática do teste de Ocultismo contra a DT do ritual (`DT 20 + PE gastos`).
  - Redução automática de Sanidade equivalente ao custo de PE em caso de falha no teste.

---

### 📄 Fase 4: Exportação para PDF / Impressão no Layout Oficial A4 *(Concluída)*
> **Objetivo:** Permitir impressão física e exportação em PDF de alta qualidade para sessões presenciais.

- **Folha de Estilo de Impressão (`@media print`):**
  - Formatação em folha A4 oficial (Frente: Atributos, Perícias, Status, Defesas; Verso: Ataques, Inventário, Rituais e Histórico).
  - Tipografia vetorial e remoção de fundos pretos densos para economia de tinta/toner.
- **Geração de PDF com 1 Clique:**
  - Exportação direta via browser ou renderização vetorial pronta para download.

---

### 👾 Fase 5: Bestiário & Fichas de Ameaças Paranormais (GM Toolkit)
> **Objetivo:** Equipar mestres com ferramentas rápidas para consultar criaturas e conduzir combates.

- **Catálogo de Criaturas por Elemento:**
  - Morte, Sangue, Energia, Conhecimento e Medo (do Zumbi de Sangue ao Anfitrião).
  - Filtro por VD (Valor de Desafio) e Elemento.
- **Ficha Rápida de Monstro:**
  - Visualização de PV, Defesa, RD, Resistências, Vulnerabilidades e Ações de Ataque.
  - Botões para rolar os ataques e habilidades das criaturas diretamente no chat/log de rolagens.

---

*Documento mantido pela equipe de desenvolvimento e atualizado conforme as entregas avançam.*
