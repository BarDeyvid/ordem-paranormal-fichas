import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type {
  Tela,
  ClasseRPG,
  Atributos,
  AtributoKey,
  AbaDireita,
  AbaModalPoderes,
  VersaoRitual,
  ResultadoRolagem,
  CondicaoId,
  EstadoSobrevivencia,
  ConjurarRitualParams,
  ResultadoConjuracao,
} from '../types';
import { calcularPenalidadesCondicoes, type ResumoPenalidadesCalculadas } from '../data/condicoes';
import { rolarPericia, rolarAtaque, rolarDano, rolarLivre } from '../services/diceRoller';
import { usePoderes } from '../hooks/usePoderes';
import { usePericias } from '../hooks/usePericias';
import { useStatus } from '../hooks/useStatus';
import { useOrigem } from '../hooks/useOrigem';
import { useRituais } from '../hooks/useRituais';
import { useTrilhas } from '../hooks/useTrilhas';
import { useInventario } from '../hooks/useInventario';
import { useArmas } from '../hooks/useArmas';
import { useMunicoes } from '../hooks/useMunicoes';
import { useProtecoes } from '../hooks/useProtecoes';
import { useItens } from '../hooks/useItens';
import { useItensAmaldicoados } from '../hooks/useItensAmaldicoados';
import { calcularBonusVestimentas, type VestimentasBonus } from '../utils/vestimentasRules';
import { calcularBonusMaldicoes, type MaldicoesBonusGlobais } from '../utils/maldicoesRules';
import { useModificacoes } from '../hooks/useModificacoes';
import { useMaldicoes } from '../hooks/useMaldicoes';
import { capMaximoAtributo, pontosIniciaisPorNivel, calcularStatusBase } from '../utils/rpgRules';
import { sendCharacterStatus, sendCastRitual } from '../services/battlematBridge';

// ============================================================
// TUDO QUE O CONTEXTO EXPÕE
// ============================================================
interface RPGContextType {
  telaAtual: Tela;
  setTelaAtual: React.Dispatch<React.SetStateAction<Tela>>;
  classe: ClasseRPG;
  setClasse: React.Dispatch<React.SetStateAction<ClasseRPG>>;
  nex: number;
  setNex: React.Dispatch<React.SetStateAction<number>>;
  atributos: Atributos;
  setAtributos: React.Dispatch<React.SetStateAction<Atributos>>;
  bonusAtributos: Atributos;
  setBonusAtributos: React.Dispatch<React.SetStateAction<Atributos>>;
  pontosRestantes: number;
  alterarAtributo: (nome: AtributoKey, operacao: 'aumentar' | 'diminuir') => void;
  status: ReturnType<typeof useStatus>;
  periciasHook: ReturnType<typeof usePericias>;
  poderesHook: ReturnType<typeof usePoderes>;
  inventarioHook: ReturnType<typeof useInventario>;
  armasHook: ReturnType<typeof useArmas>;
  municoesHook: ReturnType<typeof useMunicoes>;
  protecoesHook: ReturnType<typeof useProtecoes>;
  itensHook: ReturnType<typeof useItens>;
  itensAmaldicoadosHook: ReturnType<typeof useItensAmaldicoados>;
  bonusVestimentas: VestimentasBonus;
  bonusMaldicoes: MaldicoesBonusGlobais;
  toggleVestimentaGeral: (id: string, isAmaldicoado: boolean) => void;
  modificacoesHook: ReturnType<typeof useModificacoes>;
  maldicoesHook: ReturnType<typeof useMaldicoes>;
  abaDireita: AbaDireita;
  setAbaDireita: React.Dispatch<React.SetStateAction<AbaDireita>>;
  abaModalPoderes: AbaModalPoderes;
  setAbaModalPoderes: React.Dispatch<React.SetStateAction<AbaModalPoderes>>;
  tipoModalPoderes: 'utilidade' | 'combate';
  setTipoModalPoderes: React.Dispatch<React.SetStateAction<'utilidade' | 'combate'>>;
  origensHook: ReturnType<typeof useOrigem>;
  trilhasHook: ReturnType<typeof useTrilhas>;
  defEquip: number;
  setDefEquip: React.Dispatch<React.SetStateAction<number>>;
  defOutros: number;
  setDefOutros: React.Dispatch<React.SetStateAction<number>>;
  defesaTotal: number;
  totalDefesaProtecoes: number;
  bloqueioData: { base: number, bonusVig: boolean };
  setBloqueioData: React.Dispatch<React.SetStateAction<{ base: number, bonusVig: boolean }>>;
  protecoes: string[];
  proficienciasTotais: string[];
  sentidos: string[];
  imunidades: string[];
  vulnerabilidades: string[];
  setProtecoes: React.Dispatch<React.SetStateAction<string[]>>;
  setSentidos: React.Dispatch<React.SetStateAction<string[]>>;
  setImunidades: React.Dispatch<React.SetStateAction<string[]>>;
  setVulnerabilidades: React.Dispatch<React.SetStateAction<string[]>>;
  resistencias: string[];
  setResistencias: React.Dispatch<React.SetStateAction<string[]>>;
  proficiencias: string[];
  setProficiencias: React.Dispatch<React.SetStateAction<string[]>>;
  regrasAtivas: boolean;
  setRegrasAtivas: React.Dispatch<React.SetStateAction<boolean>>;
  bloquearLetras: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  refazerPersonagem: () => void;
  filtroHabilidades: string;
  setFiltroHabilidades: React.Dispatch<React.SetStateAction<string>>;
  habilidadesExpandidas: string[];
  setHabilidadesExpandidas: React.Dispatch<React.SetStateAction<string[]>>;
  nexModalAberto: number | null;
  setNexModalAberto: React.Dispatch<React.SetStateAction<number | null>>;
  poderesModalExpandidos: number[];
  setPoderesModalExpandidos: React.Dispatch<React.SetStateAction<number[]>>;
  nexPoderEditando: number | string | null;
  setNexPoderEditando: React.Dispatch<React.SetStateAction<number | string | null>>;
  fichaIdAtual: string | null;
  setFichaIdAtual: React.Dispatch<React.SetStateAction<string | null>>;
  nomeEditando: string;
  setNomeEditando: React.Dispatch<React.SetStateAction<string>>;
  jogadorEditando: string;
  setJogadorEditando: React.Dispatch<React.SetStateAction<string>>;
  resetarFichaParaNova: () => void;
  descricaoEditando: string;
  setDescricaoEditando: React.Dispatch<React.SetStateAction<string>>;
  afinidadeEditando: string;
  setAfinidadeEditando: React.Dispatch<React.SetStateAction<string>>;
  skillCombatente1: string;
  setSkillCombatente1: React.Dispatch<React.SetStateAction<string>>;
  skillCombatente2: string;
  setSkillCombatente2: React.Dispatch<React.SetStateAction<string>>;
  deslocM: number;
  setDeslocM: React.Dispatch<React.SetStateAction<number>>;
  deslocQ: number;
  setDeslocQ: React.Dispatch<React.SetStateAction<number>>;
  bonusDadosCondicionais: string;
  setBonusDadosCondicionais: React.Dispatch<React.SetStateAction<string>>;
  bonusDadosAtivos: string;
  setBonusDadosAtivos: React.Dispatch<React.SetStateAction<string>>;
  regras: Record<string, boolean>;
  setRegras: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleRegra: (nome: string) => void;
  nivel: number;
  setNivel: React.Dispatch<React.SetStateAction<number>>;
  rituaisHook: ReturnType<typeof useRituais>;
  rituaisExpandidos: number[];
  setRituaisExpandidos: React.Dispatch<React.SetStateAction<number[]>>;
  versaoRitual: Record<number, VersaoRitual>;
  setVersaoRitual: React.Dispatch<React.SetStateAction<Record<number, VersaoRitual>>>;
  elementoRitual: Record<number, string>;
  setElementoRitual: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  jaTinhaPericiaTrilha: boolean;

