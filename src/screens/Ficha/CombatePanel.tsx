import React from 'react';
import { useRPG } from '../../context/RPGContext';
import type { ArmaInventario } from '../../types';
import { Collapse } from '../../components/Collapse';
import { CustomSelect } from '../../components/CustomSelect';

const ATRIBUTO_OPTIONS = [
  { label: 'Força', value: 'FOR' },
  { label: 'Agilidade', value: 'AGI' },
  { label: 'Intelecto', value: 'INT' },
  { label: 'Presença', value: 'PRE' },
  { label: 'Vigor', value: 'VIG' },
  { label: 'Nenhum', value: 'NENHUM' }
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
      <div 
        className="flex items-start justify-between gap-3 cursor-pointer select-none"
        onClick={toggleExpandir}
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-sm text-zinc-100">{arma.Nome_Item}</span>
          <span className="text-[0.7rem] text-zinc-300">
            <span className="text-purple-400 font-bold">Dano:</span> {danoStr || '-'} &nbsp;&nbsp;&nbsp;
            <span className="text-purple-400 font-bold">Crítico:</span> {arma.Critico_Arma || 20}/x{multCrit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* O user enviou uma imagem com icone de dado, usando um svg simples como placeholder */}
          <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className={\`text-xs text-zinc-600 transition-transform mt-0.5 \${estaExpandida ? 'rotate-180' : ''}\`}>▼</span>
        </div>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-purple-400 font-bold">Ataque Bônus:</span>
            <span className="text-zinc-200">{bonusAtaqueStr}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-purple-400 font-bold">Tipo de Dano:</span>
            <span className="text-zinc-200">{arma.Tipo_Dano_Arma || 'Físico'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-purple-400 font-bold">Alcance:</span>
            <span className="text-zinc-200">{arma.Alcance_Item || 'Curto'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-purple-400 font-bold">Perícia:</span>
            <span className="text-zinc-200">{pericia}</span>
          </div>

          <div className="flex items-center gap-2 text-xs mt-0.5">
            <span className="text-purple-400 font-bold">Atributo Dano:</span>
            <div className="w-32">
              <CustomSelect
                value={atributoDano}
                onChange={setAtributoDano}
                options={ATRIBUTO_OPTIONS}
                className="!py-0.5 !min-h-0 text-xs"
              />
            </div>
          </div>

          {parsedDano.length > 0 && (
            <div className="mt-2 pt-2 border-t border-zinc-800/50 flex flex-col gap-1.5">
              {parsedDano.map((pd, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs">
                  <span className="text-purple-400 font-bold">{pd.label}:</span>
                  <span className="text-zinc-200">{pd.valor} <span className="text-zinc-500 italic">({arma.Tipo_Dano_Arma || 'Físico'})</span></span>
                </div>
              ))}
            </div>
          )}

          {arma.Dano_Secundario && arma.Dano_Secundario.trim() !== '-' && (
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="text-purple-400 font-bold">Dano Secundário:</span>
              <span className="text-zinc-200">{arma.Dano_Secundario}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span className="text-purple-400 font-bold">Média Dano (Normal):</span>
            <span className="text-zinc-200">{danoMedioPrincipal.normal}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-purple-400 font-bold">Média Dano (Crítico):</span>
            <span className="text-zinc-200">{danoMedioPrincipal.critico}</span>
          </div>

          {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-zinc-800/50">
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
