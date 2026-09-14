import React from 'react';
import { useRPG } from '../../context/RPGContext';
import type { ArmaInventario } from '../../types';
import { Collapse } from '../../components/Collapse';
import { CustomSelect } from '../../components/CustomSelect';

const ATRIBUTO_OPTIONS = [
  { label: 'FOR', value: 'FOR' },
  { label: 'AGI', value: 'AGI' },
  { label: 'INT', value: 'INT' },
  { label: 'PRE', value: 'PRE' },
  { label: 'VIG', value: 'VIG' },
  { label: 'NENHUM', value: 'NENHUM' }
];

function calcularDanoMedio(danoStr: string, multCritico: number): { normal: number, critico: number } {
  if (!danoStr || danoStr.trim() === '-' || danoStr.trim() === '') {
    return { normal: 0, critico: 0 };
  }
  const normalized = danoStr.toLowerCase().replace(/\s/g, '').replace(/-/g, '+-');
  const parts = normalized.split('+');
  let avgNormal = 0;
  let sumMaxMult = 0;
  let flatBonus = 0;
  for (const part of parts) {
    if (!part) continue;
    const match = part.match(/^(-?)(\d+)d(\d+)$/);
    if (match) {
      const sign = match[1] === '-' ? -1 : 1;
      const count = parseInt(match[2], 10);
      const faces = parseInt(match[3], 10);
      const lowAvg = Math.floor(faces / 2);
      avgNormal += sign * (count * lowAvg);
      sumMaxMult += sign * (count * faces);
    } else {
      const val = parseInt(part, 10);
      if (!isNaN(val)) {
        flatBonus += val;
      }
    }
  }
  const normal = Math.max(0, avgNormal + flatBonus);
  const factor = multCritico >= 2 ? multCritico / 2 : 1;
  const critico = Math.max(0, Math.floor(factor * sumMaxMult) + flatBonus);
  return { normal, critico };
}

function parseDanoString(danoStr: string) {
  if (!danoStr || danoStr.trim() === '-' || danoStr.trim() === '') return [];
  // Separa por + ou - mantendo o sinal
  const regex = /([+-]?\s*\d+d\d+)|([+-]?\s*\d+)/gi;
  const matches = danoStr.match(regex);
  if (!matches) return [{ label: 'Dado', valor: danoStr }];

  return matches.map((m, i) => {
    const val = m.replace(/\s/g, ''); // Limpa os espacos
    const valorFinal = (i > 0 && !val.startsWith('+') && !val.startsWith('-')) ? `+${val}` : val;

    if (valorFinal.toLowerCase().includes('d')) {
      if (i === 0) return { label: 'Dado', valor: valorFinal };
      return { label: 'Dado Bônus', valor: valorFinal };
    } else {
      return { label: 'Dano Bônus', valor: valorFinal };
    }
  });
}

interface ArmaCombateCardProps {
  armaInv: ArmaInventario;
  estaExpandida: boolean;
  toggleExpandir: () => void;
  modificacoesHook: any;
  maldicoesHook: any;
}

