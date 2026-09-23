import React, { useState } from 'react';
import { useRPG } from '../context/RPGContext';
import type { ItemGeralInventario } from '../types';
import { formatarTexto } from '../utils/formatters';
import { calcularCategoriaFinal, calcularEspacosFinais } from '../utils/rpgRules';
import { Collapse } from './Collapse';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableItemGeralProps {
  item: ItemGeralInventario;
  isExpanded: boolean;
  toggleExpandir: (id: string) => void;
  removerItem: (id: string) => void;
  stringDT?: string | null;
  onEditar?: () => void;
  toggleEquipado: (id: string) => void;
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

export const SortableItemGeral: React.FC<SortableItemGeralProps> = ({
  item,
  isExpanded,
  toggleExpandir,
  removerItem,
  stringDT,
  onEditar,
  toggleEquipado,
  isOverlay,
}) => {
  const { maldicoesHook, modificacoesHook, regrasAutomaticasAtivas } = useRPG();
  const [expandirMods, setExpandirMods] = useState(false);
  const [expandirMalds, setExpandirMalds] = useState(false);

  const modsAtuais = (Array.isArray(item.modificacoes) ? item.modificacoes : [])
    .map(id => modificacoesHook?.modificacoes?.find((m: any) => m.Codigo_Modif === id))
    .filter(Boolean) as any[];

  const maldicoesAtuais = (Array.isArray(item.maldicoes) ? item.maldicoes : [])
    .map(id => maldicoesHook?.maldicoes?.find((m: any) => m.Codigo_Mald === id))
    .filter(Boolean) as any[];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: 'item' },
  });

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.4 : 1,
      };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className={`rounded border border-l-4 border-l-green-700 transition-colors w-full relative ${
        isOverlay
          ? 'border-green-500 bg-zinc-900 shadow-2xl scale-[1.02] opacity-90 cursor-grabbing'
          : isDragging
          ? 'border-zinc-800 bg-zinc-950/60 opacity-40'
          : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/60'
      }`}
    >
      <div className="flex items-center gap-1 p-3">
        {/* Drag handle */}
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
          className="flex-1 flex cursor-pointer items-center justify-between gap-3 min-w-0"
          onClick={() => toggleExpandir(item.id)}
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0 justify-center">
            <span className="font-bold text-sm text-zinc-100 truncate leading-none mt-0.5">
              {item.item.Nome_Item}
            </span>
            {!(item.item.Grupo_Item?.toLowerCase().includes('explosivo') || stringDT) && (
              <span className="text-xs text-zinc-400 font-medium truncate">
                Categoria{' '}
                {calcularCategoriaFinal(
                  item.item.Categoria_Item,
                  item.modificacoes,
                  modificacoesHook?.modificacoes,
                  false,
                  item.maldicoes,
                  maldicoesHook?.maldicoes
                )}
              </span>
            )}

            {stringDT && (
              <div className="flex items-center gap-4 text-xs text-zinc-300 mt-0.5">
                <span>
                  <span className="font-bold text-green-400">DT:</span> {stringDT}
                </span>
              </div>
            )}
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
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {(item.item.Nome_Item.toLowerCase().includes('vestimenta') ||
            item.item.Nome_Item.toLowerCase().includes('amuleto sagrado')) && (
            <input
              type="checkbox"
              checked={!!item.equipado}
              onPointerDown={e => e.stopPropagation()}
              onChange={() => toggleEquipado(item.id)}
              className="w-5 h-5 cursor-pointer accent-green-600"
              title={item.equipado ? 'Desequipar' : 'Equipar item'}
            />
          )}
          <div
            onClick={() => toggleExpandir(item.id)}
            className="w-5 text-center text-zinc-500 text-xs flex-shrink-0 cursor-pointer"
          >
            {isExpanded ? '▲' : '▼'}
          </div>
        </div>
      </div>

      <Collapse isOpen={isExpanded}>
        <div
          className="border-t border-zinc-800 px-3 py-3 text-xs bg-zinc-950/80 flex flex-col gap-2 relative z-10"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-1 mt-1">
            <span>
              <span className="text-green-400 font-bold">Categoria:</span>{' '}
              {calcularCategoriaFinal(
                item.item.Categoria_Item,
                item.modificacoes,
                modificacoesHook?.modificacoes,
                false,
                item.maldicoes,
                maldicoesHook?.maldicoes
              )}
            </span>
            <span>
              <span className="text-green-400 font-bold">Espaços:</span>{' '}
              {calcularEspacosFinais(
                item.item.Espacos_Itens,
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
                    {(Array.isArray(item.maldicoes) ? item.maldicoes : []).map((id: number) => {
                      const m = maldicoesHook?.maldicoes?.find((x: any) => x.Codigo_Mald === id);
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
            <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">
              {formatarTexto(item.item.Desc_Item)}
            </p>
          </div>
          {item.item.Fonte_Item && (
            <div className="mt-2 pt-2 border-t border-zinc-800/50">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                Fonte: {item.item.Fonte_Item}
              </span>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-zinc-800/50">
            {onEditar && item.id !== 'coronhada-virtual' && (
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
            {item.id !== 'coronhada-virtual' && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  removerItem(item.id);
                }}
                className="text-xs text-green-500 hover:text-green-400 bg-green-950/30 hover:bg-green-900/50 px-3 py-1.5 rounded border border-green-900/50 transition-colors"
              >
                Remover
              </button>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};
