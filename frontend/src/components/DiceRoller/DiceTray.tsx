import React, { useState } from 'react';
import { useRPG } from '../../context/RPGContext';
import { DieBadge } from './DieBadge';
import { Collapse } from '../Collapse';

export const DiceTray: React.FC = () => {
  const {
    historicoRolagens,
    ultimaRolagem,
    diceTrayAberto,
    setDiceTrayAberto,
    executarRolagemLivre,
    limparHistoricoRolagens,
  } = useRPG();

  const [abaAtiva, setAbaAtiva] = useState<'resultado' | 'manual' | 'historico'>('resultado');

  // Reseta estado para 'resultado' ao abrir o painel
  React.useEffect(() => {
    if (diceTrayAberto) {
      setAbaAtiva('resultado');
    }
  }, [diceTrayAberto]);

  // Estado da bandeja manual
  const [qtdDado, setQtdDado] = useState<number>(1);
  const [faceEscolhida, setFaceEscolhida] = useState<number>(20);
  const [modificador, setModificador] = useState<number>(0);
  const [modoSelecao, setModoSelecao] = useState<'all' | 'highest' | 'lowest'>('all');

  const handleRolarManual = () => {
    executarRolagemLivre(qtdDado, faceEscolhida, modificador, modoSelecao);
    setAbaAtiva('resultado');
  };

  const facesPadrao = [4, 6, 8, 10, 12, 20, 100];

  return (
    <>
      {/* Botão Flutuante Discreto no Canto Inferior Direito */}
      <button
        type="button"
        onClick={() => setDiceTrayAberto(prev => !prev)}
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 ${
          diceTrayAberto
            ? 'border-emerald-500 bg-zinc-900 text-emerald-400 ring-2 ring-emerald-500/40 shadow-emerald-950/40'
            : ultimaRolagem?.ehCritico
            ? 'border-emerald-500 bg-emerald-950 text-emerald-300 ring-2 ring-emerald-500/60 animate-bounce'
            : ultimaRolagem?.ehDesastre
            ? 'border-red-600 bg-red-950 text-red-300 ring-2 ring-red-500/60 animate-bounce'
            : 'border-zinc-700 bg-zinc-900/90 text-zinc-100 hover:border-zinc-500 hover:text-white'
        }`}
        title="Abrir Rolador de Dados e Histórico de Testes"
      >
        <span className="text-xl leading-none select-none">🎲</span>
        <span className="font-display text-xs font-bold uppercase tracking-wider">
          {ultimaRolagem ? `Total: ${ultimaRolagem.total}` : 'Dados'}
        </span>
      </button>

      {/* Janela Flutuante com Animação Obrigatória Collapse */}
      <div className={`fixed bottom-20 right-4 sm:right-6 z-40 w-[340px] sm:w-[410px] pointer-events-none transition-all duration-300 ${diceTrayAberto ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <Collapse isOpen={diceTrayAberto}>
          <div className="flex flex-col rounded-xl border border-zinc-700/80 bg-zinc-950/95 shadow-2xl backdrop-blur-xl overflow-hidden max-h-[80vh]">
            
            {/* Header do Painel */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎲</span>
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-zinc-100">
                  Painel de Testes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDiceTrayAberto(false)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition text-sm"
                title="Fechar painel"
              >
                ✕
              </button>
            </div>

            {/* Abas Superiores */}
            <div className="flex border-b border-zinc-800 bg-zinc-950 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setAbaAtiva('resultado')}
                className={`flex-1 py-2 text-center transition border-b-2 ${
                  abaAtiva === 'resultado'
                    ? 'border-emerald-500 text-emerald-400 bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Resultado
              </button>
              <button
                type="button"
                onClick={() => setAbaAtiva('manual')}
                className={`flex-1 py-2 text-center transition border-b-2 ${
                  abaAtiva === 'manual'
                    ? 'border-emerald-500 text-emerald-400 bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Bandeja
              </button>
              <button
                type="button"
                onClick={() => setAbaAtiva('historico')}
                className={`flex-1 py-2 text-center transition border-b-2 ${
                  abaAtiva === 'historico'
                    ? 'border-emerald-500 text-emerald-400 bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Histórico ({historicoRolagens.length})
              </button>
            </div>

            {/* Corpo com Scrollbar sem layout shift */}
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 max-h-[55vh]">
              {/* ABA 1: RESULTADO DA ÚLTIMA ROLAGEM */}
              {abaAtiva === 'resultado' && (
                <div>
                  {ultimaRolagem ? (
                    <div className="flex flex-col items-center text-center gap-3">
                      {/* Título & Subtítulo do Teste */}
                      <div>
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                          {ultimaRolagem.tipo.toUpperCase()}
                        </span>
                        <h4 className="text-lg font-bold text-zinc-100 mt-0.5">
                          {ultimaRolagem.titulo}
                        </h4>
                        {ultimaRolagem.subtitulo && (
                          <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                            {ultimaRolagem.subtitulo}
                          </p>
                        )}
                      </div>

                      {/* Banners Especiais de Crítico ou Desastre */}
                      {ultimaRolagem.ehCritico && (
                        <div className="w-full rounded bg-emerald-950/80 border border-emerald-600/80 py-1.5 px-3 text-xs font-black uppercase tracking-widest text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
                          ★ ACERTO CRÍTICO! ★
                        </div>
                      )}
                      {ultimaRolagem.ehDesastre && (
                        <div className="w-full rounded bg-red-950/80 border border-red-600/80 py-1.5 px-3 text-xs font-black uppercase tracking-widest text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
                          ☠ DESASTRE NATURAL ☠
                        </div>
                      )}

                      {/* Display Gigante do Total */}
                      <div className="my-1 flex flex-col items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 w-full shadow-inner">
                        <span className="text-[0.65rem] uppercase font-bold tracking-widest text-zinc-500 mb-1">
                          Resultado Final
                        </span>
                        <span
                          className={`font-mono text-5xl font-black tracking-tight ${
                            ultimaRolagem.ehCritico
                              ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                              : ultimaRolagem.ehDesastre
                              ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]'
                              : 'text-zinc-100'
                          }`}
                        >
                          {ultimaRolagem.total}
                        </span>
                      </div>

                      {/* Dados Individuais Rolados */}
                      <div className="w-full">
                        <span className="text-[0.65rem] uppercase font-bold tracking-wider text-zinc-500 block mb-2 text-left">
                          Dados Rolados:
                        </span>
                        <div className="flex flex-wrap justify-center gap-2">
                          {ultimaRolagem.dados.map((d, i) => (
                            <DieBadge key={i} dado={d} tamanho="md" />
                          ))}
                        </div>
                      </div>

                      {/* Discriminação da Fórmula */}
                      <div className="w-full rounded bg-zinc-950/80 p-2.5 text-xs font-mono text-zinc-400 border border-zinc-800/80 flex justify-between items-center">
                        <span className="text-zinc-500">Cálculo:</span>
                        <span className="text-zinc-300 font-bold">{ultimaRolagem.detalhes}</span>
                      </div>

                      <span className="text-[0.65rem] font-mono text-zinc-600 mt-1">
                        Rolado às {ultimaRolagem.dataHora}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
                      <span className="text-4xl opacity-40 mb-2">🎲</span>
                      <p className="text-sm font-medium">Nenhum dado rolado ainda</p>
                      <p className="text-xs text-zinc-600 mt-1 max-w-[240px]">
                        Clique no dado de uma perícia, ataque de arma ou use a bandeja manual ao lado.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ABA 2: BANDEJA MANUAL DE DADOS */}
              {abaAtiva === 'manual' && (
                <div className="flex flex-col gap-4">
                  {/* Seletor de Tipo de Dado */}
                  <div>
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Tipo de Dado:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {facesPadrao.map((face) => (
                        <button
                          key={face}
                          type="button"
                          onClick={() => setFaceEscolhida(face)}
                          className={`rounded py-1.5 text-xs font-mono font-bold transition border ${
                            faceEscolhida === face
                              ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400 shadow-sm'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-white'
                          }`}
                        >
                          d{face}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantidade e Modificador */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Quantidade:
                      </label>
                      <div className="flex items-center rounded border border-zinc-700 bg-zinc-900">
                        <button
                          type="button"
                          onClick={() => setQtdDado(prev => Math.max(1, prev - 1))}
                          className="px-2.5 py-1 text-sm text-zinc-400 hover:text-white font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={qtdDado}
                          onChange={(e) => setQtdDado(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-full bg-transparent text-center font-mono text-xs font-bold text-zinc-100 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQtdDado(prev => Math.min(20, prev + 1))}
                          className="px-2.5 py-1 text-sm text-zinc-400 hover:text-white font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Modificador:
                      </label>
                      <div className="flex items-center rounded border border-zinc-700 bg-zinc-900">
                        <button
                          type="button"
                          onClick={() => setModificador(prev => prev - 1)}
                          className="px-2.5 py-1 text-sm text-zinc-400 hover:text-white font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={modificador}
                          onChange={(e) => setModificador(parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-transparent text-center font-mono text-xs font-bold text-zinc-100 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setModificador(prev => prev + 1)}
                          className="px-2.5 py-1 text-sm text-zinc-400 hover:text-white font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Modo de Escolha de Dados */}
                  <div>
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Regra de Escolha:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setModoSelecao('all')}
                        className={`rounded py-1 font-bold uppercase tracking-wider transition border ${
                          modoSelecao === 'all'
                            ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Somar Todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoSelecao('highest')}
                        className={`rounded py-1 font-bold uppercase tracking-wider transition border ${
                          modoSelecao === 'highest'
                            ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Pegar Maior
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoSelecao('lowest')}
                        className={`rounded py-1 font-bold uppercase tracking-wider transition border ${
                          modoSelecao === 'lowest'
                            ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Pegar Menor
                      </button>
                    </div>
                  </div>

                  {/* Botão de Rolar */}
                  <button
                    type="button"
                    onClick={handleRolarManual}
                    className="mt-2 w-full rounded bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-950/30 transition flex items-center justify-center gap-2"
                  >
                    <span>🎲</span>
                    <span>
                      Rolar {qtdDado}d{faceEscolhida}
                      {modificador > 0 ? ` +${modificador}` : modificador < 0 ? ` ${modificador}` : ''}
                    </span>
                  </button>
                </div>
              )}

              {/* ABA 3: HISTÓRICO DE ROLAGENS */}
              {abaAtiva === 'historico' && (
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
                    <span className="text-xs text-zinc-400 font-medium">
                      Últimos {historicoRolagens.length} testes
                    </span>
                    {historicoRolagens.length > 0 && (
                      <button
                        type="button"
                        onClick={limparHistoricoRolagens}
                        className="text-[0.65rem] text-red-400 hover:text-red-300 uppercase tracking-wider font-bold transition"
                      >
                        Limpar Histórico
                      </button>
                    )}
                  </div>

                  {historicoRolagens.length === 0 ? (
                    <p className="text-center py-8 text-xs text-zinc-600">
                      O histórico de rolagens está vazio.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {historicoRolagens.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between rounded border border-zinc-800/80 bg-zinc-900/60 p-2 text-xs transition hover:bg-zinc-800/40"
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-bold text-zinc-200 truncate">
                              {r.titulo}
                            </span>
                            <span className="font-mono text-[0.65rem] text-zinc-500 truncate">
                              {r.detalhes} • {r.dataHora}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {r.ehCritico && (
                              <span className="text-[0.6rem] font-bold text-emerald-400 uppercase">
                                Crítico!
                              </span>
                            )}
                            {r.ehDesastre && (
                              <span className="text-[0.6rem] font-bold text-red-400 uppercase">
                                Desastre!
                              </span>
                            )}
                            <span className="rounded bg-zinc-950 px-2 py-0.5 font-mono text-sm font-black text-emerald-400 border border-zinc-800">
                              {r.total}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};
