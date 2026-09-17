import React, { useState, useRef, useEffect } from 'react';
import type { MunicaoInventario, Municao } from '../types';
import { InputOtimizado } from './InputOtimizado';
import { ToolbarFormato } from './ToolbarFormato';
import { AprimoramentosSelector } from './AprimoramentosSelector';
import { useRPG } from '../context/RPGContext';
import { categoriaRomanParaNum, categoriaNumParaRoman } from '../utils/rpgRules';

export function ModalEditarMunicao({
  itemInventario,
  onSave,
  onClose,
}: {
  itemInventario: MunicaoInventario;
  onSave: (novosDados: Partial<Municao>, modificacoes?: number[], maldicoes?: number[], maldicoesElementos?: Record<number, string>) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!itemInventario || !itemInventario.municao) {
    return null;
  }

  const { municao } = itemInventario;

  const [nome, setNome] = useState(municao.Nome_Item || '');
  const [descricao, setDescricao] = useState(municao.Descricao_Item || '');
  const [categoria, setCategoria] = useState(municao.Categoria_Item || 'I');
  const [espacos, setEspacos] = useState(municao['Espaços_Item']?.toString() || '1');

  const { modificacoesHook, maldicoesHook } = useRPG();

  const initialMods = Array.isArray(itemInventario.modificacoes) ? itemInventario.modificacoes : [];
  const initialMalds = Array.isArray(itemInventario.maldicoes) ? itemInventario.maldicoes : [];
  
  const [modificacoes, setModificacoes] = useState<number[]>(initialMods);
  const [maldicoes, setMaldicoes] = useState<number[]>(initialMalds);
  const [maldicoesElementos, setMaldicoesElementos] = useState<Record<number, string>>({});

  const temDiscreto = modificacoes.some(id => {
    const nome = modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase();
    return nome === 'discreto' || nome === 'discreta';
  });
  
  const getEspacoNumber = (val: string | number) => {
    const num = Number(String(val).replace(',', '.').replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
  };
  const baseEspacos = getEspacoNumber(espacos);
  const espacosFinais = temDiscreto ? Math.max(0, baseEspacos - 1) : baseEspacos;

  const catNum = categoriaRomanParaNum(categoria);
  let modificador = modificacoes.length;
  let custoMaldicoes = maldicoes.length > 0 ? 2 + (maldicoes.length - 1) : 0;
  
  const catFinal = catNum + modificador + custoMaldicoes;
  const podeAdicionarMod = catFinal < 4;
  const custoProximaMaldicao = maldicoes.length === 0 ? 2 : 1;
  const podeAdicionarMald = (catFinal + custoProximaMaldicao) <= 4;

  const handleAddMald = (id: number, elementoVaria?: string) => {
    if (podeAdicionarMald) {
      setMaldicoes(prev => [...prev, id]);
      if (elementoVaria) {
        setMaldicoesElementos(prev => ({ ...prev, [id]: elementoVaria }));
      }
    }
  };

  const handleRemoveMald = (index: number) => {
    setMaldicoes(prev => {
      const removedId = prev[index];
      if (removedId !== undefined) {
        setMaldicoesElementos(elemPrev => {
          const copy = { ...elemPrev };
          delete copy[removedId];
          return copy;
        });
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const getOpcoesMaldicoes = () => {
    return maldicoesHook.maldicoes.filter(m => {
      const cat = m.Categoria_Mald.trim().toLowerCase();
      return cat.includes('armas') || cat.includes('munição') || cat.includes('municão');
    });
  };

  const handleAddMod = (id: number) => {
    if (podeAdicionarMod) {
      setModificacoes(prev => [...prev, id]);
    }
  };

  const handleRemoveMod = (index: number) => {
    setModificacoes(prev => prev.filter((_, i) => i !== index));
  };

  const getOpcoesModificacoes = () => {
    return modificacoesHook.modificacoes.filter(m => {
      if (!m.Categoria_Modif) return false;
      const cat = m.Categoria_Modif.toLowerCase();
      // Permitimos modificações de armas de fogo porque as munições acopladas nelas transferem essas modificações para a arma
      return cat.includes('muni');
    });
  };

  const editorDesc = useRef<HTMLDivElement | null>(null);

  const handleSalvar = () => {
    onSave({
      Nome_Item: nome,
      Descricao_Item: editorDesc.current?.innerHTML || descricao,
      Categoria_Item: categoria,
      'Espaços_Item': getEspacoNumber(espacos),
    }, modificacoes, maldicoes, maldicoesElementos);
  };

  const InputLabel = ({ label }: { label: string }) => (
    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 block">
      {label}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-5" onClick={onClose}>
      <div 
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-5 py-4">
          <h2 className="font-display text-lg uppercase tracking-wide text-zinc-100">
            Editar Munição
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 transition hover:text-zinc-100 p-2 text-2xl border-none bg-transparent"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-5">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 shadow-sm">
                <h3 className="font-bold text-yellow-500 mb-3 border-b border-zinc-800 pb-2 text-xs uppercase tracking-widest">Informações Principais</h3>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <InputLabel label="Nome da Munição" />
                    <InputOtimizado
                      value={nome}
                      onChange={setNome}
                      className="w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-sm text-zinc-100 outline-none focus:border-yellow-700 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <InputLabel label="Categoria" />
                      <InputOtimizado
                        value={categoriaNumParaRoman(catFinal)}
                        onChange={val => setCategoria(categoriaNumParaRoman(Math.max(0, categoriaRomanParaNum(val) - (modificador + custoMaldicoes))))}
                        className="w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-sm text-zinc-100 outline-none focus:border-yellow-700 transition"
                      />
                    </div>

                    <div>
                      <InputLabel label="Espaços" />
                      <InputOtimizado
                        value={espacosFinais.toString()}
                        onChange={val => {
                          const num = getEspacoNumber(val);
                          setEspacos(temDiscreto ? num + 1 : num);
                        }}
                        type="number"
                        step="0.5"
                        className="w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-sm text-zinc-100 outline-none focus:border-yellow-700 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 shadow-sm flex flex-col h-full">
                <h3 className="font-bold text-yellow-500 mb-3 border-b border-zinc-800 pb-2 text-xs uppercase tracking-widest">Descrição</h3>
                <div className="flex-1 flex flex-col min-h-[150px]">
                  <ToolbarFormato editorRef={editorDesc as any} />
                  <div
                    ref={(el) => {
                      editorDesc.current = el;
                      if (el && !el.dataset.initialized) {
                        el.innerHTML = descricao;
                        el.dataset.initialized = 'true';
                      }
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setDescricao(e.currentTarget.innerHTML)}
                    className="w-full p-3 text-sm text-zinc-100 outline-none overflow-y-auto custom-scrollbar flex-1 border border-zinc-800 rounded-b focus:border-yellow-700 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 border-t border-zinc-800 pt-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 block">Aprimoramentos da Munição</label>
            <AprimoramentosSelector 
              modificacoesAplicadas={modificacoes}
              opcoesModificacoes={getOpcoesModificacoes()}
              todasModificacoes={modificacoesHook.modificacoes}
              onAddMod={handleAddMod}
              onRemoveMod={handleRemoveMod}
              podeAdicionarMod={podeAdicionarMod}
              
              maldicoesAplicadas={maldicoes}
              opcoesMaldicoes={getOpcoesMaldicoes()}
              todasMaldicoes={maldicoesHook.maldicoes}
              maldicoesElementos={maldicoesElementos}
              onAddMald={handleAddMald}
              onRemoveMald={handleRemoveMald}
              podeAdicionarMald={podeAdicionarMald}
            />
          </div>

        </div>

        <div className="border-t border-zinc-800 bg-zinc-900/50 px-5 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="rounded bg-yellow-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-yellow-950 shadow-lg transition hover:bg-yellow-500"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
