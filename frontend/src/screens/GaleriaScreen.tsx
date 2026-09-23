import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRPG } from '../context/RPGContext';
import { AgenteCard } from '../components/AgenteCard';
import { CustomSelect } from '../components/CustomSelect';
import { loadFichaIntoContext } from '../utils/saveLoad';
import {
  listarFichas,
  obterFicha,
  duplicarFicha,
  deletarFicha,
  exportarTodasFichas,
  importarBackupFichas,
  definirFichaIdAtiva,
} from '../services/fichasService';
import type { FichaSummary } from '../types';

export const GaleriaScreen: React.FC = () => {
  const rpg = useRPG();
  const { fichaIdAtual, setFichaIdAtual, setJogadorEditando, resetarFichaParaNova, setTelaAtual, classe } = rpg;

  const [fichas, setFichas] = useState<FichaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [servidorOnline, setServidorOnline] = useState<boolean | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroClasse, setFiltroClasse] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<string>('recentes');
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listarFichas();
      setFichas(res.fichas);
      setServidorOnline(res.isOnline);
    } catch (err) {
      console.error('Erro ao carregar fichas:', err);
      showToast('Erro ao carregar lista de dossiês.', 'erro');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Abertura de um agente para jogar / editar
  const handleAbrirAgente = async (id: string) => {
    try {
      const ficha = await obterFicha(id);
      if (!ficha) {
        showToast('Dossiê não encontrado!', 'erro');
        return;
      }

      loadFichaIntoContext(ficha.conteudo, rpg);
      setFichaIdAtual(ficha.id);
      if (ficha.jogador) {
        setJogadorEditando(ficha.jogador);
      }
      definirFichaIdAtiva(ficha.id);
      setTelaAtual('ficha');
    } catch (err) {
      console.error('Erro ao abrir ficha:', err);
      showToast('Erro ao carregar dossiê.', 'erro');
    }
  };

  // Criação de um novo agente limpo
  const handleNovoAgente = () => {
    resetarFichaParaNova();
    setTelaAtual('atributos');
  };

  // Clonar agente existente
  const handleDuplicarAgente = async (id: string) => {
    try {
      const novaCopia = await duplicarFicha(id);
      if (novaCopia) {
        showToast('Dossiê duplicado com sucesso!');
        await carregarDados();
      }
    } catch (err) {
      console.error('Erro ao clonar agente:', err);
      showToast('Erro ao duplicar agente.', 'erro');
    }
  };

  // Exclusão definitiva de um agente
  const handleDeletarAgente = async (id: string) => {
    try {
      const sucesso = await deletarFicha(id);
      if (sucesso) {
        if (fichaIdAtual === id) {
          setFichaIdAtual(null);
        }
        showToast('Dossiê excluído do arquivo morto.');
        await carregarDados();
      }
    } catch (err) {
      console.error('Erro ao excluir agente:', err);
      showToast('Erro ao excluir agente.', 'erro');
    }
  };

  // Exportação individual do JSON do agente
  const handleExportarAgente = async (id: string) => {
    try {
      const ficha = await obterFicha(id);
      if (!ficha) {
        showToast('Dossiê não encontrado!', 'erro');
        return;
      }
      const json = JSON.stringify(ficha.conteudo, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const nomeSanitizado = (ficha.nome || 'agente')
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]/g, '');
      a.download = `dossie_${nomeSanitizado}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar agente:', err);
      showToast('Erro ao exportar dossiê.', 'erro');
    }
  };

  // Importação de arquivo (seja individual ou backup completo)
  const handleImportarArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await importarBackupFichas(file);
      showToast(`Importação concluída! ${count} dossiê(s) adicionado(s).`);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao importar arquivo:', err);
      showToast('Arquivo JSON inválido ou corrompido.', 'erro');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Filtragem e ordenação
  const fichasFiltradas = useMemo(() => {
    let lista = [...fichas];

    // Filtro por Classe
    if (filtroClasse !== 'todos') {
      lista = lista.filter((f) => f.classe === filtroClasse);
    }

    // Filtro por Termo de Busca
    if (busca.trim()) {
      const q = busca.toLowerCase().trim();
      lista = lista.filter(
        (f) =>
          (f.nome && f.nome.toLowerCase().includes(q)) ||
          (f.jogador && f.jogador.toLowerCase().includes(q)) ||
          (f.origem && f.origem.toLowerCase().includes(q)) ||
          (f.trilha && f.trilha.toLowerCase().includes(q)) ||
          (f.patente && f.patente.toLowerCase().includes(q))
      );
    }

    // Ordenação
    lista.sort((a, b) => {
      switch (ordenacao) {
        case 'recentes':
          return new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime();
        case 'antigos':
          return new Date(a.atualizadoEm).getTime() - new Date(b.atualizadoEm).getTime();
        case 'nome_asc':
          return (a.nome || '').localeCompare(b.nome || '');
        case 'nome_desc':
          return (b.nome || '').localeCompare(a.nome || '');
        case 'nex_desc':
          return b.nex - a.nex;
        case 'nex_asc':
          return a.nex - b.nex;
        default:
          return 0;
      }
    });

    return lista;
  }, [fichas, filtroClasse, busca, ordenacao]);

  const opcoesOrdenacao = [
    { value: 'recentes', label: 'Mais Recentes' },
    { value: 'antigos', label: 'Mais Antigos' },
    { value: 'nome_asc', label: 'Nome (A - Z)' },
    { value: 'nome_desc', label: 'Nome (Z - A)' },
    { value: 'nex_desc', label: 'Maior NEX' },
    { value: 'nex_asc', label: 'Menor NEX' },
  ];

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl flex flex-col p-4 md:p-8 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 ${
            toast.tipo === 'sucesso'
              ? 'border-emerald-600/80 bg-zinc-900/95 text-emerald-300'
              : 'border-red-600/80 bg-zinc-900/95 text-red-300'
          }`}
        >
          <span className="text-lg">{toast.tipo === 'sucesso' ? '✅' : '⚠️'}</span>
          <span className="text-sm font-medium">{toast.mensagem}</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportarArquivo}
        accept=".json"
        className="hidden"
      />

      {/* Top Header Bar */}
      <header className="mb-6 flex flex-col gap-4 border-b border-zinc-800/90 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">📁</span>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wider text-zinc-100">
                  Arquivo de Dossiês & Agentes
                </h1>
                <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold">
                  Ordo Realitas — Base de Registros Confidenciais
                </p>
              </div>
            </div>
          </div>

          {/* Status de Conexão com o Servidor e Ações Globais */}
          <div className="flex flex-wrap items-center gap-2">
            {servidorOnline !== null && (
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border ${
                  servidorOnline
                    ? 'border-emerald-800/70 bg-emerald-950/40 text-emerald-400'
                    : 'border-amber-800/70 bg-amber-950/40 text-amber-400'
                }`}
                title={
                  servidorOnline
                    ? 'Conectado ao servidor FastAPI. Seus dossiês estão salvos na nuvem e sincronizados localmente.'
                    : 'Servidor FastAPI indisponível. Seus dossiês estão salvos com segurança no armazenamento local do navegador.'
                }
              >
                <span className="h-2 w-2 rounded-full animate-pulse bg-current" />
                <span>{servidorOnline ? 'Servidor Sincronizado' : 'Modo Offline (Local)'}</span>
              </div>
            )}

            {classe && (
              <button
                type="button"
                onClick={() => setTelaAtual('ficha')}
                className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition border border-zinc-700"
                title="Voltar para a ficha em edição"
              >
                <span>⬅️</span>
                <span>Voltar à Ficha</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition border border-zinc-700"
              title="Importar ficha individual ou arquivo de backup (.json)"
            >
              <span>⬆️</span>
              <span>Importar JSON</span>
            </button>

            <button
              type="button"
              onClick={exportarTodasFichas}
              className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition border border-zinc-700"
              title="Baixar backup de todos os dossiês salvos"
            >
              <span>⬇️</span>
              <span>Backup Geral</span>
            </button>

            <button
              type="button"
              onClick={handleNovoAgente}
              className="flex items-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition shadow-md"
              title="Iniciar criação de um novo agente"
            >
              <span>➕</span>
              <span>Novo Agente</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros, Pesquisa e Ordenação */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome, jogador, trilha, origem..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-md border border-zinc-700/80 bg-zinc-900/90 pl-9 pr-8 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtros de Classe */}
            <div className="flex items-center rounded-lg bg-zinc-900 p-1 border border-zinc-800">
              {(['todos', 'Combatente', 'Especialista', 'Ocultista'] as const).map((cls) => {
                const isSelected = filtroClasse === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setFiltroClasse(cls)}
                    className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition ${
                      isSelected
                        ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/80'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cls === 'todos' ? 'Todas as Classes' : cls}
                  </button>
                );
              })}
            </div>

            {/* Ordenação com CustomSelect */}
            <div className="w-44">
              <CustomSelect
                value={ordenacao}
                onChange={setOrdenacao}
                options={opcoesOrdenacao}
                placeholder="Ordenar por..."
              />
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mb-4" />
            <p className="text-sm font-mono uppercase tracking-widest text-zinc-400">
              Acessando arquivos confidenciais...
            </p>
          </div>
        ) : fichasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8">
            <span className="text-5xl opacity-40 mb-3">📭</span>
            <h2 className="text-lg font-bold text-zinc-300 uppercase tracking-wider">
              Nenhum dossiê encontrado
            </h2>
            <p className="mt-1 max-w-md text-xs text-zinc-500">
              {busca || filtroClasse !== 'todos'
                ? 'Nenhum agente corresponde aos filtros de pesquisa aplicados.'
                : 'Você ainda não possui nenhum agente salvo no sistema da Ordo Realitas.'}
            </p>

            <div className="mt-6 flex gap-3">
              {busca || filtroClasse !== 'todos' ? (
                <button
                  type="button"
                  onClick={() => {
                    setBusca('');
                    setFiltroClasse('todos');
                  }}
                  className="rounded bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition"
                >
                  Limpar Filtros
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNovoAgente}
                  className="rounded bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition shadow-lg"
                >
                  ➕ Criar Primeiro Agente
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Masonry Layout conforme regra do AGENTS.md */
          <div className="flex flex-col md:flex-row gap-4 items-start pb-12">
            {/* Coluna 1 (Pares) */}
            <div className="flex flex-col gap-4 w-full flex-1 min-w-[280px]">
              {fichasFiltradas
                .filter((_, i) => i % 2 === 0)
                .map((agente) => (
                  <AgenteCard
                    key={agente.id}
                    agente={agente}
                    isActive={fichaIdAtual === agente.id}
                    onAbrir={handleAbrirAgente}
                    onDuplicar={handleDuplicarAgente}
                    onDeletar={handleDeletarAgente}
                    onExportar={handleExportarAgente}
                  />
                ))}
            </div>

            {/* Coluna 2 (Ímpares) */}
            <div className="flex flex-col gap-4 w-full flex-1 min-w-[280px]">
              {fichasFiltradas
                .filter((_, i) => i % 2 !== 0)
                .map((agente) => (
                  <AgenteCard
                    key={agente.id}
                    agente={agente}
                    isActive={fichaIdAtual === agente.id}
                    onAbrir={handleAbrirAgente}
                    onDuplicar={handleDuplicarAgente}
                    onDeletar={handleDeletarAgente}
                    onExportar={handleExportarAgente}
                  />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
