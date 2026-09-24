import React from 'react';
import { useRPG } from '../../context/RPGContext';
import { obterPericiasOrdenadas } from './printHelpers';

export interface FichaA4PageProps {
  customRpg?: any;
}

export const FichaA4Page1: React.FC<FichaA4PageProps> = ({ customRpg }) => {
  const contextRpg = useRPG();
  const rpg = customRpg || contextRpg;

  const {
    nomeEditando,
    jogadorEditando,
    classe,
    nex,
    origensHook,
    trilhasHook,
    atributosFinais,
    status,
    defesaTotal,
    deslocM,
    deslocQ,
    inventarioHook,
    resistencias,
    protecoesHook,
    periciasHook,
  } = rpg;

  const periciasList = obterPericiasOrdenadas(rpg);
  const metadePericias = Math.ceil(periciasList.length / 2);
  const coluna1 = periciasList.slice(0, metadePericias);
  const coluna2 = periciasList.slice(metadePericias);

  const origemNome = origensHook?.origemSelecionada?.Nome || '—';
  const trilhaNome = trilhasHook?.trilhaSelecionada?.Nome_Trilha || '—';
  const patente = inventarioHook?.patente || 'Recruta';

  // Cálculos de Defesas
  const periciaReflexos = periciasHook?.pericias?.['Reflexos'];
  const bonusReflexos = (periciaReflexos?.treino || 0) + (periciaReflexos?.outros || 0);
  const esquiva = (defesaTotal || 10) + bonusReflexos;

  const periciaFortitude = periciasHook?.pericias?.['Fortitude'];
  const bonusBloqueio = (periciaFortitude?.treino || 0) + (periciaFortitude?.outros || 0);

  const protecoesEquipadas = (protecoesHook?.protecoesInventario || [])
    .filter((p: any) => p.equipado)
    .map((p: any) => p.protecao.Nome_Item)
    .join(', ') || 'Nenhuma';

  return (
    <div className="page-a4 w-[210mm] max-w-[210mm] min-h-[285mm] mx-auto bg-white text-zinc-950 p-6 flex flex-col justify-between font-sans text-xs box-border page-break-after print:m-0 print:p-4">
      {/* ══════ CABEÇALHO ORDO REALITAS ══════ */}
      <div>
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-black flex items-center justify-center font-serif font-black text-lg bg-zinc-100">
              Ø
            </div>
            <div>
              <h1 className="font-display font-black text-base tracking-[0.25em] uppercase leading-none text-black">
                ORDEM PARANORMAL RPG
              </h1>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-zinc-600 mt-0.5">
                Dossiê Oficial de Agente da Ordo Realitas
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block border border-black px-2 py-0.5 font-bold text-[11px] uppercase tracking-widest bg-zinc-50">
              NEX {nex || 5}%
            </div>
          </div>
        </div>

        {/* ══════ GRADE DE DADOS BIOGRÁFICOS ══════ */}
        <div className="grid grid-cols-4 gap-x-3 gap-y-1.5 border border-black p-2.5 rounded bg-zinc-50/50 mb-3 text-[11px]">
          <div className="col-span-2 flex items-baseline gap-1.5 border-b border-zinc-300 pb-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Agente:</span>
            <span className="font-bold text-black flex-1 truncate">{nomeEditando || '—'}</span>
          </div>
          <div className="col-span-2 flex items-baseline gap-1.5 border-b border-zinc-300 pb-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Jogador:</span>
            <span className="font-medium text-black flex-1 truncate">{jogadorEditando || '—'}</span>
          </div>

          <div className="flex items-baseline gap-1.5 border-b border-zinc-300 pb-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Classe:</span>
            <span className="font-bold text-black truncate">{classe || '—'}</span>
          </div>
          <div className="flex items-baseline gap-1.5 border-b border-zinc-300 pb-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Trilha:</span>
            <span className="font-medium text-black truncate">{trilhaNome}</span>
          </div>
          <div className="flex items-baseline gap-1.5 border-b border-zinc-300 pb-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Origem:</span>
            <span className="font-medium text-black truncate">{origemNome}</span>
          </div>
          <div className="flex items-baseline gap-1.5 border-b border-zinc-300 pb-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Patente:</span>
            <span className="font-medium text-black truncate">{patente}</span>
          </div>

          <div className="col-span-2 flex items-center justify-between pt-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Deslocamento:</span>
            <span className="font-bold text-black">{deslocM || 9}m / {deslocQ || 6}q</span>
          </div>
          <div className="col-span-2 flex items-center justify-between pt-0.5">
            <span className="font-bold uppercase text-[9px] text-zinc-600 tracking-wider">Limite PE por Rodada:</span>
            <span className="font-bold text-black">{status?.peTurno || 1} PE</span>
          </div>
        </div>

        {/* ══════ ATRIBUTOS, STATUS & DEFESA ══════ */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          
          {/* ATRIBUTOS (4 colunas) */}
          <div className="col-span-4 border border-black rounded p-2 flex flex-col justify-between bg-zinc-50/30">
            <h2 className="font-bold uppercase text-[10px] tracking-wider text-center border-b border-black pb-1 mb-1.5">
              Atributos
            </h2>
            <div className="grid grid-cols-5 gap-1 text-center my-auto">
              {[
                { key: 'AGI', label: 'AGI' },
                { key: 'FOR', label: 'FOR' },
                { key: 'INT', label: 'INT' },
                { key: 'PRE', label: 'PRE' },
                { key: 'VIG', label: 'VIG' },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-zinc-600 tracking-wider">{label}</span>
                  <div className="w-8 h-8 border-2 border-black rounded flex items-center justify-center font-black text-base bg-white shadow-sm mt-0.5">
                    {atributosFinais?.[key as keyof typeof atributosFinais] ?? 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-center text-zinc-500 mt-1 italic">
              Rola Xd20 e escolhe o maior dado
            </p>
          </div>

          {/* STATUS VITAIS (4 colunas) */}
          <div className="col-span-4 border border-black rounded p-2 flex flex-col justify-between bg-zinc-50/30">
            <h2 className="font-bold uppercase text-[10px] tracking-wider text-center border-b border-black pb-1 mb-1.5">
              Pontos de Status
            </h2>
            <div className="flex flex-col gap-1.5 text-xs">
              {/* PV */}
              <div className="border border-zinc-400 rounded px-2 py-1 flex items-center justify-between bg-white">
                <span className="font-black text-[11px] tracking-wider text-red-950">PV</span>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-sm font-black">{status?.pvAtual ?? status?.pvMax ?? 0}</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-xs font-bold text-zinc-600">{status?.pvMax ?? 0}</span>
                </div>
              </div>

              {/* SAN */}
              <div className="border border-zinc-400 rounded px-2 py-1 flex items-center justify-between bg-white">
                <span className="font-black text-[11px] tracking-wider text-blue-950">SAN</span>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-sm font-black">{status?.sanAtual ?? status?.sanMax ?? 0}</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-xs font-bold text-zinc-600">{status?.sanMax ?? 0}</span>
                </div>
              </div>

              {/* PE */}
              <div className="border border-zinc-400 rounded px-2 py-1 flex items-center justify-between bg-white">
                <span className="font-black text-[11px] tracking-wider text-amber-950">PE</span>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-sm font-black">{status?.peAtual ?? status?.peMax ?? 0}</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-xs font-bold text-zinc-600">{status?.peMax ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DEFESAS & COMBATE (4 colunas) */}
          <div className="col-span-4 border border-black rounded p-2 flex flex-col justify-between bg-zinc-50/30">
            <h2 className="font-bold uppercase text-[10px] tracking-wider text-center border-b border-black pb-1 mb-1.5">
              Defesas
            </h2>
            <div className="grid grid-cols-3 gap-1.5 text-center mb-1">
              <div className="border border-zinc-400 rounded p-1 bg-white">
                <div className="text-[8px] font-bold uppercase text-zinc-600">Defesa</div>
                <div className="text-sm font-black mt-0.5">{defesaTotal || 10}</div>
              </div>
              <div className="border border-zinc-400 rounded p-1 bg-white">
                <div className="text-[8px] font-bold uppercase text-zinc-600">Esquiva</div>
                <div className="text-sm font-black mt-0.5">{esquiva}</div>
              </div>
              <div className="border border-zinc-400 rounded p-1 bg-white">
                <div className="text-[8px] font-bold uppercase text-zinc-600">Bloqueio</div>
                <div className="text-sm font-black mt-0.5">+{bonusBloqueio}</div>
              </div>
            </div>
            <div className="text-[9px] text-zinc-600 truncate border-t border-zinc-200 pt-1">
              <span className="font-bold">Proteção: </span>
              <span>{protecoesEquipadas}</span>
            </div>
          </div>
        </div>

        {/* ══════ TABELA OFICIAL DE PERÍCIAS (28 PERÍCIAS) ══════ */}
        <div className="border border-black rounded p-2.5 bg-white">
          <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
            <h2 className="font-display font-bold uppercase text-xs tracking-widest text-black">
              Perícias (Treino: D +0 / T +5 / V +10 / E +15)
            </h2>
            <span className="text-[9px] text-zinc-500 font-mono">28 Perícias Oficiais</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* COLUNA 1 */}
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-400 text-zinc-600 uppercase text-[8px]">
                  <th className="w-4 text-center pb-1">T</th>
                  <th className="text-left pb-1">Perícia</th>
                  <th className="w-7 text-center pb-1">Atr</th>
                  <th className="w-8 text-center pb-1">Bônus</th>
                  <th className="w-8 text-center pb-1">Outros</th>
                  <th className="w-9 text-right pb-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {coluna1.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="text-center font-bold text-[9px]">
                      {p.treinada ? '■' : '□'}
                    </td>
                    <td className="py-0.5 font-medium truncate max-w-[90px] text-black">
                      {p.nome}
                    </td>
                    <td className="text-center text-zinc-500 font-mono text-[9px]">{p.atributo}</td>
                    <td className="text-center font-mono">{p.treino > 0 ? `+${p.treino}` : '0'}</td>
                    <td className="text-center font-mono text-zinc-500">{p.outros !== 0 ? (p.outros > 0 ? `+${p.outros}` : p.outros) : '—'}</td>
                    <td className="text-right font-black font-mono text-[11px] text-black">
                      {p.total >= 0 ? `+${p.total}` : p.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* COLUNA 2 */}
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-400 text-zinc-600 uppercase text-[8px]">
                  <th className="w-4 text-center pb-1">T</th>
                  <th className="text-left pb-1">Perícia</th>
                  <th className="w-7 text-center pb-1">Atr</th>
                  <th className="w-8 text-center pb-1">Bônus</th>
                  <th className="w-8 text-center pb-1">Outros</th>
                  <th className="w-9 text-right pb-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {coluna2.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="text-center font-bold text-[9px]">
                      {p.treinada ? '■' : '□'}
                    </td>
                    <td className="py-0.5 font-medium truncate max-w-[90px] text-black">
                      {p.nome}
                    </td>
                    <td className="text-center text-zinc-500 font-mono text-[9px]">{p.atributo}</td>
                    <td className="text-center font-mono">{p.treino > 0 ? `+${p.treino}` : '0'}</td>
                    <td className="text-center font-mono text-zinc-500">{p.outros !== 0 ? (p.outros > 0 ? `+${p.outros}` : p.outros) : '—'}</td>
                    <td className="text-right font-black font-mono text-[11px] text-black">
                      {p.total >= 0 ? `+${p.total}` : p.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══════ RODAPÉ DA PÁGINA 1 ══════ */}
      <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-[8px] text-zinc-500 uppercase tracking-widest mt-2">
        <span>Ordem Paranormal RPG © Jambô Editora</span>
        <span>Dossiê da Ordo Realitas</span>
        <span>Página 1 de 2</span>
      </div>
    </div>
  );
};
