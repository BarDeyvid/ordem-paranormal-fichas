import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRPG } from '../context/RPGContext';
import {
  getBattlematSession,
  advanceNextTurn,
  spawnThreat,
  getBattlematFeed,
  getThreatsCompendium,
  advanceRound,
  resetBattlematSession,
  type BattlematSessionState,
  type BattlematToken,
  type BattlematFeedEntry,
  type ThreatCompendiumItem,
} from '../services/battlematBridge';

const GRID_COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const GRID_ROWS = [1, 2, 3, 4, 5, 6, 7, 8];

const ELEMENTO_CORES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Sangue: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-600', glow: 'shadow-[0_0_12px_rgba(220,38,38,0.4)]' },
  Morte: { bg: 'bg-zinc-900/90', text: 'text-zinc-300', border: 'border-zinc-500', glow: 'shadow-[0_0_12px_rgba(113,113,122,0.4)]' },
  Energia: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-500', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]' },
  Conhecimento: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-500', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]' },
  Medo: { bg: 'bg-neutral-950/90', text: 'text-neutral-200', border: 'border-neutral-400', glow: 'shadow-[0_0_15px_rgba(255,255,255,0.2)]' },
  Combatente: { bg: 'bg-rose-950/80', text: 'text-rose-400', border: 'border-rose-600', glow: 'shadow-[0_0_12px_rgba(225,29,72,0.4)]' },
  Especialista: { bg: 'bg-cyan-950/80', text: 'text-cyan-400', border: 'border-cyan-600', glow: 'shadow-[0_0_12px_rgba(8,145,178,0.4)]' },
  Ocultista: { bg: 'bg-indigo-950/80', text: 'text-indigo-400', border: 'border-indigo-600', glow: 'shadow-[0_0_12px_rgba(99,102,241,0.4)]' },
};

