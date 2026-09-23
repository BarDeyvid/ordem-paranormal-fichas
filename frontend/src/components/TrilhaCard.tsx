import React, { useState } from 'react';
import { Collapse } from './Collapse';
import { formatarDescricao } from '../utils/formatters';
import { calcularNivel } from '../utils/rpgRules';

export interface TrilhaData {
  Codigo_Trilha: number;
  Nome_Trilha: string;
  Descricao_Trilha: string;
  Fonte_Trilha?: string;
  nome_pericia?: string;
  Nome_Habilidade_10?: string;
  Descricao_Habilidade_10?: string;
  Nome_Habilidade_40?: string;
  Descricao_Habilidade_40?: string;
  Nome_Habilidade_65?: string;
  Descricao_Habilidade_65?: string;
  Nome_Habilidade_99?: string;
  Descricao_Habilidade_99?: string;
}

export interface TrilhaCardProps {
  trilha: TrilhaData;
  isVersatilidade?: boolean;
  tipoRotulo?: string;
  classe?: string;
  isNEXExperiencia?: boolean;
  effectiveNex: number;
  estaExpandida: boolean;
  toggleExpandir: () => void;
  habilidadesExpandidas: string[];
  toggleHabilidadeExpandida: (id: string) => void;
  onEditar?: () => void;
  onRemover: () => void;
}

export const TrilhaCard: React.FC<TrilhaCardProps> = ({
  trilha,
  isVersatilidade = false,
  tipoRotulo = 'Trilha',
  classe = '',
  isNEXExperiencia = false,
  effectiveNex,
  estaExpandida,
  toggleExpandir,
  habilidadesExpandidas,
  toggleHabilidadeExpandida,
  onEditar,
  onRemover,
}) => {
  const nexLevels = isVersatilidade ? [10] : [10, 40, 65, 99];

  return (
    <div className="mb-2 overflow-hidden rounded-r border-l-4 border-green-800 bg-zinc-900/50">
      <div
        onClick={toggleExpandir}
        className="flex cursor-pointer flex-col bg-zinc-800/40 px-4 py-3 transition hover:bg-zinc-700/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-zinc-500">
              {tipoRotulo}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-200">
                {isVersatilidade ? 'Versatilidade' : trilha.Nome_Trilha}
              </span>
              {!isVersatilidade && trilha.nome_pericia && (
                <span className="text-[10px] uppercase text-zinc-500">
                  ({trilha.nome_pericia})
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-zinc-600">
            {estaExpandida ? '▲' : '▼'}
          </span>
        </div>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="px-4 pb-4 pt-1 text-sm text-zinc-400">
          <div
            className="mb-4 text-zinc-400 text-left leading-relaxed text-sm"
            dangerouslySetInnerHTML={{
              __html: formatarDescricao(
                isVersatilidade
                  ? `Em ${isNEXExperiencia ? 'Nível 10' : 'NEX 50%'}, escolha entre receber um poder de ${classe.toLowerCase()} ou o primeiro poder de uma trilha de ${classe.toLowerCase()} que não a sua.<br/><br/>Trilha Escolhida: <strong>${trilha.Nome_Trilha}</strong>`
                  : trilha.Descricao_Trilha
              ),
            }}
          />

          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-green-400 border-b border-zinc-800 pb-1">
            {isVersatilidade ? 'Poder da Trilha' : 'Habilidades da Trilha'}
          </h4>

          {nexLevels.map((nexLvl) => {
            if (effectiveNex < nexLvl) return null;

            const habNameKey = `Nome_Habilidade_${nexLvl}` as keyof TrilhaData;
            const habDescKey = `Descricao_Habilidade_${nexLvl}` as keyof TrilhaData;
            const nomeHab = trilha[habNameKey] as string;
            const descHab = trilha[habDescKey] as string;

            if (!nomeHab) return null;

            const uniqueHabId = `trilha_${isVersatilidade ? 'versatilidade_' : ''}${trilha.Codigo_Trilha}_hab_${nexLvl}`;
            const isHabExpanded = habilidadesExpandidas.includes(uniqueHabId);

            return (
              <div key={nexLvl} className="mb-2 overflow-hidden rounded border border-zinc-800 bg-zinc-900/50">
                <div
                  onClick={() => toggleHabilidadeExpandida(uniqueHabId)}
                  className="flex cursor-pointer items-center justify-between px-3 py-2 transition hover:bg-zinc-800"
                >
                  <span className="font-bold text-zinc-200 text-xs">
                    {isNEXExperiencia ? `Nível ${calcularNivel(nexLvl)}` : `NEX ${nexLvl}%`} - <span className="text-zinc-400">{nomeHab}</span>
                  </span>
                  <span className="text-xs text-zinc-600">
                    {isHabExpanded ? '▲' : '▼'}
                  </span>
                </div>
                <Collapse isOpen={isHabExpanded}>
                  <div
                    className="px-3 pb-3 pt-1 text-xs text-zinc-400"
                    dangerouslySetInnerHTML={{ __html: formatarDescricao(descHab) }}
                  />
                </Collapse>
              </div>
            );
          })}

          {trilha.Fonte_Trilha && (
            <div className="mt-3 flex justify-end">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                Fonte: {trilha.Fonte_Trilha}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-zinc-800/50">
            {!isVersatilidade && onEditar && (
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemover();
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
