import React, { useState } from 'react';
import { useRPG } from '../context/RPGContext';
import type { MunicaoInventario } from '../types';
import { formatarTexto } from '../utils/formatters';
import { calcularCategoriaFinal, calcularEspacosFinais } from '../utils/rpgRules';
import { Collapse } from './Collapse';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableMunicaoItemProps {
  id: string;
  item: MunicaoInventario;
  isExpanded: boolean;
  toggleExpandir: (id: string) => void;
  removerItem: (id: string) => void;
  onEditar?: () => void;
  isOverlay?: boolean;
}

const getCorElementoTexto = (elemento: string) => {
  const e = elemento?.trim().toLowerCase() || '';
  if (e.includes('sangue')) return 'text-red-500';
  if (e.includes('morte')) return 'text-zinc-400 font-bold';
  if (e.includes('energia')) return 'text-purple-500';
  if (e.includes('conhec')) return 'text-yellow-500';
  if (e.includes('medo')) return 'text-white';
  return 'text-zinc-400';
};

const getBadgeElemento = (elemento: string) => {
  if (!elemento) return 'bg-zinc-900 text-zinc-400';
  const e = elemento.toLowerCase();
  if (e.includes('morte')) return 'bg-black/50 text-white';
  if (e.includes('medo')) return 'bg-zinc-200/80 text-zinc-950';
  if (e.includes('sangue')) return 'bg-red-950/20 text-red-500';
  if (e.includes('energia')) return 'bg-purple-950/20 text-purple-500';
  if (e.includes('conhec')) return 'bg-yellow-950/20 text-yellow-500';
  if (e.includes('varia') || e.includes('lista')) return 'bg-blue-950/20 text-blue-500';
  return 'bg-zinc-900 text-zinc-400';
};

