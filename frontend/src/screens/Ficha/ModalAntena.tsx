import React, { useState } from 'react';
import { useRPG } from '../../context/RPGContext';
import { Collapse } from '../../components/Collapse';

interface ModalAntenaProps {
  onFechar: () => void;
  onSelect: (ritualNome: string, ritualElemento: string) => void;
}

const getCorElemento = (elemento: string) => {
  const e = elemento.trim().toLowerCase();
  if (e === 'sangue') return 'text-red-500';
  if (e === 'morte') return 'text-zinc-100 bg-black/60 px-1 rounded';
  if (e === 'conhecimento') return 'text-yellow-500';
  if (e === 'energia') return 'text-purple-500';
  if (e === 'medo') return 'text-zinc-950 bg-zinc-200/90 px-1 rounded';
  return 'text-zinc-400';
};

export const ModalAntena: React.FC<ModalAntenaProps> = ({ onFechar, onSelect }) => {
  const { rituaisHook } = useRPG();
  const [busca, setBusca] = useState('');
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const toggleExpandir = (id: string) => {
    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const rituaisFiltrados = (rituaisHook?.rituaisAprendidos || [])
    .map(ra => {
      const base = rituaisHook?.rituais?.find(r => r.Codigo_Ritual === ra.codigo_ritual);
      return {
        origem: ra.origem,
        nome: ra.customNome || base?.Nome_Ritual || 'Ritual Desconhecido',
        elemento: ra.elemento_escolhido || base?.Elemento_Ritual || 'Outros',
        descricao: ra.customDesc || base?.Descricao_Ritual || '',
        circulo: base?.Circulo_Ritual || 1,
      };
    })
    .filter(r => r.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onFechar} />
      
      <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl relative">
        <div className="flex flex-col border-b border-zinc-800 p-5 pb-4 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg uppercase tracking-wide text-zinc-100">
                A ANTENA
              </h3>
              <p className="mt-1 text-xs text-zinc-400">Selecione um ritual para canalizar através da arma.</p>
            </div>
            <button onClick={onFechar} className="border-none bg-transparent text-2xl text-zinc-500 transition hover:text-zinc-100">&times;</button>
          </div>
          
          <div className="flex items-stretch gap-2">
            <input
              type="text"
              placeholder="Buscar ritual aprendido..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="flex-1 rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-green-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {rituaisFiltrados.length === 0 ? (
            <div className="text-center text-zinc-500 italic p-4">Nenhum ritual encontrado.</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-3 items-start">
              <div className="flex flex-col gap-3 w-full flex-1 min-w-0">
                {rituaisFiltrados.filter((_, i) => i % 2 === 0).map((ritual) => {
                  const isExpanded = !!expandidos[ritual.origem];
                  return (
                  <div key={ritual.origem} onClick={() => toggleExpandir(ritual.origem)} className="bg-zinc-900/40 border border-zinc-800/80 rounded p-2 hover:border-green-500/50 hover:bg-zinc-900/80 group flex flex-col overflow-hidden transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-zinc-200 group-hover:text-green-400 transition select-none flex-1 mt-0.5 truncate flex items-center gap-2">
                        {ritual.nome}
                        <span className={`text-[10px] uppercase tracking-wider ${getCorElemento(ritual.elemento)}`}>{ritual.elemento}</span>
                      </h3>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center flex-nowrap gap-3 text-xs overflow-hidden transition-all duration-300 ease-in-out text-zinc-300 mb-2">
                        <span className="italic text-zinc-400">Ritual - {ritual.circulo}º Círculo</span>
                      </div>
                      
                      <Collapse isOpen={isExpanded} previewHeight="3em">
                        <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed whitespace-pre-wrap select-none min-h-[3em]">
                          {ritual.descricao}
                        </p>
                      </Collapse>
                    </div>

                    <div className="flex flex-nowrap items-center gap-2 mt-auto overflow-hidden transition-all duration-300 ease-in-out text-[11px] border-t border-zinc-800/50 pt-2">
                      
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(ritual.nome, ritual.elemento);
                        }}
                        className="ml-auto shrink-0 px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors active:scale-95"
                      >
                        Canalizar
                      </button>
                    </div>
                  </div>
                )})}
              </div>
              <div className="flex flex-col gap-3 w-full flex-1 min-w-0">
                {rituaisFiltrados.filter((_, i) => i % 2 !== 0).map((ritual) => {
                  const isExpanded = !!expandidos[ritual.origem];
                  return (
                  <div key={ritual.origem} onClick={() => toggleExpandir(ritual.origem)} className="bg-zinc-900/40 border border-zinc-800/80 rounded p-2 hover:border-green-500/50 hover:bg-zinc-900/80 group flex flex-col overflow-hidden transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-zinc-200 group-hover:text-green-400 transition select-none flex-1 mt-0.5 truncate flex items-center gap-2">
                        {ritual.nome}
                        <span className={`text-[10px] uppercase tracking-wider ${getCorElemento(ritual.elemento)}`}>{ritual.elemento}</span>
                      </h3>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center flex-nowrap gap-3 text-xs overflow-hidden transition-all duration-300 ease-in-out text-zinc-300 mb-2">
                        <span className="italic text-zinc-400">Ritual - {ritual.circulo}º Círculo</span>
                      </div>
                      
                      <Collapse isOpen={isExpanded} previewHeight="3em">
                        <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed whitespace-pre-wrap select-none min-h-[3em]">
                          {ritual.descricao}
                        </p>
                      </Collapse>
                    </div>

                    <div className="flex flex-nowrap items-center gap-2 mt-auto overflow-hidden transition-all duration-300 ease-in-out text-[11px] border-t border-zinc-800/50 pt-2">
                      
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(ritual.nome, ritual.elemento);
                        }}
                        className="ml-auto shrink-0 px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors active:scale-95"
                      >
                        Canalizar
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
};
