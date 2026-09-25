import { useState, useEffect, useMemo } from 'react';
import { useRPG } from '../../context/RPGContext';
import type { Patente, LimiteCredito } from '../../hooks/useInventario';
import { ModalArmas, formatarCritico } from './ModalArmas';
import type { ArmaInventario, ProtecaoInventario, ItemGeralInventario, MunicaoInventario, ItemAmaldicoadoInventario } from '../../types';
import { ModalProtecoes } from './ModalProtecoes';
import { ModalItens } from './ModalItens';
import { ModalItensAmaldicoados } from './ModalItensAmaldicoados';
import { ModalEditarProtecao } from '../../components/ModalEditarProtecao';
import { ModalEditarItem } from '../../components/ModalEditarItem';
import { ModalEditarMunicao } from '../../components/ModalEditarMunicao';
import { ModalEditarItemAmaldicoado } from '../../components/ModalEditarItemAmaldicoado';
import { CustomSelect } from '../../components/CustomSelect';
import { Collapse } from '../../components/Collapse';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges, restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import type { Modifier } from '@dnd-kit/core';
import { ModalMunicoes } from './ModalMunicoes';
import { ModalGranadas } from './ModalGranadas';
import { ModalAntena } from './ModalAntena';
import { ModalEditarArma } from '../../components/ModalEditarArma';
import { SortableItemAmaldicoado } from '../../components/SortableItemAmaldicoado';

import { formatarTexto } from '../../utils/formatters';
import { calcularCategoriaFinal, calcularEspacosFinais } from '../../utils/rpgRules';
import { SortableItemGeral } from '../../components/SortableItemGeral';
import { SortableArmaItem } from '../../components/SortableArmaItem';
import { SortableMunicaoItem } from '../../components/SortableMunicaoItem';
import { SortableProtecaoItem } from '../../components/SortableProtecaoItem';
import { InventarioHeader } from '../../components/InventarioHeader';

  

const CORES_ELEMENTOS_INV: Record<string, string> = {
  sangue: '#b31717',
  conhecimento: '#b07902',
  energia: '#af27d9',
  morte: '#000000',
  medo: '#ffffff',
  outros: '#888888',
};

function obterCorBadgeInv(elemento: string): string {
  if (!elemento) return '#666';
  const elementoStr = elemento.toLowerCase();
  return CORES_ELEMENTOS_INV[elementoStr] || '#666';
}

const getCorElementoBarra = (elemento: string) => {
  const e = elemento.toLowerCase();
  if (e.includes('sangue')) return 'bg-red-900/50';
  if (e.includes('morte')) return 'bg-zinc-700';
  if (e.includes('energia')) return 'bg-purple-900/50';
  if (e.includes('conhec')) return 'bg-yellow-900/50';
  if (e.includes('medo')) return 'bg-white/50';
  return 'bg-zinc-800';
};

    const getCorElementoTexto = (elemento: string) => {
    const e = elemento.toLowerCase();
    if (e.includes('sangue')) return 'text-red-500';
    if (e.includes('morte')) return 'text-zinc-400 font-bold';
    if (e.includes('energia')) return 'text-purple-500';
    if (e.includes('conhec')) return 'text-yellow-500';
    if (e.includes('medo')) return 'text-white';
    return 'text-zinc-400';
  };

  const getBadgeElemento = (elemento: string) => {
    if (!elemento) return 'bg-zinc-900 text-zinc-400';
    const e = elemento.toLowerCase();
    if (e.includes('morte')) return 'bg-black/50 text-white';
    if (e.includes('medo')) return 'bg-zinc-200/80 text-zinc-950';
    if (e.includes('sangue')) return 'bg-red-950/20 text-red-500';
    if (e.includes('energia')) return 'bg-purple-950/20 text-purple-500';
    if (e.includes('conhec')) return 'bg-yellow-950/20 text-yellow-500';
    if (e.includes('varia') || e.includes('lista')) return 'bg-blue-950/20 text-blue-500';
    return 'bg-zinc-900 text-zinc-400';
  };

const restrictToTopAndVerticalAxis: Modifier = ({ transform, activeNodeRect }) => {
  if (!activeNodeRect) {
    return { ...transform, x: 0 };
  }
  const scrollContainer = document.getElementById('inventario-scroll-container');
  let minY = -activeNodeRect.top; // Fallback para o topo da janela
  if (scrollContainer) {
    const scrollRect = scrollContainer.getBoundingClientRect();
    minY = scrollRect.top - activeNodeRect.top;
  }
  return {
    ...transform,
    x: 0,
    y: Math.max(minY, transform.y),
  };
};