export const BattlematScreen: React.FC = () => {
  const { setTelaAtual } = useRPG();

  // Estados principais da sessão
  const [session, setSession] = useState<BattlematSessionState | null>(null);
  const [feed, setFeed] = useState<BattlematFeedEntry[]>([]);
  const [compendium, setCompendium] = useState<ThreatCompendiumItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);

  // Filtros de Feed
  const [feedFilter, setFeedFilter] = useState<'todos' | 'falas' | 'pensamentos' | 'acoes'>('todos');
  const [autoVoice, setAutoVoice] = useState<boolean>(false);

  // Modal de Spawn de Ameaça
  const [modalSpawnOpen, setModalSpawnOpen] = useState<boolean>(false);
  const [spawnSearch, setSpawnSearch] = useState<string>('');
  const [spawnElemento, setSpawnElemento] = useState<string>('Todos');
  const [targetSpawnGrid, setTargetSpawnGrid] = useState<string>('F6');
  const [selectedThreatComp, setSelectedThreatComp] = useState<ThreatCompendiumItem | null>(null);

  // Mensagem contextual para o Mestre
  const [narrativaMestre, setNarrativaMestre] = useState<string>('');

  const feedBottomRef = useRef<HTMLDivElement>(null);

  // Carrega estado inicial da batalha
  const fetchSessionData = async () => {
    try {
      const [sessData, feedData, compData] = await Promise.all([
        getBattlematSession(),
        getBattlematFeed(50),
        getThreatsCompendium().catch(() => ({ ameacas: [] })),
      ]);
      setSession(sessData);
      setFeed(feedData.feed || []);
      setCompendium(compData.ameacas || []);
      if (!selectedTokenId && sessData.active_token_id) {
        setSelectedTokenId(sessData.active_token_id);
      }
    } catch (err) {
      console.error('[Battlemat] Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    const interval = setInterval(() => {
      // Polling suave a cada 5s para sincronizar caso haja atualizações externas
      getBattlematSession().then(setSession).catch(() => {});
      getBattlematFeed(50).then(f => setFeed(f.feed || [])).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll do feed quando novas mensagens chegam
  useEffect(() => {
    feedBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feed]);

  // Síntese de voz para falas (opcional)
  const speakText = (text: string) => {
    if (!autoVoice || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Ignora falha de áudio
    }
  };

  // Avançar Turno
  const handleNextTurn = async () => {
    setActionLoading(true);
    try {
      const res = await advanceNextTurn(narrativaMestre);
      setSession(res.session);
      setFeed(prev => [...prev, res.feed_entry]);
      setSelectedTokenId(res.next_active_token_id);
      setNarrativaMestre('');

      if (res.feed_entry.fala) {
        speakText(res.feed_entry.fala);
      }
    } catch (err: any) {
      alert(`Erro ao avançar turno: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Avançar Rodada
  const handleAdvanceRound = async () => {
    setActionLoading(true);
    try {
      const updated = await advanceRound(1);
      setSession(updated);
      const f = await getBattlematFeed(50);
      setFeed(f.feed || []);
    } catch (err: any) {
      alert(`Erro ao avançar rodada: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Resetar Combate
  const handleResetSession = async () => {
    if (!window.confirm('Deseja realmente reiniciar o combate para a Rodada 1?')) return;
    setActionLoading(true);
    try {
      const resetState = await resetBattlematSession();
      setSession(resetState);
      const f = await getBattlematFeed(50);
      setFeed(f.feed || []);
      setSelectedTokenId(resetState.active_token_id);
    } catch (err: any) {
      alert(`Erro ao resetar: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Spawna criatura
  const handleSpawnThreat = async () => {
    if (!selectedThreatComp) {
      alert('Selecione uma criatura do compêndio.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await spawnThreat({
        nome: selectedThreatComp.nome,
        grid: targetSpawnGrid,
        vd: selectedThreatComp.vd,
      });
      setSession(res.session);
      setFeed(prev => [...prev, res.feed_entry]);
      setModalSpawnOpen(false);
      setSelectedThreatComp(null);
    } catch (err: any) {
      alert(`Erro ao spawnar criatura: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Mapeamento de tokens por coordenada no grid
  const tokensByGrid = useMemo(() => {
    const map: Record<string, BattlematToken[]> = {};
    if (!session?.tokens) return map;
    Object.values(session.tokens).forEach(t => {
      const g = (t.grid || 'A1').toUpperCase();
      if (!map[g]) map[g] = [];
      map[g].push(t);
    });
    return map;
  }, [session?.tokens]);

  // Token inspecionado
  const inspectedToken: BattlematToken | null = useMemo(() => {
    if (!session?.tokens) return null;
    if (selectedTokenId && session.tokens[selectedTokenId]) {
      return session.tokens[selectedTokenId];
    }
    if (session.active_token_id && session.tokens[session.active_token_id]) {
      return session.tokens[session.active_token_id];
    }
    const all = Object.values(session.tokens);
    return all.length > 0 ? all[0] : null;
  }, [session?.tokens, selectedTokenId, session?.active_token_id]);

  // Feed filtrado
  const filteredFeed = useMemo(() => {
    if (feedFilter === 'todos') return feed;
    if (feedFilter === 'falas') return feed.filter(f => f.fala && f.fala.trim().length > 0);
    if (feedFilter === 'pensamentos') return feed.filter(f => f.pensamento && f.pensamento.trim().length > 0);
    if (feedFilter === 'acoes') return feed.filter(f => f.acao && f.acao.trim().length > 0);
    return feed;
  }, [feed, feedFilter]);

  // Criaturas filtradas no modal de spawn
  const filteredCompendium = useMemo(() => {
    return compendium.filter(c => {
      if (spawnElemento !== 'Todos' && c.elemento !== spawnElemento) return false;
      if (spawnSearch.trim()) {
        const q = spawnSearch.toLowerCase();
        return c.nome.toLowerCase().includes(q) || (c.descricao || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [compendium, spawnElemento, spawnSearch]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-zinc-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <span className="font-display tracking-widest text-sm uppercase text-zinc-400">
            Conectando ao Digital Battlemat & Agentes IA...
          </span>
        </div>
      </div>
    );
  }

  const activeToken = session?.tokens && session.active_token_id ? session.tokens[session.active_token_id] : null;

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col p-3 md:p-5 antialiased font-sans">
      <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-4">

        {/* ══════════════════════════════════════════════════════════════
            1. CABEÇALHO TÁTICO
        ══════════════════════════════════════════════════════════════ */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-3 bg-zinc-900/60 p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">⚔️</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-zinc-100">
                  Painel Tático — Digital Battlemat
                </h1>
                <span className="flex items-center gap-1 rounded bg-emerald-950/80 border border-emerald-600/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400 tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  INTEGRADO COM IA
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Orquestrador de Agentes LLM, Visão Computacional ArUco & Unreal Engine
              </p>
            </div>
          </div>

          {/* Indicador de Rodada & Turno Ativo */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-1.5">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Rodada</span>
              <span className="font-display text-lg font-black text-red-500 tracking-wider">
                {String(session?.round || 1).padStart(2, '0')}
              </span>
            </div>

            {activeToken && (
              <div className="flex items-center gap-2 bg-zinc-950 border border-amber-600/60 rounded-lg px-3 py-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Turno:</span>
                <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${activeToken.tipo === 'criatura' ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
                  {activeToken.nome} ({activeToken.grid})
                </span>
              </div>
            )}

            {/* Ações Rápidas de Navegação */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTelaAtual('ficha')}
                className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-200 transition"
                title="Voltar para a Ficha do Investigador"
              >
                <span>📜</span>
                <span>Ficha</span>
              </button>

              <button
                type="button"
                onClick={() => setTelaAtual('galeria')}
                className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-200 transition"
                title="Abrir Galeria de Personagens"
              >
                <span>📂</span>
                <span>Dossiês</span>
              </button>

              <button
                type="button"
                onClick={() => setTelaAtual('bestiario')}
                className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 text-xs font-bold text-purple-300 transition"
                title="Abrir Bestiário"
              >
                <span>👾</span>
                <span>Bestiário</span>
              </button>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════
            2. BARRA DE COMANDO TÁTICO (BOTÕES DE CONTROLE)
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* BOTÃO PRINCIPAL: PRÓXIMO TURNO */}
            <button
              type="button"
              onClick={handleNextTurn}
              disabled={actionLoading}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-xs md:text-sm font-bold uppercase tracking-wider text-white transition shadow-lg ${
                actionLoading
                  ? 'bg-zinc-700 cursor-not-allowed'
                  : 'bg-red-700 hover:bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)] active:scale-95'
              }`}
              title="Avança a iniciativa e dispara o turno do próximo agente ou criatura via IA"
            >
              <span className={actionLoading ? 'animate-spin' : ''}>⚔️</span>
              <span>{actionLoading ? 'Processando IA...' : 'Próximo Turno'}</span>
            </button>

            {/* BOTÃO: SPAWN CRIATURA */}
            <button
              type="button"
              onClick={() => setModalSpawnOpen(true)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 border border-purple-600/70 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-purple-200 transition shadow-sm hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              title="Invocar uma criatura do compêndio oficial para o tabuleiro"
            >
              <span>👾</span>
              <span>Spawn Criatura</span>
            </button>

            {/* BOTÃO: AVANÇAR RODADA */}
            <button
              type="button"
              onClick={handleAdvanceRound}
              disabled={actionLoading}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition"
              title="Avança o contador de rodadas manualmente"
            >
              <span>⏩</span>
              <span>Avançar Rodada</span>
            </button>

            {/* BOTÃO: RESETAR BATALHA */}
            <button
              type="button"
              onClick={handleResetSession}
              disabled={actionLoading}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 border border-zinc-800 hover:border-red-800/80 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-red-300 transition"
              title="Reinicia combate para rodada 1"
            >
              <span>🔄</span>
              <span>Resetar</span>
            </button>
          </div>

          {/* Controles de Voz & Narração do Mestre */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoVoice}
                onChange={e => setAutoVoice(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-500"
              />
              <span>Voz Ativa (TTS)</span>
            </label>

            {/* Campo de Sussurro / Diretriz do Mestre */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={narrativaMestre}
                onChange={e => setNarrativaMestre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNextTurn()}
                placeholder="Diretriz / Narração do Mestre para o turno..."
                className="w-56 md:w-80 rounded bg-zinc-950 border border-zinc-700/80 px-2.5 py-1 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. CORPO PRINCIPAL: GRID 8X8 + HUD + FEED DE DIÁLOGOS
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ──────────────────────────────────────────────────────────
              COLUNA 1 (ESQUERDA - 7 COLS): O GRID 8X8 DIGITAL
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-3 rounded-xl bg-zinc-900/60 p-4 border border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-bold uppercase tracking-wider text-zinc-200">
                  🗺️ Matriz Tática (Grid 8x8)
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">1 quadrado = 1.5m</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Investigadores ({session?.investigators_count || 0})
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  Ameaças ({session?.threats_count || 0})
                </span>
              </div>
            </div>

            {/* TABULEIRO 8X8 */}
            <div className="flex flex-col items-center justify-center p-2 bg-zinc-950/80 rounded-lg border border-zinc-800/80 shadow-inner">
              {/* Rótulos das Colunas Superiores (A-H) */}
              <div className="grid grid-cols-8 w-full max-w-[560px] text-center mb-1">
                {GRID_COLS.map(c => (
                  <span key={c} className="font-mono text-xs font-bold text-zinc-500">
                    {c}
                  </span>
                ))}
              </div>

              {/* Linhas e Células */}
              <div className="grid grid-rows-8 gap-1.5 w-full max-w-[560px] aspect-square">
                {GRID_ROWS.map(rowNum => (
                  <div key={rowNum} className="grid grid-cols-8 gap-1.5">
                    {GRID_COLS.map(colChar => {
                      const coord = `${colChar}${rowNum}`;
                      const tokensInCell = tokensByGrid[coord] || [];
                      const hasTokens = tokensInCell.length > 0;
                      const hasActiveToken = tokensInCell.some(t => t.token_id === session?.active_token_id);
                      const isSelected = tokensInCell.some(t => t.token_id === selectedTokenId);

                      return (
                        <div
                          key={coord}
                          onClick={() => {
                            if (hasTokens) {
                              setSelectedTokenId(tokensInCell[0].token_id);
                            } else {
                              setTargetSpawnGrid(coord);
                            }
                          }}
                          className={`relative flex items-center justify-center rounded-md border transition-all cursor-pointer aspect-square ${
                            hasActiveToken
                              ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/80'
                              : isSelected
                              ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                              : hasTokens
                              ? 'border-zinc-700 bg-zinc-900/90 hover:border-zinc-500'
                              : 'border-zinc-800/60 bg-zinc-900/30 hover:bg-zinc-800/40 hover:border-zinc-700'
                          }`}
                          title={`Célula ${coord}${hasTokens ? `: ${tokensInCell.map(t => t.nome).join(', ')}` : ' (Vazia)'}`}
                        >
                          {/* Coordenada sutil no fundo */}
                          <span className="absolute top-0.5 left-1 text-[9px] font-mono text-zinc-600 select-none">
                            {coord}
                          </span>

                          {/* Marcadores de Tokens dentro da célula */}
                          {hasTokens && (
                            <div className="flex items-center justify-center -space-x-2">
                              {tokensInCell.map(token => {
                                const isInvestigator = token.tipo === 'investigador';
                                const isDead = token.pv_atual <= 0;
                                const isActive = token.token_id === session?.active_token_id;
                                const elemConfig = ELEMENTO_CORES[token.classe] || ELEMENTO_CORES['Sangue'];

                                return (
                                  <div
                                    key={token.token_id}
                                    className={`relative flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full border-2 font-display text-[11px] font-black transition-transform ${
                                      isDead
                                        ? 'bg-zinc-900 border-zinc-700 text-zinc-600 line-through opacity-60'
                                        : isInvestigator
                                        ? `${elemConfig.bg} ${elemConfig.border} ${elemConfig.text} ${elemConfig.glow}`
                                        : 'bg-red-950 border-red-500 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                    } ${isActive ? 'scale-110 ring-2 ring-amber-400' : 'hover:scale-105'}`}
                                  >
                                    <span>
                                      {isInvestigator ? token.nome.substring(0, 2).toUpperCase() : '👾'}
                                    </span>

                                    {/* Indicador de Saúde */}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700">
                                      <div
                                        className={`h-full ${token.pv_atual > token.pv_max * 0.5 ? 'bg-emerald-500' : token.pv_atual > 0 ? 'bg-red-500' : 'bg-zinc-700'}`}
                                        style={{ width: `${Math.max(0, Math.min(100, (token.pv_atual / (token.pv_max || 1)) * 100))}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Fila de Iniciativa Horizontal */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Ordem de Iniciativa da Rodada:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {session?.initiative?.map((init, idx) => (
                  <button
                    key={`${init.token_id}-${idx}`}
                    type="button"
                    onClick={() => setSelectedTokenId(init.token_id)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition whitespace-nowrap border ${
                      init.ativo
                        ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                        : init.derrotado
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-600 line-through'
                        : selectedTokenId === init.token_id
                        ? 'bg-zinc-800 border-cyan-500 text-cyan-300'
                        : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{init.tipo === 'criatura' ? '👾' : '👤'}</span>
                    <span>{init.nome}</span>
                    <span className="font-mono text-[10px] text-zinc-500">({init.grid})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              COLUNA 2 (DIREITA - 5 COLS): STATUS EM TEMPO REAL & FEED
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* ══════ CARTÃO DO COMBATENTE SELECIONADO / ATIVO ══════ */}
            {inspectedToken && (
              <div className="flex flex-col gap-3 rounded-xl bg-zinc-900/70 p-4 border border-zinc-800 shadow-md">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 text-base font-bold text-zinc-200">
                      {inspectedToken.tipo === 'criatura' ? '👾' : inspectedToken.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-zinc-100 flex items-center gap-2">
                        {inspectedToken.nome}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-sans">
                          {inspectedToken.classe}
                        </span>
                      </h3>
                      <span className="text-xs text-zinc-400 font-mono">
                        Grid: <b className="text-red-400">{inspectedToken.grid}</b> | Defesa: <b className="text-zinc-200">{inspectedToken.defesa}</b>
                        {inspectedToken.vd ? ` | VD: ${inspectedToken.vd}` : ''}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    inspectedToken.pv_atual <= 0
                      ? 'bg-red-950/80 border-red-700 text-red-300'
                      : 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                  }`}>
                    {inspectedToken.status}
                  </span>
                </div>

                {/* BARRAS DE STATUS COM CORES TEMÁTICAS OFICIAIS */}
                <div className="grid grid-cols-1 gap-2">
                  {/* BARRA DE PV (VERMELHO SANGUE) */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-red-400 flex items-center gap-1">❤️ Pontos de Vida (PV)</span>
                      <span className="font-mono text-zinc-200">
                        {inspectedToken.pv_atual} / {inspectedToken.pv_max}
                      </span>
                    </div>
                    <div className="h-3 w-full rounded bg-zinc-950 border border-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-700 to-rose-600 transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(100, (inspectedToken.pv_atual / (inspectedToken.pv_max || 1)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* BARRAS DE SANIDADE & PE (SE FOR INVESTIGADOR) */}
                  {inspectedToken.tipo === 'investigador' && (
                    <>
                      {/* SANIDADE (ROXO PARANORMAL) */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-purple-400 flex items-center gap-1">🧠 Sanidade (SAN)</span>
                          <span className="font-mono text-zinc-200">
                            {inspectedToken.san_atual} / {inspectedToken.san_max}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded bg-zinc-950 border border-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-700 to-indigo-600 transition-all duration-300"
                            style={{ width: `${Math.max(0, Math.min(100, (inspectedToken.san_atual / (inspectedToken.san_max || 1)) * 100))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* PONTOS DE ESFORÇO (DOURADO / ÂMBAR) */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-amber-400 flex items-center gap-1">⚡ Pontos de Esforço (PE)</span>
                          <span className="font-mono text-zinc-200">
                            {inspectedToken.pe_atual} / {inspectedToken.pe_max}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded bg-zinc-950 border border-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-300"
                            style={{ width: `${Math.max(0, Math.min(100, (inspectedToken.pe_atual / (inspectedToken.pe_max || 1)) * 100))}%` }}
                          ></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Habilidades e Ações Rápidas do Token */}
                <div className="text-xs text-zinc-400">
                  {inspectedToken.tipo === 'criatura' && inspectedToken.acoes && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="font-bold text-zinc-400 text-[11px]">Ataques:</span>
                      {inspectedToken.acoes.map((a, i) => (
                        <span key={i} className="rounded bg-red-950/60 border border-red-800/80 px-2 py-0.5 text-[11px] text-red-300 font-mono">
                          {a.nome} (+{a.bonus || 5}, {a.dano || '1d8'})
                        </span>
                      ))}
                    </div>
                  )}

                  {inspectedToken.tipo === 'investigador' && inspectedToken.armas && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="font-bold text-zinc-400 text-[11px]">Armas:</span>
                      {inspectedToken.armas.map((w, i) => (
                        <span key={i} className="rounded bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300 font-mono">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════ FEED DE DIÁLOGOS, PENSAMENTOS E AÇÕES ══════ */}
            <div className="flex flex-col flex-1 rounded-xl bg-zinc-900/70 p-4 border border-zinc-800 shadow-md">
              <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-2 mb-2 gap-2">
                <span className="font-display text-sm font-bold uppercase tracking-wider text-zinc-200">
                  🎙️ Feed Tático & Interpretação
                </span>

                {/* Filtros de Tipo */}
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {(['todos', 'falas', 'pensamentos', 'acoes'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFeedFilter(f)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                        feedFilter === f
                          ? 'bg-red-700 text-white shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* LISTA DE MENSAGENS COM ROLAGEM */}
              <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredFeed.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500 italic">
                    Nenhum diálogo ou ação registrada ainda. Clique em "Próximo Turno" para iniciar a interpretação dos agentes.
                  </div>
                ) : (
                  filteredFeed.map(item => {
                    const isMestre = item.tipo === 'mestre';
                    const isCriatura = item.tipo === 'criatura';

                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col gap-1.5 p-3 rounded-lg border text-xs transition-all ${
                          isMestre
                            ? 'bg-amber-950/20 border-amber-600/40 text-amber-200'
                            : isCriatura
                            ? 'bg-red-950/30 border-red-800/50 text-red-200'
                            : 'bg-zinc-950/70 border-zinc-800 text-zinc-200'
                        }`}
                      >
                        {/* Cabeçalho da Mensagem */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span>{isMestre ? '👑' : isCriatura ? '👾' : '👤'}</span>
                            <span className={isMestre ? 'text-amber-400' : isCriatura ? 'text-red-400' : 'text-zinc-100'}>
                              {item.autor}
                            </span>
                            <span className="text-[10px] font-normal text-zinc-500">
                              (R{item.round})
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>

                        {/* Monólogo Interno / Pensamento */}
                        {item.pensamento && (feedFilter === 'todos' || feedFilter === 'pensamentos') && (
                          <div className="rounded bg-indigo-950/30 border-l-2 border-indigo-500/80 px-2.5 py-1 text-[11px] italic text-indigo-300">
                            💭 <i>"{item.pensamento}"</i>
                          </div>
                        )}

                        {/* Fala em Voz Alta / Diálogo */}
                        {item.fala && (feedFilter === 'todos' || feedFilter === 'falas') && (
                          <div className="text-zinc-100 font-medium pl-1 border-l-2 border-zinc-600">
                            "{item.fala}"
                          </div>
                        )}

                        {/* Ação Mecânica de Combate */}
                        {item.acao && (feedFilter === 'todos' || feedFilter === 'acoes') && (
                          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400/90 bg-zinc-900/60 p-1.5 rounded border border-zinc-800">
                            <span>⚔️</span>
                            <span>{item.acao}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={feedBottomRef} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: SPAWN CRIATURA / COMPÊNDIO OFICIAL
      ══════════════════════════════════════════════════════════════ */}
      {modalSpawnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="flex flex-col gap-4 w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700 p-5 shadow-2xl max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👾</span>
                <h2 className="font-display font-bold text-lg text-zinc-100 uppercase tracking-wider">
                  Invocar Ameaça no Battlemat
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalSpawnOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Filtros e Busca de Ameaças */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={spawnSearch}
                onChange={e => setSpawnSearch(e.target.value)}
                placeholder="Buscar criatura por nome..."
                className="flex-1 min-w-[200px] rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-red-600"
              />

              <select
                value={spawnElemento}
                onChange={e => setSpawnElemento(e.target.value)}
                className="rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-red-600"
              >
                <option value="Todos">Todos os Elementos</option>
                <option value="Sangue">Sangue</option>
                <option value="Morte">Morte</option>
                <option value="Energia">Energia</option>
                <option value="Conhecimento">Conhecimento</option>
                <option value="Medo">Medo</option>
              </select>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 font-bold">Grid:</span>
                <input
                  type="text"
                  maxLength={2}
                  value={targetSpawnGrid}
                  onChange={e => setTargetSpawnGrid(e.target.value.toUpperCase())}
                  placeholder="F6"
                  className="w-14 rounded-lg bg-zinc-950 border border-zinc-700 px-2 py-1.5 text-xs font-mono font-bold text-center text-red-400 uppercase focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Lista de Criaturas do Compêndio */}
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredCompendium.map(threat => {
                const isSelected = selectedThreatComp?.nome === threat.nome;
                return (
                  <div
                    key={threat.id || threat.nome}
                    onClick={() => setSelectedThreatComp(threat)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-zinc-100">{threat.nome}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                          {threat.elemento}
                        </span>
                        <span className="text-[10px] font-bold text-red-400">VD {threat.vd}</span>
                      </div>
                      <span className="text-xs text-zinc-400 line-clamp-1">{threat.descricao}</span>
                    </div>

                    <div className="text-right text-xs font-mono text-zinc-400 whitespace-nowrap pl-4">
                      <div>PV: <b className="text-zinc-200">{threat.pv}</b></div>
                      <div>Defesa: <b className="text-zinc-200">{threat.defesa}</b></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé do Modal com Botão Confirmar */}
            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <span className="text-xs text-zinc-400 font-mono">
                {selectedThreatComp ? (
                  <>Alvo: <b className="text-red-400">{selectedThreatComp.nome}</b> em <b>{targetSpawnGrid}</b></>
                ) : (
                  'Selecione uma criatura na lista acima.'
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalSpawnOpen(false)}
                  className="rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 transition"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSpawnThreat}
                  disabled={!selectedThreatComp || actionLoading}
                  className={`rounded px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition ${
                    !selectedThreatComp || actionLoading
                      ? 'bg-zinc-700 cursor-not-allowed'
                      : 'bg-red-700 hover:bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                  }`}
                >
                  {actionLoading ? 'Invocando...' : 'Invocar no Tabuleiro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
