import type { FichaSummary, FichaStorage } from '../types';
import { serializeFicha } from '../utils/saveLoad';

const STORAGE_FICHAS_KEY = 'ordem_fichas_galeria';
const STORAGE_ACTIVE_ID_KEY = 'ordem_ficha_ativa_id';
const API_BASE = '/api';

/**
 * Lê todas as fichas completas salvas localmente
 */
function getLocalFichas(): FichaStorage[] {
  try {
    const raw = localStorage.getItem(STORAGE_FICHAS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler fichas do localStorage:', err);
    return [];
  }
}

/**
 * Grava todas as fichas no localStorage
 */
function setLocalFichas(fichas: FichaStorage[]): void {
  try {
    localStorage.setItem(STORAGE_FICHAS_KEY, JSON.stringify(fichas));
  } catch (err) {
    console.error('Erro ao salvar fichas no localStorage:', err);
  }
}

/**
 * Converte uma FichaStorage completa em um FichaSummary leve
 */
export function toFichaSummary(f: FichaStorage): FichaSummary {
  const c = f.conteudo || {};
  return {
    id: f.id,
    nome: f.nome || c.nomeEditando || 'Investigador Sem Nome',
    jogador: f.jogador || c.jogadorEditando || '',
    classe: f.classe || c.classe || 'Nenhuma',
    nex: typeof f.nex === 'number' ? f.nex : (c.nex || 5),
    origem: f.origem || c.origemSelecionada?.Nome || '',
    trilha: f.trilha || c.trilhaSelecionada?.Nome_Trilha || '',
    patente: f.patente || '',
    pvAtual: c.status?.pvAtual,
    pvMax: c.status?.pvMax,
    sanAtual: c.status?.sanAtual,
    sanMax: c.status?.sanMax,
    peAtual: c.status?.peAtual,
    peMax: c.status?.peMax,
    avatarUrl: f.avatarUrl || '',
    dataAtualizacao: f.dataAtualizacao || new Date().toISOString(),
    dataCriacao: f.dataCriacao,
  };
}

/**
 * Checa se o servidor FastAPI está respondendo
 */
export async function checkBackendOnline(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/fichas`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(1800),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Lista todos os agentes (resumo). Tenta backend primeiro, com fallback no localStorage.
 */
export async function listarFichas(): Promise<{ fichas: FichaSummary[]; isOnline: boolean }> {
  let isOnline = false;
  try {
    const res = await fetch(`${API_BASE}/fichas`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });

    if (res.ok) {
      isOnline = true;
      const apiList = await res.json();
      
      // Mescla com os dados locais
      const local = getLocalFichas();
      const localMap = new Map(local.map(item => [item.id, item]));

      // Se a API retornou fichas, mapeia para FichaSummary
      const summaries: FichaSummary[] = apiList.map((item: any) => {
        const localItem = localMap.get(item.id);
        const conteudo = localItem?.conteudo || item.conteudo || {};
        return {
          id: item.id,
          nome: item.nome || conteudo.nomeEditando || 'Investigador',
          jogador: localItem?.jogador || conteudo.jogadorEditando || '',
          classe: item.classe || conteudo.classe || 'Nenhuma',
          nex: item.nex ?? 5,
          origem: localItem?.origem || conteudo.origemSelecionada?.Nome || '',
          trilha: localItem?.trilha || conteudo.trilhaSelecionada?.Nome_Trilha || '',
          patente: localItem?.patente || '',
          pvAtual: conteudo.status?.pvAtual,
          pvMax: conteudo.status?.pvMax,
          sanAtual: conteudo.status?.sanAtual,
          sanMax: conteudo.status?.sanMax,
          peAtual: conteudo.status?.peAtual,
          peMax: conteudo.status?.peMax,
          avatarUrl: localItem?.avatarUrl || '',
          dataAtualizacao: item.data_criacao || localItem?.dataAtualizacao || new Date().toISOString(),
        };
      });

      // Se houver fichas locais que ainda não estão no backend, inclui elas
      local.forEach(loc => {
        if (!summaries.some(s => s.id === loc.id)) {
          summaries.push(toFichaSummary(loc));
        }
      });

      summaries.sort((a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime());
      return { fichas: summaries, isOnline: true };
    }
  } catch {
    // Backend offline, cai no fallback
  }

  const local = getLocalFichas();
  const summaries = local.map(toFichaSummary);
  summaries.sort((a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime());
  return { fichas: summaries, isOnline: false };
}

/**
 * Obtém uma ficha completa por ID
 */
export async function obterFicha(id: string): Promise<FichaStorage | null> {
  // Tenta backend primeiro
  try {
    const res = await fetch(`${API_BASE}/fichas/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = await res.json();
      const local = getLocalFichas().find(f => f.id === id);
      return {
        id: data.id,
        nome: data.nome,
        classe: data.classe,
        nex: data.nex,
        jogador: local?.jogador || data.conteudo?.jogadorEditando || '',
        origem: local?.origem || data.conteudo?.origemSelecionada?.Nome || '',
        trilha: local?.trilha || data.conteudo?.trilhaSelecionada?.Nome_Trilha || '',
        patente: local?.patente || '',
        avatarUrl: local?.avatarUrl || '',
        dataAtualizacao: data.data_criacao || local?.dataAtualizacao || new Date().toISOString(),
        conteudo: data.conteudo || {},
      };
    }
  } catch {
    // Fallback local
  }

  const local = getLocalFichas();
  const found = local.find(f => f.id === id);
  return found || null;
}

/**
 * Salva uma ficha (cria ou atualiza).
 * Salva no localStorage e envia para o backend se disponível.
 */
