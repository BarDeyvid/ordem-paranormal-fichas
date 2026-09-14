import React from 'react';
import { useRPG } from '../../context/RPGContext';
import type { ArmaInventario } from '../../types';

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

export const CombatePanel: React.FC = () => {
  const { armasHook, modificacoesHook, maldicoesHook } = useRPG();
  const armas = armasHook?.armasInventario || [];

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

  return (
    <div className="flex flex-col gap-4 p-2">
      {armas.map((armaInv: ArmaInventario) => {
        const { arma, modificacoes, maldicoes } = armaInv;
        
        // Coleta mods e maldições
        const modsAtivas = (modificacoes || []).map(id => modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)).filter(Boolean);
        const maldicoesAtivas = (maldicoes || []).map(id => maldicoesHook.maldicoes.find(m => m.Codigo_Modif === id)).filter(Boolean);

        // Alguma dá bônus de ataque?
        // Mods no DB não têm campo padronizado para ataque que possamos ler magicamente aqui,
        // mas podemos extrair o texto se quiséssemos. Vamos deixar genérico ou ler de um campo se existir.
        // O usuário pediu só pra exibir se houver. Mas como saber se a mod dá +2 de ataque? 
        // Vamos checar a descrição para ver se inclui "+2 em testes de ataque" ou similar, ou confiar numa prop se houver.
        const bonusAtaqueStr = modsAtivas.find(m => m?.Descricao_Modif?.toLowerCase().includes('+2 em testes de ataque')) 
          ? '+2' : null;

        const multCrit = arma.Multiplicador_Arma || 2;
        const danoMedioPrincipal = calcularDanoMedio(arma.Dano_Arma, multCrit);
        const danoMedioSecundario = arma.Dano_Secundario ? calcularDanoMedio(arma.Dano_Secundario, multCrit) : null;

        return (
          <div key={armaInv.id} className="flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
            {/* CABEÇALHO */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg tracking-wide text-zinc-100">{arma.Nome_Item}</h3>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">
                    {arma.Tipo_Dano_Arma || 'Físico'}
                  </span>
                </div>
                {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
                  <div className="flex flex-wrap gap-1">
                    {modsAtivas.map(m => (
                      <span key={m!.Codigo_Modif} className="rounded border border-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-zinc-300">
                        {m!.Nome_Modificacao}
                      </span>
                    ))}
                    {maldicoesAtivas.map(m => (
                      <span key={m!.Codigo_Modif} className="rounded border border-purple-900/50 bg-purple-950/30 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-purple-400">
                        {m!.Nome_Modificacao}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {bonusAtaqueStr && (
                <div className="flex flex-col items-center justify-center rounded-md border border-green-900/50 bg-green-950/30 px-3 py-1.5 text-center">
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider text-green-500">Ataque</span>
                  <span className="text-sm font-bold text-green-400">{bonusAtaqueStr}</span>
                </div>
              )}
            </div>

            {/* CONTEÚDO */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
              
              {/* STATUS BÁSICOS */}
              <div className="flex flex-1 flex-col gap-3">
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
                  <span className="text-sm font-bold text-red-400">
                    {arma.Critico_Arma || 20} / x{multCrit}
                  </span>
                </div>
              </div>

              {/* DANO MÉDIO (DESTAQUE) */}
              <div className="flex flex-1 flex-col rounded-md border border-green-900/30 bg-green-950/10 p-3">
                <h4 className="mb-3 text-[0.65rem] font-bold uppercase tracking-wider text-green-500">
                  Dano Médio (Principal)
                </h4>
                
                <div className="mb-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Normal / Dobro / Triplo</span>
                  </div>
                  <div className="font-display text-xl tracking-wider text-zinc-100">
                    {danoMedioPrincipal.normal} <span className="text-zinc-600">/</span> {danoMedioPrincipal.normal * 2} <span className="text-zinc-600">/</span> {danoMedioPrincipal.normal * 3}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-green-900/30 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-green-600">Média Crítica</span>
                  <span className="text-lg font-bold text-red-400">{danoMedioPrincipal.critico}</span>
                </div>

                {danoMedioSecundario && (
                  <div className="mt-4 flex flex-col border-t border-green-900/30 pt-3">
                    <h4 className="mb-2 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-500">
                      Dano Médio (Secundário)
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-300">
                        {danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}
                      </span>
                      <span className="text-sm font-bold text-red-400" title="Média Crítica Secundária">
                        {danoMedioSecundario.critico}
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
