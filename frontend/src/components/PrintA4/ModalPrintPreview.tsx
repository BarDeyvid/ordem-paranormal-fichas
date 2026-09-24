import React, { useState, useEffect } from 'react';
import { FichaA4Page1 } from './FichaA4Page1';
import { FichaA4Page2 } from './FichaA4Page2';

export interface ModalPrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  customRpg?: any;
}

export const ModalPrintPreview: React.FC<ModalPrintPreviewProps> = ({
  isOpen,
  onClose,
  customRpg,
}) => {
  const [paginaVisivel, setPaginaVisivel] = useState<'todas' | 'p1' | 'p2'>('todas');

  // Reset de estado no fechamento/abertura (regra do projeto)
  useEffect(() => {
    if (isOpen) {
      setPaginaVisivel('todas');
    }
  }, [isOpen]);

  // Fechar com Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4 no-print animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-6xl max-h-[96vh] rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══════ CABEÇALHO DO MODAL DE PREVIEW ══════ */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🖨️</span>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>Dossiê para Impressão & Exportação PDF</span>
                <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800/60 uppercase">
                  Layout Oficial A4
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Páginas formatadas e otimizadas para folha A4 com economia total de tinta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Seletor de visualização */}
            <div className="flex items-center rounded-lg bg-zinc-800/80 p-0.5 border border-zinc-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaginaVisivel('todas')}
                className={`px-3 py-1 rounded transition ${
                  paginaVisivel === 'todas'
                    ? 'bg-zinc-700 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ambas (2 Páginas)
              </button>
              <button
                type="button"
                onClick={() => setPaginaVisivel('p1')}
                className={`px-3 py-1 rounded transition ${
                  paginaVisivel === 'p1'
                    ? 'bg-zinc-700 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Frente (Pág 1)
              </button>
              <button
                type="button"
                onClick={() => setPaginaVisivel('p2')}
                className={`px-3 py-1 rounded transition ${
                  paginaVisivel === 'p2'
                    ? 'bg-zinc-700 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Verso (Pág 2)
              </button>
            </div>

            {/* Botão de Disparo da Impressão */}
            <button
              type="button"
              onClick={handleImprimir}
              className="inline-flex items-center gap-2 rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow transition"
              title="Abrir o diálogo de impressão do navegador para salvar em PDF ou imprimir"
            >
              <span>🖨️</span>
              <span>Imprimir / Salvar PDF</span>
            </button>

            {/* Fechar */}
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              title="Fechar Visualização"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ══════ DICA DE CONFIGURAÇÃO DE IMPRESSÃO ══════ */}
        <div className="bg-emerald-950/30 border-b border-emerald-900/40 px-4 py-2 flex items-center justify-between text-[11px] text-emerald-300">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>
              <strong>Dica de Exportação:</strong> No diálogo de impressão do navegador, selecione <strong>Destino: "Salvar como PDF"</strong>, <strong>Layout: "Retrato"</strong> e <strong>Margens: "Padrão" ou "Mínimas"</strong>.
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono hidden md:inline">210mm × 297mm</span>
        </div>

        {/* ══════ ÁREA DE PRÉ-VISUALIZAÇÃO DA FOLHA A4 ══════ */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-zinc-950/90 flex flex-col items-center gap-8">
          {(paginaVisivel === 'todas' || paginaVisivel === 'p1') && (
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Página 1: Frente (Atributos, Status, Defesas & Perícias)
              </span>
              <div className="shadow-2xl ring-1 ring-zinc-700/60 rounded overflow-hidden">
                <FichaA4Page1 customRpg={customRpg} />
              </div>
            </div>
          )}

          {(paginaVisivel === 'todas' || paginaVisivel === 'p2') && (
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Página 2: Verso (Armas, Habilidades, Grimório & Inventário)
              </span>
              <div className="shadow-2xl ring-1 ring-zinc-700/60 rounded overflow-hidden">
                <FichaA4Page2 customRpg={customRpg} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
