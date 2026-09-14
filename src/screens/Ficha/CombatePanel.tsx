import React from 'react';
import { useRPG } from '../../context/RPGContext';
import type { ArmaInventario } from '../../types';
import { Collapse } from '../../components/Collapse';

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

      // Média baixa: 1d4=2, 1d6=3, 1d8=4, 1d10=5, 1d12=6
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

  const bonusAtaqueStr = modsAtivas.find((m: any) => m?.Descricao_Modif?.toLowerCase().includes('+2 em testes de ataque')) 
    ? '+2' : null;

  const multCrit = arma.Multiplicador_Arma || 2;
  const danoMedioPrincipal = calcularDanoMedio(arma.Dano_Arma, multCrit);
  const danoMedioSecundario = arma.Dano_Secundario ? calcularDanoMedio(arma.Dano_Secundario, multCrit) : null;

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded p-3 hover:border-green-500/50 hover:bg-zinc-900/80 group flex flex-col transition-all">
      <div 
        className="flex items-start justify-between gap-3 cursor-pointer select-none"
        onClick={toggleExpandir}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-sm text-zinc-200 group-hover:text-green-400 transition">{arma.Nome_Item}</span>
          {bonusAtaqueStr && (
            <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-green-950/60 text-green-400 border border-green-800/50">
              Ataque {bonusAtaqueStr}
            </span>
          )}
        </div>
        <span className={`text-xs text-zinc-600 transition-transform mt-0.5 ${estaExpandida ? 'rotate-180' : ''}`}>▼</span>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-1.5">
          {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
            <div className="flex flex-wrap gap-1 mb-1.5">
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
          
          <p className="text-xs text-zinc-300">
            <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Tipo:</span> 
            {arma.Tipo_Dano_Arma || 'Físico'}
          </p>
          <p className="text-xs text-zinc-300">
            <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Dano Base:</span> 
            {arma.Dano_Arma}
          </p>
          {arma.Dano_Secundario && arma.Dano_Secundario.trim() !== '-' && (
            <p className="text-xs text-zinc-300">
              <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Dano Sec.:</span> 
              {arma.Dano_Secundario}
            </p>
          )}
          <p className="text-xs text-zinc-300">
            <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Crítico:</span> 
            {arma.Critico_Arma || 20} / x{multCrit}
          </p>

          <button
            onClick={() => setMostrarDanoMedio(!mostrarDanoMedio)}
            className="mt-2 text-[0.65rem] text-zinc-500 hover:text-zinc-300 underline text-left w-fit"
          >
            {mostrarDanoMedio ? 'Ocultar Média de Dano' : 'Mostrar Média de Dano'}
          </button>

          <Collapse isOpen={mostrarDanoMedio}>
            <div className="mt-2 pl-3 border-l-2 border-zinc-800 flex flex-col gap-1.5">
              <p className="text-[0.65rem] text-zinc-400">
                <span className="font-bold mr-1">Média Normal (x1 / x2 / x3):</span> 
                {danoMedioPrincipal.normal} / {danoMedioPrincipal.normal * 2} / {danoMedioPrincipal.normal * 3}
              </p>
              <p className="text-[0.65rem] text-zinc-400">
                <span className="font-bold mr-1">Média Crítica:</span> 
                {danoMedioPrincipal.critico}
              </p>
              
              {danoMedioSecundario && (
                <div className="mt-1 pt-1 border-t border-zinc-800/50 flex flex-col gap-1.5">
                  <p className="text-[0.65rem] text-zinc-400">
                    <span className="font-bold mr-1">Secundária (x1 / x2 / x3):</span> 
                    {danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}
                  </p>
                  <p className="text-[0.65rem] text-zinc-400">
                    <span className="font-bold mr-1">Crítica Secundária:</span> 
                    {danoMedioSecundario.critico}
                  </p>
                </div>
              )}
            </div>
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
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-sm border-b border-zinc-800 pb-1 mt-2">{titulo}</h3>
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
