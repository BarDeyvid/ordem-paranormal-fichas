/**
 * Serviço de comunicação entre a Ficha Web de Ordem Paranormal e o Digital Battlemat.
 * Envia atualizações de PV, SAN, PE e gerencia a sessão tática integrada com IA.
 */

export interface BattlematConfig {
  enabled: boolean;
  host: string; // Ex: "localhost:8080" ou "127.0.0.1:8000"
  tokenId: number; // ID do marcador ArUco físico (1 a 8 para investigadores)
}

const DEFAULT_CONFIG: BattlematConfig = {
  enabled: true,
  host: 'localhost:8000',
  tokenId: 1,
};

const STORAGE_KEY = 'ordem_battlemat_bridge_config';

export function getBridgeConfig(): BattlematConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('[Battlemat] Falha ao carregar config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveBridgeConfig(config: BattlematConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('[Battlemat] Falha ao salvar config:', e);
  }
}

function getBaseUrl(): string {
  const cfg = getBridgeConfig();
  if (cfg.host && !cfg.host.includes('8080')) {
    const clean = cfg.host.replace(/^https?:\/\//, '');
    return `http://${clean}`;
  }
  // Se for o mesmo domínio do frontend ou via proxy Vite
  return '';
}

/** Testa a conexão com o servidor local do Battlemat */
export async function testBridgeConnection(host: string): Promise<{ success: boolean; message: string; data?: any }> {
  const cleanHost = host.replace(/^https?:\/\//, '');
  const url = `http://${cleanHost}/api/status`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { success: true, message: 'Conectado com sucesso!', data };
    }
    return { success: false, message: `Erro HTTP ${res.status}` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Servidor offline ou inacessível' };
  }
}

/** Envia atualização de PV, SAN, PE do personagem para o Unreal Engine */
export async function sendCharacterStatus(
  nome: string,
  classe: string,
  pvAtual: number,
  pvMax: number,
  sanAtual: number,
  sanMax: number,
  peAtual: number,
  peMax: number
): Promise<boolean> {
  const cfg = getBridgeConfig();
  if (!cfg.enabled) return false;

  const base = getBaseUrl();
  const url = `${base}/api/token/status`;
  const payload = {
    token_id: cfg.tokenId,
    nome: nome || `Investigador ${cfg.tokenId}`,
    classe: classe || 'Investigador',
    pv_atual: pvAtual,
    pv_max: pvMax,
    san_atual: sanAtual,
    san_max: sanMax,
    pe_atual: peAtual,
    pe_max: peMax,
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

/** Envia comando para projetar o símbolo do ritual no chão 3D sob a miniatura */
export async function sendCastRitual(
  ritualNome: string,
  elemento: string,
  alcance: string,
  custoPe: number
): Promise<{ success: boolean; message?: string }> {
  const cfg = getBridgeConfig();
  if (!cfg.enabled) {
    return { success: false, message: 'A conexão com a Mesa Digital está desativada nas configurações.' };
  }

  const base = getBaseUrl();
  const url = `${base}/api/token/cast`;
  const payload = {
    token_id: cfg.tokenId,
    ritual: ritualNome,
    elemento: elemento,
    alcance: alcance,
    custo_pe: custoPe,
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return { success: true, message: `Ritual '${ritualNome}' projetado na mesa!` };
    }
    return { success: false, message: `Erro ao projetar ritual: ${res.statusText}` };
  } catch (e: any) {
    return { success: false, message: `Falha de rede: ${e?.message || 'Mesa inacessível'}` };
  }
}

// ============================================================
// TIPOS DA SESSÃO TÁTICA DO BATTLEMAT & IA
// ============================================================

export interface BattlematToken {
  token_id: number;
  nome: string;
  classe: string;
  trilha?: string;
  tipo: 'investigador' | 'criatura';
  nex?: number;
  vd?: number;
  pv_atual: number;
  pv_max: number;
  san_atual: number;
  san_max: number;
  pe_atual: number;
  pe_max: number;
  defesa: number;
  grid: string; // Ex: 'C3', 'D5'
  x: number; // 0.0 a 1.0
  y: number; // 0.0 a 1.0
  status: string;
  armas?: string[];
  rituais?: any[];
  acoes?: Array<{ nome: string; bonus?: number; dano?: string; alcance?: string; tipo?: string; critico?: string }>;
  habilidade_especial?: string;
  descricao?: string;
  personalidade?: string;
}

export interface InitiativeItem {
  token_id: number;
  nome: string;
  tipo: 'investigador' | 'criatura';
  classe: string;
  grid: string;
  pv_atual: number;
  pv_max: number;
  ativo: boolean;
  derrotado: boolean;
}

export interface BattlematSessionState {
  online: boolean;
  round: number;
  turn_index: number;
  active_token_id: number;
  initiative_order: number[];
  initiative: InitiativeItem[];
  tokens: Record<string, BattlematToken>;
  grid_size: { cols: number; rows: number };
  total_tokens: number;
  threats_count: number;
  investigators_count: number;
}

export interface BattlematFeedEntry {
  id: string;
  timestamp: string;
  round: number;
  token_id: number;
  autor: string;
  classe: string;
  tipo: 'investigador' | 'criatura' | 'mestre';
  pensamento: string;
  fala: string;
  acao: string;
  movimento?: { destino_grid: string; x?: number; y?: number };
  detalhes?: any;
}

export interface ThreatCompendiumItem {
  id: string;
  nome: string;
  elemento: string;
  vd: number;
  tamanho?: string;
  tipo?: string;
  pv: number;
  defesa: number;
  deslocamento?: string;
  acoes?: Array<{ nome: string; bonus?: number; dano?: string; alcance?: string; tipo?: string }>;
  habilidade_especial?: string;
  descricao?: string;
}

// ============================================================
// ENDPOINTS DO PAINEL TÁTICO
// ============================================================

/** Retorna o estado completo da sessão de combate */
export async function getBattlematSession(): Promise<BattlematSessionState> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/battlemat/session`);
  if (!res.ok) {
    throw new Error(`Falha ao obter sessão do battlemat (${res.status})`);
  }
  return res.json();
}

/** Avança a iniciativa e dispara o turno do próximo combatente (IA do agente ou criatura) */
export async function advanceNextTurn(
  narrativaMestre: string = '',
  tokenId?: number
): Promise<{
  success: boolean;
  previous_acting_token_id: number;
  next_active_token_id: number;
  round: number;
  turn_decision: any;
  feed_entry: BattlematFeedEntry;
  session: BattlematSessionState;
}> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/battlemat/next-turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      narrativa_mestre: narrativaMestre,
      token_id: tokenId,
    }),
  });
  if (!res.ok) {
    throw new Error(`Erro ao avançar turno (${res.status})`);
  }
  return res.json();
}

/** Spawna uma nova criatura no grid com base no compêndio */
export async function spawnThreat(params: {
  nome: string;
  grid?: string;
  vd?: number;
  custom_pv?: number;
}): Promise<{
  success: boolean;
  threat: BattlematToken;
  feed_entry: BattlematFeedEntry;
  session: BattlematSessionState;
}> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/battlemat/spawn-threat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Erro ao invocar criatura (${res.status})`);
  }
  return res.json();
}

/** Retorna o feed de diálogos, pensamentos e ações */
export async function getBattlematFeed(limit: number = 50): Promise<{
  success: boolean;
  feed: BattlematFeedEntry[];
  total: number;
}> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/battlemat/feed?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Erro ao carregar feed (${res.status})`);
  }
  return res.json();
}

/** Retorna o compêndio oficial de criaturas disponíveis para spawn */
export async function getThreatsCompendium(): Promise<{
  success: boolean;
  ameacas: ThreatCompendiumItem[];
  total: number;
}> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/battlemat/compendium`);
  if (!res.ok) {
    throw new Error(`Erro ao carregar compêndio de ameaças (${res.status})`);
  }
  return res.json();
}

/** Avança manualmente a rodada */
export async function advanceRound(increment: number = 1): Promise<BattlematSessionState> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/battlemat/advance-round`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ round_increment: increment }),
  });
  if (!res.ok) {
    throw new Error(`Erro ao avançar rodada (${res.status})`);
  }
  return res.json();
}

/** Reinicia a sessão para a rodada 1 */
export async function resetBattlematSession(): Promise<BattlematSessionState> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/battlemat/reset`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Erro ao resetar sessão (${res.status})`);
  }
  return res.json();
}
