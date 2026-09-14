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
    <div
      className="overflow-hidden rounded-r-lg border-l-4 border-green-800 bg-zinc-900/60 transition hover:bg-zinc-900"
    >
      {/* CABEÇALHO (CLICÁVEL) */}
      <div 
        className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
        onClick={toggleExpandir}
      >
        <div className="flex flex-1 items-center gap-3">
          <span className={`text-xs text-zinc-600 transition-transform ${estaExpandida ? 'rotate-180' : ''}`}>▼</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-100">{arma.Nome_Item}</span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">
                {arma.Tipo_Dano_Arma || 'Físico'}
              </span>
            </div>
            {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
              <div className="mt-1 flex flex-wrap gap-1">
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
          </div>
        </div>

        {bonusAtaqueStr && (
          <div className="flex flex-col items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-center">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">Ataque</span>
            <span className="text-sm font-bold text-zinc-200">{bonusAtaqueStr}</span>
          </div>
        )}
      </div>

      {/* CONTEÚDO EXPANSÍVEL */}
      <Collapse isOpen={estaExpandida}>
        <div className="border-t border-zinc-800 px-5 pb-5 pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between rounded bg-zinc-950/50 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dano Base</span>
              <span className="text-sm font-bold text-zinc-200">{arma.Dano_Arma}</span>
            </div>
            
            {arma.Dano_Secundario && arma.Dano_Secundario.trim() !== '-' && (
              <div className="flex justify-between rounded bg-zinc-950/50 px-3 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dano Sec.</span>
                <span className="text-sm font-bold text-zinc-200">{arma.Dano_Secundario}</span>
              </div>
            )}

            <div className="flex justify-between rounded bg-zinc-950/50 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Crítico</span>
              <span className="text-sm font-bold text-zinc-200">
                {arma.Critico_Arma || 20} / x{multCrit}
              </span>
            </div>

            {/* BOTÃO PARA MOSTRAR DANO MÉDIO */}
            <button
              onClick={() => setMostrarDanoMedio(!mostrarDanoMedio)}
              className="mt-2 flex w-fit items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-700 hover:text-zinc-200"
            >
              <span className={`transition-transform ${mostrarDanoMedio ? 'rotate-180' : ''}`}>▼</span>
              Média de Dano
            </button>

            <Collapse isOpen={mostrarDanoMedio}>
              <div className="mt-2 flex flex-col rounded-md border border-zinc-800/50 bg-zinc-950/30 p-4">
                <h4 className="mb-3 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">
                  Dano Médio (Principal)
                </h4>
                
                <div className="mb-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Normal / Dobro / Triplo</span>
                  </div>
                  <div className="font-display text-xl tracking-wider text-zinc-300">
                    {danoMedioPrincipal.normal} <span className="text-zinc-700">/</span> {danoMedioPrincipal.normal * 2} <span className="text-zinc-700">/</span> {danoMedioPrincipal.normal * 3}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-zinc-800/50 pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Média Crítica</span>
                  <span className="text-lg font-bold text-zinc-200">{danoMedioPrincipal.critico}</span>
                </div>

                {danoMedioSecundario && (
                  <div className="mt-4 flex flex-col border-t border-zinc-800/50 pt-3">
                    <h4 className="mb-2 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-500">
                      Dano Médio (Secundário)
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-400">
                        {danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}
                      </span>
                      <span className="text-sm font-bold text-zinc-200" title="Média Crítica Secundária">
                        {danoMedioSecundario.critico}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Collapse>
          </div>
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
