import React, { useState } from 'react';
import { useRPG } from '../context/RPGContext';
import type { ArmaInventario } from '../types';
import { formatarTexto } from '../utils/formatters';
import { calcularCategoriaFinal, calcularEspacosFinais } from '../utils/rpgRules';
import { formatarCritico } from '../screens/Ficha/ModalArmas';
import { Collapse } from './Collapse';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableArmaItemProps {
  item: ArmaInventario;
  isExpanded: boolean;
  toggleExpandir: (id: string) => void;
  stringDT?: string | null;
  removerArma: (id: string) => void;
  onEditar?: () => void;
  onAddMunicao?: () => void;
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

export const SortableArmaItem: React.FC<SortableArmaItemProps> = ({
  item,
  isExpanded,
  toggleExpandir,
  stringDT,
  removerArma,
  onEditar,
  onAddMunicao,
  isOverlay,
}) => {
  const { id, arma } = item;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { type: 'arma' },
  });

  const {
    municoesHook,
    armasHook,
    proficienciasTotais,
    modificacoesHook,
    maldicoesHook,
    atributosFinais,
    regrasAutomaticasAtivas,
    regras,
    itensHook,
  } = useRPG();
  const hasProficiencia = proficienciasTotais.includes(arma.Proficiencia);
  const [expandirMods, setExpandirMods] = useState(false);
  const [expandirMalds, setExpandirMalds] = useState(false);

  const modsAtuais = (Array.isArray(item.modificacoes) ? item.modificacoes : [])
    .map(modId => modificacoesHook?.modificacoes?.find((m: any) => m.Codigo_Modif === modId))
    .filter(Boolean) as any[];

  const maldicoesAtuais = (Array.isArray(item.maldicoes) ? item.maldicoes : [])
    .map(maldId => maldicoesHook?.maldicoes?.find((m: any) => m.Codigo_Mald === maldId))
    .filter(Boolean) as any[];

  const municoesAcopladasList = (item.municoesAcopladas || [])
    .map(mid => {
      let m = municoesHook?.municoesInventario?.find((x: any) => x.id === mid);
      if (m) return m;
      let i = itensHook?.itensInventario?.find((x: any) => x.id === mid);
      if (i) return { id: i.id, municao: i.item, qtd: i.qtd };
      return null;
    })
    .filter(Boolean) as any[];

  const isLancadorGranadas =
    arma.Nome_Item?.toLowerCase().includes('lançador de granadas') ||
    arma.Nome_Item?.toLowerCase().includes('lancador de granadas');
  let granadaAcoplada: any = null;
  if (isLancadorGranadas && item.municoesAcopladas && item.municoesAcopladas.length > 0) {
    const mid = item.municoesAcopladas[0];
    const itemInv = itensHook?.itensInventario?.find((i: any) => String(i.id) === String(mid));
    if (itemInv) granadaAcoplada = itemInv.item;
  }

  const calcularEstatisticasFinaisArma = () => {
    let dano = arma.Dano_Arma || '';
    if (dano.toLowerCase().includes('veja') || dano.toLowerCase().includes('texto')) {
      dano = '-';
    }
    let espacos = calcularEspacosFinais(
      arma['Espaços_Item'],
      item.modificacoes,
      modificacoesHook?.modificacoes,
      regrasAutomaticasAtivas?.has(43)
    );
    let automatica = !!arma['Automatica?'];
    let critico = Number(arma.Critico_Arma || 20);
    let alcance = arma.Alcance_Item || '';
    let multiplicador = Number(arma.Multiplicador_Arma || 2);
    let danoSecundario = arma.Dano_Secundario || '';
    let dtGranada: string | null = null;

    if (isLancadorGranadas && granadaAcoplada) {
      const p = granadaAcoplada.Dano_Item?.split(',') || [];
      dano = p[0]?.trim() || '-';
      if (dano.toLowerCase().includes('veja') || dano.toLowerCase().includes('texto')) {
        dano = '-';
      }

      const dtItem = granadaAcoplada.Dt_Item;
      if (dtItem) {
        let val = dtItem.trim();
        let periciaStr = '';
        if (val.includes(',')) {
          const arr = val.split(',');
          val = arr.pop()!.trim();
          periciaStr = arr.join(',').trim();
        }
        let calc: string | number = 0;
        if (['FOR', 'AGI', 'INT', 'PRE', 'VIG'].includes(val.toUpperCase())) {
          calc = 10 + (atributosFinais[val.toUpperCase() as keyof typeof atributosFinais] || 0);
        } else {
          calc = Number(val);
          if (isNaN(calc)) calc = '-';
        }
        dtGranada = calc === '-' ? '-' : `${calc}${periciaStr ? ` (${periciaStr})` : ''}`;
      } else {
        dtGranada = '-';
      }
    }

    if (
      regrasAutomaticasAtivas?.has(86) &&
      (arma.Tipo_Arma?.toLowerCase() === 'corpo a corpo' ||
        arma.Tipo_Arma?.toLowerCase() === 'corpo-a-corpo') &&
      arma.Nome_Item !== 'Ataque Desarmado'
    ) {
      dano = dano.replace(/(\d+)d(\d+)/gi, (match, p1, p2) => `${Number(p1) + 1}d${p2}`);
    }

    // Mods da arma
    for (const mod of modsAtuais) {
      const nome = mod.Nome_Modif.trim().toLowerCase();
      if (nome === 'calibre grosso') {
        dano = dano.replace(/(\d+)d(\d+)/gi, (match, p1, p2) => `${Number(p1) + 1}d${p2}`);
      }
      if (nome === 'ferrolho automático') {
        automatica = true;
      }
      if (nome === 'mira laser' || nome === 'perigosa') {
        critico -= 2;
      }
      if (nome === 'mira telescopica') {
        const ord = ['Curto', 'Medio', 'Longo', 'Extremo', 'Ilimitado'];
        const idx = ord.indexOf(alcance);
        if (idx !== -1 && idx < ord.length - 1) {
          alcance = ord[idx + 1];
        }
      }
    }

    // Maldições da arma
    for (const mald of maldicoesAtuais) {
      const nomeM = mald.Nome_Mald.trim().toLowerCase();
      if (nomeM === 'erosiva') {
        danoSecundario = danoSecundario ? `${danoSecundario} + 1d8` : '+1d8';
      }
      if (nomeM === 'lancinante') {
        danoSecundario = danoSecundario ? `${danoSecundario} + 1d8*` : '+1d8*';
      }
      if (nomeM === 'predadora') {
        const margem = 21 - critico;
        critico = 21 - margem * 2;
        const ord = ['Curto', 'Medio', 'Longo', 'Extremo', 'Ilimitado'];
        const idx = ord.indexOf(alcance);
        if (idx !== -1 && idx < ord.length - 1) {
          alcance = ord[idx + 1];
        }
      }
      if (nomeM === 'empuxo') {
        const ord = ['Curto', 'Medio', 'Longo', 'Extremo', 'Ilimitado'];
        if (!alcance) {
          alcance = 'Curto';
        } else {
          const idx = ord.indexOf(alcance);
          if (idx !== -1 && idx < ord.length - 1) {
            alcance = ord[idx + 1];
          }
        }
      }
    }

    // Mods das munições acopladas
    for (const mun of municoesAcopladasList) {
      const munMods = (mun.modificacoes || [])
        .map((modId: number) =>
          modificacoesHook?.modificacoes?.find((m: any) => m.Codigo_Modif === modId)
        )
        .filter(Boolean) as any[];
      for (const mMod of munMods) {
        const mNome = mMod.Nome_Modif.trim().toLowerCase();
        if (mNome === 'dum dum') {
          multiplicador += 1;
        }
        if (mNome === 'explosiva') {
          danoSecundario = danoSecundario ? `${danoSecundario} + 2d6` : '+2d6';
        }
      }
    }

    return {
      dano,
      espacos,
      automatica,
      critico,
      alcance,
      multiplicador,
      danoSecundario,
      dtGranada,
    };
  };

  const stats = calcularEstatisticasFinaisArma();

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
          className="flex-1 flex cursor-pointer items-center justify-between gap-3 min-w-0"
          onClick={() => toggleExpandir(id)}
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0 justify-center">
            <span className="font-bold text-sm text-zinc-100 truncate leading-none mt-0.5">
              {arma.Nome_Item}
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-300 mt-0.5">
              <span>
                <span className="font-bold text-green-400">Dano:</span> {stats.dano}
                {stats.danoSecundario
                  ? stats.danoSecundario.trim().startsWith('+')
                    ? stats.danoSecundario.trim()
                    : '+' + stats.danoSecundario.trim()
                  : ''}
              </span>
              {isLancadorGranadas ? (
                <span>
                  <span className="font-bold text-green-400">DT:</span> {stats.dtGranada || '-'}
                </span>
              ) : (
                <span>
                  <span className="font-bold text-zinc-400">Crítico:</span>{' '}
                  {formatarCritico(stats.critico, stats.multiplicador)}
                </span>
              )}
              {stringDT && (
                <span>
                  <span className="font-bold text-green-400">DT:</span> {stringDT}
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
            {regras?.['contagem_municao'] && arma.Capacidade_Municao != null && (
              <span className="relative group/mun cursor-help flex items-center">
                <span className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-500"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12" y2="18.01"></line>
                    <line x1="8" y1="18" x2="8" y2="18.01"></line>
                    <line x1="16" y1="18" x2="16" y2="18.01"></line>
                    <line x1="8" y1="14" x2="8" y2="14.01"></line>
                    <line x1="12" y1="14" x2="12" y2="14.01"></line>
                    <line x1="16" y1="14" x2="16" y2="14.01"></line>
                    <line x1="8" y1="10" x2="8" y2="10.01"></line>
                    <line x1="12" y1="10" x2="12" y2="10.01"></line>
                    <line x1="16" y1="10" x2="16" y2="10.01"></line>
                  </svg>
                  <span className="text-[11px] font-bold text-zinc-300">
                    {arma.Capacidade_Municao}
                  </span>
                </span>
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 invisible group-hover/mun:opacity-100 group-hover/mun:visible transition-all duration-300 group-hover/mun:delay-500 delay-0 w-32 p-1.5 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded z-50 text-center shadow-lg pointer-events-none">
                  Capacidade de Munição
                </span>
              </span>
            )}
            {arma['Agil?'] && (
              <span className="relative group/agil cursor-help">
                <span className="text-sm text-yellow-400">⚡</span>
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 invisible group-hover/agil:opacity-100 group-hover/agil:visible transition-all duration-300 group-hover/agil:delay-500 delay-0 w-52 p-2 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded z-50 text-center shadow-lg pointer-events-none">
                  Permite que você aplique sua Agilidade em vez de sua Força em testes de ataque e
                  rolagens de dano.
                </span>
              </span>
            )}
            {stats.automatica && (
              <span className="relative group/auto cursor-help">
                <span className="text-sm text-blue-400">🔄</span>
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 invisible group-hover/auto:opacity-100 group-hover/auto:visible transition-all duration-300 group-hover/auto:delay-500 delay-0 w-52 p-2 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded z-50 text-center shadow-lg pointer-events-none">
                  Pode disparar rajadas. Quando dispara uma rajada, você sofre -1d20 no teste de
                  ataque, mas causa 1 dado de dano adicional do mesmo tipo.
                </span>
              </span>
            )}
            {!hasProficiencia && (
              <span className="relative group/prof cursor-help">
                <span className="text-sm text-red-500">⚠️</span>
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 invisible group-hover/prof:opacity-100 group-hover/prof:visible transition-all duration-300 group-hover/prof:delay-500 delay-0 w-52 p-2 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded z-50 text-center shadow-lg pointer-events-none">
                  Você não possui proficiência com esta arma, recebendo -2d20 em testes de ataque
                  com ela.
                </span>
              </span>
            )}
            <span className="w-5 text-center text-zinc-500 text-xs">
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
        </div>
      </div>

      <Collapse isOpen={isExpanded}>
        <div className="border-t border-zinc-800 px-3 py-3 text-xs flex flex-col gap-2 bg-zinc-950/80">
          <div>
            <span className="font-bold text-zinc-200">{arma.Proficiencia}</span>
            <span className="text-zinc-600"> — </span>
            <span className="italic text-zinc-400">{arma.Tipo_Arma}</span>
          </div>
          <div className="flex flex-col gap-1 text-xs text-zinc-300">
            <span>
              <span className="text-green-400 font-bold">Categoria:</span>{' '}
              {calcularCategoriaFinal(
                arma.Categoria_Item,
                item.modificacoes,
                modificacoesHook?.modificacoes,
                arma.Codigo_Arma === 71,
                item.maldicoes,
                maldicoesHook?.maldicoes
              )}
            </span>
            {stats.alcance && (
              <span>
                <span className="text-green-400 font-bold">Alcance:</span> {stats.alcance}
              </span>
            )}
            <span>
              <span className="text-green-400 font-bold">Tipo:</span>{' '}
              {municoesAcopladasList[0]?.municao?.Codigo_Municao === 63
                ? 'Impacto'
                : arma.Tipo_Dano_Arma}
            </span>
            {municoesAcopladasList[0]?.municao?.Codigo_Municao === 67 &&
              municoesAcopladasList[0]?.municao?.granada_dano && (
                <span>
                  <span className="text-green-400 font-bold">Explosivo:</span>{' '}
                  {municoesAcopladasList[0].municao.granada_dano} (DT{' '}
                  {municoesAcopladasList[0].municao.granada_dt || '-'})
                </span>
              )}
            {isLancadorGranadas && granadaAcoplada && (
              <span>
                <span className="text-green-400 font-bold">Granada:</span>{' '}
                {granadaAcoplada.Nome_Item}
              </span>
            )}
            <span>
              <span className="text-green-400 font-bold">Espaços:</span> {stats.espacos}
            </span>
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
              {formatarTexto(arma.Descricao_Item)}
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-zinc-800/50">
            {id !== 'coronhada-virtual' && (
              <>
                {arma.Tipo_Arma?.toLowerCase() !== 'corpo a corpo' &&
                  arma.Tipo_Arma?.toLowerCase() !== 'corpo-a-corpo' &&
                  arma.Tipo_Arma && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (
                          arma.Nome_Item?.toLowerCase().includes('lançador de granadas') ||
                          arma.Nome_Item?.toLowerCase().includes('lancador de granadas')
                        ) {
                          onAddMunicao?.();
                        } else {
                          const compativeis =
                            municoesHook?.getMunicoesCompativeis?.(
                              arma.Nome_Item,
                              arma.Categoria_Item
                            ) || [];
                          if (compativeis.length === 1) {
                            const idM = municoesHook?.adicionarMunicao(compativeis[0]);
                            if (idM) armasHook?.acoplarMunicao(id, idM);
                          } else if (onAddMunicao) {
                            onAddMunicao();
                          }
                        }
                      }}
                      className={`text-xs px-3 py-1.5 rounded bg-zinc-900 border transition-colors ${
                        arma.Nome_Item?.toLowerCase().includes('lançador de granadas') ||
                        arma.Nome_Item?.toLowerCase().includes('lancador de granadas')
                          ? 'border-zinc-700 hover:border-orange-700 hover:bg-orange-900/20 text-zinc-300 hover:text-orange-400'
                          : 'border-zinc-700 hover:border-blue-700 hover:bg-blue-900/20 text-zinc-300 hover:text-blue-400'
                      }`}
                    >
                      {arma.Nome_Item?.toLowerCase().includes('lançador de granadas') ||
                      arma.Nome_Item?.toLowerCase().includes('lancador de granadas')
                        ? '+ Granada'
                        : '+ Munição'}
                    </button>
                  )}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onEditar?.();
                  }}
                  className="text-xs px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 hover:border-yellow-700 hover:bg-yellow-900/20 text-zinc-300 hover:text-yellow-400 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removerArma(id);
                  }}
                  className="text-xs text-green-500 hover:text-green-400 bg-green-950/30 hover:bg-green-900/50 px-3 py-1.5 rounded border border-green-900/50 transition-colors"
                >
                  Remover
                </button>
              </>
            )}
          </div>
        </div>

        {municoesAcopladasList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-3 pt-3 pb-1 border-t border-zinc-800/50 bg-zinc-900/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Munições:
            </span>
            {municoesAcopladasList.map(minv => (
              <div
                key={minv.id}
                className="flex items-center gap-1 bg-green-950/40 border border-green-900/50 rounded-full pl-2 pr-1 py-0.5 group"
              >
                <span className="text-[11px] font-bold text-green-400 truncate max-w-[150px]">
                  {minv.municao.Nome_Item}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    armasHook?.desacoplarMunicao(item.id, minv.id);
                    municoesHook?.removerMunicao(minv.id);
                  }}
                  title="Remover Munição"
                  className="flex items-center justify-center w-4 h-4 rounded-full text-green-600 hover:text-red-400 hover:bg-green-900/50 transition-colors"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Collapse>
    </div>
  );
};
