/**
 * Serviço de comunicação entre a Ficha Web de Ordem Paranormal e o Digital Battlemat (Unreal Engine).
 * Envia atualizações de PV, SAN, PE e ações de rituais para o bridge server local.
 */

export interface BattlematConfig {
  enabled: boolean;
  host: string; // Ex: "localhost:8080" ou "192.168.1.15:8080"
  tokenId: number; // ID do marcador ArUco físico (1 a 5 para investigadores)
}

const DEFAULT_CONFIG: BattlematConfig = {
  enabled: false,
  host: 'localhost:8080',
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

/** Testa a conexão com o servidor local do Battlemat */
export async function testBridgeConnection(host: string): Promise<{ success: boolean; message: string; data?: any }> {
  const url = `http://${host.replace(/^https?:\/\//, '')}/api/status`;
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

  const url = `http://${cfg.host.replace(/^https?:\/\//, '')}/api/token/status`;
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
    // Falha silenciosa para não atrapalhar o jogo se a mesa estiver desligada
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

  const url = `http://${cfg.host.replace(/^https?:\/\//, '')}/api/token/cast`;
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
