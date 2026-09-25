import React from 'react';
import { useRPG } from '../../context/RPGContext';
import type { ArmaInventario } from '../../types';
import { ModalMunicoes } from './ModalMunicoes';
import { ModalGranadas } from './ModalGranadas';
import { ModalAntena } from './ModalAntena';
import { ArmaCombateCard } from '../../components/ArmaCombateCard';

export const CombatePanel: React.FC = () => {
  const [modalMunicoesAberto, setModalMunicoesAberto] = React.useState(false);
  const [municaoTargetArmaId, setMunicaoTargetArmaId] = React.useState<string | undefined>(undefined);
  const [municaoFiltroNome, setMunicaoFiltroNome] = React.useState<string | undefined>(undefined);
  const [municaoFiltroCategoria, setMunicaoFiltroCategoria] = React.useState<string | undefined>(undefined);
  const [modalGranadasAberto, setModalGranadasAberto] = React.useState(false);
  const [modalAntenaAberto, setModalAntenaAberto] = React.useState(false);
  const [antenaTargetArmaId, setAntenaTargetArmaId] = React.useState<string | undefined>(undefined);
  const [granadaTargetArmaId, setGranadaTargetArmaId] = React.useState<string | undefined>(undefined);
  const [expandidos, setExpandidos] = React.useState<Record<string, boolean>>({});

  const toggleExpandir = (id: string) => {
    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const { armasHook, modificacoesHook, maldicoesHook, itensHook, regrasAutomaticasAtivas, municoesHook } = useRPG();
  let armas = [...(armasHook?.armasInventario || [])];

  // Sort Duplas Obsessivas together, hide Punhos Enraivecidos
  armas = armas.filter(a => !(a.arma.Nome_Item?.trim().toLowerCase().includes('enraivecido')) || a.id === 'ataque-desarmado-virtual').sort((a, b) => {
    if (a.arma.Nome_Item?.includes('Dupla Obsessiva') && b.arma.Nome_Item?.includes('Dupla Obsessiva')) return a.arma.Nome_Item.localeCompare(b.arma.Nome_Item);
    return 0;
  });

  const soqueira = itensHook?.itensInventario.find(i => i.item.Nome_Item.toLowerCase().includes('soqueira'));
  if (soqueira) {
    const desarmadoIndex = armas.findIndex(a => a.id === 'ataque-desarmado-virtual');
    if (desarmadoIndex !== -1) {
      const desarmado = armas[desarmadoIndex];
      armas[desarmadoIndex] = {
        ...desarmado,
        arma: {
          ...desarmado.arma,
          Dano_Arma: (regrasAutomaticasAtivas?.has(86) ? desarmado.arma.Dano_Arma.replace(/(\d+)d(\d+)/gi, (m, p1, p2) => `${Number(p1) + 1}d${p2}`) : desarmado.arma.Dano_Arma) + '+1'
        },
        modificacoes: soqueira.modificacoes || [],
        maldicoes: soqueira.maldicoes || [],
        maldicoes_elementos: soqueira.maldicoes_elementos || {}
      };
    }
  }

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
            armasHook={armasHook}
            municoesHook={municoesHook}
            itensHook={itensHook}
            onAddMunicao={() => {
              if (armaInv.arma.Nome_Item?.trim().toLowerCase() === 'a antena' || armaInv.arma.Nome_Item?.trim().toLowerCase() === 'a antena\r') {
                setAntenaTargetArmaId(armaInv.id);
                setModalAntenaAberto(true);
              } else if (armaInv.arma.Nome_Item?.toLowerCase().includes('lançador de granadas') || armaInv.arma.Nome_Item?.toLowerCase().includes('lancador de granadas')) {
                setGranadaTargetArmaId(armaInv.id);
                setModalGranadasAberto(true);
              } else {
                setMunicaoTargetArmaId(armaInv.id);
                setMunicaoFiltroNome(armaInv.arma.Nome_Item);
                setMunicaoFiltroCategoria(armaInv.arma.Categoria_Item);
                setModalMunicoesAberto(true);
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      {renderWeaponList(armasCorpoACorpo, 'Ataques Corpo a Corpo')}
      {renderWeaponList(armasFogo, 'Ataques à Distância')}
      {modalMunicoesAberto && (
        <ModalMunicoes
          onFechar={() => setModalMunicoesAberto(false)}
          armaFiltroNome={municaoFiltroNome}
          armaFiltroCategoria={municaoFiltroCategoria}
          onSelect={municao => {
            const idGerado = municoesHook?.adicionarMunicao(municao);
            if (idGerado && municaoTargetArmaId) {
              armasHook?.acoplarMunicao(municaoTargetArmaId, idGerado);
            }
            setModalMunicoesAberto(false);
          }}
        />
      )}
      {modalAntenaAberto && (
        <ModalAntena
          onFechar={() => setModalAntenaAberto(false)}
          onSelect={(nome, elemento) => {
            if (antenaTargetArmaId) {
              const armaInv = armasHook?.armasInventario.find((a: any) => a.id === antenaTargetArmaId);
              if (armaInv?.municoesAcopladas) {
                armaInv.municoesAcopladas.forEach((m: string) => armasHook?.desacoplarMunicao(antenaTargetArmaId, m));
              }
              armasHook?.acoplarMunicao(antenaTargetArmaId, 'RITUAL_' + elemento + '_' + nome);
            }
            setModalAntenaAberto(false);
          }}
        />
      )}
      {modalGranadasAberto && (
        <ModalGranadas
          onFechar={() => setModalGranadasAberto(false)}
          onSelect={(granada) => {
            const newId = itensHook?.adicionarItem(granada);
            if (granadaTargetArmaId && newId) {
              armasHook?.acoplarMunicao(granadaTargetArmaId, newId);
            }
            setModalGranadasAberto(false);
          }}
        />
      )}
    </div>
  );
};