export async function salvarFicha(ficha: FichaStorage): Promise<{ success: boolean; id: string; savedOnline: boolean }> {
  const agora = new Date().toISOString();
  const fichaAtualizada: FichaStorage = {
    ...ficha,
    id: ficha.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ficha_${Date.now()}`),
    dataAtualizacao: agora,
    dataCriacao: ficha.dataCriacao || agora,
  };

  // 1. Salva no localStorage
  const local = getLocalFichas();
  const idx = local.findIndex(f => f.id === fichaAtualizada.id);
  if (idx !== -1) {
    local[idx] = fichaAtualizada;
  } else {
    local.push(fichaAtualizada);
  }
  setLocalFichas(local);
  definirFichaIdAtiva(fichaAtualizada.id);

  // 2. Tenta sincronizar com o backend
  let savedOnline = false;
  try {
    const payload = {
      id: fichaAtualizada.id,
      nome: fichaAtualizada.nome || 'Investigador',
      classe: fichaAtualizada.classe || 'Investigador',
      nex: fichaAtualizada.nex || 5,
      conteudo: fichaAtualizada.conteudo,
    };

    const res = await fetch(`${API_BASE}/fichas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      savedOnline = true;
    }
  } catch (err) {
    console.warn('Backend indisponível no momento. Ficha salva localmente com sucesso.', err);
  }

  return { success: true, id: fichaAtualizada.id, savedOnline };
}

/**
 * Salva o estado atual do contexto RPG diretamente como FichaStorage
 */
export async function salvarFichaContexto(rpg: any): Promise<{ success: boolean; id: string; savedOnline: boolean }> {
  const dados = serializeFicha(rpg);
  const id = rpg.fichaIdAtual || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ficha_${Date.now()}`);
  const ficha: FichaStorage = {
    id,
    nome: rpg.nomeEditando || 'Investigador',
    jogador: rpg.jogadorEditando || '',
    classe: rpg.classe || 'Combatente',
    nex: rpg.nex || 5,
    origem: rpg.origensHook?.origemSelecionada?.Nome || '',
    trilha: rpg.trilhasHook?.trilhaSelecionada?.Nome_Trilha || '',
    patente: '',
    avatarUrl: '',
    dataAtualizacao: new Date().toISOString(),
    dataCriacao: new Date().toISOString(),
    conteudo: dados,
  };
  return salvarFicha(ficha);
}

/**
 * Duplica uma ficha existente
 */
export async function duplicarFicha(id: string): Promise<FichaSummary | null> {
  const original = await obterFicha(id);
  if (!original) return null;

  const novoId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ficha_${Date.now()}`;
  const copia: FichaStorage = {
    ...original,
    id: novoId,
    nome: `${original.nome} (Cópia)`,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    conteudo: {
      ...original.conteudo,
      nomeEditando: `${original.nome} (Cópia)`,
    },
  };

  await salvarFicha(copia);
  return toFichaSummary(copia);
}

/**
 * Remove uma ficha por ID
 */
export async function deletarFicha(id: string): Promise<boolean> {
  // Remove local
  const local = getLocalFichas();
  const filtered = local.filter(f => f.id !== id);
  setLocalFichas(filtered);

  if (obterFichaIdAtiva() === id) {
    definirFichaIdAtiva(null);
  }

  // Remove da API se disponível
  try {
    await fetch(`${API_BASE}/fichas/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Ignora se backend estiver offline
  }

  return true;
}

/**
 * Baixa um backup completo de todas as fichas em JSON
 */
export function exportarTodasFichas(): void {
  const local = getLocalFichas();
  const data = {
    versao: '1.0',
    dataBackup: new Date().toISOString(),
    totalFichas: local.length,
    fichas: local,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_dossies_ordem_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Restaura fichas a partir de um arquivo de backup ou export individual
 */
export async function importarBackupFichas(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        let listaParaImportar: any[] = [];

        if (Array.isArray(parsed.fichas)) {
          listaParaImportar = parsed.fichas;
        } else if (Array.isArray(parsed)) {
          listaParaImportar = parsed;
        } else if (parsed && typeof parsed === 'object') {
          // É uma ficha única exportada pelo botão tradicional
          listaParaImportar = [{
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ficha_${Date.now()}`,
            nome: parsed.nomeEditando || 'Investigador Importado',
            classe: parsed.classe || 'Combatente',
            nex: parsed.nex || 5,
            conteudo: parsed,
          }];
        }

        let importados = 0;
        for (const item of listaParaImportar) {
          const fichaStorage: FichaStorage = {
            id: item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ficha_${Date.now()}_${importados}`),
            nome: item.nome || item.conteudo?.nomeEditando || 'Investigador Importado',
            jogador: item.jogador || item.conteudo?.jogadorEditando || '',
            classe: item.classe || item.conteudo?.classe || 'Nenhuma',
            nex: item.nex ?? (item.conteudo?.nex || 5),
            origem: item.origem || item.conteudo?.origemSelecionada?.Nome || '',
            trilha: item.trilha || item.conteudo?.trilhaSelecionada?.Nome_Trilha || '',
            patente: item.patente || '',
            avatarUrl: item.avatarUrl || '',
            dataAtualizacao: new Date().toISOString(),
            dataCriacao: item.dataCriacao || new Date().toISOString(),
            conteudo: item.conteudo || item,
          };
          await salvarFicha(fichaStorage);
          importados++;
        }

        resolve(importados);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Gerencia o ID da ficha atualmente aberta no app
 */
export function obterFichaIdAtiva(): string | null {
  try {
    return localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
  } catch {
    return null;
  }
}

export function definirFichaIdAtiva(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_ID_KEY);
    }
  } catch {
    // Ignora
  }
}
