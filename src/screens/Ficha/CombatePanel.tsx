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
  { label: 'VIG', value: 'VIG' }
];

function calcularDanoMedio(danoStr: string, multCritico: number): { normal: number, critico: number } {
  if (!danoStr || danoStr.trim() === '-' || danoStr.trim() === '') {
    return { normal: 0, critico: 0 };
  }
  
  // Remove colchetes de tipos (ex: 1d8[Sangue]) para o cálculo
  const strClean = danoStr.replace(/\[.*?\]/g, '');
  const normalized = strClean.toLowerCase().replace(/\s/g, '').replace(/-/g, '+-');
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

function parseDanoString(danoStr: string, tipoDanoBase: string) {
  if (!danoStr || danoStr.trim() === '-' || danoStr.trim() === '') return [];
  
  // Separa por + ou - mantendo o sinal. Ex: 1d8+1d6[Sangue]+2
  const regex = /([+-]?\s*\d+d\d+(?:\[.*?\])?)|([+-]?\s*\d+(?:\[.*?\])?)/gi;
  const matches = danoStr.match(regex);
  if (!matches) return [{ label: 'Dado', valor: danoStr, tipo: tipoDanoBase }];

  const parsed: { label: string, valor: string, tipo: string }[] = [];
  const flatBonuses: Record<string, number> = {};

  matches.forEach((m, i) => {
    let val = m.replace(/\s/g, ''); // Limpa os espacos
    let tipo = tipoDanoBase;
    
    // Extrai tipo se houver [Tipo]
    const typeMatch = val.match(/\[(.*?)\]/);
    if (typeMatch) {
      tipo = typeMatch[1];
      val = val.replace(/\[.*?\]/, '');
    }

    const valorFinal = (i > 0 && !val.startsWith('+') && !val.startsWith('-')) ? `+${val}` : val;

    if (valorFinal.toLowerCase().includes('d')) {
      if (i === 0) parsed.push({ label: 'Dado', valor: valorFinal, tipo });
      else parsed.push({ label: 'Dado Bônus', valor: valorFinal, tipo });
    } else {
      const num = parseInt(valorFinal, 10);
      if (!isNaN(num)) {
        flatBonuses[tipo] = (flatBonuses[tipo] || 0) + num;
      }
    }
  });

  Object.entries(flatBonuses).forEach(([tipo, total]) => {
    if (total !== 0) {
      const sign = total > 0 ? '+' : '';
      parsed.push({ label: 'Dano Bônus', valor: `${sign}${total}`, tipo });
    }
  });

  return parsed;
}

interface ArmaCombateCardProps {
  armaInv: ArmaInventario;
  estaExpandida: boolean;
  toggleExpandir: () => void;
  modificacoesHook: any;
  maldicoesHook: any;
}

const ArmaCombateCard: React.FC<ArmaCombateCardProps> = ({ armaInv, estaExpandida, toggleExpandir, modificacoesHook, maldicoesHook }) => {
  const { atributosFinais } = useRPG();
  const [mostrarDanoMedio, setMostrarDanoMedio] = React.useState(false);
  const { arma, modificacoes, maldicoes } = armaInv;
  
  const modsSafe = Array.isArray(modificacoes) ? modificacoes : [];
  const maldsSafe = Array.isArray(maldicoes) ? maldicoes : [];
  
  const modsAtivas = modsSafe.map(id => modificacoesHook.modificacoes.find((m: any) => m.Codigo_Modif === id)).filter(Boolean);
  const maldicoesAtivas = maldsSafe.map(id => maldicoesHook.maldicoes.find((m: any) => m.Codigo_Mald === id)).filter(Boolean);

  const isPontaria = ['arremesso', 'disparo', 'fogo'].some(t => arma.Tipo_Arma?.toLowerCase().includes(t));
  const pericia = isPontaria ? 'Pontaria' : 'Luta';
  const isAgil = arma['Agil?'] || isPontaria;
  const defaultAtributo = isAgil ? 'AGI' : 'FOR';

  const [atributoDano, setAtributoDano] = React.useState(defaultAtributo);
  const [danoIdx, setDanoIdx] = React.useState(0);

  let extrasStr = '';
  
  maldicoesAtivas.forEach(m => {
    if (!m) return;
    const desc = m.Descricao_Mald || '';
    const match = desc.match(/\+?\s*(\d+d\d+)/i);
    if (match) {
      let elemento = m.Elemento_Mald || 'Paranormal';
      if (elemento.toLowerCase() === 'varia' || elemento.toLowerCase() === 'variável') {
         elemento = armaInv.maldicoes_elementos?.[m.Codigo_Mald] || elemento;
      }
      extrasStr += `+${match[1]}[${elemento}]`;
    }
  });

  modsAtivas.forEach(m => {
    if (!m) return;
    const desc = m.Descricao_Modif || '';
    const nome = m.Nome_Modif?.toLowerCase() || '';
    if (desc.toLowerCase().includes('+2 em rolagens de dano') || desc.toLowerCase().includes('+2 rolagens de dano') || desc.toLowerCase().includes('+2 no dano') || nome.includes('cruel')) {
       extrasStr += `+2`;
    }
    const match = desc.match(/\+?\s*(\d+d\d+)/i);
    if (match) {
      extrasStr += `+${match[1]}`;
    }
  });

  // Calcula bônus de atributo para o DANO
  let bonusDanoAtributo = 0;
  const isFogoDisparo = ['fogo', 'disparo'].some(t => arma.Tipo_Arma?.toLowerCase().includes(t));
  if (!isFogoDisparo) {
    if (atributoDano === 'FOR') {
      bonusDanoAtributo = (atributosFinais.FOR || 0);
    } else if (atributoDano === 'AGI' && isAgil) {
      bonusDanoAtributo = (atributosFinais.AGI || 0);
    }
  }

  if (bonusDanoAtributo > 0) {
    extrasStr += `+${bonusDanoAtributo}`;
  } else if (bonusDanoAtributo < 0) {
    extrasStr += `${bonusDanoAtributo}`;
  }

  const multCrit = arma.Multiplicador_Arma || 2;
  const tipoBase = arma.Tipo_Dano_Arma || 'Físico';
  
  const rawDano = arma.Dano_Arma || '';
  const danoOptions = rawDano.includes('/') ? rawDano.split('/').map(s => s.trim()) : [rawDano];
  const currentDanoIdx = danoIdx >= danoOptions.length ? 0 : danoIdx;
  const danoSelecionado = danoOptions[currentDanoIdx];

  const danoStrFull = danoSelecionado ? danoSelecionado + extrasStr : extrasStr;
  const parsedDano = parseDanoString(danoStrFull, tipoBase);

  const danoSecStr = arma.Dano_Secundario || '';
  if (danoSecStr && danoSecStr.trim() !== '-') {
    parsedDano.push({ label: 'Dano Secundário', valor: danoSecStr, tipo: tipoBase });
  }
  const danoSecFull = danoSecStr && danoSecStr !== '-' ? danoSecStr + extrasStr : '';
  const danoHeader = parsedDano
    .filter(p => p.label !== 'Dano Secundário')
    .map((p, i) => {
      let v = p.valor;
      if (i > 0 && !v.startsWith('+') && !v.startsWith('-')) v = '+' + v;
      return v;
    })
    .join('');

  const danoMedioPrincipal = calcularDanoMedio(danoStrFull, multCrit);
  const danoMedioSecundario = danoSecFull ? calcularDanoMedio(danoSecFull, multCrit) : null;

  let bonusAtaque = 0;
  // Bônus de ataque vem apenas de modificações (como Certeira, Alongada, etc.)
  modsAtivas.forEach(m => {
    if (!m) return;
    const desc = m.Descricao_Modif?.toLowerCase() || '';
    const nome = m.Nome_Modif?.toLowerCase() || '';
    if (desc.includes('+2 em testes de ataque') || desc.includes('+2 nas rolagens de ataque') || nome.includes('certeira') || nome.includes('alongad')) {
      bonusAtaque += 2;
    }
  });
  
  const bonusAtaqueStr = bonusAtaque >= 0 ? `+${bonusAtaque}` : `${bonusAtaque}`;

  const getCorElementoTexto = (el: string) => {
    const e = el?.toLowerCase() || '';
    if (e.includes('sangue')) return 'text-red-500';
    if (e.includes('morte')) return 'text-zinc-400 font-bold';
    if (e.includes('energia')) return 'text-purple-500';
    if (e.includes('conhec')) return 'text-yellow-500';
    if (e.includes('medo')) return 'text-white';
    if (e.includes('varia') || e.includes('lista')) return 'text-blue-500';
    return 'text-zinc-400';
  };

  return (
    <div className="bg-zinc-950/60 border border-zinc-800 rounded p-3 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all flex flex-col">
      {/* CABEÇALHO */}
      <div 
        className="flex items-start justify-between cursor-pointer select-none"
        onClick={toggleExpandir}
      >
        <div className="flex flex-col gap-1 w-full min-w-0 pr-3">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-bold text-sm text-zinc-100 truncate">{arma.Nome_Item}</span>
            {danoOptions.length > 1 && (
              <div className="flex items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <CustomSelect
                  value={danoSelecionado}
                  onChange={(val) => setDanoIdx(danoOptions.indexOf(val as string))}
                  options={danoOptions.map(o => ({ label: `(${o})`, value: o }))}
                  className="!p-0 !min-h-0 !border-transparent !bg-transparent text-sm text-zinc-400 font-bold hover:!text-white transition-colors"
                  hideIcon={true}
                  wrapperClassName="w-fit"
                />
              </div>
            )}
          </div>
          <span className="text-xs text-zinc-400">
            <span className="font-bold text-green-400">Dano:</span> {danoHeader.replace(/\[.*?\]/g, '') || '-'} 
            <span className="mx-2 text-zinc-700">|</span>
            <span className="font-bold text-green-400">Crítico:</span> {arma.Critico_Arma || 20}/x{multCrit}
          </span>
          {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
            <div className="flex items-center mt-0.5 min-w-0">
              <span className="text-[11px] text-zinc-400 truncate italic">
                {modsAtivas.length > 0 && modsAtivas.map((m: any) => m!.Nome_Modif).join(' • ')}
                {modsAtivas.length > 0 && maldicoesAtivas.length > 0 && <span> • </span>}
                {maldicoesAtivas.map((m: any, i: number) => {
                    let el = m!.Elemento_Mald;
                    if (el?.toLowerCase().includes('varia') || el?.toLowerCase().includes('lista')) {
                      el = armaInv.maldicoes_elementos?.[m!.Codigo_Mald] || el;
                    }
                    const cor = getCorElementoTexto(el);
                    return (
                      <span key={m!.Codigo_Mald}>
                        {i > 0 && <span> • </span>}
                        <span className={cor}>{m!.Nome_Mald}</span>
                      </span>
                    )
                })}
              </span>
            </div>
          )}
        </div>
        <span className={`text-xs text-zinc-600 transition-transform mt-0.5 flex-shrink-0 ${estaExpandida ? 'rotate-180' : ''}`}>▼</span>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-2 relative z-10 text-xs">
          
          {/* 1. DANO EXPLICADO NO TOPO */}
          {parsedDano.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
              {parsedDano.map((pd, index) => (
                <span key={index} className="text-zinc-300">
                  <span className="font-bold text-green-400 capitalize">{pd.label.toLowerCase()}:</span> {pd.valor} <span className="text-zinc-500 text-[10px] ml-1">({pd.tipo})</span>
                </span>
              ))}
            </div>
          )}

          {/* 2. STATS DA ARMA ESPALHADAS (GRID) */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-2 mt-1 border-t border-zinc-800/50">
            <span className="text-zinc-300"><span className="font-bold text-green-400">Ataque Bônus:</span> {bonusAtaqueStr}</span>
            <span className="text-zinc-300"><span className="font-bold text-green-400">Perícia:</span> {pericia}</span>
            {arma.Alcance_Item && arma.Alcance_Item.trim() !== '-' && (
              <span className="text-zinc-300"><span className="font-bold text-green-400">Alcance:</span> {arma.Alcance_Item}</span>
            )}
            <div className="flex items-center gap-1 text-zinc-300">
              <span className="font-bold text-green-400">Atributo:</span>
              <CustomSelect
                value={atributoDano}
                onChange={setAtributoDano}
                options={ATRIBUTO_OPTIONS}
                className="!p-0 !min-h-0 !border-transparent !bg-transparent text-xs text-zinc-300 font-bold hover:!text-white transition-colors"
                wrapperClassName="w-fit"
                hideIcon={true}
              />
            </div>
          </div>



          {/* 4. MÉDIA DE DANO ESCONDIDA */}
          <button
            onClick={() => setMostrarDanoMedio(!mostrarDanoMedio)}
            className="mt-2 pt-2 border-t border-zinc-800/50 flex w-fit items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span className={`transition-transform ${mostrarDanoMedio ? 'rotate-180' : ''}`}>▼</span>
            Média de Dano
          </button>
          
          <Collapse isOpen={mostrarDanoMedio}>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
              <span className="text-zinc-300"><span className="font-bold text-green-400">Normal (x1/x2/x3):</span> {danoMedioPrincipal.normal} / {danoMedioPrincipal.normal * 2} / {danoMedioPrincipal.normal * 3}</span>
              <span className="text-zinc-300"><span className="font-bold text-green-400">Média Crítica:</span> <span className="font-bold">{danoMedioPrincipal.critico}</span></span>
              
              {danoMedioSecundario && (
                <>
                  <span className="text-zinc-300 mt-1"><span className="font-bold text-green-400">Sec. (x1/x2/x3):</span> {danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}</span>
                  <span className="text-zinc-300 mt-1"><span className="font-bold text-green-400">Sec. Crítica:</span> <span className="font-bold">{danoMedioSecundario.critico}</span></span>
                </>
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
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1 mt-2 mb-1 border-b border-zinc-800/50 pb-1">{titulo}</h3>
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
