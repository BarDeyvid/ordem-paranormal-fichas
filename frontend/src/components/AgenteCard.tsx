import React, { useState } from 'react';
import type { FichaSummary } from '../types';
import { Collapse } from './Collapse';

export interface AgenteCardProps {
  agente: FichaSummary;
  isActive?: boolean;
  onAbrir: (id: string) => void;
  onDuplicar: (id: string) => void;
  onDeletar: (id: string) => void;
  onExportar: (id: string) => void;
}

export const AgenteCard: React.FC<AgenteCardProps> = ({
  agente,
  isActive = false,
  onAbrir,
  onDuplicar,
  onDeletar,
  onExportar,
}) => {
  const [expandido, setExpandido] = useState(false);
  const [confirmandoExcluir, setConfirmandoExcluir] = useState(false);

  // Cores por classe
  const getClassTheme = () => {
    switch (agente.classe) {
      case 'Combatente':
        return {
          borderL: 'border-l-red-600',
          badge: 'bg-red-950/70 text-red-400 border border-red-800/80',
          accent: 'text-red-400',
        };
      case 'Especialista':
        return {
          borderL: 'border-l-sky-500',
          badge: 'bg-sky-950/70 text-sky-400 border border-sky-800/80',
          accent: 'text-sky-400',
        };
      case 'Ocultista':
        return {
          borderL: 'border-l-purple-600',
          badge: 'bg-purple-950/70 text-purple-400 border border-purple-800/80',
          accent: 'text-purple-400',
        };
      default:
        return {
          borderL: 'border-l-zinc-600',
          badge: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
          accent: 'text-zinc-400',
        };
    }
  };

  const theme = getClassTheme();

  // Formatação de data
  const dataFormatada = (() => {
    try {
      const dataStr = agente.dataAtualizacao || (agente as any).atualizadoEm;
      return new Date(dataStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return agente.dataAtualizacao || (agente as any).atualizadoEm || '';
    }
  })();

  const pvAtual = agente.pvAtual ?? (agente as any).pv?.atual ?? 0;
  const pvMax = agente.pvMax ?? (agente as any).pv?.max ?? 0;
  const pvPercent = Math.min(100, Math.max(0, pvMax ? (pvAtual / pvMax) * 100 : 0));

  const sanAtual = agente.sanAtual ?? (agente as any).san?.atual ?? 0;
  const sanMax = agente.sanMax ?? (agente as any).san?.max ?? 0;
  const sanPercent = Math.min(100, Math.max(0, sanMax ? (sanAtual / sanMax) * 100 : 0));

  const peAtual = agente.peAtual ?? (agente as any).pe?.atual ?? 0;
  const peMax = agente.peMax ?? (agente as any).pe?.max ?? 0;
  const pePercent = Math.min(100, Math.max(0, peMax ? (peAtual / peMax) * 100 : 0));

  return (
    <div
      className={`group relative flex flex-col rounded-r-lg border border-zinc-800 bg-zinc-900/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:shadow-xl border-l-4 ${theme.borderL} ${
        isActive ? 'ring-2 ring-emerald-500/60 shadow-emerald-950/20' : ''
      }`}
    >
      {/* Header do Card */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar e Títulos */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-zinc-700 bg-zinc-950/80 shadow-inner flex items-center justify-center">
              {agente.avatarUrl ? (
                <img src={agente.avatarUrl} alt={agente.nome} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl select-none opacity-60">🕵️‍♂️</span>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="truncate text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  {agente.nome || 'Agente Sem Nome'}
                </h3>
                {isActive && (
                  <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-700/80">
                    Ativo
                  </span>
                )}
              </div>
              <span className="truncate text-xs font-mono text-zinc-400">
                {agente.jogador ? `Jogador: ${agente.jogador}` : 'Sem jogador definido'}
              </span>
            </div>
          </div>

          {/* Badges de Classe e NEX */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
              {agente.classe || 'Indefinida'}
            </span>
            <span className="font-mono text-xs font-bold text-zinc-300">
              NEX <span className={theme.accent}>{agente.nex}%</span>
            </span>
          </div>
        </div>

        {/* Informações de Trilha e Origem */}
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <div className="flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300 border border-zinc-700/60">
            <span className="text-[0.65rem] uppercase font-bold text-zinc-500">Origem:</span>
            <span className="font-medium truncate max-w-[120px]">{agente.origem || '—'}</span>
          </div>
          <div className="flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300 border border-zinc-700/60">
            <span className="text-[0.65rem] uppercase font-bold text-zinc-500">Trilha:</span>
            <span className="font-medium truncate max-w-[120px]">{agente.trilha || '—'}</span>
          </div>
          {agente.patente && (
            <div className="flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300 border border-zinc-700/60">
              <span className="text-[0.65rem] uppercase font-bold text-zinc-500">Patente:</span>
              <span className="font-medium">{agente.patente}</span>
            </div>
          )}
        </div>

        {/* Barras de Status Rápidas (PV / SAN / PE) */}
        <div className="mt-3 space-y-1.5 rounded bg-zinc-950/60 p-2.5 border border-zinc-800/80">
          {/* PV */}
          <div>
            <div className="flex justify-between text-[0.7rem] font-bold uppercase tracking-wider">
              <span className="text-red-400">PV</span>
              <span className="font-mono text-zinc-400">
                {pvAtual} / {pvMax}
              </span>
            </div>
            <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${pvPercent}%` }}
              />
            </div>
          </div>

          {/* SAN */}
          <div>
            <div className="flex justify-between text-[0.7rem] font-bold uppercase tracking-wider">
              <span className="text-sky-400">SAN</span>
              <span className="font-mono text-zinc-400">
                {sanAtual} / {sanMax}
              </span>
            </div>
            <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{ width: `${sanPercent}%` }}
              />
            </div>
          </div>

          {/* PE */}
          <div>
            <div className="flex justify-between text-[0.7rem] font-bold uppercase tracking-wider">
              <span className="text-amber-400">PE</span>
              <span className="font-mono text-zinc-400">
                {peAtual} / {peMax}
              </span>
            </div>
            <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${pePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Seção Expansível de Detalhes com Animação Obrigatória Collapse */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setExpandido(prev => !prev)}
            className="flex w-full items-center justify-center gap-1 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-200 transition"
          >
            <span>{expandido ? 'Ocultar Detalhes' : 'Ver Detalhes do Dossiê'}</span>
            <span className={`transform transition-transform duration-200 ${expandido ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </button>

          <Collapse isOpen={expandido}>
            <div className="border-t border-zinc-800/80 pt-2 pb-1 text-xs text-zinc-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Nível Calculado:</span>
                <span className="text-zinc-200 font-bold">{agente.nivel || Math.max(1, Math.ceil(agente.nex / 5))}</span>
              </div>
              <div className="flex justify-between">
                <span>Identificador:</span>
                <span className="truncate max-w-[180px] text-zinc-400">{agente.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Última Edição:</span>
                <span className="text-zinc-300">{dataFormatada}</span>
              </div>
            </div>
          </Collapse>
        </div>
      </div>

      {/* Rodapé e Ações do Card */}
      <div className="mt-auto border-t border-zinc-800/80 bg-zinc-950/40 p-2.5 flex items-center justify-between gap-2">
        {/* Ação Primária: Abrir / Jogar */}
        <button
          type="button"
          onClick={() => onAbrir(agente.id)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 text-xs uppercase tracking-wider transition shadow-sm"
          title="Abrir e Editar Ficha"
        >
          <span>📂</span>
          <span>Abrir Dossiê</span>
        </button>

        {/* Botão Clonar */}
        <button
          type="button"
          onClick={() => onDuplicar(agente.id)}
          className="rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white p-1.5 text-xs transition border border-zinc-700/80"
          title="Duplicar / Clonar Agente"
        >
          📋
        </button>

        {/* Botão Baixar JSON Individual */}
        <button
          type="button"
          onClick={() => onExportar(agente.id)}
          className="rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white p-1.5 text-xs transition border border-zinc-700/80"
          title="Baixar Arquivo JSON deste Agente"
        >
          ⬇️
        </button>

        {/* Botão Excluir */}
        {confirmandoExcluir ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onDeletar(agente.id);
                setConfirmandoExcluir(false);
              }}
              className="rounded bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-1 text-[0.7rem] uppercase tracking-wider transition"
              title="Confirmar exclusão definitiva"
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoExcluir(false)}
              className="rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-2 py-1 text-[0.7rem] uppercase tracking-wider transition"
            >
              Não
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoExcluir(true)}
            className="rounded bg-zinc-800 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 p-1.5 text-xs transition border border-zinc-700/80"
            title="Excluir Agente"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};
