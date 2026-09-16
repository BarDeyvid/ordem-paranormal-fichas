import React from 'react';
import { useState, useRef } from 'react';
import { useRPG } from '../../context/RPGContext';
import type { ItemGeral } from '../../types';

import { formatarTexto } from '../../utils/formatters';
import { Collapse } from '../../components/Collapse';

interface ModalGranadasProps {
  onFechar: () => void;
  onSelect: (granada: ItemGeral) => void;
}

export function ModalGranadas({ onFechar, onSelect }: ModalGranadasProps) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const { itensHook, regrasAutomaticasAtivas } = useRPG();
  const [busca, setBusca] = useState('');
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  
  const toggleExpandir = (id: string) => {
    setExpandidos(prev => ({...prev, [id]: !prev[id]}));
  };

  const granadasDisponiveis = itensHook?.itens.filter(i => i.Nome_Item.toLowerCase().includes('granada')) || [];

  const granadasFiltradas = granadasDisponiveis.filter(m => {
    if (busca && !m.Nome_Item.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.Nome_Item.localeCompare(b.Nome_Item));
  
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl relative">
        <div className="flex flex-col gap-3 border-b border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                <span className="text-2xl">💣</span>
                Selecionar Granada
              </h2>
              <p className="mt-1 text-xs text-zinc-400">Selecione uma granada para acoplar ao lançador.</p>
            </div>
            <button onClick={onFechar} className="border-none bg-transparent text-2xl text-zinc-500 transition hover:text-zinc-100">&times;</button>
          </div>
          
          <div className="flex items-stretch gap-2">
            <input
              type="text"
              placeholder="Buscar granada..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="flex-1 rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-orange-700"
            />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {granadasFiltradas.length === 0 ? (
            <div className="text-center text-zinc-500 italic p-4">Nenhuma granada encontrada.</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-3 items-start">
              <div className="flex flex-col gap-3 w-full flex-1 min-w-[200px]">
                {granadasFiltradas.filter((_, i) => i % 2 === 0).map((granada) => {
                  const isExpanded = !!expandidos[String(granada.Codigo_Item || granada.Nome_Item)];
                  return (
                  <div key={granada.Codigo_Item || granada.Nome_Item} onClick={() => toggleExpandir(String(granada.Codigo_Item || granada.Nome_Item))} className={`bg-zinc-900/40 border border-zinc-800/80 rounded p-2 hover:border-orange-500/50 hover:bg-zinc-900/80 group flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'min-h-[130px] max-h-[3000px]' : 'min-h-[130px] max-h-[130px]'} cursor-pointer`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-zinc-200 group-hover:text-orange-400 transition select-none flex-1 mt-0.5 truncate">
                        {granada.Nome_Item}
                      </h3>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center flex-nowrap gap-3 text-xs overflow-hidden transition-all duration-300 ease-in-out text-zinc-300 mb-2">
                        <span className="italic text-zinc-400">{granada.Dano_Item?.split(',')[0]} Dano</span>
                      </div>
                      
                      <Collapse isOpen={isExpanded} previewHeight="3em">
                        <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed whitespace-pre-wrap select-none min-h-[3em]">
                          {formatarTexto(granada.Descricao_Item || '')}
                        </p>
                      </Collapse>
                    </div>

                    <div className="flex flex-nowrap items-center gap-2 mt-auto overflow-hidden transition-all duration-300 ease-in-out text-[11px] border-t border-zinc-800/50 pt-2">
                      <span className="text-zinc-500">
                        <span className="text-orange-400 font-semibold">Espaços:</span> {(regrasAutomaticasAtivas?.has(43) && (granada.Espacos_Itens === 0.5 || String(granada.Espacos_Itens) === '0,5' || String(granada.Espacos_Itens) === '0.5')) ? 0.25 : granada.Espacos_Itens}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1">
                        • <span className="text-orange-400 font-semibold">Categoria:</span> <span className="uppercase tracking-wider text-zinc-400">{granada.Categoria_Item}</span>
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(granada);
                        }}
                        className="ml-auto shrink-0 px-3 py-1 bg-orange-700 hover:bg-orange-600 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors active:scale-95"
                      >
                        Acoplar
                      </button>
                    </div>
                  </div>
                )})}
              </div>
              <div className="flex flex-col gap-3 w-full flex-1 min-w-[200px]">
                {granadasFiltradas.filter((_, i) => i % 2 !== 0).map((granada) => {
                  const isExpanded = !!expandidos[String(granada.Codigo_Item || granada.Nome_Item)];
                  return (
                  <div key={granada.Codigo_Item || granada.Nome_Item} onClick={() => toggleExpandir(String(granada.Codigo_Item || granada.Nome_Item))} className={`bg-zinc-900/40 border border-zinc-800/80 rounded p-2 hover:border-orange-500/50 hover:bg-zinc-900/80 group flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'min-h-[130px] max-h-[3000px]' : 'min-h-[130px] max-h-[130px]'} cursor-pointer`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-zinc-200 group-hover:text-orange-400 transition select-none flex-1 mt-0.5 truncate">
                        {granada.Nome_Item}
                      </h3>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center flex-nowrap gap-3 text-xs overflow-hidden transition-all duration-300 ease-in-out text-zinc-300 mb-2">
                        <span className="italic text-zinc-400">{granada.Dano_Item?.split(',')[0]} Dano</span>
                      </div>
                      
                      <Collapse isOpen={isExpanded} previewHeight="3em">
                        <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed whitespace-pre-wrap select-none min-h-[3em]">
                          {formatarTexto(granada.Descricao_Item || '')}
                        </p>
                      </Collapse>
                    </div>

                    <div className="flex flex-nowrap items-center gap-2 mt-auto overflow-hidden transition-all duration-300 ease-in-out text-[11px] border-t border-zinc-800/50 pt-2">
                      <span className="text-zinc-500">
                        <span className="text-orange-400 font-semibold">Espaços:</span> {(regrasAutomaticasAtivas?.has(43) && (granada.Espacos_Itens === 0.5 || String(granada.Espacos_Itens) === '0,5' || String(granada.Espacos_Itens) === '0.5')) ? 0.25 : granada.Espacos_Itens}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1">
                        • <span className="text-orange-400 font-semibold">Categoria:</span> <span className="uppercase tracking-wider text-zinc-400">{granada.Categoria_Item}</span>
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(granada);
                        }}
                        className="ml-auto shrink-0 px-3 py-1 bg-orange-700 hover:bg-orange-600 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors active:scale-95"
                      >
                        Acoplar
                      </button>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
