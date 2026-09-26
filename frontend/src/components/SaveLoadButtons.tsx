import React, { useRef, useState, useEffect } from 'react';
import { useRPG } from '../context/RPGContext';
import { exportarFicha, importarFicha } from '../utils/saveLoad';
import { salvarFichaContexto } from '../services/fichasService';
import { ModalBattlematConnect } from './ModalBattlematConnect';
import { getBridgeConfig } from '../services/battlematBridge';
import { ModalPrintPreview } from './PrintA4/ModalPrintPreview';

export const SaveLoadButtons: React.FC = () => {
  const rpg = useRPG();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrintOpen, setModalPrintOpen] = useState(false);
  const [bridgeConfig, setBridgeConfig] = useState(getBridgeConfig());
  const [salvando, setSalvando] = useState(false);
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  useEffect(() => {
    // Atualiza o estado da config quando o modal fechar ou abrir
    setBridgeConfig(getBridgeConfig());
  }, [modalOpen]);

  const handleSalvarNaGaleria = async () => {
    setSalvando(true);
    try {
      const res = await salvarFichaContexto(rpg);
      if (res.id) {
        rpg.setFichaIdAtual(res.id);
      }
      setSalvoFeedback(true);
      setTimeout(() => setSalvoFeedback(false), 2500);
    } catch (err) {
      console.error('Erro ao salvar ficha:', err);
      alert('Erro ao salvar ficha na galeria: ' + String(err));
    } finally {
      setSalvando(false);
    }
  };

  const handleExport = () => {
    exportarFicha(rpg);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    importarFicha(e, rpg);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botão para acessar a Galeria de Agentes */}
      <button
        type="button"
        onClick={() => rpg.setTelaAtual('galeria')}
        className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 transition border border-zinc-700 shadow-sm"
        title="Abrir Galeria de Personagens / Dossiês"
      >
        <span>📂</span>
        <span>Dossiês</span>
      </button>

      {/* Botão para acessar o Bestiário / Ameaças */}
      <button
        type="button"
        onClick={() => rpg.setTelaAtual('bestiario')}
        className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 transition border border-zinc-700 shadow-sm"
        title="Abrir Bestiário do Outro Lado (GM Toolkit / Ameaças)"
      >
        <span>👾</span>
        <span>Bestiário</span>
      </button>

      {/* Botão para acessar o Painel Tático Battlemat */}
      <button
        type="button"
        onClick={() => rpg.setTelaAtual('battlemat')}
        className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition border border-zinc-700 shadow-sm"
        title="Abrir Painel Tático do Battlemat (Grid & IA de Combate)"
      >
        <span>⚔️</span>
        <span>Battlemat</span>
      </button>

      {/* Botão de Salvar no Dossiê / Galeria */}
      <button
        type="button"
        onClick={handleSalvarNaGaleria}
        disabled={salvando}
        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
          salvoFeedback
            ? 'bg-emerald-600 text-white'
            : 'bg-emerald-700/90 hover:bg-emerald-600 text-white shadow-sm'
        }`}
        title="Salvar alterações deste agente no Dossiê"
      >
        <span>{salvoFeedback ? '✅' : '💾'}</span>
        <span>{salvoFeedback ? 'Salvo!' : salvando ? 'Salvando...' : 'Salvar'}</span>
      </button>

      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-1.5 rounded bg-zinc-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-700 border border-zinc-700/80"
        title="Baixar Ficha como Arquivo JSON"
      >
        <span>⬇️ JSON</span>
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 rounded bg-zinc-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-700 border border-zinc-700/80"
        title="Importar Ficha de um Arquivo JSON"
      >
        <span>⬆️ Importar</span>
      </button>

      <button
        type="button"
        onClick={() => setModalPrintOpen(true)}
        className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition border border-zinc-700/80 shadow-sm"
        title="Visualizar Impressão ou Exportar em PDF (Layout Oficial A4)"
      >
        <span>🖨️</span>
        <span>PDF / Imprimir</span>
      </button>

      {/* Botão de Conexão com a Mesa Digital */}
      <button
        onClick={() => setModalOpen(true)}
        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
          bridgeConfig.enabled
            ? 'bg-red-900/80 text-red-200 border border-red-500/60 hover:bg-red-800'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
        }`}
        title="Conectar à Mesa Digital (Battlemat / Unreal Engine)"
      >
        <span>🎲</span>
        <span>
          {bridgeConfig.enabled ? `Mesa: #${bridgeConfig.tokenId}` : 'Conectar Mesa'}
        </span>
      </button>

      <ModalBattlematConnect
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <ModalPrintPreview
        isOpen={modalPrintOpen}
        onClose={() => setModalPrintOpen(false)}
      />

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};
