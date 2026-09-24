import React, { useState } from 'react';
import type { Ameaca } from '../../types';
import { Collapse } from '../Collapse';
import { useRPG } from '../../context/RPGContext';

export interface AmeacaCardProps {
  ameaca: Ameaca;
  expandido?: boolean;
  onToggleExpandir?: () => void;
}

export const AmeacaCard: React.FC<AmeacaCardProps> = ({
  ameaca,
  expandido: expandidoProp,
  onToggleExpandir: onToggleProp,
}) => {
  const [expandidoLocal, setExpandidoLocal] = useState(false);
  const expandido = expandidoProp !== undefined ? expandidoProp : expandidoLocal;
  const toggleExpandir = onToggleProp || (() => setExpandidoLocal(prev => !prev));

  const [pvAtual, setPvAtual] = useState(ameaca.pv);
  const rpg = useRPG();

  const pctPv = Math.max(0, Math.min(100, Math.round((pvAtual / ameaca.pv) * 100)));

  // Borda esquerda do elemento
  const getBordaElemento = (el: string) => {
    switch (el.toLowerCase()) {
      case 'sangue':
        return 'border-l-red-600';
      case 'morte':
        return 'border-l-zinc-200';
      case 'conhecimento':
        return 'border-l-yellow-500';
      case 'energia':
        return 'border-l-purple-500';
      case 'medo':
      default:
        return 'border-l-zinc-400';
    }
  };

  // Tag pequena inline (sem borda conforme regra do projeto)
  const getTagElemento = (el: string) => {
    switch (el.toLowerCase()) {
      case 'sangue':
        return 'text-red-500';
      case 'conhecimento':
        return 'text-yellow-500';
      case 'energia':
        return 'text-purple-500';
      case 'morte':
        return 'bg-black/50 text-white px-1';
      case 'medo':
      default:
        return 'bg-zinc-200/80 text-zinc-950 px-1';
    }
  };

  const getStatusPv = () => {
    if (pvAtual === 0) return { label: '💀 Derrotado', cor: 'text-zinc-500 bg-zinc-900/90 border-zinc-700' };
    if (pctPv <= 25) return { label: '🚨 Crítico', cor: 'text-red-400 bg-red-950/60 border-red-800' };
    if (pctPv <= 50) return { label: '⚠️ Machucado', cor: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    return { label: 'Saudável', cor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
  };

  const statusPv = getStatusPv();

  // Ações de rolagem
  const handleRolarAtaque = (acao: any) => {
    const qtdDados = acao.dadoQtd || (ameaca.atributos.FOR >= 3 ? ameaca.atributos.FOR : 2);
    const bonus = acao.bonusAtaque || 0;
    rpg.executarRolagemLivre?.(
      qtdDados,
      20,
      bonus,
      'highest',
      `${ameaca.nome}: Ataque com ${acao.nome}`
    );
  };

  const handleRolarDano = (acao: any) => {
    if (!acao.dano) return;
    rpg.executarRolagemDano?.(
      `${ameaca.nome}: ${acao.nome}`,
      acao.dano,
      2,
      false
    );
  };

  const handleRolarPresenca = () => {
    if (!ameaca.presencaPerturbadora) return;
    rpg.executarRolagemDano?.(
      `${ameaca.nome}: Presença Perturbadora (DT ${ameaca.presencaPerturbadora.dt})`,
      ameaca.presencaPerturbadora.dano,
      2,
      false
    );
  };

  const handleRolarPericia = (periciaNome: string, bonus: number) => {
    rpg.executarRolagemLivre?.(
      2,
      20,
      bonus,
      'highest',
      `${ameaca.nome}: Teste de ${periciaNome}`
    );
  };

  return (
    <div
      className={`overflow-hidden rounded-r border-l-4 bg-zinc-900/80 border border-zinc-800 transition hover:border-zinc-700 ${getBordaElemento(
        ameaca.elemento
      )}`}
    >
      {/* ══════ CABEÇALHO DO CARD (Sempre Visível) ══════ */}
      <div
        onClick={toggleExpandir}
        className="flex cursor-pointer flex-col gap-2 bg-zinc-800/60 p-3.5 transition hover:bg-zinc-700/40"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-zinc-100">{ameaca.nome}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${getTagElemento(ameaca.elemento)}`}>
              {ameaca.elemento}
            </span>
            <span className="rounded bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300">
              VD {ameaca.vd}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${statusPv.cor}`}>
              {statusPv.label}
            </span>
            <span className="text-xs text-zinc-500 font-bold ml-1">
              {expandido ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* Resumo de Combate Rápido */}
        <div className="flex items-center justify-between text-xs text-zinc-400 gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-zinc-200">PV:</strong> {pvAtual}/{ameaca.pv}
            </span>
            <span>•</span>
            <span>
              <strong className="text-zinc-200">Defesa:</strong> {ameaca.defesa}
            </span>
            <span>•</span>
            <span>
              <strong className="text-zinc-200">Desloc:</strong> {ameaca.deslocamento}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-medium">
            {ameaca.tamanho} • {ameaca.tipo}
          </span>
        </div>

        {/* Mini barra de vida no cabeçalho */}
        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800/80">
          <div
            className={`h-full transition-all duration-300 ${
              pctPv <= 25 ? 'bg-red-600' : pctPv <= 50 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${pctPv}%` }}
          />
        </div>
      </div>

      {/* ══════ DETALHES EXPANDIDOS (COM COLLAPSE PADRÃO) ══════ */}
      <Collapse isOpen={expandido}>
        <div className="border-t border-zinc-800 p-4 text-xs leading-relaxed text-zinc-300 space-y-4">
          
          {/* ══ RASTREADOR DE PV DO MESTRE (TEMPO REAL) ══ */}
          <div className="rounded-lg bg-zinc-950/90 border border-zinc-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Controle de Vida (GM Tracker)
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-base font-black text-white">{pvAtual}</span>
                <span className="text-zinc-500">/</span>
                <span className="text-xs font-bold text-zinc-400">{ameaca.pv} PV</span>
              </div>
            </div>

            {/* Barra de vida interativa */}
            <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800 mb-2.5">
              <div
                className={`h-full transition-all duration-300 ${
                  pctPv <= 25 ? 'bg-red-600' : pctPv <= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${pctPv}%` }}
              />
            </div>

            {/* Botões Rápidos de Dano / Cura */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPvAtual(prev => Math.max(0, prev - 1));
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-700 font-bold text-zinc-300 hover:text-red-300 text-[10px] transition"
              >
                -1 PV
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPvAtual(prev => Math.max(0, prev - 5));
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-700 font-bold text-zinc-300 hover:text-red-300 text-[10px] transition"
              >
                -5 PV
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPvAtual(prev => Math.max(0, prev - 10));
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-700 font-bold text-zinc-300 hover:text-red-300 text-[10px] transition"
              >
                -10 PV
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPvAtual(prev => Math.min(ameaca.pv, prev + 5));
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-emerald-950/80 border border-zinc-700 hover:border-emerald-700 font-bold text-zinc-300 hover:text-emerald-300 text-[10px] transition"
              >
                +5 PV
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPvAtual(ameaca.pv);
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 font-bold text-zinc-400 hover:text-white text-[10px] transition ml-auto"
                title="Restaurar PV total"
              >
                ↺ Resetar
              </button>
            </div>
          </div>

          {/* ══ ATRIBUTOS ══ */}
          <div className="grid grid-cols-5 gap-2 text-center bg-zinc-950/60 p-2 rounded border border-zinc-800/80">
            {Object.entries(ameaca.atributos).map(([atr, val]) => (
              <div key={atr} className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{atr}</span>
                <span className="text-base font-black text-zinc-100">{val}</span>
              </div>
            ))}
          </div>

          {/* ══ DEFESAS ESPECIAIS & RESISTÊNCIAS ══ */}
          {(ameaca.rd || ameaca.resistencias?.length || ameaca.vulnerabilidades?.length || ameaca.imunidades?.length) && (
            <div className="flex flex-col gap-1 rounded bg-zinc-950/50 p-2.5 border border-zinc-800/70 text-[11px]">
              {ameaca.rd && (
                <div>
                  <strong className="text-zinc-400">RD:</strong> <span className="text-zinc-200">{ameaca.rd}</span>
                </div>
              )}
              {ameaca.resistencias && ameaca.resistencias.length > 0 && (
                <div>
                  <strong className="text-zinc-400">Resistências:</strong>{' '}
                  <span className="text-zinc-300">{ameaca.resistencias.join(', ')}</span>
                </div>
              )}
              {ameaca.vulnerabilidades && ameaca.vulnerabilidades.length > 0 && (
                <div>
                  <strong className="text-red-400">Vulnerabilidades:</strong>{' '}
                  <span className="text-red-300 font-bold">{ameaca.vulnerabilidades.join(', ')}</span>
                </div>
              )}
              {ameaca.imunidades && ameaca.imunidades.length > 0 && (
                <div>
                  <strong className="text-blue-400">Imunidades:</strong>{' '}
                  <span className="text-blue-300">{ameaca.imunidades.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* ══ PRESENÇA PERTURBADORA ══ */}
          {ameaca.presencaPerturbadora && (
            <div className="flex items-center justify-between rounded bg-purple-950/30 border border-purple-900/50 p-2 text-xs">
              <div>
                <strong className="text-purple-300">Presença Perturbadora:</strong>{' '}
                <span className="text-purple-200">
                  Vontade DT {ameaca.presencaPerturbadora.dt} • {ameaca.presencaPerturbadora.dano} mental
                </span>
              </div>
              <button
                type="button"
                onClick={handleRolarPresenca}
                className="px-2.5 py-1 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-100 font-bold text-[10px] border border-purple-700 shadow transition"
              >
                🧠 Rolar ({ameaca.presencaPerturbadora.dano})
              </button>
            </div>
          )}

          {/* ══ PERÍCIAS PRINCIPAIS ══ */}
          {ameaca.pericias && Object.keys(ameaca.pericias).length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Perícias da Ameaça
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(ameaca.pericias).map(([nome, bonus]) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => handleRolarPericia(nome, bonus)}
                    className="inline-flex items-center gap-1 rounded bg-zinc-800/80 hover:bg-zinc-700 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 border border-zinc-700 transition"
                    title={`Rolar teste de ${nome} (+${bonus})`}
                  >
                    <span>{nome}</span>
                    <span className="font-mono font-bold text-emerald-400">+{bonus}</span>
                    <span className="text-[9px]">🎲</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══ AÇÕES & ATAQUES ══ */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Ações de Ataque
            </span>
            {ameaca.acoes.map((acao, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 rounded bg-zinc-950/70 p-2.5 border border-zinc-800 hover:border-zinc-700 transition"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <strong className="text-zinc-100 text-xs">{acao.nome}</strong>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                      {acao.tipo}
                    </span>
                    {acao.teste && (
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        {acao.teste}
                      </span>
                    )}
                  </div>

                  {/* Botões de Rolagem de Ataque & Dano */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRolarAtaque(acao)}
                      className="inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-emerald-950/60 border border-zinc-700 hover:border-emerald-700 px-2 py-1 text-[10px] font-bold text-zinc-200 hover:text-emerald-400 shadow transition"
                      title={`Rolar Teste de Ataque (${acao.teste || '2d20'})`}
                    >
                      <span>⚔️</span>
                      <span>Atacar</span>
                    </button>

                    {acao.dano && (
                      <button
                        type="button"
                        onClick={() => handleRolarDano(acao)}
                        className="inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-red-950/60 border border-zinc-700 hover:border-red-700 px-2 py-1 text-[10px] font-bold text-zinc-200 hover:text-red-400 shadow transition"
                        title={`Rolar Dano (${acao.dano})`}
                      >
                        <span>💥</span>
                        <span>{acao.dano}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Detalhes do Ataque */}
                <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                  {acao.alcance && <span>Alcance: {acao.alcance}</span>}
                  {acao.critico && <span>Crítico: {acao.critico}</span>}
                </div>

                {acao.especial && (
                  <p className="text-[10px] text-amber-300/90 italic bg-amber-950/20 p-1 rounded mt-0.5 border border-amber-900/30">
                    {acao.especial}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ══ HABILIDADES ESPECIAIS ══ */}
          {ameaca.habilidades.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Habilidades Especiais
              </span>
              {ameaca.habilidades.map((hab, idx) => (
                <div key={idx} className="rounded bg-zinc-950/40 p-2 border border-zinc-800/60">
                  <strong className="text-zinc-200 block text-[11px] mb-0.5">{hab.nome}</strong>
                  <p className="text-[10px] text-zinc-400 leading-snug">{hab.descricao}</p>
                </div>
              ))}
            </div>
          )}

          {/* ══ ENIGMA DO MEDO (SE HOUVER) ══ */}
          {ameaca.enigmaDeMedo && (
            <div className="rounded bg-zinc-950/90 border border-zinc-600 p-2.5">
              <strong className="text-zinc-100 uppercase tracking-wider text-[10px] block mb-1 flex items-center gap-1.5">
                <span>🗝️</span>
                <span>Enigma do Medo</span>
              </strong>
              <p className="text-[10px] text-zinc-300 italic">{ameaca.enigmaDeMedo}</p>
            </div>
          )}

          {/* ══ DESCRIÇÃO NARRATIVA ══ */}
          {ameaca.descricao && (
            <p className="text-[10px] text-zinc-500 italic border-t border-zinc-800/60 pt-2 leading-relaxed">
              "{ameaca.descricao}"
            </p>
          )}

        </div>
      </Collapse>
    </div>
  );
};
