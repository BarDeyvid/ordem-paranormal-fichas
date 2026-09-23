import React, { useState, useEffect, useMemo } from 'react';
import { useRPG } from '../context/RPGContext';
import { CONDICOES_CATALOGO, CONDICOES_MAP } from '../data/condicoes';
import type { CategoriaCondicao, CondicaoDef, CondicaoId } from '../types';
import { Collapse } from './Collapse';

export const ModalCondicoes: React.FC = () => {
  const {
    condicoesAtivas,
    toggleCondicao,
    limparCondicoes,
    modalCondicoesAberto,
    setModalCondicoesAberto,
    penalidadesCondicoes,
  } = useRPG();

  // Estados internos do modal (resetados sempre que o modal abre)
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<'todas' | CategoriaCondicao | 'ativas'>('todas');
  const [cardExpandido, setCardExpandido] = useState<string | null>(null);

  // Regra do projeto: reset de estado total sempre que o modal for fechado e aberto
  useEffect(() => {
    if (modalCondicoesAberto) {
      setBusca('');
      setCategoriaAtiva('todas');
      setCardExpandido(null);
    }
  }, [modalCondicoesAberto]);

  // Lista filtrada
  const condicoesFiltradas = useMemo(() => {
    return CONDICOES_CATALOGO.filter((c) => {
      // Filtro por categoria ou ativas
      if (categoriaAtiva === 'ativas') {
        if (!condicoesAtivas.includes(c.id)) return false;
      } else if (categoriaAtiva !== 'todas') {
        if (c.categoria !== categoriaAtiva) return false;
      }

      // Filtro de busca textual
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const nomeMatch = c.nome.toLowerCase().includes(termo);
        const descMatch = c.descricao.toLowerCase().includes(termo);
        const efeitoMatch = c.resumoEfeito.toLowerCase().includes(termo);
        if (!nomeMatch && !descMatch && !efeitoMatch) return false;
      }

      return true;
    });
  }, [categoriaAtiva, busca, condicoesAtivas]);

  if (!modalCondicoesAberto) return null;

  const getCorCategoria = (cat: CategoriaCondicao) => {
    switch (cat) {
      case 'fisica':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
      case 'mental':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/60';
      case 'sentidos':
        return 'text-blue-400 bg-blue-950/40 border-blue-800/60';
      case 'critica':
        return 'text-red-400 bg-red-950/50 border-red-800/80 animate-pulse';
      default:
        return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  const getLabelCategoria = (cat: CategoriaCondicao) => {
    switch (cat) {
      case 'fisica':
        return 'Física';
      case 'mental':
        return 'Mental';
      case 'sentidos':
        return 'Sentidos';
      case 'critica':
        return 'Crítica';
      default:
        return cat;
    }
  };

  const renderCard = (c: CondicaoDef) => {
    const isAtiva = condicoesAtivas.includes(c.id);
    const estaExpandido = cardExpandido === c.id;

    return (
      <div
        key={c.id}
        onClick={() => toggleCondicao(c.id)}
        className={`group relative flex flex-col rounded-lg border p-3.5 transition-all cursor-pointer select-none ${
          isAtiva
            ? 'border-emerald-600 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/40'
        }`}
      >
        {/* Linha Superior: Ícone, Nome, Categoria e Checkbox */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl leading-none">{c.icone}</span>
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-bold truncate ${isAtiva ? 'text-emerald-300' : 'text-zinc-100 group-hover:text-white'}`}>
                {c.nome}
              </span>
              <span className={`w-fit mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border ${getCorCategoria(c.categoria)}`}>
                {getLabelCategoria(c.categoria)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle visual */}
            <div
              className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                isAtiva ? 'bg-emerald-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  isAtiva ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Resumo do Efeito */}
        <div className="mt-2.5 rounded bg-zinc-950/60 border border-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-300">
          <span className="font-semibold text-emerald-400">Efeito: </span>
          <span>{c.resumoEfeito}</span>
        </div>

        {/* Botão de Ver Descrição Completa */}
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCardExpandido(prev => (prev === c.id ? null : c.id));
            }}
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1"
          >
            <span>{estaExpandido ? 'Menos detalhes' : 'Ver detalhes'}</span>
            <span className={`transition-transform text-[9px] ${estaExpandido ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>

        {/* Bloco Expansível Obrigatório usando <Collapse> */}
        <Collapse isOpen={estaExpandido}>
          <div className="mt-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400 leading-relaxed font-sans">
            {c.descricao}
          </div>
        </Collapse>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6"
      onClick={() => setModalCondicoesAberto(false)}
    >
      <div
        className="flex flex-col w-full max-w-4xl max-h-[90vh] rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩸</span>
            <div>
              <h3 className="font-display text-base font-bold uppercase tracking-widest text-zinc-100">
                Condições & Estados Paranormais
              </h3>
              <p className="text-xs text-zinc-400">
                {condicoesAtivas.length === 0
                  ? 'Nenhuma condição ativa no momento'
                  : `${condicoesAtivas.length} condição(ões) ativa(s) afetando o personagem`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModalCondicoesAberto(false)}
            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
            title="Fechar modal"
          >
            ✕
          </button>
        </div>

        {/* Resumo de Penalidades Ativas no Topo (se houver alguma) */}
        {condicoesAtivas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800/80 bg-zinc-900/40 px-5 py-2.5 text-xs">
            <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
              Penalidades Totais:
            </span>
            {penalidadesCondicoes.penalidadeDefesa !== 0 && (
              <span className="rounded bg-red-950/60 border border-red-800/80 px-2 py-0.5 font-bold text-red-300">
                🛡️ Defesa {penalidadesCondicoes.penalidadeDefesa}
              </span>
            )}
            {penalidadesCondicoes.deslocamentoMultiplicador < 1 && (
              <span className="rounded bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 font-bold text-amber-300">
                🏃 Deslocamento {penalidadesCondicoes.deslocamentoMultiplicador === 0 ? 'Zerado (0m)' : '÷ 2 (Metade)'}
              </span>
            )}
            {penalidadesCondicoes.deslocamentoFixo !== null && (
              <span className="rounded bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 font-bold text-amber-300">
                🏃 Deslocamento {penalidadesCondicoes.deslocamentoFixo}m (Caído)
              </span>
            )}
            {penalidadesCondicoes.penalidadeDadosTodos !== 0 && (
              <span className="rounded bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 font-bold text-purple-300">
                🎲 Todos os Testes ({penalidadesCondicoes.penalidadeDadosTodos}d20)
              </span>
            )}
            {Object.entries(penalidadesCondicoes.penalidadeDadosAtributos).some(([_, val]) => val !== 0) && (
              <span className="rounded bg-zinc-900 border border-zinc-700 px-2 py-0.5 font-bold text-zinc-200">
                🎲 Físicos/Mentais: {Object.entries(penalidadesCondicoes.penalidadeDadosAtributos)
                  .filter(([_, v]) => v !== 0)
                  .map(([attr, v]) => `${attr} ${v}d20`)
                  .join(', ')}
              </span>
            )}
            {penalidadesCondicoes.sangrando && (
              <span className="rounded bg-red-950/80 border border-red-600 px-2 py-0.5 font-bold text-red-400">
                🩸 Sofre 1d6 [Sangue]/turno
              </span>
            )}
          </div>
        )}

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/20 px-5 py-3">
          {/* Abas */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCategoriaAtiva('todas')}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                categoriaAtiva === 'todas'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Todas ({CONDICOES_CATALOGO.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoriaAtiva('ativas')}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                categoriaAtiva === 'ativas'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Ativas ({condicoesAtivas.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoriaAtiva('fisica')}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                categoriaAtiva === 'fisica'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Físicas
            </button>
            <button
              type="button"
              onClick={() => setCategoriaAtiva('mental')}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                categoriaAtiva === 'mental'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Mentais
            </button>
            <button
              type="button"
              onClick={() => setCategoriaAtiva('sentidos')}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                categoriaAtiva === 'sentidos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Sentidos
            </button>
            <button
              type="button"
              onClick={() => setCategoriaAtiva('critica')}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                categoriaAtiva === 'critica'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Críticas
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar condição..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500 transition"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 select-none">
              🔍
            </span>
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Lista com Layout Masonry Flexível Obrigatório e Scrollbar customizada */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          {condicoesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
              <span className="text-4xl opacity-40 mb-2">🩹</span>
              <p className="text-sm font-medium">Nenhuma condição encontrada</p>
              <p className="text-xs text-zinc-600 mt-1">
                Tente ajustar os filtros ou o termo de busca.
              </p>
            </div>
          ) : (
            /* Regra obrigatória: Masonry layout flexível de duas colunas, NUNCA grid-cols-2 */
            <div className="flex flex-col md:flex-row gap-3 items-start">
              <div className="flex flex-col gap-3 w-full flex-1 min-w-[200px]">
                {condicoesFiltradas
                  .filter((_, i) => i % 2 === 0)
                  .map(renderCard)}
              </div>
              <div className="flex flex-col gap-3 w-full flex-1 min-w-[200px]">
                {condicoesFiltradas
                  .filter((_, i) => i % 2 !== 0)
                  .map(renderCard)}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Ações */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/90 px-5 py-3">
          <div>
            {condicoesAtivas.length > 0 && (
              <button
                type="button"
                onClick={limparCondicoes}
                className="rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-red-900/60 transition"
              >
                Limpar Todas ({condicoesAtivas.length})
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setModalCondicoesAberto(false)}
            className="rounded bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-950/40 transition"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
