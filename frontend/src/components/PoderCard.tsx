import React from 'react';
import { Collapse } from './Collapse';
import { formatarDescricao } from '../utils/formatters';

export function getBadgeElemento(elemento: string): string {
  if (!elemento) return 'border-zinc-700 bg-zinc-900 text-zinc-400';
  const el = elemento.toLowerCase();
  
  if (el.includes(' e ')) {
    return 'border-zinc-500 bg-zinc-800 text-zinc-300';
  }

  switch (el) {
    case 'morte': return 'border-zinc-700 bg-black/50 text-white';
    case 'medo': return 'border-zinc-500 bg-zinc-200/80 text-zinc-950';
    case 'sangue': return 'border-red-900 bg-red-950/20 text-red-500';
    case 'energia': return 'border-purple-900 bg-purple-950/20 text-purple-500';
    case 'conhecimento': return 'border-yellow-900 bg-yellow-950/20 text-yellow-500';
    default: return 'border-zinc-700 bg-zinc-900 text-zinc-400';
  }
}

export interface PoderItem {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  elemento?: string;
  categoria?: string;
  extra?: string;
  automatico?: string;
  afinidade?: string;
  afinidadeAtiva?: boolean;
  afinidadeAdquiridaKey?: string | number;
  fonte?: string;
  subPoder?: {
    nome: string;
    descricao: string;
    extra?: string;
  };
  limiteCirculos?: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
  };
  preRequisitos?: string;
  isSlotVazio?: boolean;
}

export interface PoderCardProps {
  poder: PoderItem;
  estaExpandida: boolean;
  toggleExpandir: () => void;
  onEditar?: () => void;
  onRemover?: () => void;
  onRemoverAfinidade?: () => void;
}

