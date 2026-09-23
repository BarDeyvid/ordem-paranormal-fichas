import React from 'react';

export type ElementoParanormal = 'Sangue' | 'Morte' | 'Conhecimento' | 'Energia' | 'Medo';

interface ElementBadgeProps {
  elemento: ElementoParanormal | string;
  variant?: 'badge' | 'inline';
  className?: string;
  onClick?: () => void;
  selecionado?: boolean;
}

export const ElementBadge: React.FC<ElementBadgeProps> = ({
  elemento,
  variant = 'inline',
  className = '',
  onClick,
  selecionado = false,
}) => {
  const elem = (elemento || '').trim();

  if (variant === 'badge') {
    // 1. Botões de Filtro / Badges Grandes: usam borda e fundo
    let styles = 'border-zinc-700 bg-black/60 text-white'; // Morte default

    if (elem.includes('Sangue')) {
      styles = 'border-red-900 bg-red-950/40 text-red-500';
    } else if (elem.includes('Energia')) {
      styles = 'border-purple-900 bg-purple-950/40 text-purple-500';
    } else if (elem.includes('Conhecimento')) {
      styles = 'border-yellow-900 bg-yellow-950/40 text-yellow-500';
    } else if (elem.includes('Medo')) {
      styles = 'border-zinc-500 bg-zinc-200/90 text-zinc-950';
    } else if (elem.includes('Morte')) {
      styles = 'border-zinc-700 bg-black/60 text-white';
    }

    const activeRing = selecionado ? 'ring-2 ring-white/60 shadow-lg' : '';

    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border transition ${styles} ${activeRing} ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      >
        {elem}
      </span>
    );
  }

  // 2. Tags Pequenas (Inline, ao lado de nomes de itens/poderes): NUNCA USE BORDA!
  let inlineStyles = 'bg-black/50 text-white px-1 rounded text-[11px] font-semibold'; // Morte default

  if (elem.includes('Sangue')) {
    inlineStyles = 'text-red-500 text-[11px] font-semibold';
  } else if (elem.includes('Conhecimento')) {
    inlineStyles = 'text-yellow-500 text-[11px] font-semibold';
  } else if (elem.includes('Energia')) {
    inlineStyles = 'text-purple-500 text-[11px] font-semibold';
  } else if (elem.includes('Medo')) {
    inlineStyles = 'bg-zinc-200/80 text-zinc-950 px-1 rounded text-[11px] font-semibold';
  } else if (elem.includes('Morte')) {
    inlineStyles = 'bg-black/50 text-white px-1 rounded text-[11px] font-semibold';
  }

  return (
    <span className={`inline-block ${inlineStyles} ${className}`}>
      {elem}
    </span>
  );
};