const ArmaCombateCard: React.FC<ArmaCombateCardProps> = ({ armaInv, estaExpandida, toggleExpandir, modificacoesHook, maldicoesHook }) => {
  const [mostrarDanoMedio, setMostrarDanoMedio] = React.useState(false);
  const { arma, modificacoes, maldicoes } = armaInv;
  
  const modsAtivas = (modificacoes || []).map(id => modificacoesHook.modificacoes.find((m: any) => m.Codigo_Modif === id)).filter(Boolean);
  const maldicoesAtivas = (maldicoes || []).map(id => maldicoesHook.maldicoes.find((m: any) => m.Codigo_Modif === id)).filter(Boolean);

  const isPontaria = ['arremesso', 'disparo', 'fogo'].some(t => arma.Tipo_Arma?.toLowerCase().includes(t));
  const pericia = isPontaria ? 'Pontaria' : 'Luta';
  const isAgil = arma['Agil?'] || isPontaria;
  const defaultAtributo = isAgil ? 'AGI' : 'FOR';

  const [atributoDano, setAtributoDano] = React.useState(defaultAtributo);

  const multCrit = arma.Multiplicador_Arma || 2;
  const danoStr = arma.Dano_Arma || '';
  const parsedDano = parseDanoString(danoStr);
  const danoMedioPrincipal = calcularDanoMedio(danoStr, multCrit);
  const danoMedioSecundario = arma.Dano_Secundario ? calcularDanoMedio(arma.Dano_Secundario, multCrit) : null;

  const bonusAtaqueStr = modsAtivas.find((m: any) => m?.Descricao_Modif?.toLowerCase().includes('+2 em testes de ataque')) ? '2' : '0';

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded p-3 hover:border-zinc-700 transition-all flex flex-col">
      {/* CABEÇALHO */}
      <div 
        className="flex items-start justify-between cursor-pointer select-none"
        onClick={toggleExpandir}
      >
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-zinc-200">{arma.Nome_Item}</span>
          <span className="text-xs text-zinc-400">
            <span className="font-bold text-green-400">Dano:</span> {danoStr || '-'} 
            <span className="mx-2 text-zinc-700">|</span>
            <span className="font-bold text-green-400">Crítico:</span> {arma.Critico_Arma || 20}/x{multCrit}
          </span>
        </div>
        <span className={`text-xs text-zinc-600 transition-transform mt-0.5 ${estaExpandida ? 'rotate-180' : ''}`}>▼</span>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-3">
          
          {/* 1. DANO EXPLICADO NO TOPO */}
          {parsedDano.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsedDano.map((pd, index) => (
                <div key={index} className="flex-1 min-w-[110px] bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">{pd.label}</span>
                  <span className="text-sm text-zinc-300">
                    {pd.valor} <span className="text-[0.65rem] text-zinc-500">({arma.Tipo_Dano_Arma || 'Físico'})</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 2. STATS DA ARMA ESPALHADAS (GRID) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Ataque Bônus</span>
              <span className="text-sm text-zinc-300">{bonusAtaqueStr}</span>
            </div>
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Alcance</span>
              <span className="text-sm text-zinc-300">{arma.Alcance_Item || 'Curto'}</span>
            </div>
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Perícia</span>
              <span className="text-sm text-zinc-300">{pericia}</span>
            </div>
            <div className="bg-zinc-950/50 rounded px-3 py-1.5 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Atributo</span>
              <div className="w-24">
                <CustomSelect
                  value={atributoDano}
                  onChange={setAtributoDano}
                  options={ATRIBUTO_OPTIONS}
                  className="!py-0.5 !min-h-0 text-xs"
                  hideIcon={true}
                />
              </div>
            </div>
          </div>

          {/* 3. DANO SECUNDÁRIO E MODIFICAÇÕES */}
          {arma.Dano_Secundario && arma.Dano_Secundario.trim() !== '-' && (
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Dano Secundário</span>
              <span className="text-sm text-zinc-300">{arma.Dano_Secundario}</span>
            </div>
          )}

          {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {modsAtivas.map((m: any) => (
                <span key={m!.Codigo_Modif} className="rounded border border-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-zinc-300">
                  {m!.Nome_Modificacao}
                </span>
              ))}
              {maldicoesAtivas.map((m: any) => (
                <span key={m!.Codigo_Modif} className="rounded border border-purple-900/50 bg-purple-950/30 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-purple-400">
                  {m!.Nome_Modificacao}
                </span>
              ))}
            </div>
          )}

          {/* 4. MÉDIA DE DANO ESCONDIDA */}
          <button
            onClick={() => setMostrarDanoMedio(!mostrarDanoMedio)}
            className="mt-1 flex w-fit items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span className={`transition-transform ${mostrarDanoMedio ? 'rotate-180' : ''}`}>▼</span>
            Média de Dano
          </button>
          
          <Collapse isOpen={mostrarDanoMedio}>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Normal (x1 / x2 / x3)</span>
                <span className="text-sm text-zinc-300">{danoMedioPrincipal.normal} / {danoMedioPrincipal.normal * 2} / {danoMedioPrincipal.normal * 3}</span>
              </div>
              <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Média Crítica</span>
                <span className="text-sm text-green-400">{danoMedioPrincipal.critico}</span>
              </div>
            </div>
            {danoMedioSecundario && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Secundária (Normal)</span>
                  <span className="text-sm text-zinc-300">{danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}</span>
                </div>
                <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Secundária (Crítica)</span>
                  <span className="text-sm text-green-400">{danoMedioSecundario.critico}</span>
                </div>
              </div>
            )}
          </Collapse>

        </div>
      </Collapse>
    </div>
  );
};

export const CombatePanel: React.FC = () => {
  const [expandidos, setExpandidos] = React.useState<Record<string, boolean>>({});

  const toggleExpandir = (id: string) => {
    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const { armasHook, modificacoesHook, maldicoesHook } = useRPG();
  const armas = armasHook?.armasInventario || [];

  const armasCorpoACorpo = armas.filter(a => a.arma.Tipo_Arma?.toLowerCase() === 'corpo a corpo' || a.arma.Tipo_Arma?.toLowerCase() === 'corpo-a-corpo');
  const armasFogo = armas.filter(a => a.arma.Tipo_Arma?.toLowerCase() !== 'corpo a corpo' && a.arma.Tipo_Arma?.toLowerCase() !== 'corpo-a-corpo');

  if (armas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        <svg className="mb-3 h-10 w-10 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 17.5L3 6m0 0l2-2 11.5 11.5m-11.5-11.5l2 2m9.5 9.5l2 2m-2-2l2-2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Seu inventário de armas está vazio.</p>
        <p className="text-xs">Adicione armas no inventário para ver seus atributos de combate aqui.</p>
      </div>
    );
  }

  const renderWeaponList = (lista: ArmaInventario[], titulo: string) => {
    if (lista.length === 0) return null;
    return (
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-sm border-b border-zinc-800 pb-1 mt-2 mb-1">{titulo}</h3>
        {lista.map((armaInv: ArmaInventario) => (
          <ArmaCombateCard 
            key={armaInv.id} 
            armaInv={armaInv} 
            estaExpandida={!!expandidos[armaInv.id]} 
            toggleExpandir={() => toggleExpandir(armaInv.id)} 
            modificacoesHook={modificacoesHook}
            maldicoesHook={maldicoesHook}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      {renderWeaponList(armasCorpoACorpo, 'Armas Corpo a Corpo')}
      {renderWeaponList(armasFogo, 'Armas de Fogo e Disparo')}
    </div>
  );
};