export const PoderCard: React.FC<PoderCardProps> = ({
  poder,
  estaExpandida,
  toggleExpandir,
  onEditar,
  onRemover,
  onRemoverAfinidade,
}) => {
  let corBordaLeft = 'border-l-green-800';
  if (poder.categoria === 'paranormais' && poder.elemento) {
    const elStr = poder.elemento.toLowerCase();
    corBordaLeft = elStr.includes('medo') ? 'border-l-zinc-200' :
                   elStr.includes('sangue') ? 'border-l-red-600' :
                   elStr.includes('morte') ? 'border-l-black' :
                   elStr.includes('conhecimento') ? 'border-l-yellow-600' :
                   elStr.includes('energia') ? 'border-l-purple-600' : 
                   (elStr.includes('varia') || elStr.includes('vária')) ? 'border-l-green-600' : 'border-l-zinc-600';
  }

  return (
    <div className={`overflow-hidden rounded-r border-l-4 bg-zinc-900/50 ${corBordaLeft}`}>
      <div
        onClick={toggleExpandir}
        className="flex cursor-pointer justify-between gap-3 relative bg-zinc-800/40 px-4 py-3 transition hover:bg-zinc-700/50 items-center"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-sm font-bold text-zinc-100 truncate">{poder.nome}</span>
          {poder.extra && (
            <span className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-xs font-bold text-amber-400 shrink-0">
              {poder.extra}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {poder.elemento && (
            <span className={`rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${getBadgeElemento(poder.elemento)}`}>
              {poder.elemento}
            </span>
          )}
          <span className="rounded border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-zinc-500">
            {poder.tipo}
          </span>
          <span className="text-xs text-zinc-600">{estaExpandida ? '▲' : '▼'}</span>
        </div>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">
          {poder.automatico && (
            <div className="mb-3 flex items-center gap-2 border-b border-zinc-800/50 pb-2">
              <span
                title={poder.automatico.toLowerCase().trim() === 'sim' ? 'Totalmente automático' : 'Semi-automático'}
                className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider ${
                  poder.automatico.toLowerCase().trim() === 'sim'
                    ? 'bg-green-950/60 text-green-400 border border-green-800/50'
                    : 'bg-yellow-950/60 text-yellow-400 border border-yellow-800/50'
                }`}
              >
                {poder.automatico.toLowerCase().trim() === 'sim' ? (
                  <>
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></svg>
                    Auto
                  </>
                ) : (
                  <>
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" opacity="0.5"/><path d="M19 3v4m0 4v10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    Semi
                  </>
                )}
              </span>
              <span className="text-[10px] text-zinc-500 italic">
                {poder.automatico.toLowerCase().trim() === 'sim' 
                  ? 'Os bônus deste poder já estão aplicados na sua ficha.' 
                  : 'Uma parte deste poder é aplicada automaticamente na sua ficha, e a outra não.'}
              </span>
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: formatarDescricao(poder.descricao) }} />

          {/* Afinidade */}
          {poder.afinidade && (
            <div className={`mt-2 text-sm leading-relaxed transition-opacity duration-300 ${poder.afinidadeAtiva ? 'text-zinc-300 opacity-100' : 'text-zinc-500 opacity-40'}`}>
              {poder.afinidadeAtiva && poder.afinidadeAdquiridaKey && (
                <div className="flex justify-end mb-2">
                  <span className="text-[0.65rem] uppercase tracking-widest text-zinc-500 font-semibold bg-zinc-800/50 px-2 py-0.5 rounded">
                    {String(poder.afinidadeAdquiridaKey).startsWith('extra_dedo_decepado') ? 'DEDO DECEPADO' : (String(poder.afinidadeAdquiridaKey).startsWith('extra_') ? 'Transcender Extra' : (
                      (parseInt(String(poder.afinidadeAdquiridaKey), 10) >= 1000) ? 
                      `Transcender ${parseInt(String(poder.afinidadeAdquiridaKey), 10) - 1000}%` :
                      `Transcender ${parseInt(String(poder.afinidadeAdquiridaKey), 10)}%`
                    ))}
                  </span>
                </div>
              )}
              <p>
                <strong className={poder.afinidadeAtiva ? 'text-zinc-100' : 'text-zinc-400'}>Afinidade:</strong> {poder.afinidade}
              </p>
              {poder.afinidadeAtiva && poder.afinidadeAdquiridaKey && onRemoverAfinidade && (
                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoverAfinidade();
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-green-500/70 transition hover:text-green-400"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 text-[0.6rem] uppercase tracking-wider text-zinc-600">Fonte: {poder.fonte || 'NÃO DEFINIDA'}</div>

          {poder.subPoder && (
            <div className="mt-4 rounded-r border-l-2 border-amber-500 bg-zinc-900/80 p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-100">{poder.subPoder.nome}</span>
                {poder.subPoder.extra && (
                  <span className="rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-xs font-bold text-amber-400">
                    {poder.subPoder.extra}
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-400">{poder.subPoder.descricao}</div>
            </div>
          )}

          {poder.limiteCirculos && (
            <div className="mt-4 rounded-r border-l-2 border-zinc-400 bg-zinc-900/80 p-3">
              <div className="mb-2 text-sm font-bold text-zinc-100">Rituais:</div>
              <div className="flex flex-wrap gap-2">
                {([['1° Círculo', poder.limiteCirculos.c1], ['2° Círculo', poder.limiteCirculos.c2], ['3° Círculo', poder.limiteCirculos.c3], ['4° Círculo', poder.limiteCirculos.c4]] as const).map(([r,q]) => (
                  <span key={r} className={`rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs ${q > 0 ? 'text-zinc-100' : 'text-zinc-600'}`}>
                    {r}: <strong>{q}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {poder.preRequisitos && (
            <div className="mt-3 inline-block rounded bg-amber-400/5 px-2.5 py-1.5 text-xs italic text-amber-400">
              <strong>Pré-requisitos:</strong> {poder.preRequisitos}
            </div>
          )}

          {(onEditar || onRemover) && (
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-zinc-800/50">
              {onEditar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar();
                  }}
                  className="text-xs px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 hover:border-yellow-700 hover:bg-yellow-900/20 text-zinc-300 hover:text-yellow-400 transition-colors"
                >
                  Editar
                </button>
              )}
              {onRemover && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemover();
                  }}
                  className="text-xs text-green-500 hover:text-green-400 bg-green-950/30 hover:bg-green-900/50 px-3 py-1.5 rounded border border-green-900/50 transition-colors"
                >
                  Remover
                </button>
              )}
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export interface SlotPoderVazioCardProps {
  nome: string;
  tipo: string;
  descricao: string;
  onClick: () => void;
}

export const SlotPoderVazioCard: React.FC<SlotPoderVazioCardProps> = ({
  nome,
  tipo,
  descricao,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded border-2 border-dashed border-zinc-700 border-l-zinc-600 border-l-4 bg-zinc-900/40 transition hover:border-green-800 hover:bg-zinc-900/80"
      style={{ borderLeftStyle: 'solid' }}
    >
      <div className="flex items-center justify-between gap-3 bg-zinc-800/40 px-4 py-3 transition group-hover:bg-zinc-800/60">
        <div className="flex flex-col items-start gap-0.5 text-left">
          <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-300">{nome}</span>
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400">{tipo}</span>
        </div>
        <span className="whitespace-nowrap rounded bg-green-900/40 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-green-400 transition group-hover:bg-green-900/60 group-hover:text-green-300">
          + Adicionar
        </span>
      </div>
      <div className="border-t border-zinc-800/50 px-4 py-3 text-left text-xs leading-relaxed text-zinc-500 transition group-hover:text-zinc-400">
        {descricao}
      </div>
    </div>
  );
};
