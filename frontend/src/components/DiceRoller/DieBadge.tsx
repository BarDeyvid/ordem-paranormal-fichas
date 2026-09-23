import React from 'react';
import type { DadoIndividual } from '../../types';

interface DieBadgeProps {
  dado: DadoIndividual;
  tamanho?: 'sm' | 'md' | 'lg';
}

export const DieBadge: React.FC<DieBadgeProps> = ({ dado, tamanho = 'md' }) => {
  const getDimensoes = () => {
    switch (tamanho) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-14 h-14 text-xl';
      case 'md':
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  const getEstilo = () => {
    if (!dado.mantido) {
      return 'border-zinc-800/80 bg-zinc-950/40 text-zinc-600 line-through opacity-45';
    }
    if (dado.critico) {
      return 'border-emerald-500 bg-emerald-950/90 text-emerald-300 font-black shadow-[0_0_14px_rgba(16,185,129,0.45)] ring-1 ring-emerald-400/60 animate-pulse';
    }
    if (dado.desastre) {
      return 'border-red-600 bg-red-950/90 text-red-300 font-black shadow-[0_0_14px_rgba(239,68,68,0.45)] ring-1 ring-red-500/60 animate-pulse';
    }
    return 'border-zinc-600 bg-zinc-800/90 text-zinc-100 font-bold shadow-sm';
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-lg border transition-all duration-200 select-none ${getDimensoes()} ${getEstilo()}`}
      title={`Dado d${dado.faces}: ${dado.valor}${!dado.mantido ? ' (Descartado)' : ''}${dado.critico ? ' - Crítico!' : ''}${dado.desastre ? ' - Desastre!' : ''}`}
    >
      <span className="leading-none">{dado.valor}</span>
      <span className="text-[0.5rem] font-mono tracking-tighter opacity-60 leading-none mt-0.5">
        d{dado.faces}
      </span>
    </div>
  );
};