  afinidadeEscolhida: string | null;
  setAfinidadeEscolhida: React.Dispatch<React.SetStateAction<string | null>>;
  afinidadeAtiva: boolean;
  poderesExtras: Record<string, string>;
  setPoderesExtras: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  progressaoNexRecusados: number[];
  setProgressaoNexRecusados: React.Dispatch<React.SetStateAction<number[]>>;
  progressaoNexEditados: Record<number, string>;
  setProgressaoNexEditados: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  elementoRegra18: string | null;
  setElementoRegra18: React.Dispatch<React.SetStateAction<string | null>>;
  regrasAutomaticasAtivas: Set<number>;
  escolhaRegra53: 'FOR' | 'AGI' | null;
  setEscolhaRegra53: React.Dispatch<React.SetStateAction<'FOR' | 'AGI' | null>>;
  atributosFinais: Atributos;
  historicoRolagens: ResultadoRolagem[];
  ultimaRolagem: ResultadoRolagem | null;
  diceTrayAberto: boolean;
  setDiceTrayAberto: React.Dispatch<React.SetStateAction<boolean>>;
  executarRolagemPericia: (periciaNome: string, atributoNome: AtributoKey, bonusTotal: number) => ResultadoRolagem;
  executarRolagemAtaque: (armaNome: string, atributoNome: AtributoKey, bonusAtaque: number, margemCritico?: number, periciaUsada?: string) => ResultadoRolagem;
  executarRolagemDano: (armaNome: string, expressaoDano: string, multCritico?: number, isCritico?: boolean) => ResultadoRolagem;
  executarRolagemLivre: (qtd: number, faces: number, mod?: number, keepMode?: 'highest' | 'lowest' | 'all', descricao?: string) => ResultadoRolagem;
  limparHistoricoRolagens: () => void;
  condicoesAtivas: CondicaoId[];
  setCondicoesAtivas: React.Dispatch<React.SetStateAction<CondicaoId[]>>;
  toggleCondicao: (id: CondicaoId) => void;
  adicionarCondicao: (id: CondicaoId) => void;
  removerCondicao: (id: CondicaoId) => void;
  limparCondicoes: () => void;
  modalCondicoesAberto: boolean;
  setModalCondicoesAberto: React.Dispatch<React.SetStateAction<boolean>>;
  penalidadesCondicoes: ResumoPenalidadesCalculadas;
  estadoSobrevivencia: EstadoSobrevivencia;
  setEstadoSobrevivencia: React.Dispatch<React.SetStateAction<EstadoSobrevivencia>>;
  estabilizarMorrendo: () => void;
  estabilizarEnlouquecendo: () => void;
  registrarFalhaMorte: () => void;
  conjurarRitual: (params: ConjurarRitualParams) => ResultadoConjuracao;
}

export const RPGContext = createContext<RPGContextType | null>(null);