export const SortableMunicaoItem: React.FC<SortableMunicaoItemProps> = ({
  id,
  item,
  isExpanded,
  toggleExpandir,
  removerItem,
  onEditar,
  isOverlay,
}) => {
  const { municao } = item;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { type: 'municao' },
  });

  const { modificacoesHook, maldicoesHook, armasHook, regrasAutomaticasAtivas, regras } = useRPG();
  const [expandirMods, setExpandirMods] = useState(false);
  const [expandirMalds, setExpandirMalds] = useState(false);

  const modsAtuais = (Array.isArray(item.modificacoes) ? item.modificacoes : [])
    .map(modId => modificacoesHook?.modificacoes?.find((m: any) => m.Codigo_Modif === modId))
    .filter(Boolean) as any[];

  const maldicoesAtuais = (Array.isArray(item.maldicoes) ? item.maldicoes : [])
    .map(maldId => maldicoesHook?.maldicoes?.find((m: any) => m.Codigo_Mald === maldId))
    .filter(Boolean) as any[];

  let armaNome = '';
  let armaPos = 0;
  let armaTotal = 0;
  armasHook?.armasInventario?.forEach((a: any) => {
    if (a.municoesAcopladas && a.municoesAcopladas.includes(id)) {
      armaNome = a.arma.Nome_Item;
      armaTotal = a.municoesAcopladas.length;
      armaPos = a.municoesAcopladas.indexOf(id) + 1;
    }
  });

  const modsNames = [
    ...modsAtuais.map(m => m.Nome_Modif),
    ...maldicoesAtuais.map(m => m.Nome_Mald),
  ];
  const modifiersText = modsNames.length > 0 ? ` (${modsNames.join(', ')})` : '';
  const displayName = `${municao.Nome_Item}${modifiersText}`;

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.4 : 1,
      };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className={`rounded border border-l-4 border-l-green-700 transition-colors ${
        isOverlay
          ? 'border-green-500 bg-zinc-900 shadow-2xl scale-[1.02] opacity-90 cursor-grabbing'
          : isDragging
          ? 'border-zinc-800 bg-zinc-950/60 opacity-40'
          : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/60'
      }`}
    >
      <div className="flex items-center gap-1 p-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 p-2 flex-shrink-0 flex items-center justify-center rounded hover:bg-zinc-800"
          title="Arrastar para reordenar"
        >
          <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
            <path d="M4 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-6 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-6 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
        </div>

        <div
          className="flex-1 flex items-center justify-between min-w-0 pr-2 cursor-pointer"
          onClick={() => toggleExpandir(id)}
        >
          <div className="flex flex-col gap-1 min-w-0 justify-center">
            <div className="flex flex-col gap-0.5">
              <span
                className="font-bold text-zinc-100 text-sm truncate leading-none mt-0.5"
                title={displayName}
              >
                {displayName}
              </span>
              {armaNome && (
                <span className="text-[10px] font-bold text-green-500/80 uppercase tracking-wider">
                  Em: {armaNome} [{armaPos}/{armaTotal}]
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-300 mt-0.5">
              <span>
                <span className="font-bold text-zinc-400">Categoria:</span>{' '}
                {calcularCategoriaFinal(
                  municao.Categoria_Item,
                  item.modificacoes,
                  modificacoesHook?.modificacoes,
                  false,
                  item.maldicoes,
                  maldicoesHook?.maldicoes
                )}
              </span>
              {regras?.['contagem_municao'] && municao.contagem_municao && (
                <span>
                  <span className="font-bold text-zinc-400">Quantidade:</span>{' '}
                  {municao.contagem_municao}
                </span>
              )}
            </div>
            {(modsAtuais.length > 0 || maldicoesAtuais.length > 0) && (
              <div className="flex items-center mt-1 min-w-0">
                <span className="text-[11px] text-zinc-400 truncate italic">
                  {modsAtuais.length > 0 && modsAtuais.map(m => m.Nome_Modif).join(' • ')}
                  {modsAtuais.length > 0 && maldicoesAtuais.length > 0 && <span> • </span>}
                  {maldicoesAtuais.map((m: any, i: number) => {
                    const cor = getCorElementoTexto(m.Elemento_Mald);
                    return (
                      <span key={m.Codigo_Mald}>
                        {i > 0 && <span> • </span>}
                        <span className={cor}>{m.Nome_Mald}</span>
                      </span>
                    );
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              onClick={() => toggleExpandir(id)}
              className="w-5 text-center text-zinc-500 text-xs flex-shrink-0 cursor-pointer"
            >
              {isExpanded ? '▲' : '▼'}
            </div>
          </div>
        </div>
      </div>

      <Collapse isOpen={isExpanded}>
        <div className="border-t border-zinc-800 px-3 py-3 text-xs flex flex-col gap-2 bg-zinc-950/80">
          <div className="flex flex-col gap-1 text-xs text-zinc-300">
            <span>
              <span className="text-zinc-400 font-bold">Categoria:</span>{' '}
              {calcularCategoriaFinal(
                municao.Categoria_Item,
                item.modificacoes,
                modificacoesHook?.modificacoes,
                false,
                item.maldicoes,
                maldicoesHook?.maldicoes
              )}
            </span>
            <span>
              <span className="text-zinc-400 font-bold">Espaços:</span>{' '}
              {calcularEspacosFinais(
                municao['Espaços_Item'],
                item.modificacoes,
                modificacoesHook?.modificacoes,
                regrasAutomaticasAtivas?.has(43)
              )}
            </span>

            {(Array.isArray(item.maldicoes) ? item.maldicoes : []).length > 0 && (
              <div className="mt-3">
                <div
                  className="flex items-center gap-2 cursor-pointer group py-1.5 px-2 -mx-2 rounded hover:bg-zinc-800/40 transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    setExpandirMalds(!expandirMalds);
                  }}
                >
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                    Maldições
                  </span>
                  <div className="h-px bg-zinc-800 flex-1 group-hover:bg-zinc-700 transition-colors"></div>
                  <svg
                    className={`w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${
                      expandirMalds ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <Collapse isOpen={expandirMalds}>
                  <div className="flex flex-col gap-2 pt-2 pb-1">
                    {(Array.isArray(item.maldicoes) ? item.maldicoes : []).map((maldId: number) => {
                      const m = maldicoesHook?.maldicoes?.find((x: any) => x.Codigo_Mald === maldId);
                      if (!m) return null;
                      const corTexto = getCorElementoTexto(m.Elemento_Mald);
                      return (
                        <div key={m.Codigo_Mald} className="flex flex-col gap-0.5">
                          <div className="flex gap-1 items-center">
                            <span className={`text-xs font-bold ${corTexto}`}>{m.Nome_Mald}</span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${getBadgeElemento(
                                m.Elemento_Mald
                              )}`}
                            >
                              {m.Elemento_Mald}
                            </span>
                          </div>
                          {m.Descricao_Mald && (
                            <p className="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">
                              {formatarTexto(m.Descricao_Mald)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Collapse>
              </div>
            )}
            {modsAtuais.length > 0 && (
              <div className="mt-3">
                <div
                  className="flex items-center gap-2 cursor-pointer group py-1.5 px-2 -mx-2 rounded hover:bg-zinc-800/40 transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    setExpandirMods(!expandirMods);
                  }}
                >
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                    Modificações
                  </span>
                  <div className="h-px bg-zinc-800 flex-1 group-hover:bg-zinc-700 transition-colors"></div>
                  <svg
                    className={`w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${
                      expandirMods ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <Collapse isOpen={expandirMods}>
                  <div className="flex flex-col gap-2 pt-2 pb-1">
                    {modsAtuais.map(m => (
                      <div key={m.Codigo_Modif} className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-zinc-200">{m.Nome_Modif}</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">
                          {formatarTexto(m.Descricao_Modif || '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-zinc-800/50">
            <div
              className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: municao.Descricao_Item }}
            />
          </div>

          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-zinc-800/50">
            {onEditar && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onEditar();
                }}
                className="text-xs px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 hover:border-yellow-700 hover:bg-yellow-900/20 text-zinc-300 hover:text-yellow-400 transition-colors"
              >
                Editar
              </button>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                removerItem(id);
              }}
              className="text-xs text-green-500 hover:text-green-400 bg-green-950/30 hover:bg-green-900/50 px-3 py-1.5 rounded border border-green-900/50 transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
