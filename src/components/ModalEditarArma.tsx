import React, { useState, useRef } from 'react';
import type { ArmaInventario, Arma } from '../types';
import { InputOtimizado } from './InputOtimizado';
import { ToolbarFormato } from './ToolbarFormato';
import { CustomSelect } from './CustomSelect';

import { AprimoramentosSelector } from './AprimoramentosSelector';
import { useRPG } from '../context/RPGContext';
import { categoriaRomanParaNum, categoriaNumParaRoman } from '../utils/rpgRules';

const InputLabel = ({ label }: { label: string }) => (
  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">
    {label}
  </label>
);

export function ModalEditarArma({
  armaInventario,
  onSave,
  onClose,
}: {
  armaInventario: ArmaInventario;
  onSave: (novosDados: Partial<Arma>, modificacoes?: number[], maldicoes?: number[], maldicoesElementos?: Record<number, string>) => void;
  onClose: () => void;
}) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!armaInventario || !armaInventario.arma) {
    return null;
  }

  const { arma } = armaInventario;

  const [nome, setNome] = useState(arma.Nome_Item || '');
  const [descricao, setDescricao] = useState(arma.Descricao_Item || '');
  const [dano, setDano] = useState(arma.Dano_Arma || '');
  const [critico, setCritico] = useState(arma.Critico_Arma?.toString() || '');
  const [multiplicador, setMultiplicador] = useState(arma.Multiplicador_Arma?.toString() || '');
  const [alcance, setAlcance] = useState(arma.Alcance_Item || '');
  const [danoSecundario, setDanoSecundario] = useState(arma.Dano_Secundario || '');
  const [categoria, setCategoria] = useState(arma.Categoria_Item || '');
  const [espacos, setEspacos] = useState(arma['Espaos_Item']?.toString() || '');
  const [dt, setDt] = useState(arma.dt_item || '');

  const [proficiencia, setProficiencia] = useState(arma.Proficiencia || 'Armas Simples');
  const [tipoArma, setTipoArma] = useState(arma.Tipo_Arma || 'Corpo a Corpo');
  const [empunhadura, setEmpunhadura] = useState(arma.Empunhadura_Arma || 'Uma Mǜo');
  const [tipoDano, setTipoDano] = useState(arma.Tipo_Dano_Arma || 'Corte');

  const { modificacoesHook, maldicoesHook } = useRPG();

  const initialMods = Array.isArray(armaInventario.modificacoes) ? armaInventario.modificacoes : [];
  const initialMalds = Array.isArray(armaInventario.maldicoes) ? armaInventario.maldicoes : [];
  
  const [modificacoes, setModificacoes] = useState<number[]>(initialMods);
  const [maldicoes, setMaldicoes] = useState<number[]>(initialMalds);
  const [maldicoesElementos, setMaldicoesElementos] = useState<Record<number, string>>(armaInventario.maldicoes_elementos || {});
  
  const editorDesc = useRef<HTMLDivElement | null>(null);

  const temDiscreto = modificacoes.some(id => modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase() === 'discreto' || modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase() === 'discreta');
  const temMiraTelescopica = modificacoes.some(id => modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase() === 'mira telescpica' || modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase() === 'mira telescopica');
  const temMira = modificacoes.some(id => modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase().startsWith('mira'));
  const temCalibreGrosso = modificacoes.some(id => modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase() === 'calibre grosso');
  const temApocaliptica = modificacoes.some(id => modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase() === 'apocalptica' || modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)?.Nome_Modif.trim().toLowerCase() === 'apocaliptica');

  const ordAlcance = ['Curto', 'Mdio', 'Longo', 'Extremo', 'Ilimitado'];
  let alcanceFinal = alcance;
  if (temMiraTelescopica && alcance) {
    const idx = ordAlcance.indexOf(alcance);
    if (idx !== -1 && idx < ordAlcance.length - 1) alcanceFinal = ordAlcance[idx + 1];
  }

  const getEspacoNumber = (str: string) => {
    let val = Number(String(str).replace(',', '.').replace(/[^0-9.-]+/g, ''));
    return isNaN(val) ? 0 : val;
  };

  let espacosFinais = getEspacoNumber(espacos);
  if (temDiscreto) espacosFinais -= 1;
  if (espacosFinais < 0) espacosFinais = 0;

  let danoFinal = dano;
  if (temCalibreGrosso && dano) {
    danoFinal = dano.replace(/(\d+)d(\d+)/i, (match, p1, p2) => `${Number(p1) + 1}d${p2}`);
  }

  let criticoFinal = Number(critico) || 20;
  if (temMira) criticoFinal -= 2;

  const handleSalvar = () => {
    if (editorDesc.current) {
      setDescricao(editorDesc.current.innerHTML);
    }

    onSave({
      Nome_Item: nome,
      Descricao_Item: editorDesc.current?.innerHTML || descricao,
      Dano_Arma: dano,
      Critico_Arma: Number(critico) || 20,
      Multiplicador_Arma: Number(multiplicador) || 2,
      Alcance_Item: alcance,
      Dano_Secundario: danoSecundario,
      Categoria_Item: categoria,
      'Espaos_Item': getEspacoNumber(espacos),
      dt_item: dt,
      Proficiencia: proficiencia,
      Tipo_Arma: tipoArma,
      Empunhadura_Arma: empunhadura,
      Tipo_Dano_Arma: tipoDano
    }, modificacoes, maldicoes, maldicoesElementos);
    onClose();
  };

  const getOpcoesModificacoes = () => {
    return modificacoesHook.modificacoes.filter(m => {
      const tipo = m.Tipos_Arma?.toLowerCase() || '';
      if (tipo === 'qualquer') return true;
      if (tipoArma.toLowerCase().includes('corpo a corpo') && tipo.includes('corpo a corpo')) return true;
      if (tipoArma.toLowerCase().includes('fogo') && tipo.includes('fogo')) return true;
      if (tipoArma.toLowerCase().includes('disparo') && tipo.includes('disparo')) return true;
      if (tipoArma.toLowerCase().includes('arremesso') && tipo.includes('arremesso')) return true;
      return false;
    });
  };

  const getOpcoesMaldicoes = () => {
    return maldicoesHook.maldicoes.filter(m => m.Categoria_Mald.trim().toLowerCase().includes('armas'));
  };

  const catNum = categoriaRomanParaNum(categoria);
  let modificador = modificacoes.length;
  if (temApocaliptica) modificador -= 1;
  let custoMaldicoes = 0;
  if (maldicoes.length > 0) {
    custoMaldicoes = 2 + (maldicoes.length - 1);
  }

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

  const handleAddMod = (id: number) => {
    if (podeAdicionarMod) {
      setModificacoes(prev => [...prev, id]);
    }
  };

  const handleRemoveMod = (index: number) => {
    setModificacoes(prev => prev.filter((_, i) => i !== index));
  };

  const inputClass = "w-full rounded bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-green-500 focus:bg-zinc-900 focus:ring-1 focus:ring-green-500/50 hover:border-zinc-700";
  const selectClass = "w-full rounded border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 outline-none transition-all hover:border-zinc-700 focus:border-green-500 focus:bg-zinc-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div 
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.8)] ring-1 ring-white/5" 
        onClick={e => e.stopPropagation()}
      >
        {/* Glow de borda no topo do Modal */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/5 bg-zinc-900/40 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 text-green-500 shadow-[0_0_15px_rgba(22,163,74,0.15)] text-xl">
              🗡️
            </div>
            <div>
              <h2 className="font-display text-xl uppercase tracking-wider text-zinc-100 drop-shadow-md">
                Editar Arma
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-widest font-semibold">
                Configure os atributos, dano e poder paranormal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-8">
          
          {/* SECTION: Atributos Básicos */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-green-400/90">Atributos Básicos</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 md:col-span-2">
                <InputLabel label="Nome da Arma" />
                <InputOtimizado value={nome} onChange={setNome} className={inputClass} />
              </div>

              <div>
                <InputLabel label="Proficiência" />
                <CustomSelect
                  value={proficiencia}
                  onChange={val => setProficiencia(val)}
                  options={[
                    { value: "Armas Simples", label: "Armas Simples" },
                    { value: "Armas Táticas", label: "Armas Táticas" },
                    { value: "Armas Pesadas", label: "Armas Pesadas" }
                  ]}
                  wrapperClassName="w-full"
                  className={selectClass}
                />
              </div>

              <div>
                <InputLabel label="Tipo da Arma" />
                <CustomSelect
                  value={tipoArma}
                  onChange={val => setTipoArma(val)}
                  options={[
                    { value: "Corpo a Corpo", label: "Corpo a Corpo" },
                    { value: "Arma de Disparo", label: "Arma de Disparo" },
                    { value: "Arma de Fogo", label: "Arma de Fogo" },
                    { value: "Arma de Arremesso", label: "Arma de Arremesso" },
                    { value: "Explosivos", label: "Explosivos" }
                  ]}
                  wrapperClassName="w-full"
                  className={selectClass}
                />
              </div>

              <div>
                <InputLabel label="Empunhadura" />
                <CustomSelect
                  value={empunhadura}
                  onChange={val => setEmpunhadura(val)}
                  options={[
                    { value: "Leve", label: "Leve" },
                    { value: "Uma Mão", label: "Uma Mão" },
                    { value: "Duas Mãos", label: "Duas Mãos" },
                    { value: "Uma Mão/Duas Mãos", label: "Uma Mão/Duas Mãos" }
                  ]}
                  wrapperClassName="w-full"
                  className={selectClass}
                />
              </div>

              <div>
                <InputLabel label="Tipo de Dano" />
                <CustomSelect
                  value={tipoDano}
                  onChange={val => setTipoDano(val)}
                  options={[
                    { value: "Corte", label: "Corte" },
                    { value: "Perfuração", label: "Perfuração" },
                    { value: "Impacto", label: "Impacto" },
                    { value: "Balístico", label: "Balístico" },
                    { value: "Fogo", label: "Fogo" },
                    { value: "Frio", label: "Frio" },
                    { value: "Químico", label: "Químico" },
                    { value: "Eletricidade", label: "Eletricidade" },
                    { value: "Morte", label: "Morte" },
                    { value: "Sangue", label: "Sangue" },
                    { value: "Energia", label: "Energia" },
                    { value: "Conhecimento", label: "Conhecimento" },
                    { value: "Medo", label: "Medo" }
                  ]}
                  wrapperClassName="w-full"
                  className={selectClass}
                />
              </div>
            </div>
          </section>

          {/* SECTION: Combate */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-green-400/90">Estatísticas de Combate</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="col-span-2 md:col-span-1">
                <InputLabel label="Dano" />
                <InputOtimizado
                  value={danoFinal}
                  onChange={val => {
                    if (temCalibreGrosso) {
                      const reversao = val.replace(/(\d+)d(\d+)/i, (match, p1, p2) => `${Math.max(1, Number(p1) - 1)}d${p2}`);
                      setDano(reversao);
                    } else {
                      setDano(val);
                    }
                  }}
                  placeholder="Ex: 1d8"
                  className={inputClass}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputLabel label="Dado Bônus" />
                <InputOtimizado
                  value={danoSecundario}
                  onChange={setDanoSecundario}
                  placeholder="Ex: +2d6"
                  className={inputClass}
                />
              </div>

              <div>
                <InputLabel label="Crítico (Margem)" />
                <InputOtimizado
                  value={criticoFinal.toString()}
                  onChange={val => {
                    const num = Number(val);
                    if (!isNaN(num)) {
                      setCritico(temMira ? (num + 2).toString() : val);
                    } else {
                      setCritico(val);
                    }
                  }}
                  placeholder="Ex: 19"
                  className={inputClass}
                />
              </div>

              <div>
                <InputLabel label="Multiplicador" />
                <InputOtimizado
                  value={multiplicador}
                  onChange={setMultiplicador}
                  placeholder="Ex: 2"
                  className={inputClass}
                />
              </div>

              <div className="col-span-2">
                <InputLabel label="Alcance" />
                <CustomSelect
                  value={alcanceFinal}
                  onChange={(val) => {
                    if (temMiraTelescopica) {
                      const idx = ordAlcance.indexOf(val);
                      if (idx > 0) {
                        setAlcance(ordAlcance[idx - 1]);
                      } else {
                        setAlcance(val);
                      }
                    } else {
                      setAlcance(val);
                    }
                  }}
                  options={[
                    { value: "", label: "Nenhum" },
                    { value: "Curto", label: "Curto" },
                    { value: "Médio", label: "Médio" },
                    { value: "Longo", label: "Longo" },
                    { value: "Extremo", label: "Extremo" },
                    { value: "Ilimitado", label: "Ilimitado" }
                  ]}
                  wrapperClassName="w-full"
                  className={selectClass}
                />
              </div>

              <div className="col-span-2">
                <InputLabel label="Teste DT" />
                <InputOtimizado
                  value={dt}
                  onChange={setDt}
                  placeholder="Ex: Fortitude, 20"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* SECTION: Inventário */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-green-400/90">Inventário</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <InputLabel label="Categoria" />
                <InputOtimizado
                  value={categoriaNumParaRoman(catFinal)}
                  onChange={(val) => {
                      const finalDesejado = categoriaRomanParaNum(val);
                      let modCount = modificacoes.length;
                      if (temApocaliptica) modCount -= 1;
                      setCategoria(categoriaNumParaRoman(Math.max(0, finalDesejado - modCount - custoMaldicoes)));
                    }}
                  placeholder="Ex: I, II, 0"
                  className={inputClass}
                />
              </div>

              <div>
                <InputLabel label="Espaços" />
                <InputOtimizado
                  value={espacosFinais.toString()}
                  onChange={val => {
                    const num = getEspacoNumber(val);
                    setEspacos(temDiscreto ? String(num + 1) : String(num));
                  }}
                  type="number"
                  step="0.5"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* SECTION: Descrição */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-green-400/90">Descrição</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            </div>
            
            <div className="rounded border border-zinc-800/80 bg-zinc-900/30 overflow-hidden focus-within:border-green-500/50 focus-within:ring-1 focus-within:ring-green-500/50 transition-all">
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
                className="w-full p-4 text-sm text-zinc-300 outline-none overflow-y-auto custom-scrollbar max-h-[250px] leading-relaxed"
              />
            </div>
          </section>

          {/* SECTION: Aprimoramentos */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-green-400/90">Aprimoramentos Paranormais</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            </div>
            
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-5">
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
          </section>

        </div>

        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-white/5 bg-zinc-900/40 px-6 py-5">
          <button
            onClick={onClose}
            className="rounded border border-zinc-700 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="rounded bg-green-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:bg-green-500 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(22,163,74,0.6)] transition-all"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
