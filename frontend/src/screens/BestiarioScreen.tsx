import React, { useState, useMemo } from 'react';
import { useRPG } from '../context/RPGContext';
import { AMEACAS_DATABASE } from '../data/ameacas';
import { AmeacaCard } from '../components/Bestiario/AmeacaCard';
import { CustomSelect } from '../components/CustomSelect';
import { DiceTray } from '../components/DiceRoller/DiceTray';
import type { ElementoAmeaca } from '../types';

const VD_OPTIONS = [
  { value: 'todos', label: 'Todos os VDs' },
  { value: 'iniciante', label: 'Iniciante (VD 20–40)' },
  { value: 'intermediario', label: 'Intermediário (VD 60–100)' },
  { value: 'veterano', label: 'Veterano (VD 140–220)' },
  { value: 'epico', label: 'Relíquias / Épico (VD 300+)' },
];

export const BestiarioScreen: React.FC = () => {
  const { setTelaAtual } = useRPG();
  const [elementoFiltro, setElementoFiltro] = useState<ElementoAmeaca | 'Todos'>('Todos');
  const [vdFiltro, setVdFiltro] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');

  // Filtragem
  const ameacasFiltradas = useMemo(() => {
    return AMEACAS_DATABASE.filter(ameaca => {
      // 1. Filtro de Elemento
      if (elementoFiltro !== 'Todos' && ameaca.elemento !== elementoFiltro) {
        return false;
      }

      // 2. Filtro de VD
      if (vdFiltro === 'iniciante' && (ameaca.vd < 20 || ameaca.vd > 40)) return false;
      if (vdFiltro === 'intermediario' && (ameaca.vd < 60 || ameaca.vd > 100)) return false;
      if (vdFiltro === 'veterano' && (ameaca.vd < 140 || ameaca.vd > 220)) return false;
      if (vdFiltro === 'epico' && ameaca.vd < 300) return false;

      // 3. Busca por texto
      if (busca.trim()) {
        const q = busca.toLowerCase();
        const nomeMatch = ameaca.nome.toLowerCase().includes(q);
        const descMatch = (ameaca.descricao || '').toLowerCase().includes(q);
        const acaoMatch = ameaca.acoes.some(a => a.nome.toLowerCase().includes(q));
        const habMatch = ameaca.habilidades.some(h => h.nome.toLowerCase().includes(q));
        if (!nomeMatch && !descMatch && !acaoMatch && !habMatch) return false;
      }

      return true;
    });
  }, [elementoFiltro, vdFiltro, busca]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col p-4 md:p-6 antialiased font-sans">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
        
        {/* ══════ CABEÇALHO DO BESTIÁRIO ══════ */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👾</span>
            <div>
              <h1 className="font-display text-xl font-bold tracking-[0.2em] uppercase text-zinc-100">
                Bestiário do Outro Lado
              </h1>
              <p className="text-xs text-zinc-400">
                Catálogo de Ameaças Paranormais & Ferramenta de Combate do Mestre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTelaAtual('galeria')}
              className="flex items-center gap-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition shadow-sm"
              title="Abrir Galeria de Agentes"
            >
              <span>📂</span>
              <span>Dossiês</span>
            </button>

            <button
              type="button"
              onClick={() => setTelaAtual('battlemat')}
              className="flex items-center gap-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-700/80 px-3 py-1.5 text-xs font-bold text-red-200 transition shadow-sm"
              title="Abrir Painel Tático Battlemat"
            >
              <span>⚔️</span>
              <span>Battlemat</span>
            </button>

            <button
              type="button"
              onClick={() => setTelaAtual('ficha')}
              className="flex items-center gap-1.5 rounded bg-emerald-700/90 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition shadow-sm"
              title="Voltar para a Ficha do Investigador"
            >
              <span>👤</span>
              <span>Voltar à Ficha</span>
            </button>
          </div>
        </div>

        {/* ══════ BARRA DE FILTROS & BUSCA ══════ */}
        <div className="flex flex-col gap-3 rounded-xl bg-zinc-900/60 p-4 border border-zinc-800">
          {/* Linha 1: Elementos (Cores oficiais de badges grandes) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mr-1">
              Elemento:
            </span>

            <button
              type="button"
              onClick={() => setElementoFiltro('Todos')}
              className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                elementoFiltro === 'Todos'
                  ? 'border-zinc-500 bg-zinc-700 text-white'
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todos ({AMEACAS_DATABASE.length})
            </button>

            <button
              type="button"
              onClick={() => setElementoFiltro('Sangue')}
              className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                elementoFiltro === 'Sangue'
                  ? 'border-red-900 bg-red-950/40 text-red-500 ring-1 ring-red-500/50'
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-red-400'
              }`}
            >
              Sangue
            </button>

            <button
              type="button"
              onClick={() => setElementoFiltro('Morte')}
              className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                elementoFiltro === 'Morte'
                  ? 'border-zinc-700 bg-black/60 text-white ring-1 ring-zinc-400/50'
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Morte
            </button>

            <button
              type="button"
              onClick={() => setElementoFiltro('Conhecimento')}
              className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                elementoFiltro === 'Conhecimento'
                  ? 'border-yellow-900 bg-yellow-950/40 text-yellow-500 ring-1 ring-yellow-500/50'
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-yellow-400'
              }`}
            >
              Conhecimento
            </button>

            <button
              type="button"
              onClick={() => setElementoFiltro('Energia')}
              className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                elementoFiltro === 'Energia'
                  ? 'border-purple-900 bg-purple-950/40 text-purple-500 ring-1 ring-purple-500/50'
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-purple-400'
              }`}
            >
              Energia
            </button>

            <button
              type="button"
              onClick={() => setElementoFiltro('Medo')}
              className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                elementoFiltro === 'Medo'
                  ? 'border-zinc-500 bg-zinc-200/90 text-zinc-950 ring-1 ring-zinc-300'
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Medo
            </button>
          </div>

          {/* Linha 2: Busca por texto & Filtro de VD */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar criatura, ataque ou habilidade..."
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-green-600"
              />
            </div>

            <div className="w-[200px]">
              <CustomSelect
                value={vdFiltro}
                onChange={val => setVdFiltro(val)}
                options={VD_OPTIONS}
                className="w-full cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-200 outline-none transition hover:bg-zinc-800 focus:border-green-600"
              />
            </div>
          </div>
        </div>

        {/* ══════ LISTA DE CRIATURAS (LAYOUT MASONRY FLEXÍVEL DE 2 COLUNAS) ══════ */}
        {ameacasFiltradas.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-3 items-start">
            {/* Coluna 1 (Pares) */}
            <div className="flex flex-col gap-3 w-full flex-1 min-w-[280px]">
              {ameacasFiltradas
                .filter((_, i) => i % 2 === 0)
                .map(ameaca => (
                  <AmeacaCard key={ameaca.id} ameaca={ameaca} />
                ))}
            </div>

            {/* Coluna 2 (Ímpares) */}
            <div className="flex flex-col gap-3 w-full flex-1 min-w-[280px]">
              {ameacasFiltradas
                .filter((_, i) => i % 2 !== 0)
                .map(ameaca => (
                  <AmeacaCard key={ameaca.id} ameaca={ameaca} />
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm font-bold text-zinc-400">Nenhuma ameaça encontrada.</p>
            <p className="text-xs text-zinc-500 mt-1">
              Tente ajustar os filtros de elemento, faixa de VD ou o termo de busca.
            </p>
          </div>
        )}

        {/* Gaveta de Rolagem de Dados integrada */}
        <DiceTray />
      </div>
    </div>
  );
};