// ============================================================
// PROVIDER
// ============================================================
export function RPGProvider({ children }: { children: React.ReactNode }) {
  const [telaAtual, setTelaAtual] = useState<Tela>('atributos');
  const [classe, setClasse] = useState<ClasseRPG>(null);
  const [nex, setNex] = useState(5);
  const [abaDireita, setAbaDireita] = useState<AbaDireita>('combate');
  const [abaModalPoderes, setAbaModalPoderes] = useState<AbaModalPoderes>('classe');
  const [tipoModalPoderes, setTipoModalPoderes] = useState<'utilidade' | 'combate'>('utilidade');
  const [atributos, setAtributos] = useState<Atributos>({ FOR: 1, AGI: 1, INT: 1, PRE: 1, VIG: 1 });
  const [bonusAtributos, setBonusAtributos] = useState<Atributos>({ FOR: 0, AGI: 0, INT: 0, PRE: 0, VIG: 0 });
  const [defEquip, setDefEquip] = useState(0);
  const [defOutros, setDefOutros] = useState(0);
  const [bloqueioData, setBloqueioData] = useState({ base: 0, bonusVig: false });
  const [protecoes, setProtecoes] = useState<string[]>([]);
  const [sentidos, setSentidos] = useState<string[]>([]);
  const [imunidades, setImunidades] = useState<string[]>([]);
  const [vulnerabilidades, setVulnerabilidades] = useState<string[]>([]);
  const [resistencias, setResistencias] = useState<string[]>([]);
  const [proficiencias, setProficiencias] = useState<string[]>([]);
  const [regrasAtivas, setRegrasAtivas] = useState(true);
  const [filtroHabilidades, setFiltroHabilidades] = useState('');
  const [habilidadesExpandidas, setHabilidadesExpandidas] = useState<string[]>([]);
  const [nexModalAberto, setNexModalAberto] = useState<number | null>(null);
  const [poderesModalExpandidos, setPoderesModalExpandidos] = useState<number[]>([]);
  const [nexPoderEditando, setNexPoderEditando] = useState<number | string | null>(null);
  const [fichaIdAtual, setFichaIdAtual] = useState<string | null>(null);
  const [nomeEditando, setNomeEditando] = useState('');
  const [jogadorEditando, setJogadorEditando] = useState('');
  const [descricaoEditando, setDescricaoEditando] = useState('');
  const [afinidadeEditando, setAfinidadeEditando] = useState('');
  const [skillCombatente1, setSkillCombatente1] = useState('');
  const [skillCombatente2, setSkillCombatente2] = useState('');
  const [deslocM, setDeslocM] = useState(9);
  const [deslocQ, setDeslocQ] = useState(6);
  const [bonusDadosCondicionais, setBonusDadosCondicionais] = useState('');
  const [bonusDadosAtivos, setBonusDadosAtivos] = useState('');
  const [regras, setRegras] = useState<Record<string, boolean>>({});
  const [nivel, setNivel] = useState(1);

  const [rituaisExpandidos, setRituaisExpandidos] = useState<number[]>([]);
  const [versaoRitual, setVersaoRitual] = useState<Record<number, VersaoRitual>>({});
  const [elementoRitual, setElementoRitual] = useState<Record<number, string>>({});
  
  const [afinidadeEscolhida, setAfinidadeEscolhida] = useState<string | null>(null);
  const [poderesExtras, setPoderesExtras] = useState<Record<string, string>>({});
  const [progressaoNexRecusados, setProgressaoNexRecusados] = useState<number[]>([]);
  const [progressaoNexEditados, setProgressaoNexEditados] = useState<Record<number, string>>({});
  const [elementoRegra18, setElementoRegra18] = useState<string | null>(null);
  const [escolhaRegra53, setEscolhaRegra53] = useState<'FOR' | 'AGI' | null>(null);

  const [historicoRolagens, setHistoricoRolagens] = useState<ResultadoRolagem[]>([]);
  const [ultimaRolagem, setUltimaRolagem] = useState<ResultadoRolagem | null>(null);
  const [diceTrayAberto, setDiceTrayAberto] = useState<boolean>(false);

  // Estados de Condições & Sobrevivência
  const [condicoesAtivas, setCondicoesAtivas] = useState<CondicaoId[]>([]);
  const [modalCondicoesAberto, setModalCondicoesAberto] = useState<boolean>(false);
  const [estadoSobrevivencia, setEstadoSobrevivencia] = useState<EstadoSobrevivencia>({
    morrendo: false,
    enlouquecendo: false,
    falhasMorte: 0,
    rodadasMorrendo: 0,
  });

  const penalidadesCondicoes = useMemo(() => {
    return calcularPenalidadesCondicoes(condicoesAtivas);
  }, [condicoesAtivas]);

  const toggleCondicao = useCallback((id: CondicaoId) => {
    setCondicoesAtivas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }, []);

  const adicionarCondicao = useCallback((id: CondicaoId) => {
    setCondicoesAtivas(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removerCondicao = useCallback((id: CondicaoId) => {
    setCondicoesAtivas(prev => prev.filter(c => c !== id));
  }, []);

  const limparCondicoes = useCallback(() => {
    setCondicoesAtivas([]);
    setEstadoSobrevivencia({
      morrendo: false,
      enlouquecendo: false,
      falhasMorte: 0,
      rodadasMorrendo: 0,
    });
  }, []);

  const estabilizarMorrendo = useCallback(() => {
    setCondicoesAtivas(prev => prev.filter(c => c !== 'morrendo'));
    setEstadoSobrevivencia(prev => ({
      ...prev,
      morrendo: false,
      falhasMorte: 0,
      rodadasMorrendo: 0,
    }));
    if ((status.pvAtual ?? 0) <= 0) {
      status.setPvAtual(1);
    }
  }, [status]);

  const estabilizarEnlouquecendo = useCallback(() => {
    setCondicoesAtivas(prev => {
      const sem = prev.filter(c => c !== 'enlouquecendo');
      return sem.includes('perturbado') ? sem : [...sem, 'perturbado'];
    });
    setEstadoSobrevivencia(prev => ({
      ...prev,
      enlouquecendo: false,
    }));
    if ((status.sanAtual ?? 0) <= 0) {
      status.setSanAtual(1);
    }
  }, [status]);

  const registrarFalhaMorte = useCallback(() => {
    setEstadoSobrevivencia(prev => ({
      ...prev,
      falhasMorte: Math.min(3, prev.falhasMorte + 1),
    }));
  }, []);

  // Monitora 0 PV para Morrendo
  useEffect(() => {
    if (status.pvAtual === 0 && status.pvMax > 0) {
      setCondicoesAtivas(prev => (prev.includes('morrendo') ? prev : [...prev, 'morrendo']));
      setEstadoSobrevivencia(prev => ({ ...prev, morrendo: true }));
    } else if (status.pvAtual !== null && status.pvAtual > 0) {
      setCondicoesAtivas(prev => (prev.includes('morrendo') ? prev.filter(c => c !== 'morrendo') : prev));
      setEstadoSobrevivencia(prev => (prev.morrendo ? { ...prev, morrendo: false, falhasMorte: 0, rodadasMorrendo: 0 } : prev));
    }
  }, [status.pvAtual, status.pvMax]);

  // Monitora 0 SAN para Enlouquecendo
  useEffect(() => {
    if (!regras['sem_sanidade'] && status.sanAtual === 0 && status.sanMax > 0) {
      setCondicoesAtivas(prev => (prev.includes('enlouquecendo') ? prev : [...prev, 'enlouquecendo']));
      setEstadoSobrevivencia(prev => ({ ...prev, enlouquecendo: true }));
    } else if (status.sanAtual !== null && status.sanAtual > 0) {
      setCondicoesAtivas(prev => (prev.includes('enlouquecendo') ? prev.filter(c => c !== 'enlouquecendo') : prev));
      setEstadoSobrevivencia(prev => (prev.enlouquecendo ? { ...prev, enlouquecendo: false } : prev));
    }
  }, [status.sanAtual, status.sanMax, regras]);

  const toggleRegra = useCallback((nome: string) => {
    setRegras(prev => {
      const novo = { ...prev, [nome]: !prev[nome] };
      
      if (nome === 'nex_experiencia') {
        if (novo[nome]) {
          // Ativou a regra: salva nível baseado no NEX atual
          setNivel(Math.min(20, Math.max(1, Math.ceil(nex / 5))));
          setNex(0);
        } else {
          // Desativou a regra: recupera NEX baseado no Nível atual
          setNex(Math.min(99, Math.max(5, nivel * 5)));
        }
      }
      return novo;
    });
  }, [nex, nivel]);


  // ============================================================
  // HOOKS
  // ============================================================
  const trilhasHook = useTrilhas(classe);
  const poderesHook = usePoderes(classe);
  const origensHook = useOrigem();
  

  // Computa o conjunto de regras automáticas ativas
  const regrasAutomaticasAtivas = useMemo(() => {
    const set = new Set<number>();
    if (origensHook.origemSelecionada?.Codigo_Regra) {
      set.add(Number(origensHook.origemSelecionada.Codigo_Regra));
    }
    Object.values(poderesHook.poderesEscolhidos).forEach(p => {
      if (p.codigoRegra) set.add(Number(p.codigoRegra));
    });
    return set;
  }, [origensHook.origemSelecionada, poderesHook.poderesEscolhidos]);

  const armasHook = useArmas(nex, regrasAutomaticasAtivas);
  const municoesHook = useMunicoes();
  const protecoesHook = useProtecoes();
  const rituaisHook = useRituais();

  const modificacoesHook = useModificacoes();
  const maldicoesHook = useMaldicoes();

  const itensHook = useItens(regrasAutomaticasAtivas.has(23) ? 3 : 2);
  const itensAmaldicoadosHook = useItensAmaldicoados();

  const bonusVestimentas = useMemo(() => {
    return calcularBonusVestimentas(itensAmaldicoadosHook.itensAmaldicoadosInventario);
  }, [itensAmaldicoadosHook.itensAmaldicoadosInventario]);

  const bonusMaldicoes = useMemo(() => {
    return calcularBonusMaldicoes(armasHook.armasInventario, protecoesHook.protecoesInventario, itensHook.itensInventario, municoesHook.municoesInventario, maldicoesHook.maldicoes);
  }, [armasHook.armasInventario, protecoesHook.protecoesInventario, itensHook.itensInventario, municoesHook.municoesInventario, maldicoesHook.maldicoes]);


  const toggleVestimentaGeral = useCallback((id: string, isAmaldicoado: boolean) => {
    const maxVestimentas = regrasAutomaticasAtivas.has(23) ? 3 : 2;
    
    let isEquipando = false;
    if (isAmaldicoado) {
      isEquipando = !itensAmaldicoadosHook.itensAmaldicoadosInventario.find(i => i.id === id)?.equipado;
    } else {
      isEquipando = !itensHook.itensInventario.find(i => i.id === id)?.equipado;
    }

    if (!isEquipando) {
      if (isAmaldicoado) itensAmaldicoadosHook.toggleEquipadoSimples(id, false);
      else itensHook.toggleEquipadoSimples(id, false);
      return;
    }

    const vestimentasGeraisEquipadas = itensHook.itensInventario.filter(i => i.equipado && (i.item.Nome_Item.toLowerCase().includes('vestimenta') || i.item.Nome_Item.toLowerCase().includes('amuleto sagrado')));
    const vestimentasAmaldicoadasEquipadas = itensAmaldicoadosHook.itensAmaldicoadosInventario.filter(i => i.equipado && i.item['Vestimenta?']?.toLowerCase() === 'true');

    const totalEquipadas = vestimentasGeraisEquipadas.length + vestimentasAmaldicoadasEquipadas.length;

    if (totalEquipadas >= maxVestimentas) {
      if (vestimentasGeraisEquipadas.length > 0) {
        itensHook.toggleEquipadoSimples(vestimentasGeraisEquipadas[0].id, false);
      } else if (vestimentasAmaldicoadasEquipadas.length > 0) {
        itensAmaldicoadosHook.toggleEquipadoSimples(vestimentasAmaldicoadasEquipadas[0].id, false);
      }
    }

    if (isAmaldicoado) itensAmaldicoadosHook.toggleEquipadoSimples(id, true);
    else itensHook.toggleEquipadoSimples(id, true);
  }, [itensHook, itensAmaldicoadosHook, regrasAutomaticasAtivas]);

  // Sincroniza ganho/perda de NEX pelos Rituais
  const rituaisAprendidosRef = React.useRef(rituaisHook.rituaisAprendidos);

  React.useEffect(() => {
    if (!regras['nex_experiencia']) {
      rituaisAprendidosRef.current = rituaisHook.rituaisAprendidos;
      return;
    }

    const previous = rituaisAprendidosRef.current;
    const current = rituaisHook.rituaisAprendidos;

    if (previous && current && previous !== current) {
      let nexDiff = 0;
      
      // Calculate what was added
      current.forEach(ritual => {
        if (!previous.some(p => p.id === ritual.id)) {
          const def = rituaisHook.rituais?.find(r => r.Nome_Ritual === ritual.nome);
          if (def) nexDiff += parseInt(def.Circulo, 10) || 0;
        }
      });
      
      // Calculate what was removed
      previous.forEach(ritual => {
        if (!current.some(p => p.id === ritual.id)) {
          const def = rituaisHook.rituais?.find(r => r.Nome_Ritual === ritual.nome);
          if (def) nexDiff -= parseInt(def.Circulo, 10) || 0;
        }
      });

      if (nexDiff !== 0) {
        setNex(prev => Math.min(99, Math.max(0, prev + nexDiff)));
      }
    }

    rituaisAprendidosRef.current = current;
  }, [rituaisHook.rituaisAprendidos, rituaisHook.rituais, regras]);

  const paranormalPenalty = useMemo(() => {
    const qtd = Object.entries(poderesHook.poderesEscolhidos).filter(([key, p]) => {
      if (p.categoria !== 'paranormais') return false;
      const numKey = Number(key);
      if (!isNaN(numKey) && numKey >= 1000) return false;
      if (String(key).startsWith('extra_')) return false;
      return true;
    }).length;
    if (qtd === 0 || !classe) return 0;
    
    let perda = 0;
    if (classe === 'Especialista') perda = 4;
    else if (classe === 'Combatente') perda = 3;
    else if (classe === 'Ocultista') perda = 5;
    
    return qtd * perda;
  }, [poderesHook.poderesEscolhidos, classe]);

  // Sincroniza o nível com o NEX caso a regra 'nex_experiencia' não esteja ativa
  React.useEffect(() => {
    if (!regras['nex_experiencia']) {
      setNivel(Math.min(20, Math.max(1, Math.ceil(nex / 5))));
    }
  }, [nex, regras]);

  
  const effectiveNex = useMemo(() => {
    let finalNex = nex;
    if (regrasAutomaticasAtivas.has(83)) finalNex += 5;
    return Math.min(99, finalNex);
  }, [nex, regrasAutomaticasAtivas]);

  const effectiveNivel = useMemo(() => {
    let finalNivel = nivel;
    if (regrasAutomaticasAtivas.has(83)) finalNivel += 1;
    return Math.min(20, finalNivel);
  }, [nivel, regrasAutomaticasAtivas]);

const atributosBaseComBonus = useMemo(() => {
    const obj = { ...atributos };
    (Object.keys(obj) as AtributoKey[]).forEach(k => {
      obj[k] += bonusAtributos[k] + (bonusMaldicoes.atributos[k] || 0);
    });
    return obj;
  }, [atributos, bonusAtributos]);

  const status = useStatus(classe, effectiveNex, effectiveNivel, atributosBaseComBonus, paranormalPenalty, regrasAutomaticasAtivas, bonusVestimentas.pv + bonusMaldicoes.pv, bonusVestimentas.pe + bonusMaldicoes.pe);

  
  React.useEffect(() => {
    if (regrasAutomaticasAtivas.has(83)) {
      if ((regras['nex_experiencia'] && nivel >= 20) || (!regras['nex_experiencia'] && nex >= 95)) {
        if (!status.hasPeTemp) {
          status.setHasPeTemp(true);
          status.setPeTempMax(10);
          status.setPeTempAtual(10);
        }
      }
    }
  }, [regrasAutomaticasAtivas, nex, nivel, regras, status]);

const atributosFinais = useMemo(() => {
    const obj = { ...atributosBaseComBonus };
    const machucado = status.pvAtual !== null && status.pvMax > 0 && status.pvAtual <= Math.floor(status.pvMax / 2);
    if (machucado && regrasAutomaticasAtivas.has(53) && escolhaRegra53) {
      obj[escolhaRegra53] += regrasAutomaticasAtivas.has(54) ? 2 : 1;
    }
    
    // Clear choice if not machucado anymore
    if (!machucado && escolhaRegra53) {
       setEscolhaRegra53(null);
    }
    
    return obj;
  }, [atributosBaseComBonus, status.pvAtual, status.pvMax, regrasAutomaticasAtivas, escolhaRegra53]);

  const afinidadeAtiva = useMemo(() => {
    if (!afinidadeEscolhida) return false;

    // Se a regra estiver ativa, a afinidade é garantida a partir do NEX 60 automaticamente
    if (regras['nex_experiencia'] && nivel >= 12) {
      return true;
    }

    // Comportamento original corrigido: transcender antes de 50% não dá afinidade.
    // Chaves de transcender são: nexPatamar + 1000 (ex: 1025, 1050).
    return Object.entries(poderesHook.poderesEscolhidos).some(([key, p]) => {
      if (p.categoria !== 'paranormais') return false;
      
      let nexSlot = Number(key);
      if (isNaN(nexSlot)) return false;

      // Normaliza as chaves do botão transcender (1025 -> 25, 1050 -> 50, etc)
      if (nexSlot > 1000) {
        nexSlot -= 1000;
      }

      return nexSlot >= 50;
    });
  }, [afinidadeEscolhida, poderesHook.poderesEscolhidos, regras, nex, nivel]);

  const periciasGratisSemTrilha = useMemo(() => {
    const gratis: string[] = [];
    if (classe === 'Ocultista') {
      gratis.push('Vontade', 'Ocultismo');
    } else if (classe === 'Combatente') {
      if (skillCombatente1) gratis.push(skillCombatente1);
      if (skillCombatente2) gratis.push(skillCombatente2);
    }
    if (origensHook.origemSelecionada) {
      const { nome_p1, nome_p2, nome_pesp, Codigo_Per_Regra, escolhaRegra6 } = origensHook.origemSelecionada;
      if (nome_p1) gratis.push(nome_p1);

      if (Codigo_Per_Regra === 1) {
        // Regra 1: Apenas a per�cia 1
      } else if (Codigo_Per_Regra === 6) {
        // Regra 6: Per�cia 1 + escolha
        if (escolhaRegra6 === 'p2' && nome_p2) gratis.push(nome_p2);
        else if (escolhaRegra6 === 'pesp' && nome_pesp) gratis.push(nome_pesp);
      } else if (Codigo_Per_Regra === 7) {
        // Regra 7 n�o adiciona treino b�sico aqui
      } else {
        // Padr�o: Per�cia 1 + Per�cia 2
        if (nome_p2) gratis.push(nome_p2);
      }
    }
    return gratis;
  }, [classe, skillCombatente1, skillCombatente2, origensHook.origemSelecionada]);

  const periciasGratis = useMemo(() => {
    const list = [...periciasGratisSemTrilha];
    if (trilhasHook.trilhaSelecionada && trilhasHook.trilhaSelecionada.nome_pericia) {
      list.push(trilhasHook.trilhaSelecionada.nome_pericia);
    }
    return list;
  }, [periciasGratisSemTrilha, trilhasHook.trilhaSelecionada]);

  const jaTinhaPericiaTrilha = useMemo(() => {
    if (!trilhasHook.trilhaSelecionada || !trilhasHook.trilhaSelecionada.nome_pericia) return false;
    return periciasGratisSemTrilha.includes(trilhasHook.trilhaSelecionada.nome_pericia);
  }, [periciasGratisSemTrilha, trilhasHook.trilhaSelecionada]);

  const veteranasGratis = useMemo(() => {
    const vet: string[] = [];
    if (origensHook.origemSelecionada?.Codigo_Per_Regra === 7) {
      vet.push('Pilotagem');
    }
    return vet;
  }, [origensHook.origemSelecionada]);

  const periciasHook = usePericias(
    classe, 
    nivel, 
    atributosFinais, 
    regrasAtivas, 
    periciasGratis, 
    origensHook.origemSelecionada?.Codigo_Per_Regra, 
    veteranasGratis, 
    regrasAutomaticasAtivas, 
    poderesHook.poderesEscolhidos,
    origensHook.origemSelecionada,
    (() => { const comb = {...bonusVestimentas.pericias}; Object.keys(bonusMaldicoes.pericias || {}).forEach(k => { comb[k] = (comb[k] || 0) + bonusMaldicoes.pericias[k]; }); return comb; })()
  );

  const grauProfissao = periciasHook.pericias['Profissão']?.treino || 0;
  const inventarioHook = useInventario(origensHook.origemSelecionada?.Codigo_Regra, grauProfissao);

  // ============================================================
  // LÓGICA DE ATRIBUTOS
  // ============================================================
  const capMaximo = capMaximoAtributo(nivel);
  const pontosIniciais = pontosIniciaisPorNivel(nivel);

  let pontosGastos = 0;
  let bonusPorAtributoZero = 0;
  Object.values(atributos).forEach(valor => {
    if (valor === 0) bonusPorAtributoZero += 1;
    else if (valor > 1) pontosGastos += valor - 1;
  });
  const pontosTotais = pontosIniciais + bonusPorAtributoZero;
  const pontosRestantes = pontosTotais - pontosGastos;

  const alterarAtributo = useCallback(
    (nome: AtributoKey, operacao: 'aumentar' | 'diminuir') => {
      setAtributos(prev => {
        const valorAtual = prev[nome];
        if (operacao === 'aumentar' && pontosRestantes > 0 && valorAtual < capMaximo) {
          return { ...prev, [nome]: valorAtual + 1 };
        }
        if (operacao === 'diminuir') {
          if (valorAtual === 1 && Object.values(prev).filter(v => v === 0).length >= 1) {
            return prev;
          }
          if (valorAtual > 0) return { ...prev, [nome]: valorAtual - 1 };
        }
        return prev;
      });
    },
    [pontosRestantes, capMaximo]
  );

  // ============================================================
  // PROFICIÊNCIAS TOTAIS
  // ============================================================
  const proficienciasTotais = [...proficiencias];
  if (regrasAutomaticasAtivas.has(17) && !proficienciasTotais.includes('Armas Pesadas')) proficienciasTotais.push('Armas Pesadas');
  if (regrasAutomaticasAtivas.has(20) && !proficienciasTotais.includes('Proteções Pesadas')) proficienciasTotais.push('Proteções Pesadas');
  if (regrasAutomaticasAtivas.has(27) && !proficienciasTotais.includes('Armas Táticas (de fogo)')) proficienciasTotais.push('Armas Táticas (de fogo)');
  if (regrasAutomaticasAtivas.has(28) && !proficienciasTotais.includes('Armas Táticas (corpo a corpo e de disparo)')) proficienciasTotais.push('Armas Táticas (corpo a corpo e de disparo)');
  if (regrasAutomaticasAtivas.has(38) && !proficienciasTotais.includes('Proteções Leves')) proficienciasTotais.push('Proteções Leves');

  // ============================================================
  // DEFESA
  // ============================================================
  const defOutrosBonusRegra4 = regrasAutomaticasAtivas.has(4) ? 2 : 0;
  const defOutrosBonusRegra12 = regrasAutomaticasAtivas.has(12) ? 2 : 0;
  
  const temProtecaoPesada = protecoesHook?.protecoesInventario.some(p => p.equipado && p.protecao.Proficiencia?.toLowerCase().includes('pesada')) || false;
  const defOutrosBonusRegra21 = (regrasAutomaticasAtivas.has(21) && temProtecaoPesada) ? 2 : 0;
  
  const temProtecaoLeve = protecoesHook?.protecoesInventario.some(p => p.equipado && p.protecao.Proficiencia?.toLowerCase().includes('leve')) || false;
  const defOutrosBonusRegra25 = (regrasAutomaticasAtivas.has(25) && temProtecaoLeve) ? 2 : 0;

  const totalDefesaProtecoes = (protecoesHook?.protecoesInventario || []).reduce((acc, item) => {
    if (!item.equipado) return acc;
    const defRaw = String(item.protecao.Defesa_Protecao || '0').replace(/[^0-9.-]+/g, '');
    let defVal = Number(defRaw);
    if (isNaN(defVal)) defVal = 0;
    
    // Bônus Reforçada
    const temReforcada = (item.modificacoes || []).some(id => {
      const m = modificacoesHook?.modificacoes.find(mod => mod.Codigo_Modif === id);
      return m?.Nome_Modif.trim().toLowerCase() === 'reforçada';
    });
    if (temReforcada) defVal += 2;
    
    return acc + defVal;
  }, 0);

  const defesaTotal = 10 + atributos.AGI + bonusAtributos.AGI + defEquip + defOutros + defOutrosBonusRegra4 + defOutrosBonusRegra12 + defOutrosBonusRegra21 + defOutrosBonusRegra25 + totalDefesaProtecoes + (bonusVestimentas?.defesa || 0) + (bonusMaldicoes?.defesa || 0) + penalidadesCondicoes.penalidadeDefesa;

  // ============================================================
  // UTILITÁRIOS
  // ============================================================
  const bloquearLetras = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const refazerPersonagem = useCallback(() => {
    setAtributos({ FOR: 1, AGI: 1, INT: 1, PRE: 1, VIG: 1 });
    setBonusAtributos({ FOR: 0, AGI: 0, INT: 0, PRE: 0, VIG: 0 });
    setSkillCombatente1('');
    setSkillCombatente2('');
    setClasse(null);
    setTelaAtual('atributos');
    setProtecoes([]);
    setResistencias([]);
    setProficiencias([]);
    setCondicoesAtivas([]);
    setEstadoSobrevivencia({ morrendo: false, enlouquecendo: false, falhasMorte: 0, rodadasMorrendo: 0 });
    status.resetarStatus();
  }, [status]);

  const resetarFichaParaNova = useCallback(() => {
    setFichaIdAtual(null);
    setAtributos({ FOR: 1, AGI: 1, INT: 1, PRE: 1, VIG: 1 });
    setBonusAtributos({ FOR: 0, AGI: 0, INT: 0, PRE: 0, VIG: 0 });
    setSkillCombatente1('');
    setSkillCombatente2('');
    setClasse(null);
    setNex(5);
    setNivel(1);
    setNomeEditando('');
    setJogadorEditando('');
    setDescricaoEditando('');
    setAfinidadeEditando('');
    setAfinidadeEscolhida(null);
    setDefEquip(0);
    setDefOutros(0);
    setBloqueioData({ base: 0, bonusVig: false });
    setProtecoes([]);
    setSentidos([]);
    setImunidades([]);
    setVulnerabilidades([]);
    setResistencias([]);
    setProficiencias([]);
    setPoderesExtras({});
    setProgressaoNexRecusados([]);
    setProgressaoNexEditados({});
    setVersaoRitual({});
    setElementoRitual({});
    setElementoRegra18(null);
    setEscolhaRegra53(null);
    setCondicoesAtivas([]);
    setEstadoSobrevivencia({ morrendo: false, enlouquecendo: false, falhasMorte: 0, rodadasMorrendo: 0 });
    status.resetarStatus();
    if (periciasHook?.setPericiasStatus) periciasHook.setPericiasStatus({});
    if (poderesHook?.setPoderesEscolhidos) poderesHook.setPoderesEscolhidos({});
    if (origensHook?.setOrigemSelecionada) origensHook.setOrigemSelecionada(null);
    if (rituaisHook?.setRituaisAprendidos) rituaisHook.setRituaisAprendidos([]);
    if (armasHook?.setArmasInventario) armasHook.setArmasInventario([]);
    if (protecoesHook?.setProtecoesInventario) protecoesHook.setProtecoesInventario([]);
    if (municoesHook?.setMunicoesInventario) municoesHook.setMunicoesInventario([]);
    if (itensHook?.setItensInventario) itensHook.setItensInventario([]);
    if (itensAmaldicoadosHook?.setItensAmaldicoadosInventario) itensAmaldicoadosHook.setItensAmaldicoadosInventario([]);
    if (modificacoesHook?.setModificacoesAtivas) modificacoesHook.setModificacoesAtivas({});
    if (trilhasHook?.setTrilhaSelecionada) trilhasHook.setTrilhaSelecionada(null);
    if (trilhasHook?.setVersatilidadeSelecionada) trilhasHook.setVersatilidadeSelecionada(null);
    setTelaAtual('atributos');
  }, [
    status, periciasHook, poderesHook, origensHook, rituaisHook, armasHook,
    protecoesHook, municoesHook, itensHook, itensAmaldicoadosHook, modificacoesHook, trilhasHook
  ]);

  // Sincronização automática com a Mesa Digital (Battlemat) em tempo real
  useEffect(() => {
    if (!classe) return;
    const timer = setTimeout(() => {
      sendCharacterStatus(
        nomeEditando || 'Investigador',
        classe,
        status.pvAtual,
        status.pvMax,
        status.sanAtual,
        status.sanMax,
        status.peAtual,
        status.peMax
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [
    nomeEditando,
    classe,
    status.pvAtual,
    status.pvMax,
    status.sanAtual,
    status.sanMax,
    status.peAtual,
    status.peMax,
  ]);

  // ============================================================
  // FUNÇÕES DO ROLADOR DE DADOS
  // ============================================================
  const registrarRolagem = useCallback((resultado: ResultadoRolagem) => {
    setUltimaRolagem(resultado);
    setHistoricoRolagens(prev => [resultado, ...prev.slice(0, 49)]);
    setDiceTrayAberto(true);
  }, []);

  const executarRolagemPericia = useCallback((periciaNome: string, atributoNome: AtributoKey, bonusTotal: number) => {
    const valorAtributoBase = atributosFinais[atributoNome] ?? 1;
    const penalidadeAttr = penalidadesCondicoes.penalidadeDadosAtributos[atributoNome] || 0;
    const penalidadeGeral = penalidadesCondicoes.penalidadeDadosTodos || 0;
    const penalidadeTotalDados = penalidadeAttr + penalidadeGeral;
    const valorAtributoFinal = Math.max(0, valorAtributoBase + penalidadeTotalDados);

    const resultado = rolarPericia(periciaNome, valorAtributoFinal, bonusTotal, atributoNome, penalidadeTotalDados);
    registrarRolagem(resultado);
    return resultado;
  }, [atributosFinais, penalidadesCondicoes, registrarRolagem]);

  const executarRolagemAtaque = useCallback((armaNome: string, atributoNome: AtributoKey, bonusAtaque: number, margemCritico: number = 20, periciaUsada: string = 'Pontaria') => {
    const valorAtributoBase = atributosFinais[atributoNome] ?? 1;
    const penalidadeAttr = penalidadesCondicoes.penalidadeDadosAtributos[atributoNome] || 0;
    const penalidadeGeral = penalidadesCondicoes.penalidadeDadosTodos || 0;
    const penalidadeAtaque = penalidadesCondicoes.penalidadeAtaque || 0;
    const penalidadeTotalDados = penalidadeAttr + penalidadeGeral + penalidadeAtaque;
    const valorAtributoFinal = Math.max(0, valorAtributoBase + penalidadeTotalDados);

    const resultado = rolarAtaque(armaNome, valorAtributoFinal, bonusAtaque, margemCritico, periciaUsada, penalidadeTotalDados);
    registrarRolagem(resultado);
    return resultado;
  }, [atributosFinais, penalidadesCondicoes, registrarRolagem]);

  const executarRolagemDano = useCallback((armaNome: string, expressaoDano: string, multCritico: number = 2, isCritico: boolean = false) => {
    const resultado = rolarDano(armaNome, expressaoDano, multCritico, isCritico);
    registrarRolagem(resultado);
    return resultado;
  }, [registrarRolagem]);

  const executarRolagemLivre = useCallback((qtd: number, faces: number, mod: number = 0, keepMode: 'highest' | 'lowest' | 'all' = 'all', descricao?: string) => {
    const resultado = rolarLivre(qtd, faces, mod, keepMode, descricao);
    registrarRolagem(resultado);
    return resultado;
  }, [registrarRolagem]);

  const limparHistoricoRolagens = useCallback(() => {
    setHistoricoRolagens([]);
    setUltimaRolagem(null);
  }, []);

  // ============================================================
  // CONJURAÇÃO DE RITUAIS & CUSTO DO PARANORMAL
  // ============================================================
  const conjurarRitual = useCallback((params: ConjurarRitualParams): ResultadoConjuracao => {
    const {
      nome,
      elemento,
      custoPE,
      versao,
      circulo,
      dadosEfeito,
      alcance,
      resistencia,
      ignorarCustoParanormal = false,
    } = params;

    // 1. Verificação da condição Perturbado
    if (condicoesAtivas.includes('perturbado')) {
      return {
        sucesso: false,
        mensagem: 'Você está Perturbado e não pode gastar PE voluntariamente.',
        peGasto: 0,
        sanidadePerdida: 0,
        sucessoCustoParanormal: false,
      };
    }

    // 2. Verificação do limite de PE por turno (peTurno)
    const limiteTurno = status.peTurno || 1;
    if (custoPE > limiteTurno) {
      return {
        sucesso: false,
        mensagem: `O custo de ${custoPE} PE excede seu limite de canalização de ${limiteTurno} PE por rodada.`,
        peGasto: 0,
        sanidadePerdida: 0,
        sucessoCustoParanormal: false,
      };
    }

    // 3. Verificação de PE disponível (atual + temporário)
    const peAtual = status.peAtual ?? 0;
    const peTemp = status.hasPeTemp ? (status.peTempAtual ?? 0) : 0;
    const peTotalDisponivel = peAtual + peTemp;

    if (peTotalDisponivel < custoPE) {
      return {
        sucesso: false,
        mensagem: `Pontos de Esforço insuficientes (${peTotalDisponivel}/${custoPE} PE).`,
        peGasto: 0,
        sanidadePerdida: 0,
        sucessoCustoParanormal: false,
      };
    }

    // 4. Desconto de PE (priorizando temporário)
    let danoRestante = custoPE;
    if (status.hasPeTemp && status.peTempAtual > 0) {
      const absorvido = Math.min(status.peTempAtual, danoRestante);
      status.setPeTempAtual(prev => Math.max(0, prev - absorvido));
      danoRestante -= absorvido;
    }
    if (danoRestante > 0) {
      status.setPeAtual(prev => Math.max(0, (prev ?? 0) - danoRestante));
    }

    // 5. Custo do Paranormal (Ocultismo contra DT 20 + custoPE)
    let sucessoCustoParanormal = true;
    let sanidadePerdida = 0;
    let resultadoTeste: ResultadoRolagem | undefined;

    if (!ignorarCustoParanormal) {
      const dtCusto = 20 + custoPE;
      const ocObj = periciasHook?.pericias?.['Ocultismo'];
      const bonusOcultismo = (ocObj?.treino || 0) + (ocObj?.outros || 0);

      resultadoTeste = executarRolagemPericia(
        `Custo Paranormal: ${nome}`,
        (ocObj?.atributo as AtributoKey) || 'INT',
        bonusOcultismo
      );

      if (resultadoTeste.total < dtCusto) {
        sucessoCustoParanormal = false;
        sanidadePerdida = custoPE;
        status.setSanAtual(prev => Math.max(0, (prev ?? 0) - sanidadePerdida));
      }
    }

    // 6. Rolar dados de efeito se houver
    if (dadosEfeito && dadosEfeito.toLowerCase().includes('d')) {
      const expr = dadosEfeito.includes('/') ? dadosEfeito.split('/')[0].trim() : dadosEfeito.trim();
      executarRolagemDano(nome, expr, 2, false);
    }

    // 7. Enviar para battlemat bridge se conectado
    sendCastRitual(nome, elemento, alcance || 'Curto', custoPE).catch(() => {});

    const msgSucesso = sucessoCustoParanormal
      ? `Ritual "${nome}" (${versao}) conjurado gastando ${custoPE} PE! Custo do Paranormal superado sem perda de Sanidade.`
      : `Ritual "${nome}" (${versao}) conjurado gastando ${custoPE} PE! Falhou no Custo do Paranormal (DT ${20 + custoPE}): perdeu ${sanidadePerdida} de Sanidade.`;

    return {
      sucesso: true,
      mensagem: msgSucesso,
      peGasto: custoPE,
      sanidadePerdida,
      sucessoCustoParanormal,
      resultadoTesteOcultismo: resultadoTeste,
    };
  }, [condicoesAtivas, status, periciasHook, executarRolagemPericia, executarRolagemDano]);

  // ============================================================
  // VALUE DO CONTEXTO
  // ============================================================
  // Calcula status reais
  const { pvMax, peMax, sanMax, peTurno } = useMemo(() => {
    if (!classe) return { pvMax: 0, peMax: 0, sanMax: 0, peTurno: 0 };
    return calcularStatusBase(classe, atributosFinais, nivel, regrasAutomaticasAtivas);
  }, [classe, atributosFinais, nivel, regrasAutomaticasAtivas]);

  const value: RPGContextType = {
    telaAtual, setTelaAtual,
    classe, setClasse,
    nex: effectiveNex, setNex,
    atributos, setAtributos,
    bonusAtributos, setBonusAtributos,
    pontosRestantes, alterarAtributo,
    status, periciasHook, poderesHook, origensHook, trilhasHook, rituaisHook, inventarioHook, armasHook, municoesHook, protecoesHook, itensHook, itensAmaldicoadosHook, toggleVestimentaGeral, modificacoesHook, maldicoesHook, bonusVestimentas,
      bonusMaldicoes,
      abaDireita, setAbaDireita,
    abaModalPoderes, setAbaModalPoderes,
    tipoModalPoderes, setTipoModalPoderes,
    defEquip, setDefEquip,
    defOutros, setDefOutros,
    defesaTotal,
    totalDefesaProtecoes,
    bloqueioData, setBloqueioData,
    protecoes, setProtecoes,
    proficienciasTotais,
    sentidos, setSentidos,
    imunidades, setImunidades,
    vulnerabilidades, setVulnerabilidades,
    resistencias, setResistencias,
    proficiencias, setProficiencias,
    regrasAtivas, setRegrasAtivas,
    bloquearLetras, refazerPersonagem,
    fichaIdAtual, setFichaIdAtual,
    jogadorEditando, setJogadorEditando,
    resetarFichaParaNova,
    filtroHabilidades, setFiltroHabilidades,
    habilidadesExpandidas, setHabilidadesExpandidas,
    nexModalAberto, setNexModalAberto,
    poderesModalExpandidos, setPoderesModalExpandidos,
    nexPoderEditando, setNexPoderEditando,
    nomeEditando, setNomeEditando,
    descricaoEditando, setDescricaoEditando,
    afinidadeEditando, setAfinidadeEditando,
    skillCombatente1, setSkillCombatente1,
    skillCombatente2, setSkillCombatente2,
    deslocM, setDeslocM,
    deslocQ, setDeslocQ,
    bonusDadosCondicionais, setBonusDadosCondicionais,
    bonusDadosAtivos, setBonusDadosAtivos,
    regras, setRegras, toggleRegra,
    nivel: effectiveNivel, setNivel,
    rituaisExpandidos, setRituaisExpandidos,
    versaoRitual, setVersaoRitual,
    elementoRitual, setElementoRitual,
    jaTinhaPericiaTrilha,
    afinidadeEscolhida, setAfinidadeEscolhida, afinidadeAtiva,
    poderesExtras, setPoderesExtras,
    progressaoNexRecusados, setProgressaoNexRecusados,
    progressaoNexEditados, setProgressaoNexEditados,
    elementoRegra18, setElementoRegra18,
    regrasAutomaticasAtivas,
    escolhaRegra53, setEscolhaRegra53,
    atributosFinais,
    historicoRolagens,
    ultimaRolagem,
    diceTrayAberto,
    setDiceTrayAberto,
    executarRolagemPericia,
    executarRolagemAtaque,
    executarRolagemDano,
    executarRolagemLivre,
    limparHistoricoRolagens,
    condicoesAtivas,
    setCondicoesAtivas,
    toggleCondicao,
    adicionarCondicao,
    removerCondicao,
    limparCondicoes,
    modalCondicoesAberto,
    setModalCondicoesAberto,
    penalidadesCondicoes,
    estadoSobrevivencia,
    setEstadoSobrevivencia,
    estabilizarMorrendo,
    estabilizarEnlouquecendo,
    registrarFalhaMorte,
    conjurarRitual,
  };

  return <RPGContext.Provider value={value}>{children}</RPGContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRPG(): RPGContextType {
  const ctx = useContext(RPGContext);
  if (!ctx) throw new Error('useRPG deve ser usado dentro de RPGProvider');
  return ctx;
}