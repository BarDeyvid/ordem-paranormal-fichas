import React from 'react';
import type { Patente, LimiteCredito } from '../hooks/useInventario';
import { CustomSelect } from './CustomSelect';

export interface InventarioHeaderProps {
  prestigio: number;
  setPrestigio: (val: number) => void;
  patente: Patente;
  setPatenteManual: (val: Patente) => void;
  credito: LimiteCredito;
  setCreditoOverride: (val: LimiteCredito) => void;
  cargaAtual: number;
  cargaMaxima: number;
  limitesItens: number[];
  setLimiteItemCategoria: (index: number, val: number) => void;
  noInventario: number[];
}

const patentesDisponiveis: Patente[] = [
  'Recruta',
  'Operador',
  'Agente Especial',
  'Oficial de Operações',
  'Agente de Elite',
];

const creditosDisponiveis: LimiteCredito[] = ['Baixo', 'Médio', 'Alto', 'Ilimitado'];

export const InventarioHeader: React.FC<InventarioHeaderProps> = ({
  prestigio,
  setPrestigio,
  patente,
  setPatenteManual,
  credito,
  setCreditoOverride,
  cargaAtual,
  cargaMaxima,
  limitesItens,
  setLimiteItemCategoria,
  noInventario,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/* LINHA 1: Prestígio + Patente */}
      <div className="flex items-end gap-4 pr-2">
        <div className="flex flex-col gap-1">
          <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-500">
            Prestígio
          </label>
          <input
            type="number"
            min="0"
            value={prestigio}
            onChange={e => setPrestigio(Number(e.target.value))}
            className="w-16 rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-sm font-bold text-zinc-100 outline-none transition focus:border-green-700"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-500">
            Patente
          </label>
          <CustomSelect
            value={patente}
            onChange={val => setPatenteManual(val as Patente)}
            wrapperClassName="w-full"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-sm font-bold text-zinc-100 outline-none transition focus:border-green-700"
            options={patentesDisponiveis.map(p => ({ value: p, label: p }))}
          />
        </div>
      </div>

      {/* LINHA 2: Crédito + Carga */}
      <div className="flex items-end gap-4 pr-2">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-500">
            Crédito
          </label>
          <CustomSelect
            value={credito}
            onChange={val => setCreditoOverride(val as LimiteCredito)}
            wrapperClassName="w-full"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-sm font-bold text-zinc-100 outline-none transition focus:border-green-700"
            options={creditosDisponiveis.map(c => ({ value: c, label: c }))}
          />
        </div>
        <div className="flex flex-col gap-1 w-24">
          <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-500">
            Carga
          </label>
          <div className="flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 justify-center">
            <span
              className={`text-sm font-bold ${
                cargaAtual > cargaMaxima ? 'text-red-400' : 'text-zinc-100'
              }`}
            >
              {cargaAtual}
            </span>
            <span className="text-zinc-600 text-xs">/</span>
            <span className="text-sm font-bold text-zinc-500">{cargaMaxima}</span>
          </div>
        </div>
      </div>

      {/* LINHA 3: Limite + Em Uso */}
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 items-center mt-2 pr-2">
        <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-500 text-right">
          Limite
        </label>
        <div className="flex gap-1 min-w-0">
          {limitesItens.map((limite, index) => (
            <input
              key={`limite-${index}`}
              type="number"
              min="0"
              value={limite}
              onChange={e => setLimiteItemCategoria(index, Number(e.target.value))}
              className="flex-1 min-w-0 rounded border border-zinc-700 bg-zinc-900 py-1.5 text-center text-sm font-bold text-zinc-100 outline-none transition focus:border-green-700"
            />
          ))}
        </div>
        <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-500 text-right">
          Em uso
        </label>
        <div className="flex gap-1 min-w-0">
          {noInventario.map((qtd: number, index: number) => (
            <div
              key={`inventario-${index}`}
              className={`flex-1 min-w-0 rounded border py-1.5 flex items-center justify-center text-sm font-bold ${
                qtd > limitesItens[index]
                  ? 'border-red-800/60 bg-red-950/30 text-red-400'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-500'
              }`}
            >
              {qtd}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