export function InventarioPanel() {
  const { maldicoesHook, inventarioHook, atributosFinais, regrasAutomaticasAtivas, armasHook, municoesHook, protecoesHook, itensHook, itensAmaldicoadosHook, toggleVestimentaGeral, status, modificacoesHook, proficienciasTotais, rituaisHook, poderesHook } = useRPG();

  useEffect(() => {
    const handler = (e: any) => {
      const { poder, elemento, poderId } = e.detail;
        const str = window.localStorage.getItem('dedoDecepadoAguardando');
        if (str) {
          try {
            const item = JSON.parse(str);
            itensAmaldicoadosHook.adicionarItem({ 
              ...item, 
              Nome_Ama: `Dedo Decepado (${(poder.Nome || poder.Nome_Poder).replace('<Elemento>', elemento || 'Varia')})`, 
              Elemento_Ama: elemento || 'Varia',
              dedoDecepadoPoderId: poderId
            });
        } catch (err) {}
        window.localStorage.removeItem('dedoDecepadoAguardando');
      }
    };
    window.addEventListener('dedoDecepadoSelecionado', handler);
    return () => window.removeEventListener('dedoDecepadoSelecionado', handler);
  }, [itensAmaldicoadosHook]);
  const {
    prestigio, setPrestigio,
    patente, setPatenteManual,
    credito, setCreditoOverride,
    limitesItens, setLimiteItemCategoria
  } = inventarioHook;

  const [modalArmasAberto, setModalArmasAberto] = useState(false);
  const [modalMunicoesAberto, setModalMunicoesAberto] = useState(false);
  const [modalProteçõesAberto, setModalProtecoesAberto] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Armas');
  const [modalItensAberto, setModalItensAberto] = useState(false);
  const [modalItensAmaldicoadosAberto, setModalItensAmaldicoadosAberto] = useState(false);
  const [abaItensAberta, setAbaItensAberta] = useState<string>('');
  const [buscaItem, setBuscaItem] = useState('');
  const [municaoFiltroNome, setMunicaoFiltroNome] = useState<string | undefined>(undefined);
  const [municaoFiltroCategoria, setMunicaoFiltroCategoria] = useState<string | undefined>(undefined);
  const [municaoTargetArmaId, setMunicaoTargetArmaId] = useState<string | undefined>(undefined);
  const [modalGranadasAberto, setModalGranadasAberto] = useState(false);
    const [modalAntenaAberto, setModalAntenaAberto] = useState(false);
    const [antenaTargetArmaId, setAntenaTargetArmaId] = useState<string | undefined>(undefined);
  const [flechaExplosivaPendente, setFlechaExplosivaPendente] = useState<any>(null);
  const [granadaTargetArmaId, setGranadaTargetArmaId] = useState<string | undefined>(undefined);
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    setExpandidos({});
  }, [categoriaFiltro]);

  const [armaEditandoId, setArmaEditandoId] = useState<string | null>(null);
  const [protecaoEditandoId, setProtecaoEditandoId] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<{ id: string, tipo: 'arma' | 'protecao' | 'item' | 'municao' | 'amaldicoado' } | null>(null);
  const [editingItemAmaldicoado, setEditingItemAmaldicoado] = useState<ItemAmaldicoadoInventario | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<{ id: string, type: 'arma' | 'municao' | 'protecao' | 'item' | 'amaldicoado', name?: string, fullItem?: any, stringDT?: string | null } | null>(null);

  const getArmaParaEditar = () => editingItem?.tipo === 'arma' ? armasHook.armasInventario.find(i => i.id === editingItem.id) : null;
  const getProtecaoParaEditar = () => editingItem?.tipo === 'protecao' ? protecoesHook.protecoesInventario.find(i => i.id === editingItem.id) : null;
  const getItemParaEditar = () => editingItem?.tipo === 'item' ? itensHook.itensInventario.find(i => i.id === editingItem.id) : null;
  const getMunicaoParaEditar = () => editingItem?.tipo === 'municao' ? municoesHook.municoesInventario.find(i => i.id === editingItem.id) : null;
  const getItemAmaldicoadoParaEditar = () => editingItem?.tipo === 'amaldicoado' ? itensAmaldicoadosHook.itensAmaldicoadosInventario.find(i => i.id === editingItem.id) : null;
  const getSoqueiraComoArmaParaEditar = () => null;

  const cargaMaxima = 5 + (atributosFinais.FOR * 5) + (regrasAutomaticasAtivas.has(23) ? 5 : 0) + (regrasAutomaticasAtivas.has(43) ? atributosFinais.INT : 0);
  
  const cargaAtual = useMemo(() => {
    let total = 0;
    armasHook?.armasInventario.forEach(i => {
      if (i.arma.isDuplaObsessivaCompanion) return;
      total += calcularEspacosFinais(i.arma['Espaços_Item'], i.modificacoes, modificacoesHook.modificacoes, regrasAutomaticasAtivas.has(43));
    });
    municoesHook?.municoesInventario.forEach(i => total += calcularEspacosFinais(i.municao['Espaços_Item'], i.modificacoes, modificacoesHook.modificacoes, regrasAutomaticasAtivas.has(43)));
    protecoesHook?.protecoesInventario.forEach(i => total += calcularEspacosFinais(i.protecao.Espacos_Protecao, i.modificacoes, modificacoesHook.modificacoes, regrasAutomaticasAtivas.has(43)));
    itensHook?.itensInventario.forEach(i => total += calcularEspacosFinais(i.item.Espacos_Itens, i.modificacoes, modificacoesHook.modificacoes, regrasAutomaticasAtivas.has(43)));
    return total;
  }, [armasHook?.armasInventario, municoesHook?.municoesInventario, protecoesHook?.protecoesInventario, itensHook?.itensInventario, modificacoesHook.modificacoes]);
  
      const noInventario = [0, 0, 0, 0];
    
    const getCatIndex = (catStr: string) => {
      const c = catStr.trim().toUpperCase();
      if (c === 'I' || c === '1') return 0;
      if (c === 'II' || c === '2') return 1;
      if (c === 'III' || c === '3') return 2;
      if (c === 'IV' || c === '4') return 3;
      return -1;
    };

    const modsAll = modificacoesHook?.modificacoes || [];
    const maldsAll = maldicoesHook?.maldicoes || [];

    armasHook?.armasInventario?.forEach(a => {
      if (a.arma.isDuplaObsessivaCompanion) return;
      const cat = calcularCategoriaFinal(a.arma.Categoria_Item, a.modificacoes, modsAll, a.arma.Codigo_Arma === 71 ? true : a.arma.Nome_Item, a.maldicoes, maldsAll);
      const idx = getCatIndex(cat);
      if (idx !== -1) noInventario[idx]++;
    });

    municoesHook?.municoesInventario?.forEach(m => {
      const cat = calcularCategoriaFinal(m.municao.Categoria_Item, m.modificacoes, modsAll, false, m.maldicoes, maldsAll);
      const idx = getCatIndex(cat);
      if (idx !== -1) noInventario[idx]++;
    });

    protecoesHook?.protecoesInventario?.forEach(p => {
      const cat = calcularCategoriaFinal(p.protecao.Categoria_Protecao, p.modificacoes, modsAll, false, p.maldicoes, maldsAll);
      const idx = getCatIndex(cat);
      if (idx !== -1) noInventario[idx]++;
    });

    itensHook?.itensInventario?.forEach(i => {
      const cat = calcularCategoriaFinal(i.item.Categoria_Item, i.modificacoes, modsAll, false, i.maldicoes, maldsAll);
      const idx = getCatIndex(cat);
      if (idx !== -1) noInventario[idx]++;
    });

    itensAmaldicoadosHook?.itensAmaldicoadosInventario?.forEach(ia => {
      const cat = calcularCategoriaFinal(ia.item.Categoria_Ama, undefined, [], false, undefined, []);
      const idx = getCatIndex(cat);
      if (idx !== -1) noInventario[idx]++;
    });

  useEffect(() => {
    (window as any)._inventarioPanelSetters = {
      setMunicaoTargetArmaId,
      setMunicaoFiltroNome,
      setMunicaoFiltroCategoria,
      setModalMunicoesAberto,
    };
    return () => {
      delete (window as any)._inventarioPanelSetters;
    };
  }, []);

  const patentesDisponiveis: Patente[] = ['Recruta', 'Operador', 'Agente Especial', 'Oficial de Operações', 'Agente de Elite'];
  const creditosDisponiveis: LimiteCredito[] = ['Baixo', 'Médio', 'Alto', 'Ilimitado'];

  const toggleExpandir = (id: string) => {
    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calcularDT = (dtItem: string | null, isExplosivo: boolean = false): string | null => {
    if (!dtItem) return null;
    
    if (dtItem.includes('/')) {
      return dtItem.split('/').map(part => calcularDT(part.trim(), isExplosivo)).join(' / ');
    }

    let pericia = '';
    let val = dtItem.trim();
    
    if (val.includes(',')) {
      const parts = val.split(',');
      val = parts.pop()!.trim();
      pericia = parts.join(',').trim();
    }

    let calculado: string | number = 0;
    const isAtributo = ['FOR', 'AGI', 'INT', 'PRE', 'VIG'].includes(val.toUpperCase());
    
    if (isAtributo) {
      calculado = 10 + (status?.peTurno || 0) + (atributosFinais[val.toUpperCase() as keyof typeof atributosFinais] || 0);
    } else {
      const numVal = Number(val);
        if (isNaN(numVal) || val.toLowerCase().includes('veja') || val.toLowerCase().includes('texto') || val.trim() === '') {
          calculado = '-';
        } else {
          calculado = numVal;
        }
    }
    
    if (isExplosivo && regrasAutomaticasAtivas.has(29) && typeof calculado === 'number') {
      calculado += atributosFinais.INT;
    }
    
    if (calculado === '-') return '-';
    if (pericia) {
      return `${pericia} ${calculado}`;
    }
    return `${calculado}`;
  };

  const sensores = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    if (event.active && expandidos[event.active.id]) {
      setExpandidos(prev => ({ ...prev, [event.active.id]: false }));
    }
    const { active } = event;
    
    const type = active.data?.current?.type;
    let name = 'Item';
    let fullItem = null;
    let stringDT = null;
    
    if (type === 'municao') {
      fullItem = municoesHook?.municoesInventario.find(x => x.id === active.id);
      if (fullItem) name = fullItem.municao.Nome_Item;
    } else if (type === 'arma') {
      fullItem = armasHook?.armasInventario.find(x => x.id === active.id);
      if (fullItem) {
        name = fullItem.arma.Nome_Item;
        stringDT = calcularDT(fullItem.arma.dt_item, fullItem.arma.Categoria_Item?.toLowerCase().includes('explosivos') || fullItem.arma.Nome_Item?.toLowerCase().includes('explosivo'));
      }
    } else if (type === 'protecao') {
      fullItem = protecoesHook?.protecoesInventario.find(x => x.id === active.id);
      if (fullItem) name = fullItem.protecao.Nome_Protecao;
    } else if (type === 'item') {
      fullItem = itensHook?.itensInventario.find(x => x.id === active.id);
      if (fullItem) name = fullItem.item.Nome_Item;
    } else if (type === 'amaldicoado') {
      fullItem = itensAmaldicoadosHook?.itensAmaldicoadosInventario.find(x => x.id === active.id);
      if (fullItem) name = fullItem.item.Nome_Ama;
    }
    
    setActiveDragItem({ id: active.id, type, name, fullItem, stringDT });
  };

  const handleDragEnd = (event: any) => {
    setActiveDragItem(null);
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const armaActive = armasHook?.armasInventario.find(a => a.id === active.id);
      const municaoActive = municoesHook?.municoesInventario.find(m => m.id === active.id);
      const protecaoActive = protecoesHook?.protecoesInventario.find(p => p.id === active.id);
      const itemAmaldicoadoActive = itensAmaldicoadosHook?.itensAmaldicoadosInventario.find(p => p.id === active.id);
      
      const armaOver = armasHook?.armasInventario.find(a => a.id === over.id);
      const municaoOver = municoesHook?.municoesInventario.find(m => m.id === over.id);
      const protecaoOver = protecoesHook?.protecoesInventario.find(p => p.id === over.id);
      const itemAmaldicoadoOver = itensAmaldicoadosHook?.itensAmaldicoadosInventario.find(p => p.id === over.id);

      const isMunicao = !!municaoActive;
      const isProtecao = !!protecaoActive;
      const isArmaOver = !!armaOver;
      const isMunicaoOver = !!municaoOver;
      const isProtecaoOver = !!protecaoOver;

      if (isMunicao) {
        if (isArmaOver && armaOver && municaoActive) {
          // Tenta acoplar
          const compativeis = municoesHook?.getMunicoesCompativeis(armaOver.arma.Nome_Item, armaOver.arma.Categoria_Item) || [];
          if (compativeis.some(c => c.Nome_Item === municaoActive.municao.Nome_Item)) {
            armasHook?.acoplarMunicao(armaOver.id, municaoActive.id);
          } else {
            alert(`Munição "${municaoActive.municao.Nome_Item}" é incompatível com a arma "${armaOver.arma.Nome_Item}".`);
          }
        } else if (isMunicaoOver) {
          // reordenar munição
          const oldIndex = (municoesHook?.municoesInventario || []).findIndex(x => x.id === active.id);
          const newIndex = (municoesHook?.municoesInventario || []).findIndex(x => x.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1 && municoesHook?.reordenarMunicoes) {
            municoesHook.reordenarMunicoes(oldIndex, newIndex);
          }
        }
      } else if (isProtecao) {
        if (isProtecaoOver) {
          const oldIndex = (protecoesHook?.protecoesInventario || []).findIndex(x => x.id === active.id);
          const newIndex = (protecoesHook?.protecoesInventario || []).findIndex(x => x.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1 && protecoesHook?.reordenarProteções) {
            protecoesHook.reordenarProteções(oldIndex, newIndex);
          }
        }
      } else if (armaActive) {
        // reordenar arma
        if (isArmaOver) {
          const oldIndex = (armasHook?.armasInventario || []).findIndex(x => x.id === active.id);
          const newIndex = (armasHook?.armasInventario || []).findIndex(x => x.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1 && armasHook?.reordenarArmas) {
            armasHook.reordenarArmas(oldIndex, newIndex);
          }
        }
      } else {
        const itemActive = itensHook?.itensInventario.find(i => i.id === active.id);
        const itemOver = itensHook?.itensInventario.find(i => i.id === over.id);
        if (itemAmaldicoadoActive && itemAmaldicoadoOver) {
          const oldIndex = (itensAmaldicoadosHook?.itensAmaldicoadosInventario || []).findIndex(x => x.id === active.id);
          const newIndex = (itensAmaldicoadosHook?.itensAmaldicoadosInventario || []).findIndex(x => x.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1 && itensAmaldicoadosHook?.reordenarItens) {
            itensAmaldicoadosHook.reordenarItens(oldIndex, newIndex);
          }
          return;
        }
        if (itemActive && itemOver) {
          const oldIndex = (itensHook?.itensInventario || []).findIndex(x => x.id === active.id);
          const newIndex = (itensHook?.itensInventario || []).findIndex(x => x.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1 && itensHook?.reordenarItens) {
            itensHook.reordenarItens(oldIndex, newIndex);
          }
        }
      }
    }
  };

  let armasExibidas = [...(armasHook?.armasInventario || [])].filter(a => a.id !== 'coronhada-virtual' && a.id !== 'ataque-desarmado-virtual');
  armasExibidas = armasExibidas.filter((item: ArmaInventario) => {
    if (buscaItem && !item.arma.Nome_Item.toLowerCase().includes(buscaItem.toLowerCase())) return false;
    return true;
  });
  
  const armasNormaisExibidas = armasExibidas.filter(i => !i.arma.isAmaldicoada);
  const armasAmaldicoadasExibidas = armasExibidas.filter(i => i.arma.isAmaldicoada);
  

  const municoesSoltas = (municoesHook?.municoesInventario || []).filter(minv => {
    // É solta se não estiver acoplada a nenhuma arma
    const acoplada = armasHook?.armasInventario.some(a => a.municoesAcopladas?.includes(minv.id));
    if (acoplada) return false;
    if (buscaItem && !minv.municao.Nome_Item.toLowerCase().includes(buscaItem.toLowerCase())) return false;
    return true;
  });

  const municoesGeral = (municoesHook?.municoesInventario || []).filter(minv => {
    if (buscaItem && !minv.municao.Nome_Item.toLowerCase().includes(buscaItem.toLowerCase())) return false;
    return true;
  });

  const protecoesGeral = (protecoesHook?.protecoesInventario || []).filter(pinv => {
    if (buscaItem && !pinv.protecao.Nome_Protecao.toLowerCase().includes(buscaItem.toLowerCase())) return false;
    return true;
  });

  const itensAmaldicoadosGeral = (itensAmaldicoadosHook?.itensAmaldicoadosInventario || []).filter(iinv => {
    if (buscaItem && !iinv.item.Nome_Ama.toLowerCase().includes(buscaItem.toLowerCase())) return false;
    return true;
  });

  const itensGeral = (itensHook?.itensInventario || []).filter(iinv => {
    if (buscaItem && !iinv.item.Nome_Item.toLowerCase().includes(buscaItem.toLowerCase())) return false;
    if (categoriaFiltro === 'Itens Operacionais') {
      if (iinv.item.Grupo_Item.trim() !== 'Itens Operacionais' && iinv.item.Grupo_Item.trim() !== 'Recursos') return false;
    } else if (categoriaFiltro !== 'Geral' && iinv.item.Grupo_Item.trim() !== categoriaFiltro) return false;
    return true;
  });

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden gap-2 p-2 font-sans text-zinc-300 w-full">
      <InventarioHeader
        prestigio={prestigio}
        setPrestigio={setPrestigio}
        patente={patente}
        setPatenteManual={setPatenteManual}
        credito={credito}
        setCreditoOverride={setCreditoOverride}
        cargaAtual={cargaAtual}
        cargaMaxima={cargaMaxima}
        limitesItens={limitesItens}
        setLimiteItemCategoria={setLimiteItemCategoria}
        noInventario={noInventario}
      />

      <div className="h-px bg-zinc-800 my-1" />

      {/* Seção de Inventário */}
      <div className="flex flex-col flex-1 min-h-0 gap-3 mt-2">
        {/* Abas de Categoria */}
        <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setCategoriaFiltro('Geral')}
            title="Geral"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Geral' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            🎒
          </button>
          <button
            onClick={() => setCategoriaFiltro('Armas')}
            title="Armas"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Armas' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            <img 
              src="/gun-icon.png" 
              alt="Armas" 
              className="w-8 h-8 object-contain mix-blend-screen"
            />
          </button>
          <button
            onClick={() => setCategoriaFiltro('Munições')}
            title="Munições"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Munições' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            🔫
          </button>
          <button
            onClick={() => setCategoriaFiltro('Proteções')}
            title="Proteções"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Proteções' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            🛡️
          </button>
          <button
            onClick={() => setCategoriaFiltro('Acessórios')}
            title="Acessórios"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Acessórios' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            🧰
          </button>
          <button
            onClick={() => setCategoriaFiltro('Explosivos')}
            title="Explosivos"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Explosivos' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            💣
          </button>
          <button
            onClick={() => setCategoriaFiltro('Itens Operacionais')}
            title="Itens Operacionais / Recursos"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Itens Operacionais' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            🔦
          </button>
          <button
            onClick={() => setCategoriaFiltro('Medicamentos')}
            title="Medicamentos"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Medicamentos' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            💊
          </button>
          <button
            onClick={() => setCategoriaFiltro('Itens Paranormais')}
            title="Itens Paranormais"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Itens Paranormais' 
                ? 'bg-zinc-900 text-green-400 border-b-green-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            👁️
          </button>
        
          <button
            onClick={() => setCategoriaFiltro('Amaldiçoados')}
            title="Amaldiçoados"
            className={`w-12 h-12 flex items-center justify-center rounded-t text-2xl transition border-b-2 ${
              categoriaFiltro === 'Amaldiçoados' 
                ? 'bg-zinc-900 text-purple-400 border-b-purple-500' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-transparent'
            }`}
          >
            💀
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar no inventário..."
            value={buscaItem}
            onChange={(e) => setBuscaItem(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-purple-500"
          />
          {categoriaFiltro === 'Armas' && (
            <button
              onClick={() => setModalArmasAberto(true)}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded font-bold text-sm transition"
            >
              + Adicionar
            </button>
          )}
          {categoriaFiltro === 'Munições' && (
            <button
              onClick={() => {
                setMunicaoFiltroNome(undefined);
                setMunicaoFiltroCategoria(undefined);
                setMunicaoTargetArmaId(undefined);
                setModalMunicoesAberto(true);
              }}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded font-bold text-sm transition"
            >
              + Adicionar
            </button>
          )}
          {categoriaFiltro === 'Proteções' && (
            <button
              onClick={() => setModalProtecoesAberto(true)}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded font-bold text-sm transition"
            >
              + Adicionar
            </button>
          )}
          {(itensHook?.gruposUnicos.includes(categoriaFiltro) || categoriaFiltro === 'Itens Operacionais') && (
            <button
              onClick={() => {
                setAbaItensAberta(categoriaFiltro);
                setModalItensAberto(true);
              }}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded font-bold text-sm transition"
            >
              + Adicionar
            </button>
          )}
          {categoriaFiltro === 'Amaldiçoados' && (
            <button
              onClick={() => setModalItensAmaldicoadosAberto(true)}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-1.5 rounded font-bold text-sm transition"
            >
              + Adicionar
            </button>
          )}
        </div>

        {/* Corpo principal: Lista */}
        <div id="inventario-scroll-container" className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          <DndContext 
            sensors={sensores}
            collisionDetection={closestCenter}
            modifiers={[restrictToTopAndVerticalAxis]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {(categoriaFiltro === 'Armas' || categoriaFiltro === 'Geral') && (
              <>
              {categoriaFiltro === 'Geral' && armasNormaisExibidas.length > 0 && (
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 mt-2 border-b border-zinc-800/50 pb-1 ml-1">Armas</h3>
              )}
              
              <SortableContext 
                  items={armasNormaisExibidas.map(a => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {armasNormaisExibidas.map((item: ArmaInventario) => (
                    <SortableArmaItem
                      key={item.id}
                      item={item}
                      isExpanded={!!expandidos[item.id]}
                      toggleExpandir={toggleExpandir}
                      stringDT={calcularDT(item.arma.dt_item, item.arma.Categoria_Item?.toLowerCase().includes('explosivos') || item.arma.Nome_Item?.toLowerCase().includes('explosivo'))}
                      removerArma={armasHook?.removerArma || (() => {})}
                        onEditar={() => setArmaEditandoId(item.id)}
                        onAddMunicao={() => {
                          if (item.arma.Nome_Item?.trim().toLowerCase() === 'a antena') {
                            setAntenaTargetArmaId(item.id); setModalAntenaAberto(true);
                          } else if (item.arma.Nome_Item?.toLowerCase().includes('lançador de granadas') || item.arma.Nome_Item?.toLowerCase().includes('lancador de granadas')) {
                            setGranadaTargetArmaId(item.id);
                            setModalGranadasAberto(true);
                          } else {
                            setMunicaoTargetArmaId(item.id);
                            setMunicaoFiltroNome(item.arma.Nome_Item);
                            setMunicaoFiltroCategoria(item.arma.Categoria_Item);
                            setModalMunicoesAberto(true);
                          }
                        }}
                      />
                  ))}
                </SortableContext>
              
              {categoriaFiltro === 'Armas' && armasNormaisExibidas.length === 0 && (
                <p className="text-center text-zinc-600 text-sm py-4">Nenhuma arma no inventário.</p>
              )}
              
              {categoriaFiltro === 'Geral' && armasNormaisExibidas.length === 0 && municoesSoltas.length === 0 && protecoesGeral.length === 0 && itensGeral.length === 0 && armasAmaldicoadasExibidas.length === 0 && (itensAmaldicoadosHook?.itensAmaldicoadosInventario?.length || 0) === 0 && (
                <p className="text-center text-zinc-600 text-sm py-4">Inventário vazio.</p>
              )}

              {categoriaFiltro === 'Geral' && municoesSoltas.length > 0 && (
                <>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 mt-2 border-b border-zinc-800/50 pb-1 ml-1">Munições Soltas</h3>
                  <SortableContext items={municoesSoltas.map(m => m.id)} strategy={verticalListSortingStrategy}>
                    {municoesSoltas.map(item => (
                      <SortableMunicaoItem 
                        key={item.id} 
                        id={item.id}
                        item={item} 
                        isExpanded={!!expandidos[item.id]}
                        toggleExpandir={toggleExpandir}
                        removerItem={municoesHook?.removerMunicao || (() => {})} 
                        onEditar={() => setEditingItem({ id: item.id, tipo: 'municao' })}
                      />
                    ))}
                  </SortableContext>
                </>
              )}
              </>
            )}

            {categoriaFiltro === 'Munições' && (
              <>
                <SortableContext items={municoesGeral.map(m => m.id)} strategy={verticalListSortingStrategy}>
                  {municoesGeral.map(item => (
                    <SortableMunicaoItem 
                      key={item.id} 
                      id={item.id}
                      item={item} 
                      isExpanded={!!expandidos[item.id]}
                      toggleExpandir={toggleExpandir}
                      removerItem={municoesHook?.removerMunicao || (() => {})} 
                      onEditar={() => setEditingItem({ id: item.id, tipo: 'municao' })}
                    />
                  ))}
                </SortableContext>

                {municoesGeral.length === 0 && (
                  <p className="text-center text-zinc-600 text-sm py-4">Nenhuma munição no inventário.</p>
                )}
              </>
            )}

            {(categoriaFiltro === 'Proteções' || categoriaFiltro === 'Geral') && (
              <>
                {categoriaFiltro === 'Geral' && protecoesGeral.length > 0 && (
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 mt-2 border-b border-zinc-800/50 pb-1 ml-1">Proteções</h3>
                )}
                <SortableContext items={protecoesGeral.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  {protecoesGeral.map(item => (
                    <SortableProtecaoItem
                      key={item.id}
                      item={item}
                      isExpanded={!!expandidos[item.id]}
                      toggleExpandir={toggleExpandir}
                      removerProtecao={protecoesHook?.removerProtecao || (() => {})}
                      onEditar={() => setProtecaoEditandoId(item.id)}
                      toggleEquipado={protecoesHook?.toggleEquipado || (() => {})}
                    />
                  ))}
                </SortableContext>
                {categoriaFiltro === 'Proteções' && protecoesGeral.length === 0 && (
                  <p className="text-center text-zinc-600 text-sm py-4">Nenhuma proteção no inventário.</p>
                )}
              </>
            )}

            {(itensHook?.gruposUnicos.includes(categoriaFiltro) || categoriaFiltro === 'Geral' || categoriaFiltro === 'Itens Operacionais') && (
              <>
                {categoriaFiltro === 'Geral' || categoriaFiltro === 'Itens Operacionais' ? (
                  Array.from(new Set(itensGeral.map(i => i.item.Grupo_Item.trim()))).sort().map(grupo => {
                    const itensDoGrupo = itensGeral.filter(i => i.item.Grupo_Item.trim() === grupo);
                    if (itensDoGrupo.length === 0) return null;
                    return (
                      <div key={grupo} className="flex flex-col gap-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 mt-2 border-b border-zinc-800/50 pb-1 ml-1">{grupo}</h3>
                        <SortableContext items={itensDoGrupo.map(i => i.id)} strategy={verticalListSortingStrategy}>
                          {itensDoGrupo.map(item => (
                            <SortableItemGeral 
                              key={item.id} 
                              item={item} 
                              isExpanded={!!expandidos[item.id]}
                              toggleExpandir={(id) => setExpandidos(prev => ({ ...prev, [id]: !prev[id] }))}
                              stringDT={calcularDT(item.item.Dt_Item, item.item.Grupo_Item?.toLowerCase().includes('explosivos'))}
                              removerItem={itensHook?.removerItem || (() => {})}
                              onEditar={() => {
                                setEditingItem({ id: item.id, tipo: 'item' });
                              }}
                              toggleEquipado={itensHook?.toggleEquipado || (() => {})}
                            />
                          ))}
                        </SortableContext>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <SortableContext items={itensGeral.map(i => i.id)} strategy={verticalListSortingStrategy}>
                      {itensGeral.map(item => (
                        <SortableItemGeral 
                          key={item.id} 
                          item={item} 
                          isExpanded={!!expandidos[item.id]}
                          toggleExpandir={(id) => setExpandidos(prev => ({ ...prev, [id]: !prev[id] }))}
                          stringDT={calcularDT(item.item.Dt_Item, item.item.Grupo_Item?.toLowerCase().includes('explosivos'))}
                          removerItem={itensHook?.removerItem || (() => {})}
                          onEditar={() => {
                            setEditingItem({ id: item.id, tipo: 'item' });
                          }}
                          toggleEquipado={itensHook?.toggleEquipado || (() => {})}
                        />
                      ))}
                    </SortableContext>
                    {itensGeral.length === 0 && (
                      <p className="text-center text-zinc-600 text-sm py-4">
                        {categoriaFiltro === 'Acessórios' ? 'Nenhum acessório no inventário.' :
                         categoriaFiltro === 'Explosivos' ? 'Nenhum explosivo no inventário.' :
                         categoriaFiltro === 'Itens Operacionais' ? 'Nenhum item operacional ou recurso no inventário.' :
                         categoriaFiltro === 'Medicamentos' ? 'Nenhum medicamento no inventário.' :
                         categoriaFiltro === 'Itens Paranormais' ? 'Nenhum item paranormal no inventário.' :
                         `Nenhum item no inventário.`}
                      </p>
                    )}
                  </>
                )}
              </>
            )}

            {(categoriaFiltro === 'Amaldiçoados' || categoriaFiltro === 'Geral') && ((itensAmaldicoadosHook?.itensAmaldicoadosInventario?.length || 0) > 0 || armasAmaldicoadasExibidas.length > 0) && (
                  <>
                  {['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo', 'Outros'].map(elemento => {
                    const armasNesteElemento = armasAmaldicoadasExibidas.filter(a => {
                      const e = (a.arma.Elemento_Arma || '').toLowerCase();
                      if (elemento === 'Outros') return !e || !['sangue', 'morte', 'conhecimento', 'energia', 'medo'].some(el => e.includes(el));
                      return e.includes(elemento.toLowerCase());
                    });
                    
                    const itensNesteElemento = (itensAmaldicoadosHook?.itensAmaldicoadosInventario || []).filter(i => {
                      const e = (i.item.Elemento_Ama || '').toLowerCase();
                      const matchBusca = buscaItem.trim() === '' || i.item.Nome_Ama.toLowerCase().includes(buscaItem.toLowerCase());
                      if (!matchBusca) return false;
                      if (elemento === 'Outros') return !e || !['sangue', 'morte', 'conhecimento', 'energia', 'medo'].some(el => e.includes(el));
                      return e.includes(elemento.toLowerCase());
                    });

                    if (armasNesteElemento.length === 0 && itensNesteElemento.length === 0) return null;

                    return (
                      <div key={elemento} className="mb-4">
                        <div className="flex items-center gap-3 mb-2 mt-3">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: obterCorBadgeInv(elemento) || '#52525b' }}></span>
                            <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-zinc-500">{elemento}</span>
                            <div className="flex-1 border-t border-zinc-800/50"></div>
                          </div>
                        
                        {armasNesteElemento.length > 0 && (
                          <div className="mb-2">
                            <SortableContext items={armasNesteElemento.map(a => a.id)} strategy={verticalListSortingStrategy}>
                              {armasNesteElemento.map((item: ArmaInventario) => (
                                <SortableArmaItem
                                  key={item.id}
                                  item={item}
                                  isExpanded={!!expandidos[item.id]}
                                  toggleExpandir={toggleExpandir}
                                  stringDT={calcularDT(item.arma.dt_item, item.arma.Categoria_Item?.toLowerCase().includes('explosivos') || item.arma.Nome_Item?.toLowerCase().includes('explosivo'))}
                                  removerArma={armasHook?.removerArma || (() => {})}
                                  onEditar={() => setArmaEditandoId(item.id)}
                                  onAddMunicao={() => {
                                    if (item.arma.Nome_Item?.trim().toLowerCase() === 'a antena') {
                                      setAntenaTargetArmaId(item.id); setModalAntenaAberto(true);
                                    } else if (item.arma.Nome_Item?.toLowerCase().includes('lançador de granadas') || item.arma.Nome_Item?.toLowerCase().includes('lancador de granadas')) {
                                      setGranadaTargetArmaId(item.id);
                                      setModalGranadasAberto(true);
                                    } else {
                                      setMunicaoTargetArmaId(item.id);
                                      setMunicaoFiltroNome(item.arma.Nome_Item);
                                      setMunicaoFiltroCategoria(item.arma.Categoria_Item);
                                      setModalMunicoesAberto(true);
                                    }
                                  }}
                                />
                              ))}
                            </SortableContext>
                          </div>
                        )}

                        {itensNesteElemento.length > 0 && (
                          <div className="mb-2">
                            <SortableContext items={itensNesteElemento.map(i => i.id)} strategy={verticalListSortingStrategy}>
                              {itensNesteElemento.map(item => (
                                <SortableItemAmaldicoado
                                  key={item.id}
                                  item={item}
                                  isExpanded={!!expandidos[item.id]}
                                  toggleExpandir={toggleExpandir}
                                  removerItem={(id) => {
                                      const itemToRemove = itensAmaldicoadosHook?.itensAmaldicoados.find(i => i.id === id);
                                      if (itemToRemove && itemToRemove.item.dedoDecepadoPoderId) {
                                        poderesHook.removerPoder(itemToRemove.item.dedoDecepadoPoderId);
                                      }
                                      if (itensAmaldicoadosHook?.removerItem) itensAmaldicoadosHook.removerItem(id);
                                    }}
                                  onEditar={() => setEditingItemAmaldicoado(item)}
                                  stringDT={null}
                                  toggleEquipado={(id) => toggleVestimentaGeral(id, true)}
                                />
                              ))}
                            </SortableContext>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {categoriaFiltro === 'Amaldiçoados' && (itensAmaldicoadosHook?.itensAmaldicoadosInventario?.length || 0) === 0 && armasAmaldicoadasExibidas.length === 0 && (
                    <p className="text-center text-zinc-600 text-sm py-4">Nenhum item ou arma amaldiçoada no inventário.</p>
                  )}
                  </>
                )}

            <DragOverlay>
              {activeDragItem?.fullItem ? (
                <div className="w-full">
                  {activeDragItem.type === 'arma' && <SortableArmaItem item={activeDragItem.fullItem} isExpanded={!!expandidos[activeDragItem.id]} toggleExpandir={() => {}} removerArma={() => {}} stringDT={activeDragItem.stringDT || null} isOverlay onAddMunicao={() => {}} />}
                  {activeDragItem.type === 'protecao' && <SortableProtecaoItem item={activeDragItem.fullItem} isExpanded={!!expandidos[activeDragItem.id]} toggleExpandir={() => {}} removerProtecao={() => {}} toggleEquipado={() => {}} isOverlay />}
                  {activeDragItem.type === 'item' && <SortableItemGeral item={activeDragItem.fullItem} isExpanded={!!expandidos[activeDragItem.id]} toggleExpandir={() => {}} removerItem={() => {}} stringDT={null} toggleEquipado={() => {}} isOverlay />}
                  {activeDragItem.type === 'municao' && <SortableMunicaoItem id={activeDragItem.id} item={activeDragItem.fullItem} isExpanded={!!expandidos[activeDragItem.id]} toggleExpandir={() => {}} removerItem={() => {}} isOverlay />}
                  {activeDragItem.type === 'amaldicoado' && <SortableItemAmaldicoado item={activeDragItem.fullItem} isExpanded={!!expandidos[activeDragItem.id]} toggleExpandir={() => {}} removerItem={() => {}} stringDT={null} toggleEquipado={() => {}} isOverlay />}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {categoriaFiltro !== 'Armas' && categoriaFiltro !== 'Geral' && categoriaFiltro !== 'Munições' && categoriaFiltro !== 'Proteções' && categoriaFiltro !== 'Amaldiçoados' && !itensHook?.gruposUnicos.includes(categoriaFiltro) && (
            <p className="text-center text-zinc-600 text-sm py-8">Esta categoria ainda não possui itens implementados.</p>
          )}
        </div>
      </div>

      <ModalArmas
        aberto={modalArmasAberto}
        onFechar={() => setModalArmasAberto(false)}
      />
      {modalMunicoesAberto && (
        <ModalMunicoes
          onFechar={() => setModalMunicoesAberto(false)}
          armaFiltroNome={municaoFiltroNome}
          armaFiltroCategoria={municaoFiltroCategoria}
          onSelect={municao => {
            if (municao.Codigo_Municao === 67) {
              setFlechaExplosivaPendente(municao);
              setModalGranadasAberto(true);
              setModalMunicoesAberto(false);
              return;
            }
            const idGerado = municoesHook?.adicionarMunicao(municao);
            if (idGerado && municaoTargetArmaId) {
              armasHook?.acoplarMunicao(municaoTargetArmaId, idGerado);
            }
            setModalMunicoesAberto(false);
          }}
        />
      )}

      {armaEditandoId && (
        <ModalEditarArma
          armaInventario={armasHook?.armasInventario.find(a => a.id === armaEditandoId)!}
          onSave={(dadosEditados, modificacoes, maldicoes, maldicoesElementos) => {
            armasHook?.editarArma(armaEditandoId, dadosEditados, modificacoes, maldicoes, maldicoesElementos);
          }}
          onClose={() => setArmaEditandoId(null)}
        />
      )}

      {editingItemAmaldicoado && itensAmaldicoadosHook && (
        <ModalEditarItemAmaldicoado
          itemInventario={editingItemAmaldicoado}
          onSave={(novosDados) => itensAmaldicoadosHook.editarItem(editingItemAmaldicoado.id, novosDados)}
          onClose={() => setEditingItemAmaldicoado(null)}
        />
      )}

      <ModalProtecoes
        aberto={modalProteçõesAberto}
        onFechar={() => setModalProtecoesAberto(false)}
      />
      
      <ModalItensAmaldicoados
        aberto={modalItensAmaldicoadosAberto}
        fechar={() => setModalItensAmaldicoadosAberto(false)}
      />
      <ModalItens
        aberto={modalItensAberto}
        onFechar={() => setModalItensAberto(false)}
        grupoAba={abaItensAberta}
      />

      {protecaoEditandoId && (
        <ModalEditarProtecao
          protecao={protecoesHook?.protecoesInventario.find(p => p.id === protecaoEditandoId)!}
          onSave={(id, dadosEditados, modificacoes, maldicoes, maldicoesElementos) => {
            protecoesHook?.editarProtecao(protecaoEditandoId, dadosEditados, modificacoes, maldicoes, maldicoesElementos);
          }}
          onClose={() => setProtecaoEditandoId(null)}
        />
      )}

      {editingItem?.tipo === 'item' && getItemParaEditar() && (
        <ModalEditarItem
          itemInventario={getItemParaEditar()!}
          onSave={(dadosEditados, modificacoes, maldicoes, maldicoesElementos) => {
            itensHook.editarItem(editingItem.id, dadosEditados, modificacoes, maldicoes, maldicoesElementos);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {editingItem?.tipo === 'municao' && getMunicaoParaEditar() && (
        <ModalEditarMunicao
          itemInventario={getMunicaoParaEditar()!}
          onSave={(municaoEditada, modificacoes) => {
            municoesHook.atualizarMunicao(editingItem.id, { municao: { ...getMunicaoParaEditar()!.municao, ...municaoEditada }, modificacoes });
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}

      
      {modalAntenaAberto && (
        <ModalAntena
          onFechar={() => setModalAntenaAberto(false)}
          onSelect={(nome, elemento) => {
             if (antenaTargetArmaId) {
                const armaInv = armasHook?.armasInventario.find(a => a.id === antenaTargetArmaId);
                if (armaInv?.municoesAcopladas) {
                   armaInv.municoesAcopladas.forEach(m => armasHook?.desacoplarMunicao(antenaTargetArmaId, m));
                }
                armasHook?.acoplarMunicao(antenaTargetArmaId, 'RITUAL_' + elemento + '_' + nome);
             }
             setModalAntenaAberto(false);
          }}
        />
      )}

      {/* Modal Granadas */}
      {modalGranadasAberto && (
        <ModalGranadas
          onFechar={() => {
            setModalGranadasAberto(false);
            setFlechaExplosivaPendente(null);
          }}
          onSelect={(granada) => {
            if (flechaExplosivaPendente) {
              const flechaComGranada = {
                ...flechaExplosivaPendente,
                Nome_Item: `${flechaExplosivaPendente.Nome_Item} (${granada.Nome_Item})`,
                Categoria_Item: flechaExplosivaPendente.Categoria_Item + " + " + granada.Categoria_Item,
                granada_dano: granada.Dano_Item,
                granada_dt: granada.Dt_Item,
              };
              const newId = municoesHook?.adicionarMunicao(flechaComGranada);
              if (municaoTargetArmaId && newId) {
                armasHook?.acoplarMunicao(municaoTargetArmaId, newId);
              }
              setFlechaExplosivaPendente(null);
              setModalGranadasAberto(false);
              return;
            }

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
}